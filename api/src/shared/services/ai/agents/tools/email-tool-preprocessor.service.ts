import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { GcsService } from '@/integrations/storage/gcs/services/gcs.service';
import { formatEmailBody } from '../organization/email-body-formatter';

const EMAIL_SEND_ACTION_KEYS = new Set(['send_email', 'send_message']);

export function extractIntegrationActionKey(toolName: string): string | null {
  if (toolName.startsWith('db__')) {
    return toolName.replace('db__', '');
  }

  const openapiMatch = toolName.match(/^openapi_[^_]+__(.+)$/);
  if (openapiMatch) {
    return openapiMatch[1];
  }

  const mcpMatch = toolName.match(/^mcp_[^_]+__(.+)$/);
  if (mcpMatch) {
    return mcpMatch[1];
  }

  const parts = toolName.split('__');
  return parts.length > 1 ? parts.slice(1).join('__') : null;
}

export function isEmailSendIntegrationTool(toolName: string): boolean {
  const actionKey = extractIntegrationActionKey(toolName);
  return actionKey !== null && EMAIL_SEND_ACTION_KEYS.has(actionKey);
}

@Injectable()
export class EmailToolPreprocessorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gcs: GcsService,
  ) {}

  async prepare(
    userUuid: string,
    toolName: string,
    input: Record<string, unknown>,
  ): Promise<{ toolName: string; input: Record<string, unknown> }> {
    if (!isEmailSendIntegrationTool(toolName)) {
      return { toolName, input };
    }

    const body = typeof input.body === 'string' ? input.body : '';
    const formatted = formatEmailBody(body);
    const prepared: Record<string, unknown> = {
      ...input,
      body: formatted.text,
      html: formatted.html,
    };

    const attachmentUuids = this.extractAttachmentDocumentUuids(input.attachment_document_uuids);
    delete prepared.attachment_document_uuids;

    if (attachmentUuids.length === 0) {
      return { toolName, input: prepared };
    }

    const actionKey = extractIntegrationActionKey(toolName);
    if (actionKey === 'send_message') {
      throw new BadRequestException(
        'Gmail does not support attachments through this tool. Connect SendGrid, Resend, or SMTP for attachments.',
      );
    }

    const attachments = await this.loadAttachments(userUuid, attachmentUuids);
    const attachmentToolName = toolName.replace(/__send_email$/, '__send_email_with_attachments');

    if (attachmentToolName === toolName) {
      throw new BadRequestException('Cannot attach files with this email integration');
    }

    return {
      toolName: attachmentToolName,
      input: { ...prepared, attachments },
    };
  }

  private extractAttachmentDocumentUuids(value: unknown): string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return [...new Set(value.filter((item): item is string => typeof item === 'string'))];
  }

  private async loadAttachments(userUuid: string, documentUuids: string[]) {
    const documents = await this.prisma.document.findMany({
      where: {
        uuid: { in: documentUuids },
        user_uuid: userUuid,
      },
    });

    if (documents.length !== documentUuids.length) {
      throw new NotFoundException('One or more attachment documents were not found or are not accessible');
    }

    return Promise.all(
      documents.map(async (document) => {
        const downloaded = await this.gcs.downloadImage({ filename: document.path });
        return {
          filename: document.filename,
          content: downloaded.buffer.toString('base64'),
          encoding: 'base64' as const,
          contentType: document.mimetype,
        };
      }),
    );
  }
}
