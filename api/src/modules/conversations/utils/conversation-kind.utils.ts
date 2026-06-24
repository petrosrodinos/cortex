import { ForbiddenException } from '@nestjs/common';
import { ConversationKind } from 'generated/prisma';

export function assertInteractiveConversation(kind: ConversationKind): void {
  if (kind === ConversationKind.SCHEDULED_AGENT) {
    throw new ForbiddenException(
      'This conversation is managed by an agent and cannot be modified here',
    );
  }
}
