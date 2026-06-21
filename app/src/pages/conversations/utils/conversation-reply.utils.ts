import {
  MessageRoles,
  type Message,
} from '@/features/conversations/interfaces/conversation.interfaces';
import { stripMarkdownForPreview } from '@/lib/message-markdown.utils';
import { getMessageAttachments } from '../components/messages/message-attachments';

export interface ConversationReplyTarget {
  messageUuid: string;
  role: MessageRoles;
  authorLabel: string;
  quotedText: string;
  attachmentCount: number;
}

export function createReplyTargetFromMessage(message: Message): ConversationReplyTarget {
  const quotedText =
    message.role === MessageRoles.ASSISTANT
      ? stripMarkdownForPreview(message.content)
      : message.content.trim();
  const attachments = getMessageAttachments(message.metadata);

  return {
    messageUuid: message.uuid,
    role: message.role,
    authorLabel: message.role === MessageRoles.USER ? 'You' : 'Cortex',
    quotedText,
    attachmentCount: attachments.length,
  };
}

export function buildMessageWithReply(
  userContent: string,
  reply: ConversationReplyTarget | null,
): string {
  const trimmedUser = userContent.trim();
  const quotedText = reply?.quotedText.trim() ?? '';

  if (!quotedText) {
    return trimmedUser;
  }

  const quotedBlock = quotedText
    .split('\n')
    .map((line) => `> ${line}`)
    .join('\n');

  if (!trimmedUser) {
    return quotedBlock;
  }

  return `${quotedBlock}\n\n${trimmedUser}`;
}
