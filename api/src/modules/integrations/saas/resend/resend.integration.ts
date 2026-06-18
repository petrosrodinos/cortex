import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { IntegrationProvider } from 'generated/prisma';
import { SaasActionDefinition, SaasIntegration, emptySchema, optionalString } from '../saas-integration.base';
import { RESEND_REQUIRED_CONFIG_KEYS } from './config/resend.config';
import { ResendService } from './services/resend.service';
import { verifyResendApiKey } from './utils/resend.utils';

const attachmentSchema = z.object({ filename: z.string(), content: z.string(), encoding: optionalString });

@Injectable()
export class ResendIntegration extends SaasIntegration {
  provider = IntegrationProvider.RESEND;

  protected readonly actions: SaasActionDefinition[] = [
    {
      key: 'send_email',
      label: 'Send email',
      description: 'Send a plain-text/HTML email via Resend.',
      schema: z.object({ to: z.string(), subject: z.string(), body: z.string(), cc: optionalString, bcc: optionalString, replyTo: optionalString }),
      parameters: this.jsonSchema({ to: { type: 'string' }, subject: { type: 'string' }, body: { type: 'string' }, cc: { type: 'string' }, bcc: { type: 'string' }, replyTo: { type: 'string' } }, ['to', 'subject', 'body']),
    },
    {
      key: 'send_html_email',
      label: 'Send HTML email',
      description: 'Send an email with separate plain-text and HTML parts via Resend.',
      schema: z.object({ to: z.string(), subject: z.string(), text: z.string(), html: z.string(), cc: optionalString, bcc: optionalString, replyTo: optionalString }),
      parameters: this.jsonSchema({ to: { type: 'string' }, subject: { type: 'string' }, text: { type: 'string' }, html: { type: 'string' }, cc: { type: 'string' }, bcc: { type: 'string' }, replyTo: { type: 'string' } }, ['to', 'subject', 'text', 'html']),
    },
    {
      key: 'send_email_with_attachments',
      label: 'Send email with attachments',
      description: 'Send an email with one or more base64-encoded file attachments via Resend.',
      schema: z.object({ to: z.string(), subject: z.string(), body: z.string(), attachments: z.array(attachmentSchema), cc: optionalString, bcc: optionalString }),
      parameters: this.jsonSchema({ to: { type: 'string' }, subject: { type: 'string' }, body: { type: 'string' }, attachments: { type: 'array', items: { type: 'object', properties: { filename: { type: 'string' }, content: { type: 'string' }, encoding: { type: 'string' } }, required: ['filename', 'content'] } }, cc: { type: 'string' }, bcc: { type: 'string' } }, ['to', 'subject', 'body', 'attachments']),
    },
    {
      key: 'send_bulk_email',
      label: 'Send bulk email',
      description: 'Send the same email to a list of recipients via Resend.',
      schema: z.object({ recipients: z.array(z.string()), subject: z.string(), body: z.string() }),
      parameters: this.jsonSchema({ recipients: { type: 'array', items: { type: 'string' } }, subject: { type: 'string' }, body: { type: 'string' } }, ['recipients', 'subject', 'body']),
    },
    {
      key: 'verify_connection',
      label: 'Verify connection',
      description: 'Verify that the Resend API key is valid.',
      schema: emptySchema,
      parameters: this.jsonSchema(),
    },
  ];

  constructor(prisma: PrismaService, encryption: EncryptionService) {
    super(prisma, encryption);
  }

  protected requiredConfigKeys() {
    return [...RESEND_REQUIRED_CONFIG_KEYS];
  }

  async testConnection(config: Record<string, any>): Promise<boolean> {
    if (!this.requiredConfigKeys().every((key) => Boolean(config?.[key]))) {
      return false;
    }

    return verifyResendApiKey(String(config.apiKey));
  }

  protected async executeValidatedTool(actionKey: string, input: Record<string, any>, config: Record<string, any>) {
    const service = new ResendService(String(config.apiKey), String(config.from));

    const actions: Record<string, () => Promise<any>> = {
      send_email: () => service.sendEmail(input as any),
      send_html_email: () => service.sendHtmlEmail(input as any),
      send_email_with_attachments: () => service.sendEmailWithAttachments(input as any),
      send_bulk_email: () => service.sendBulkEmail(input as any),
      verify_connection: () => service.verifyConnection(),
    };

    return actions[actionKey]();
  }
}
