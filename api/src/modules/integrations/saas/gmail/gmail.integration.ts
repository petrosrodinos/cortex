import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { IntegrationProvider } from 'generated/prisma';
import { SaasActionDefinition, SaasIntegration, emptySchema, optionalNumber, optionalString } from '../saas-integration.base';
import { createGoogleOAuthClient } from '../google-auth.helper';
import { GMAIL_REQUIRED_CONFIG_KEYS } from './config/gmail.config';
import { GmailService } from './services/gmail.service';

@Injectable()
export class GmailIntegration extends SaasIntegration {
  provider = IntegrationProvider.GMAIL;

  protected readonly actions: SaasActionDefinition[] = [
    // ── Messages ──────────────────────────────────────────────────────────
    {
      key: 'list_messages',
      label: 'List messages',
      description: 'List recent Gmail messages.',
      schema: z.object({ maxResults: optionalNumber, labelIds: z.array(z.string()).optional(), pageToken: optionalString }),
      parameters: this.jsonSchema({ maxResults: { type: 'number' }, labelIds: { type: 'array', items: { type: 'string' } }, pageToken: { type: 'string' } }),
    },
    {
      key: 'get_message',
      label: 'Get message',
      description: 'Get a full Gmail message by ID.',
      schema: z.object({ messageId: z.string() }),
      parameters: this.jsonSchema({ messageId: { type: 'string' } }, ['messageId']),
    },
    {
      key: 'send_message',
      label: 'Send message',
      description: 'Send an email with Gmail.',
      schema: z.object({ to: z.string(), subject: z.string(), body: z.string(), cc: optionalString, bcc: optionalString, replyTo: optionalString, inReplyTo: optionalString, references: optionalString }),
      parameters: this.jsonSchema({ to: { type: 'string' }, subject: { type: 'string' }, body: { type: 'string' }, cc: { type: 'string' }, bcc: { type: 'string' }, replyTo: { type: 'string' }, inReplyTo: { type: 'string' }, references: { type: 'string' } }, ['to', 'subject', 'body']),
    },
    {
      key: 'search_messages',
      label: 'Search messages',
      description: 'Search Gmail messages by query string.',
      schema: z.object({ query: z.string(), maxResults: optionalNumber }),
      parameters: this.jsonSchema({ query: { type: 'string' }, maxResults: { type: 'number' } }, ['query']),
    },
    {
      key: 'trash_message',
      label: 'Trash message',
      description: 'Move a Gmail message to the trash.',
      schema: z.object({ messageId: z.string() }),
      parameters: this.jsonSchema({ messageId: { type: 'string' } }, ['messageId']),
    },
    {
      key: 'delete_message',
      label: 'Delete message',
      description: 'Permanently delete a Gmail message.',
      schema: z.object({ messageId: z.string() }),
      parameters: this.jsonSchema({ messageId: { type: 'string' } }, ['messageId']),
    },
    {
      key: 'mark_as_read',
      label: 'Mark as read',
      description: 'Mark a Gmail message as read.',
      schema: z.object({ messageId: z.string() }),
      parameters: this.jsonSchema({ messageId: { type: 'string' } }, ['messageId']),
    },
    {
      key: 'mark_as_unread',
      label: 'Mark as unread',
      description: 'Mark a Gmail message as unread.',
      schema: z.object({ messageId: z.string() }),
      parameters: this.jsonSchema({ messageId: { type: 'string' } }, ['messageId']),
    },
    {
      key: 'modify_message_labels',
      label: 'Modify message labels',
      description: 'Add or remove labels on a Gmail message.',
      schema: z.object({ messageId: z.string(), addLabelIds: z.array(z.string()).optional(), removeLabelIds: z.array(z.string()).optional() }),
      parameters: this.jsonSchema({ messageId: { type: 'string' }, addLabelIds: { type: 'array', items: { type: 'string' } }, removeLabelIds: { type: 'array', items: { type: 'string' } } }, ['messageId']),
    },
    {
      key: 'get_attachment',
      label: 'Get attachment',
      description: 'Get a specific attachment from a Gmail message.',
      schema: z.object({ messageId: z.string(), attachmentId: z.string() }),
      parameters: this.jsonSchema({ messageId: { type: 'string' }, attachmentId: { type: 'string' } }, ['messageId', 'attachmentId']),
    },

    // ── Drafts ────────────────────────────────────────────────────────────
    {
      key: 'list_drafts',
      label: 'List drafts',
      description: 'List Gmail drafts.',
      schema: z.object({ maxResults: optionalNumber }),
      parameters: this.jsonSchema({ maxResults: { type: 'number' } }),
    },
    {
      key: 'get_draft',
      label: 'Get draft',
      description: 'Get a Gmail draft by ID.',
      schema: z.object({ draftId: z.string() }),
      parameters: this.jsonSchema({ draftId: { type: 'string' } }, ['draftId']),
    },
    {
      key: 'create_draft',
      label: 'Create draft',
      description: 'Create a Gmail draft.',
      schema: z.object({ to: z.string(), subject: z.string(), body: z.string(), cc: optionalString, bcc: optionalString }),
      parameters: this.jsonSchema({ to: { type: 'string' }, subject: { type: 'string' }, body: { type: 'string' }, cc: { type: 'string' }, bcc: { type: 'string' } }, ['to', 'subject', 'body']),
    },
    {
      key: 'delete_draft',
      label: 'Delete draft',
      description: 'Delete a Gmail draft.',
      schema: z.object({ draftId: z.string() }),
      parameters: this.jsonSchema({ draftId: { type: 'string' } }, ['draftId']),
    },
    {
      key: 'send_draft',
      label: 'Send draft',
      description: 'Send an existing Gmail draft.',
      schema: z.object({ draftId: z.string() }),
      parameters: this.jsonSchema({ draftId: { type: 'string' } }, ['draftId']),
    },

    // ── Labels ────────────────────────────────────────────────────────────
    {
      key: 'list_labels',
      label: 'List labels',
      description: 'List all Gmail labels.',
      schema: emptySchema,
      parameters: this.jsonSchema(),
    },
    {
      key: 'create_label',
      label: 'Create label',
      description: 'Create a new Gmail label.',
      schema: z.object({ name: z.string(), labelListVisibility: optionalString, messageListVisibility: optionalString }),
      parameters: this.jsonSchema({ name: { type: 'string' }, labelListVisibility: { type: 'string', enum: ['labelShow', 'labelShowIfUnread', 'labelHide'] }, messageListVisibility: { type: 'string', enum: ['show', 'hide'] } }, ['name']),
    },
    {
      key: 'delete_label',
      label: 'Delete label',
      description: 'Delete a Gmail label.',
      schema: z.object({ labelId: z.string() }),
      parameters: this.jsonSchema({ labelId: { type: 'string' } }, ['labelId']),
    },

    // ── Threads ───────────────────────────────────────────────────────────
    {
      key: 'list_threads',
      label: 'List threads',
      description: 'List Gmail conversation threads.',
      schema: z.object({ maxResults: optionalNumber, query: optionalString }),
      parameters: this.jsonSchema({ maxResults: { type: 'number' }, query: { type: 'string' } }),
    },
    {
      key: 'get_thread',
      label: 'Get thread',
      description: 'Get a full Gmail conversation thread by ID.',
      schema: z.object({ threadId: z.string() }),
      parameters: this.jsonSchema({ threadId: { type: 'string' } }, ['threadId']),
    },
    {
      key: 'trash_thread',
      label: 'Trash thread',
      description: 'Move an entire Gmail thread to the trash.',
      schema: z.object({ threadId: z.string() }),
      parameters: this.jsonSchema({ threadId: { type: 'string' } }, ['threadId']),
    },

    // ── Profile ───────────────────────────────────────────────────────────
    {
      key: 'get_profile',
      label: 'Get profile',
      description: 'Get the Gmail profile (email address, message count, thread count).',
      schema: emptySchema,
      parameters: this.jsonSchema(),
    },
  ];

  constructor(prisma: PrismaService, encryption: EncryptionService) {
    super(prisma, encryption);
  }

  protected requiredConfigKeys() {
    return [...GMAIL_REQUIRED_CONFIG_KEYS];
  }

  protected async executeValidatedTool(actionKey: string, input: Record<string, any>, config: Record<string, any>) {
    const { google, auth } = await createGoogleOAuthClient(config);
    const service = new GmailService(google.gmail({ version: 'v1', auth }));

    const actions: Record<string, () => Promise<any>> = {
      // Messages
      list_messages: () => service.listMessages(input),
      get_message: () => service.getMessage(input as any),
      send_message: () => service.sendMessage(input as any),
      search_messages: () => service.searchMessages(input as any),
      trash_message: () => service.trashMessage(input as any),
      delete_message: () => service.deleteMessage(input as any),
      mark_as_read: () => service.markAsRead(input as any),
      mark_as_unread: () => service.markAsUnread(input as any),
      modify_message_labels: () => service.modifyMessageLabels(input as any),
      get_attachment: () => service.getAttachment(input as any),
      // Drafts
      list_drafts: () => service.listDrafts(input),
      get_draft: () => service.getDraft(input as any),
      create_draft: () => service.createDraft(input as any),
      delete_draft: () => service.deleteDraft(input as any),
      send_draft: () => service.sendDraft(input as any),
      // Labels
      list_labels: () => service.listLabels(),
      create_label: () => service.createLabel(input as any),
      delete_label: () => service.deleteLabel(input as any),
      // Threads
      list_threads: () => service.listThreads(input),
      get_thread: () => service.getThread(input as any),
      trash_thread: () => service.trashThread(input as any),
      // Profile
      get_profile: () => service.getProfile(),
    };

    return actions[actionKey]();
  }
}
