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

function extractFilenameFromUrl(url: string): string {
  try {
    return new URL(url).pathname.split('/').pop() ?? 'file';
  } catch {
    return url.split('/').pop() ?? 'file';
  }
}

function urlKey(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return url;
  }
}

export function getConversationDocuments(
  messages: Message[],
  pendingAttachments: MessageAttachment[] = [],
): ConversationDocument[] {
  const documents: ConversationDocument[] = [];
  const seen = new Set<string>();

  for (const message of messages) {
    if (message.role === MessageRoles.USER) {
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
    } else if (message.role === MessageRoles.ASSISTANT && message.metadata) {
      const meta = message.metadata as { files?: string[] };
      for (const fileUrl of (meta.files ?? [])) {
        if (!fileUrl) {
          continue;
        }

        const key = urlKey(fileUrl);
        if (seen.has(key)) {
          continue;
        }

        seen.add(key);
        documents.push({
          id: key,
          filename: extractFilenameFromUrl(fileUrl),
          url: fileUrl,
          createdAt: message.created_at,
        });
      }
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
