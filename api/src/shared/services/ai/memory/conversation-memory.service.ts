import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { CacheService } from '@/shared/services/cache/cache.service';
import { MessageRole } from 'generated/prisma';
import type { ModelMessage } from 'ai';
import type { ConversationMemory } from './conversation-memory.interface';

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const MESSAGE_LIMIT = 100;

@Injectable()
export class ConversationMemoryService implements ConversationMemory {
  private readonly logger = new Logger(ConversationMemoryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  private cacheKey(organizationUuid: string, conversationId: string) {
    return `chat:messages:${organizationUuid}:${conversationId}`;
  }

  async getMessages(organizationUuid: string, conversationId: string): Promise<ModelMessage[]> {
    const key = this.cacheKey(organizationUuid, conversationId);
    const cached = await this.cache.get<ModelMessage[]>(key);

    if (cached) {
      await this.cache.set(key, cached, CACHE_TTL_MS);
      return cached;
    }

    return this.hydrateCacheFromDb(organizationUuid, conversationId);
  }

  async hydrateCacheFromDb(organizationUuid: string, conversationId: string): Promise<ModelMessage[]> {
    const key = this.cacheKey(organizationUuid, conversationId);
    const messages = await this.loadMessagesFromDb(conversationId);
    await this.cache.set(key, messages, CACHE_TTL_MS);
    return messages;
  }

  scheduleHydrateCacheFromDb(organizationUuid: string, conversationId: string): void {
    void this.hydrateCacheFromDb(organizationUuid, conversationId).catch((error) => {
      const message = error instanceof Error ? error.message : 'Failed to hydrate conversation cache';
      this.logger.warn(`Conversation cache hydrate failed for ${conversationId}: ${message}`);
    });
  }

  async replaceMessages(organizationUuid: string, conversationId: string, messages: ModelMessage[]): Promise<void> {
    const key = this.cacheKey(organizationUuid, conversationId);
    await this.cache.set(key, messages, CACHE_TTL_MS);

    await this.prisma.$transaction(async (tx) => {
      await tx.message.deleteMany({ where: { conversation_uuid: conversationId } });
      if (messages.length === 0) {
        return;
      }

      await tx.message.createMany({
        data: messages.map((message, index) => ({
          conversation_uuid: conversationId,
          role: this.fromModelRole(message.role),
          content: this.extractContent(message),
          metadata: message as object,
          created_at: new Date(Date.now() + index),
        })),
      });
    });
  }

  async persistNewMessages(
    conversationId: string,
    messages: Array<{ role: MessageRole; content: string; metadata?: object }>,
  ) {
    if (messages.length === 0) {
      return;
    }

    await this.prisma.message.createMany({
      data: messages.map((message) => ({
        conversation_uuid: conversationId,
        role: message.role,
        content: message.content,
        metadata: message.metadata,
      })),
    });
  }

  async invalidate(organizationUuid: string, conversationId: string): Promise<void> {
    await this.cache.delete(this.cacheKey(organizationUuid, conversationId));
  }

  private async loadMessagesFromDb(conversationId: string): Promise<ModelMessage[]> {
    const rows = await this.prisma.message.findMany({
      where: { conversation_uuid: conversationId },
      orderBy: { created_at: 'asc' },
      take: MESSAGE_LIMIT,
    });

    return Promise.all(rows.map((row) => this.toModelMessage(row.role, row.content, row.metadata)));
  }

  private async toModelMessage(role: MessageRole, content: string, metadata: unknown): Promise<ModelMessage> {
    if (metadata && typeof metadata === 'object' && 'role' in (metadata as object)) {
      return metadata as ModelMessage;
    }

    switch (role) {
      case MessageRole.SYSTEM:
        return { role: 'system', content };
      case MessageRole.ASSISTANT:
        return { role: 'assistant', content: await this.enrichAssistantContent(content, metadata) };
      case MessageRole.TOOL:
        return { role: 'user', content: `[tool] ${content}` };
      default:
        return { role: 'user', content };
    }
  }

  private async enrichAssistantContent(content: string, metadata: unknown): Promise<string> {
    const meta = metadata as {
      generatedDocuments?: Array<{ document_uuid: string; filename?: string }>;
      files?: string[];
    } | null;

    const lines: string[] = [];

    if (meta?.generatedDocuments?.length) {
      for (const document of meta.generatedDocuments) {
        lines.push(
          `- ${document.filename ?? 'Generated file'} (document_uuid: ${document.document_uuid})`,
        );
      }
    } else if (meta?.files?.length) {
      const documents = await this.prisma.document.findMany({
        where: { url: { in: meta.files } },
        select: { uuid: true, filename: true, url: true },
      });

      for (const fileUrl of meta.files) {
        const document = documents.find((entry) => entry.url === fileUrl);
        if (document) {
          lines.push(`- ${document.filename} (document_uuid: ${document.uuid})`);
        }
      }
    }

    if (lines.length === 0) {
      return content;
    }

    return `${content}\n\nGenerated files:\n${lines.join('\n')}`;
  }

  private fromModelRole(role: ModelMessage['role']): MessageRole {
    switch (role) {
      case 'system':
        return MessageRole.SYSTEM;
      case 'assistant':
        return MessageRole.ASSISTANT;
      case 'tool':
        return MessageRole.TOOL;
      default:
        return MessageRole.USER;
    }
  }

  private extractContent(message: ModelMessage): string {
    if (typeof message.content === 'string') {
      return message.content;
    }

    if (Array.isArray(message.content)) {
      return message.content
        .map((part) => {
          if (typeof part === 'string') {
            return part;
          }
          if (part && typeof part === 'object' && 'type' in part && part.type === 'text') {
            return (part as { text: string }).text;
          }
          return '';
        })
        .filter(Boolean)
        .join('\n');
    }

    return '';
  }
}
