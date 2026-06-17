import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { IntegrationProvider } from 'generated/prisma';
import { SaasActionDefinition, SaasIntegration, emptySchema, loadRuntimePackage, optionalNumber, optionalString } from '../saas-integration.base';
import { SLACK_REQUIRED_CONFIG_KEYS } from './config/slack.config';
import { SlackService } from './services/slack.service';

@Injectable()
export class SlackIntegration extends SaasIntegration {
  provider = IntegrationProvider.SLACK;

  protected readonly actions: SaasActionDefinition[] = [
    // ── Channels ──────────────────────────────────────────────────────────
    {
      key: 'list_channels',
      label: 'List channels',
      description: 'List Slack channels.',
      schema: z.object({ types: optionalString, limit: optionalNumber }),
      parameters: this.jsonSchema({ types: { type: 'string' }, limit: { type: 'number' } }),
    },
    {
      key: 'get_channel',
      label: 'Get channel',
      description: 'Get info about a Slack channel.',
      schema: z.object({ channel: z.string() }),
      parameters: this.jsonSchema({ channel: { type: 'string' } }, ['channel']),
    },
    {
      key: 'create_channel',
      label: 'Create channel',
      description: 'Create a new Slack channel.',
      schema: z.object({ name: z.string(), isPrivate: z.boolean().optional() }),
      parameters: this.jsonSchema({ name: { type: 'string' }, isPrivate: { type: 'boolean' } }, ['name']),
    },
    {
      key: 'join_channel',
      label: 'Join channel',
      description: 'Join a Slack channel.',
      schema: z.object({ channel: z.string() }),
      parameters: this.jsonSchema({ channel: { type: 'string' } }, ['channel']),
    },
    {
      key: 'leave_channel',
      label: 'Leave channel',
      description: 'Leave a Slack channel.',
      schema: z.object({ channel: z.string() }),
      parameters: this.jsonSchema({ channel: { type: 'string' } }, ['channel']),
    },
    {
      key: 'archive_channel',
      label: 'Archive channel',
      description: 'Archive a Slack channel.',
      schema: z.object({ channel: z.string() }),
      parameters: this.jsonSchema({ channel: { type: 'string' } }, ['channel']),
    },
    {
      key: 'invite_to_channel',
      label: 'Invite to channel',
      description: 'Invite users to a Slack channel.',
      schema: z.object({ channel: z.string(), users: z.string() }),
      parameters: this.jsonSchema({ channel: { type: 'string' }, users: { type: 'string' } }, ['channel', 'users']),
    },
    {
      key: 'list_channel_members',
      label: 'List channel members',
      description: 'List members of a Slack channel.',
      schema: z.object({ channel: z.string(), limit: optionalNumber }),
      parameters: this.jsonSchema({ channel: { type: 'string' }, limit: { type: 'number' } }, ['channel']),
    },
    {
      key: 'set_channel_topic',
      label: 'Set channel topic',
      description: 'Set the topic of a Slack channel.',
      schema: z.object({ channel: z.string(), topic: z.string() }),
      parameters: this.jsonSchema({ channel: { type: 'string' }, topic: { type: 'string' } }, ['channel', 'topic']),
    },
    {
      key: 'set_channel_purpose',
      label: 'Set channel purpose',
      description: 'Set the purpose of a Slack channel.',
      schema: z.object({ channel: z.string(), purpose: z.string() }),
      parameters: this.jsonSchema({ channel: { type: 'string' }, purpose: { type: 'string' } }, ['channel', 'purpose']),
    },

    // ── Messages ──────────────────────────────────────────────────────────
    {
      key: 'send_message',
      label: 'Send message',
      description: 'Post a message to a Slack channel.',
      schema: z.object({ channel: z.string(), text: z.string(), threadTs: optionalString, blocks: z.array(z.any()).optional() }),
      parameters: this.jsonSchema({ channel: { type: 'string' }, text: { type: 'string' }, threadTs: { type: 'string' }, blocks: { type: 'array' } }, ['channel', 'text']),
    },
    {
      key: 'get_messages',
      label: 'Get messages',
      description: 'Read recent Slack channel messages.',
      schema: z.object({ channel: z.string(), limit: optionalNumber, oldest: optionalString, latest: optionalString }),
      parameters: this.jsonSchema({ channel: { type: 'string' }, limit: { type: 'number' }, oldest: { type: 'string' }, latest: { type: 'string' } }, ['channel']),
    },
    {
      key: 'update_message',
      label: 'Update message',
      description: 'Update an existing Slack message.',
      schema: z.object({ channel: z.string(), ts: z.string(), text: z.string() }),
      parameters: this.jsonSchema({ channel: { type: 'string' }, ts: { type: 'string' }, text: { type: 'string' } }, ['channel', 'ts', 'text']),
    },
    {
      key: 'delete_message',
      label: 'Delete message',
      description: 'Delete a Slack message.',
      schema: z.object({ channel: z.string(), ts: z.string() }),
      parameters: this.jsonSchema({ channel: { type: 'string' }, ts: { type: 'string' } }, ['channel', 'ts']),
    },
    {
      key: 'get_thread_replies',
      label: 'Get thread replies',
      description: 'Get replies in a Slack thread.',
      schema: z.object({ channel: z.string(), ts: z.string(), limit: optionalNumber }),
      parameters: this.jsonSchema({ channel: { type: 'string' }, ts: { type: 'string' }, limit: { type: 'number' } }, ['channel', 'ts']),
    },
    {
      key: 'search_messages',
      label: 'Search messages',
      description: 'Search Slack messages by query.',
      schema: z.object({ query: z.string(), count: optionalNumber }),
      parameters: this.jsonSchema({ query: { type: 'string' }, count: { type: 'number' } }, ['query']),
    },

    // ── Reactions ─────────────────────────────────────────────────────────
    {
      key: 'add_reaction',
      label: 'Add reaction',
      description: 'Add an emoji reaction to a Slack message.',
      schema: z.object({ channel: z.string(), timestamp: z.string(), name: z.string() }),
      parameters: this.jsonSchema({ channel: { type: 'string' }, timestamp: { type: 'string' }, name: { type: 'string' } }, ['channel', 'timestamp', 'name']),
    },
    {
      key: 'remove_reaction',
      label: 'Remove reaction',
      description: 'Remove an emoji reaction from a Slack message.',
      schema: z.object({ channel: z.string(), timestamp: z.string(), name: z.string() }),
      parameters: this.jsonSchema({ channel: { type: 'string' }, timestamp: { type: 'string' }, name: { type: 'string' } }, ['channel', 'timestamp', 'name']),
    },
    {
      key: 'get_reactions',
      label: 'Get reactions',
      description: 'Get all reactions on a Slack message.',
      schema: z.object({ channel: z.string(), timestamp: z.string() }),
      parameters: this.jsonSchema({ channel: { type: 'string' }, timestamp: { type: 'string' } }, ['channel', 'timestamp']),
    },

    // ── Pins ──────────────────────────────────────────────────────────────
    {
      key: 'pin_message',
      label: 'Pin message',
      description: 'Pin a message in a Slack channel.',
      schema: z.object({ channel: z.string(), timestamp: z.string() }),
      parameters: this.jsonSchema({ channel: { type: 'string' }, timestamp: { type: 'string' } }, ['channel', 'timestamp']),
    },
    {
      key: 'unpin_message',
      label: 'Unpin message',
      description: 'Unpin a message from a Slack channel.',
      schema: z.object({ channel: z.string(), timestamp: z.string() }),
      parameters: this.jsonSchema({ channel: { type: 'string' }, timestamp: { type: 'string' } }, ['channel', 'timestamp']),
    },
    {
      key: 'list_pins',
      label: 'List pins',
      description: 'List pinned messages in a Slack channel.',
      schema: z.object({ channel: z.string() }),
      parameters: this.jsonSchema({ channel: { type: 'string' } }, ['channel']),
    },

    // ── Users ─────────────────────────────────────────────────────────────
    {
      key: 'list_users',
      label: 'List users',
      description: 'List members of the Slack workspace.',
      schema: z.object({ limit: optionalNumber }),
      parameters: this.jsonSchema({ limit: { type: 'number' } }),
    },
    {
      key: 'get_user',
      label: 'Get user',
      description: 'Get info about a Slack user by ID.',
      schema: z.object({ user: z.string() }),
      parameters: this.jsonSchema({ user: { type: 'string' } }, ['user']),
    },
    {
      key: 'get_user_by_email',
      label: 'Get user by email',
      description: 'Look up a Slack user by email address.',
      schema: z.object({ email: z.string() }),
      parameters: this.jsonSchema({ email: { type: 'string' } }, ['email']),
    },
    {
      key: 'open_dm',
      label: 'Open DM',
      description: 'Open a direct message conversation with a Slack user.',
      schema: z.object({ user: z.string() }),
      parameters: this.jsonSchema({ user: { type: 'string' } }, ['user']),
    },

    // ── Files ─────────────────────────────────────────────────────────────
    {
      key: 'list_files',
      label: 'List files',
      description: 'List files in the Slack workspace.',
      schema: z.object({ channel: optionalString, limit: optionalNumber }),
      parameters: this.jsonSchema({ channel: { type: 'string' }, limit: { type: 'number' } }),
    },
    {
      key: 'upload_file',
      label: 'Upload file',
      description: 'Upload a file to Slack.',
      schema: z.object({ channels: z.string(), content: z.string(), filename: z.string(), title: optionalString }),
      parameters: this.jsonSchema({ channels: { type: 'string' }, content: { type: 'string' }, filename: { type: 'string' }, title: { type: 'string' } }, ['channels', 'content', 'filename']),
    },
    {
      key: 'delete_file',
      label: 'Delete file',
      description: 'Delete a file from Slack.',
      schema: z.object({ file: z.string() }),
      parameters: this.jsonSchema({ file: { type: 'string' } }, ['file']),
    },
    {
      key: 'get_file',
      label: 'Get file',
      description: 'Get info about a Slack file.',
      schema: z.object({ file: z.string() }),
      parameters: this.jsonSchema({ file: { type: 'string' } }, ['file']),
    },

    // ── Auth ──────────────────────────────────────────────────────────────
    {
      key: 'auth_test',
      label: 'Auth test',
      description: 'Test the Slack bot token and return workspace/bot info.',
      schema: emptySchema,
      parameters: this.jsonSchema(),
    },
  ];

  constructor(prisma: PrismaService, encryption: EncryptionService) {
    super(prisma, encryption);
  }

  protected requiredConfigKeys() {
    return [...SLACK_REQUIRED_CONFIG_KEYS];
  }

  protected async executeValidatedTool(actionKey: string, input: Record<string, any>, config: Record<string, any>) {
    const { WebClient } = await loadRuntimePackage('@slack/web-api');
    const service = new SlackService(new WebClient(config.botToken));

    const actions: Record<string, () => Promise<any>> = {
      // Channels
      list_channels: () => service.listChannels(input),
      get_channel: () => service.getChannel(input as any),
      create_channel: () => service.createChannel(input as any),
      join_channel: () => service.joinChannel(input as any),
      leave_channel: () => service.leaveChannel(input as any),
      archive_channel: () => service.archiveChannel(input as any),
      invite_to_channel: () => service.inviteToChannel(input as any),
      list_channel_members: () => service.listChannelMembers(input as any),
      set_channel_topic: () => service.setChannelTopic(input as any),
      set_channel_purpose: () => service.setChannelPurpose(input as any),
      // Messages
      send_message: () => service.sendMessage(input as any),
      get_messages: () => service.getMessages(input as any),
      update_message: () => service.updateMessage(input as any),
      delete_message: () => service.deleteMessage(input as any),
      get_thread_replies: () => service.getThreadReplies(input as any),
      search_messages: () => service.searchMessages(input as any),
      // Reactions
      add_reaction: () => service.addReaction(input as any),
      remove_reaction: () => service.removeReaction(input as any),
      get_reactions: () => service.getReactions(input as any),
      // Pins
      pin_message: () => service.pinMessage(input as any),
      unpin_message: () => service.unpinMessage(input as any),
      list_pins: () => service.listPins(input as any),
      // Users
      list_users: () => service.listUsers(input),
      get_user: () => service.getUser(input as any),
      get_user_by_email: () => service.getUserByEmail(input as any),
      open_dm: () => service.openDm(input as any),
      // Files
      list_files: () => service.listFiles(input),
      upload_file: () => service.uploadFile(input as any),
      delete_file: () => service.deleteFile(input as any),
      get_file: () => service.getFile(input as any),
      // Auth
      auth_test: () => service.authTest(),
    };

    return actions[actionKey]();
  }
}
