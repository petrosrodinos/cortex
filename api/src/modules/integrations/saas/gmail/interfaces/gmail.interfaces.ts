// ── Messages ─────────────────────────────────────────────────────────────────

export interface ListMessagesInput {
  maxResults?: number;
  labelIds?: string[];
  pageToken?: string;
}

export interface GetMessageInput {
  messageId: string;
}

export interface SendMessageInput {
  to: string;
  subject: string;
  body: string;
  cc?: string;
  bcc?: string;
  replyTo?: string;
  inReplyTo?: string;
  references?: string;
}

export interface SearchMessagesInput {
  query: string;
  maxResults?: number;
}

export interface TrashMessageInput {
  messageId: string;
}

export interface DeleteMessageInput {
  messageId: string;
}

export interface ModifyMessageLabelsInput {
  messageId: string;
  addLabelIds?: string[];
  removeLabelIds?: string[];
}

export interface GetAttachmentInput {
  messageId: string;
  attachmentId: string;
}

// ── Drafts ───────────────────────────────────────────────────────────────────

export interface ListDraftsInput {
  maxResults?: number;
}

export interface GetDraftInput {
  draftId: string;
}

export type CreateDraftInput = SendMessageInput;

export interface DeleteDraftInput {
  draftId: string;
}

export interface SendDraftInput {
  draftId: string;
}

// ── Labels ───────────────────────────────────────────────────────────────────

export interface CreateLabelInput {
  name: string;
  labelListVisibility?: 'labelShow' | 'labelShowIfUnread' | 'labelHide';
  messageListVisibility?: 'show' | 'hide';
}

export interface DeleteLabelInput {
  labelId: string;
}

// ── Threads ───────────────────────────────────────────────────────────────────

export interface ListThreadsInput {
  maxResults?: number;
  query?: string;
}

export interface GetThreadInput {
  threadId: string;
}

export interface TrashThreadInput {
  threadId: string;
}

// ── Result ────────────────────────────────────────────────────────────────────

export interface GmailActionResult<T = any> {
  success: boolean;
  data: T;
}
