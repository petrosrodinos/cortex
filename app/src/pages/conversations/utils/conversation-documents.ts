import type { Message, MessageAttachment } from '@/features/conversations/interfaces/conversation.interfaces';
import { MessageRoles } from '@/features/conversations/interfaces/conversation.interfaces';
import { getMessageAttachments } from '../components/messages/message-attachments';

export interface ConversationDocument {
  id: string;
  filename: string;
  url: string;
  mimetype?: string;
  createdAt: string;
}

export function getConversationDocuments(
  messages: Message[],
  pendingAttachments: MessageAttachment[] = [],
): ConversationDocument[] {
  const documents: ConversationDocument[] = [];
  const seen = new Set<string>();

  for (const message of messages) {
    if (message.role !== MessageRoles.USER) {
      continue;
    }

    for (const attachment of getMessageAttachments(message.metadata)) {
      if (!attachment.url || seen.has(attachment.uuid)) {
        continue;
      }

      seen.add(attachment.uuid);
      documents.push({
        id: attachment.uuid,
        filename: attachment.filename,
        url: attachment.url,
        mimetype: attachment.mimetype,
        createdAt: message.created_at,
      });
    }
  }

  for (const attachment of pendingAttachments) {
    if (!attachment.url || seen.has(attachment.uuid)) {
      continue;
    }

    seen.add(attachment.uuid);
    documents.push({
      id: attachment.uuid,
      filename: attachment.filename,
      url: attachment.url,
      mimetype: attachment.mimetype,
      createdAt: new Date().toISOString(),
    });
  }

  return documents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
