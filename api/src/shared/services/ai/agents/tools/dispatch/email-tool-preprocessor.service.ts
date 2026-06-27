import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { GcsService } from '@/integrations/storage/gcs/services/gcs.service';
import { formatEmailBody } from '../../organization/email-body-formatter';
import { isEmailSendToolName } from '../email-tool.utils';

const EMAIL_SEND_ACTION_KEYS = new Set(['send_email', 'send_message']);

export const EMAIL_ATTACHMENT_DOCUMENT_UUIDS_DESCRIPTION =
  'Optional document UUIDs from output__create_* tools to attach to the email';

type LoadedEmailAttachment = {
  filename: string;
  content: string;
  contentType?: string;
};

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

export function extractComposioEmailActionKey(toolName: string): string | null {
  const match = toolName.match(
    /^[a-z0-9]+_(send_email|send_message|send_html_email|send_bulk_email|send_email_with_attachments)$/i,
  );
  return match?.[1]?.toLowerCase() ?? null;
}

export function isEmailSendIntegrationTool(toolName: string): boolean {
  const actionKey = extractIntegrationActionKey(toolName);
  if (actionKey !== null && EMAIL_SEND_ACTION_KEYS.has(actionKey)) {
    return true;
  }

  return isEmailSendToolName(toolName);
}

export function resolveEmailAttachmentToolName(toolName: string): string {
  if (toolName.endsWith('__send_email')) {
    return toolName.replace(/__send_email$/, '__send_email_with_attachments');
  }

  return toolName;
}

export function mapAttachmentsForEmailProvider(
  toolName: string,
  attachments: LoadedEmailAttachment[],
) {
  const normalizedToolName = toolName.toLowerCase();

  if (normalizedToolName.includes('sendgrid')) {
    return attachments.map((attachment) => ({
      filename: attachment.filename,
      content: attachment.content,
      type: attachment.contentType,
      disposition: 'attachment',
    }));
  }

  return attachments.map((attachment) => ({
    filename: attachment.filename,
    content: attachment.content,
    ...(attachment.contentType
      ? { content_type: attachment.contentType, type: attachment.contentType }
      : {}),
  }));
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

    const actionKey =
      extractIntegrationActionKey(toolName) ??
      extractComposioEmailActionKey(toolName);
    if (actionKey === 'send_message') {
      throw new BadRequestException(
        'Gmail does not support attachments through this tool. Connect SendGrid, Resend, or SMTP for attachments.',
      );
    }

    const attachments = await this.loadAttachments(userUuid, attachmentUuids);
    const attachmentToolName = resolveEmailAttachmentToolName(toolName);
    const usesLegacyAttachmentTool =
      toolName.endsWith('__send_email') &&
      attachmentToolName !== toolName;

    if (
      toolName.endsWith('__send_email') &&
      attachmentToolName === toolName
    ) {
      throw new BadRequestException('Cannot attach files with this email integration');
    }

    return {
      toolName: attachmentToolName,
      input: {
        ...prepared,
        attachments: mapAttachmentsForEmailProvider(
          usesLegacyAttachmentTool ? attachmentToolName : toolName,
          attachments,
        ),
      },
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
          contentType: document.mimetype,
        };
      }),
    );
  }
}
