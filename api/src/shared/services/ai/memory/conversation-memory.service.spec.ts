import { MessageRole } from 'generated/prisma';
import { ConversationMemoryService } from './conversation-memory.service';

describe('ConversationMemoryService', () => {
  function createService(options?: {
    cached?: unknown;
    dbRows?: Array<{ role: MessageRole; content: string; metadata: null }>;
  }) {
    const cache = new Map<string, unknown>();
    if (options?.cached !== undefined) {
      cache.set('chat:messages:org-uuid:conversation-uuid', options.cached);
    }

    const prisma = {
      message: {
        findMany: jest.fn().mockResolvedValue(
          options?.dbRows ?? [
            { role: MessageRole.USER, content: 'find members', metadata: null },
            { role: MessageRole.ASSISTANT, content: 'member list', metadata: null },
          ],
        ),
      },
    };

    const service = new ConversationMemoryService(prisma as any, {
      get: jest.fn(async (key: string) => cache.get(key)),
      set: jest.fn(async (key: string, value: unknown) => {
        cache.set(key, value);
      }),
      delete: jest.fn(async (key: string) => {
        cache.delete(key);
      }),
    } as any);

    return { service, prisma, cache };
  }

  it('returns cached messages without querying the database', async () => {
    const cached = [
      { role: 'user', content: 'find members' },
      { role: 'assistant', content: 'member list' },
    ];
    const { service, prisma } = createService({ cached });

    const messages = await service.getMessages('org-uuid', 'conversation-uuid');

    expect(messages).toEqual(cached);
    expect(prisma.message.findMany).not.toHaveBeenCalled();
  });

  it('loads from the database only on cache miss', async () => {
    const { service, prisma, cache } = createService();

    const messages = await service.getMessages('org-uuid', 'conversation-uuid');

    expect(prisma.message.findMany).toHaveBeenCalledTimes(1);
    expect(messages).toEqual([
      { role: 'user', content: 'find members' },
      { role: 'assistant', content: 'member list' },
    ]);
    expect(cache.get('chat:messages:org-uuid:conversation-uuid')).toEqual(messages);
  });

  it('hydrates cache from the database in the background', async () => {
    const dbRows = [
      { role: MessageRole.USER, content: 'find members', metadata: null },
      { role: MessageRole.ASSISTANT, content: 'member list', metadata: null },
      { role: MessageRole.USER, content: 'make it an excel', metadata: null },
    ];
    const { service, cache } = createService({
      cached: [{ role: 'user', content: 'stale only message' }],
      dbRows,
    });

    await service.hydrateCacheFromDb('org-uuid', 'conversation-uuid');

    expect(cache.get('chat:messages:org-uuid:conversation-uuid')).toEqual([
      { role: 'user', content: 'find members' },
      { role: 'assistant', content: 'member list' },
      { role: 'user', content: 'make it an excel' },
    ]);
  });
});
