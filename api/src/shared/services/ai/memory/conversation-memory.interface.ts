import type { ModelMessage } from 'ai';

export interface ConversationMemory {
  getMessages(organizationUuid: string, conversationId: string): Promise<ModelMessage[]>;
  hydrateCacheFromDb(organizationUuid: string, conversationId: string): Promise<ModelMessage[]>;
  scheduleHydrateCacheFromDb(organizationUuid: string, conversationId: string): void;
  replaceMessages(organizationUuid: string, conversationId: string, messages: ModelMessage[]): Promise<void>;
  invalidate(organizationUuid: string, conversationId: string): Promise<void>;
}
