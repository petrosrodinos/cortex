import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { IntegrationProvider } from 'generated/prisma';
import { SaasActionDefinition, SaasIntegration, optionalNumber, optionalString } from '../saas-integration.base';
import { createGoogleOAuthClient } from '../google-auth.helper';

@Injectable()
export class GmailIntegration extends SaasIntegration {
  provider = IntegrationProvider.GMAIL;
  protected readonly actions: SaasActionDefinition[] = [
    { key: 'list_messages', label: 'List messages', description: 'List recent Gmail messages.', schema: z.object({ maxResults: optionalNumber }), parameters: this.jsonSchema({ maxResults: { type: 'number' } }) },
    { key: 'get_message', label: 'Get message', description: 'Get a Gmail message.', schema: z.object({ messageId: z.string() }), parameters: this.jsonSchema({ messageId: { type: 'string' } }, ['messageId']) },
    { key: 'send_message', label: 'Send message', description: 'Send an email with Gmail.', schema: z.object({ to: z.string(), subject: z.string(), body: z.string(), cc: optionalString }), parameters: this.jsonSchema({ to: { type: 'string' }, cc: { type: 'string' }, subject: { type: 'string' }, body: { type: 'string' } }, ['to', 'subject', 'body']) },
    { key: 'search_messages', label: 'Search messages', description: 'Search Gmail messages by query.', schema: z.object({ query: z.string(), maxResults: optionalNumber }), parameters: this.jsonSchema({ query: { type: 'string' }, maxResults: { type: 'number' } }, ['query']) },
  ];

  constructor(prisma: PrismaService, encryption: EncryptionService) { super(prisma, encryption); }
  protected requiredConfigKeys() { return ['accessToken']; }

  protected async executeValidatedTool(actionKey: string, input: Record<string, any>, config: Record<string, any>) {
    const { google, auth } = await createGoogleOAuthClient(config);
    const gmail: any = google.gmail({ version: 'v1', auth });
    const actions: Record<string, () => Promise<any>> = {
      list_messages: () => gmail.users.messages.list({ userId: 'me', maxResults: input.maxResults ?? 20 }),
      get_message: () => gmail.users.messages.get({ userId: 'me', id: input.messageId, format: 'full' }),
      send_message: () => gmail.users.messages.send({ userId: 'me', requestBody: { raw: this.encodeEmail(input) } }),
      search_messages: () => gmail.users.messages.list({ userId: 'me', q: input.query, maxResults: input.maxResults ?? 20 }),
    };
    const response = await actions[actionKey]();
    return { success: true, data: response.data };
  }

  private encodeEmail(input: Record<string, any>) {
    const lines = [`To: ${input.to}`, input.cc ? `Cc: ${input.cc}` : '', `Subject: ${input.subject}`, '', input.body].filter(Boolean);
    return Buffer.from(lines.join('\n')).toString('base64url');
  }
}
