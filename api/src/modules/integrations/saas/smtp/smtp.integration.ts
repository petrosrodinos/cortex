import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { IntegrationProvider } from 'generated/prisma';
import { SaasActionDefinition, SaasIntegration, loadRuntimePackage, optionalString } from '../saas-integration.base';

@Injectable()
export class SmtpIntegration extends SaasIntegration {
  provider = IntegrationProvider.SMTP;
  protected readonly actions: SaasActionDefinition[] = [
    { key: 'send_email', label: 'Send email', description: 'Send an email over SMTP.', schema: z.object({ to: z.string(), cc: optionalString, subject: z.string(), body: z.string() }), parameters: this.jsonSchema({ to: { type: 'string' }, cc: { type: 'string' }, subject: { type: 'string' }, body: { type: 'string' } }, ['to', 'subject', 'body']) },
  ];

  constructor(prisma: PrismaService, encryption: EncryptionService) { super(prisma, encryption); }
  protected requiredConfigKeys() { return ['host', 'port', 'from']; }

  protected async executeValidatedTool(actionKey: string, input: Record<string, any>, config: Record<string, any>) {
    const nodemailer = await loadRuntimePackage('nodemailer');
    const transport = nodemailer.createTransport({
      host: config.host,
      port: Number(config.port),
      secure: Number(config.port) === 465,
      auth: config.user || config.password ? { user: config.user, pass: config.password } : undefined,
    });
    const response = await transport.sendMail({
      from: config.from,
      to: input.to,
      cc: input.cc,
      subject: input.subject,
      text: input.body,
      html: input.body,
    });
    return { success: true, data: response };
  }
}
