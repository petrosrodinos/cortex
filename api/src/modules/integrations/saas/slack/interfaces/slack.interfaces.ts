// ── Channels ──────────────────────────────────────────────────────────────────

export interface ListChannelsInput {
  types?: string;
  limit?: number;
}

export interface GetChannelInput {
  channel: string;
}

export interface CreateChannelInput {
  name: string;
  isPrivate?: boolean;
}

export interface ChannelInput {
  channel: string;
}

export interface InviteToChannelInput {
  channel: string;
  users: string;
}

export interface ListChannelMembersInput {
  channel: string;
  limit?: number;
}

export interface SetChannelTopicInput {
  channel: string;
  topic: string;
}

export interface SetChannelPurposeInput {
  channel: string;
  purpose: string;
}

// ── Messages ──────────────────────────────────────────────────────────────────

export interface SendMessageInput {
  channel: string;
  text: string;
  threadTs?: string;
  blocks?: any[];
}

export interface GetMessagesInput {
  channel: string;
  limit?: number;
  oldest?: string;
  latest?: string;
}

export interface UpdateMessageInput {
  channel: string;
  ts: string;
  text: string;
}

export interface DeleteMessageInput {
  channel: string;
  ts: string;
}

export interface GetThreadRepliesInput {
  channel: string;
  ts: string;
  limit?: number;
}

export interface SearchMessagesInput {
  query: string;
  count?: number;
}

// ── Reactions ─────────────────────────────────────────────────────────────────

export interface ReactionInput {
  channel: string;
  timestamp: string;
  name: string;
}

export interface GetReactionsInput {
  channel: string;
  timestamp: string;
}

// ── Pins ──────────────────────────────────────────────────────────────────────

export interface PinInput {
  channel: string;
  timestamp: string;
}

// ── Users ─────────────────────────────────────────────────────────────────────

export interface ListUsersInput {
  limit?: number;
}

export interface GetUserInput {
  user: string;
}

export interface GetUserByEmailInput {
  email: string;
}

export interface OpenDmInput {
  user: string;
}

// ── Files ─────────────────────────────────────────────────────────────────────

export interface ListFilesInput {
  channel?: string;
  limit?: number;
}

export interface UploadFileInput {
  channels: string;
  content: string;
  filename: string;
  title?: string;
}

export interface FileInput {
  file: string;
}

// ── Result ────────────────────────────────────────────────────────────────────

export interface SlackActionResult<T = any> {
  success: boolean;
  data: T;
}
