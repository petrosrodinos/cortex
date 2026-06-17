import { SLACK_DEFAULTS } from '../config/slack.config';
import {
  ChannelInput,
  CreateChannelInput,
  DeleteMessageInput,
  FileInput,
  GetChannelInput,
  GetMessagesInput,
  GetReactionsInput,
  GetThreadRepliesInput,
  GetUserByEmailInput,
  GetUserInput,
  InviteToChannelInput,
  ListChannelMembersInput,
  ListChannelsInput,
  ListFilesInput,
  ListUsersInput,
  OpenDmInput,
  PinInput,
  ReactionInput,
  SearchMessagesInput,
  SendMessageInput,
  SetChannelPurposeInput,
  SetChannelTopicInput,
  UpdateMessageInput,
  UploadFileInput,
} from '../interfaces/slack.interfaces';
import { wrapResult } from '../utils/slack.utils';

export class SlackService {
  constructor(private readonly client: any) {}

  // ── Channels ──────────────────────────────────────────────────────────────

  async listChannels({ types, limit }: ListChannelsInput = {}) {
    return wrapResult(await this.client.conversations.list({ types: types ?? SLACK_DEFAULTS.CHANNEL_TYPES, limit: limit ?? SLACK_DEFAULTS.LIMIT }));
  }

  async getChannel({ channel }: GetChannelInput) {
    return wrapResult(await this.client.conversations.info({ channel }));
  }

  async createChannel({ name, isPrivate }: CreateChannelInput) {
    return wrapResult(await this.client.conversations.create({ name, is_private: isPrivate ?? false }));
  }

  async joinChannel({ channel }: ChannelInput) {
    return wrapResult(await this.client.conversations.join({ channel }));
  }

  async leaveChannel({ channel }: ChannelInput) {
    return wrapResult(await this.client.conversations.leave({ channel }));
  }

  async archiveChannel({ channel }: ChannelInput) {
    return wrapResult(await this.client.conversations.archive({ channel }));
  }

  async inviteToChannel({ channel, users }: InviteToChannelInput) {
    return wrapResult(await this.client.conversations.invite({ channel, users }));
  }

  async listChannelMembers({ channel, limit }: ListChannelMembersInput) {
    return wrapResult(await this.client.conversations.members({ channel, limit: limit ?? SLACK_DEFAULTS.LIMIT }));
  }

  async setChannelTopic({ channel, topic }: SetChannelTopicInput) {
    return wrapResult(await this.client.conversations.setTopic({ channel, topic }));
  }

  async setChannelPurpose({ channel, purpose }: SetChannelPurposeInput) {
    return wrapResult(await this.client.conversations.setPurpose({ channel, purpose }));
  }

  // ── Messages ──────────────────────────────────────────────────────────────

  async sendMessage({ channel, text, threadTs, blocks }: SendMessageInput) {
    return wrapResult(await this.client.chat.postMessage({ channel, text, thread_ts: threadTs, blocks }));
  }

  async getMessages({ channel, limit, oldest, latest }: GetMessagesInput) {
    return wrapResult(await this.client.conversations.history({ channel, limit: limit ?? SLACK_DEFAULTS.LIMIT, oldest, latest }));
  }

  async updateMessage({ channel, ts, text }: UpdateMessageInput) {
    return wrapResult(await this.client.chat.update({ channel, ts, text }));
  }

  async deleteMessage({ channel, ts }: DeleteMessageInput) {
    return wrapResult(await this.client.chat.delete({ channel, ts }));
  }

  async getThreadReplies({ channel, ts, limit }: GetThreadRepliesInput) {
    return wrapResult(await this.client.conversations.replies({ channel, ts, limit: limit ?? SLACK_DEFAULTS.LIMIT }));
  }

  async searchMessages({ query, count }: SearchMessagesInput) {
    return wrapResult(await this.client.search.messages({ query, count: count ?? SLACK_DEFAULTS.LIMIT }));
  }

  // ── Reactions ─────────────────────────────────────────────────────────────

  async addReaction({ channel, timestamp, name }: ReactionInput) {
    return wrapResult(await this.client.reactions.add({ channel, timestamp, name }));
  }

  async removeReaction({ channel, timestamp, name }: ReactionInput) {
    return wrapResult(await this.client.reactions.remove({ channel, timestamp, name }));
  }

  async getReactions({ channel, timestamp }: GetReactionsInput) {
    return wrapResult(await this.client.reactions.get({ channel, timestamp }));
  }

  // ── Pins ──────────────────────────────────────────────────────────────────

  async pinMessage({ channel, timestamp }: PinInput) {
    return wrapResult(await this.client.pins.add({ channel, timestamp }));
  }

  async unpinMessage({ channel, timestamp }: PinInput) {
    return wrapResult(await this.client.pins.remove({ channel, timestamp }));
  }

  async listPins({ channel }: ChannelInput) {
    return wrapResult(await this.client.pins.list({ channel }));
  }

  // ── Users ─────────────────────────────────────────────────────────────────

  async listUsers({ limit }: ListUsersInput = {}) {
    return wrapResult(await this.client.users.list({ limit: limit ?? SLACK_DEFAULTS.LIMIT }));
  }

  async getUser({ user }: GetUserInput) {
    return wrapResult(await this.client.users.info({ user }));
  }

  async getUserByEmail({ email }: GetUserByEmailInput) {
    return wrapResult(await this.client.users.lookupByEmail({ email }));
  }

  async openDm({ user }: OpenDmInput) {
    return wrapResult(await this.client.conversations.open({ users: user }));
  }

  // ── Files ─────────────────────────────────────────────────────────────────

  async listFiles({ channel, limit }: ListFilesInput = {}) {
    return wrapResult(await this.client.files.list({ channel, count: limit ?? SLACK_DEFAULTS.LIMIT }));
  }

  async uploadFile({ channels, content, filename, title }: UploadFileInput) {
    return wrapResult(await this.client.files.upload({ channels, content, filename, title }));
  }

  async deleteFile({ file }: FileInput) {
    return wrapResult(await this.client.files.delete({ file }));
  }

  async getFile({ file }: FileInput) {
    return wrapResult(await this.client.files.info({ file }));
  }

  // ── Auth ──────────────────────────────────────────────────────────────────

  async authTest() {
    return wrapResult(await this.client.auth.test());
  }
}
