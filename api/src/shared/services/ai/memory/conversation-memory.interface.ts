import type { ModelMessage } from 'ai';

export interface ConversationMemory {
  getMessages(organizationUuid: string, conversationId: string): Promise<ModelMessage[]>;
  appendMessages(organizationUuid: string, conversationId: string, messages: ModelMessage[]): Promise<void>;
  replaceMessages(organizationUuid: string, conversationId: string, messages: ModelMessage[]): Promise<void>;
  invalidate(organizationUuid: string, conversationId: string): Promise<void>;
}
