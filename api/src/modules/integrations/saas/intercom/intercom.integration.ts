import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { IntegrationProvider } from 'generated/prisma';
import { SaasActionDefinition, SaasIntegration, loadRuntimePackage, optionalNumber } from '../saas-integration.base';

@Injectable()
export class IntercomIntegration extends SaasIntegration {
  provider = IntegrationProvider.INTERCOM;
  protected readonly actions: SaasActionDefinition[] = [
    { key: 'list_conversations', label: 'List conversations', description: 'List Intercom support conversations.', schema: z.object({ per_page: optionalNumber }), parameters: this.jsonSchema({ per_page: { type: 'number' } }) },
    { key: 'get_conversation', label: 'Get conversation', description: 'Get an Intercom conversation with messages.', schema: z.object({ conversationId: z.string() }), parameters: this.jsonSchema({ conversationId: { type: 'string' } }, ['conversationId']) },
    { key: 'list_contacts', label: 'List contacts', description: 'List Intercom contacts.', schema: z.object({ per_page: optionalNumber }), parameters: this.jsonSchema({ per_page: { type: 'number' } }) },
    { key: 'reply_conversation', label: 'Reply conversation', description: 'Reply to an Intercom conversation.', schema: z.object({ conversationId: z.string(), message: z.string(), admin_id: z.string() }), parameters: this.jsonSchema({ conversationId: { type: 'string' }, message: { type: 'string' }, admin_id: { type: 'string' } }, ['conversationId', 'message', 'admin_id']) },
  ];

  constructor(prisma: PrismaService, encryption: EncryptionService) { super(prisma, encryption); }
  protected requiredConfigKeys() { return ['accessToken']; }

  protected async executeValidatedTool(actionKey: string, input: Record<string, any>, config: Record<string, any>) {
    const { IntercomClient } = await loadRuntimePackage('intercom-client');
    const client: any = new IntercomClient({ token: config.accessToken });
    const actions: Record<string, () => Promise<any>> = {
      list_conversations: () => client.conversations.list({ per_page: input.per_page ?? 50 }),
      get_conversation: () => client.conversations.find({ conversation_id: input.conversationId }),
      list_contacts: () => client.contacts.list({ per_page: input.per_page ?? 50 }),
      reply_conversation: () =>
        client.conversations.reply({
          conversation_id: input.conversationId,
          body: {
            message_type: 'comment',
            type: 'admin',
            admin_id: input.admin_id,
            body: input.message,
          },
        }),
    };
    return { success: true, data: await actions[actionKey]() };
  }
}
