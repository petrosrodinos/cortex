import { GMAIL_DEFAULTS } from '../config/gmail.config';
import {
  CreateDraftInput,
  CreateLabelInput,
  DeleteDraftInput,
  DeleteLabelInput,
  DeleteMessageInput,
  GetAttachmentInput,
  GetDraftInput,
  GetMessageInput,
  GetThreadInput,
  ListDraftsInput,
  ListMessagesInput,
  ListThreadsInput,
  ModifyMessageLabelsInput,
  SearchMessagesInput,
  SendDraftInput,
  SendMessageInput,
  TrashMessageInput,
  TrashThreadInput,
} from '../interfaces/gmail.interfaces';
import { deletedResult, encodeEmail, extractData } from '../utils/gmail.utils';

const ME = GMAIL_DEFAULTS.USER_ID;

export class GmailService {
  constructor(private readonly gmail: any) {}

  // ── Messages ──────────────────────────────────────────────────────────────

  listMessages({ maxResults, labelIds, pageToken }: ListMessagesInput = {}) {
    return this.gmail.users.messages
      .list({ userId: ME, maxResults: maxResults ?? GMAIL_DEFAULTS.MAX_RESULTS, labelIds, pageToken })
      .then(extractData);
  }

  getMessage({ messageId }: GetMessageInput) {
    return this.gmail.users.messages
      .get({ userId: ME, id: messageId, format: 'full' })
      .then(extractData);
  }

  sendMessage(input: SendMessageInput) {
    return this.gmail.users.messages
      .send({ userId: ME, requestBody: { raw: encodeEmail(input) } })
      .then(extractData);
  }

  searchMessages({ query, maxResults }: SearchMessagesInput) {
    return this.gmail.users.messages
      .list({ userId: ME, q: query, maxResults: maxResults ?? GMAIL_DEFAULTS.MAX_RESULTS })
      .then(extractData);
  }

  trashMessage({ messageId }: TrashMessageInput) {
    return this.gmail.users.messages
      .trash({ userId: ME, id: messageId })
      .then(extractData);
  }

  async deleteMessage({ messageId }: DeleteMessageInput) {
    await this.gmail.users.messages.delete({ userId: ME, id: messageId });
    return deletedResult(`Message ${messageId} permanently deleted.`);
  }

  modifyMessageLabels({ messageId, addLabelIds, removeLabelIds }: ModifyMessageLabelsInput) {
    return this.gmail.users.messages
      .modify({ userId: ME, id: messageId, requestBody: { addLabelIds: addLabelIds ?? [], removeLabelIds: removeLabelIds ?? [] } })
      .then(extractData);
  }

  markAsRead({ messageId }: GetMessageInput) {
    return this.modifyMessageLabels({ messageId, removeLabelIds: ['UNREAD'] });
  }

  markAsUnread({ messageId }: GetMessageInput) {
    return this.modifyMessageLabels({ messageId, addLabelIds: ['UNREAD'] });
  }

  getAttachment({ messageId, attachmentId }: GetAttachmentInput) {
    return this.gmail.users.messages.attachments
      .get({ userId: ME, messageId, id: attachmentId })
      .then(extractData);
  }

  // ── Drafts ────────────────────────────────────────────────────────────────

  listDrafts({ maxResults }: ListDraftsInput = {}) {
    return this.gmail.users.drafts
      .list({ userId: ME, maxResults: maxResults ?? GMAIL_DEFAULTS.MAX_RESULTS })
      .then(extractData);
  }

  getDraft({ draftId }: GetDraftInput) {
    return this.gmail.users.drafts
      .get({ userId: ME, id: draftId, format: 'full' })
      .then(extractData);
  }

  createDraft(input: CreateDraftInput) {
    return this.gmail.users.drafts
      .create({ userId: ME, requestBody: { message: { raw: encodeEmail(input) } } })
      .then(extractData);
  }

  async deleteDraft({ draftId }: DeleteDraftInput) {
    await this.gmail.users.drafts.delete({ userId: ME, id: draftId });
    return deletedResult(`Draft ${draftId} deleted.`);
  }

  sendDraft({ draftId }: SendDraftInput) {
    return this.gmail.users.drafts
      .send({ userId: ME, requestBody: { id: draftId } })
      .then(extractData);
  }

  // ── Labels ────────────────────────────────────────────────────────────────

  listLabels() {
    return this.gmail.users.labels.list({ userId: ME }).then(extractData);
  }

  createLabel({ name, labelListVisibility, messageListVisibility }: CreateLabelInput) {
    return this.gmail.users.labels
      .create({ userId: ME, requestBody: { name, labelListVisibility, messageListVisibility } })
      .then(extractData);
  }

  async deleteLabel({ labelId }: DeleteLabelInput) {
    await this.gmail.users.labels.delete({ userId: ME, id: labelId });
    return deletedResult(`Label ${labelId} deleted.`);
  }

  // ── Threads ───────────────────────────────────────────────────────────────

  listThreads({ maxResults, query }: ListThreadsInput = {}) {
    return this.gmail.users.threads
      .list({ userId: ME, maxResults: maxResults ?? GMAIL_DEFAULTS.MAX_RESULTS, q: query })
      .then(extractData);
  }

  getThread({ threadId }: GetThreadInput) {
    return this.gmail.users.threads
      .get({ userId: ME, id: threadId, format: 'full' })
      .then(extractData);
  }

  trashThread({ threadId }: TrashThreadInput) {
    return this.gmail.users.threads
      .trash({ userId: ME, id: threadId })
      .then(extractData);
  }

  // ── Profile ───────────────────────────────────────────────────────────────

  getProfile() {
    return this.gmail.users.getProfile({ userId: ME }).then(extractData);
  }
}
