import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { IntegrationProvider } from 'generated/prisma';
import { SaasActionDefinition, SaasIntegration, emptySchema, loadRuntimePackage, optionalNumber, optionalString } from '../saas-integration.base';

@Injectable()
export class SlackIntegration extends SaasIntegration {
  provider = IntegrationProvider.SLACK;
  protected readonly actions: SaasActionDefinition[] = [
    { key: 'list_channels', label: 'List channels', description: 'List public Slack channels.', schema: emptySchema, parameters: this.jsonSchema() },
    { key: 'send_message', label: 'Send message', description: 'Post a message to a Slack channel.', schema: z.object({ channel: z.string(), text: z.string() }), parameters: this.jsonSchema({ channel: { type: 'string' }, text: { type: 'string' } }, ['channel', 'text']) },
    { key: 'get_messages', label: 'Get messages', description: 'Read recent Slack channel messages.', schema: z.object({ channel: z.string(), limit: optionalNumber }), parameters: this.jsonSchema({ channel: { type: 'string' }, limit: { type: 'number' } }, ['channel']) },
    { key: 'search_messages', label: 'Search messages', description: 'Search Slack messages.', schema: z.object({ query: z.string() }), parameters: this.jsonSchema({ query: { type: 'string' } }, ['query']) },
  ];

  constructor(prisma: PrismaService, encryption: EncryptionService) { super(prisma, encryption); }
  protected requiredConfigKeys() { return ['botToken']; }

  protected async executeValidatedTool(actionKey: string, input: Record<string, any>, config: Record<string, any>) {
    const { WebClient } = await loadRuntimePackage('@slack/web-api');
    const client: any = new WebClient(config.botToken);
    const actions: Record<string, () => Promise<any>> = {
      list_channels: () => client.conversations.list({ types: 'public_channel' }),
      send_message: () => client.chat.postMessage(input),
      get_messages: () => client.conversations.history(input),
      search_messages: () => client.search.messages({ query: input.query }),
    };
    return { success: true, data: await actions[actionKey]() };
  }
}
