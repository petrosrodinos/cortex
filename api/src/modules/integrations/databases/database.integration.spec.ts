import { DatabaseOperation, DatabaseType, IntegrationProvider } from 'generated/prisma';
import { DatabaseIntegration } from './database.integration';

describe('DatabaseIntegration', () => {
  const prisma: any = {
    databaseIntegration: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    integrationAction: {
      findFirst: jest.fn(),
    },
  };
  const encryption: any = { decrypt: jest.fn() };
  const adapterFactory: any = { getAdapter: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    encryption.decrypt.mockReturnValue('postgres://user:pass@localhost:5432/app');
    prisma.integrationAction.findFirst.mockResolvedValue({ key: 'query', enabled: true });
    prisma.databaseIntegration.findUnique.mockResolvedValue({
      uuid: 'db-row',
      integration_uuid: 'integration-uuid',
      db_type: DatabaseType.POSTGRESQL,
      connection_string: 'encrypted',
      allowed_ops: [DatabaseOperation.READ],
      schema_cache: { tables: [] },
      last_schema_sync: new Date(),
    });
    adapterFactory.getAdapter.mockResolvedValue({
      introspectSchema: jest.fn(),
      executeQuery: jest.fn().mockResolvedValue({ rows: [{ id: 1 }], rowCount: 1 }),
    });
  });

  it('exposes shared database tools based on allowed operations', () => {
    const integration = new DatabaseIntegration(prisma, encryption, adapterFactory, IntegrationProvider.DATABASE_PG);
    const tools = integration.getTools({
      database: { allowed_ops: [DatabaseOperation.READ, DatabaseOperation.INSERT] },
    } as any);

    expect(tools.map((tool) => tool.function.name)).toEqual(['db__get_schema', 'db__query', 'db__insert']);
  });

  it('refreshes stale schema before executing a query', async () => {
    const oldDate = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const adapter = {
      introspectSchema: jest.fn().mockResolvedValue({ tables: [{ name: 'users', columns: [] }] }),
      executeQuery: jest.fn().mockResolvedValue({ rows: [{ id: 1 }], rowCount: 1 }),
    };
    prisma.databaseIntegration.findUnique.mockResolvedValue({
      uuid: 'db-row',
      integration_uuid: 'integration-uuid',
      db_type: DatabaseType.POSTGRESQL,
      connection_string: 'encrypted',
      allowed_ops: [DatabaseOperation.READ],
      schema_cache: { tables: [] },
      last_schema_sync: oldDate,
    });
    adapterFactory.getAdapter.mockResolvedValue(adapter);
    const integration = new DatabaseIntegration(prisma, encryption, adapterFactory, IntegrationProvider.DATABASE_PG);

    const result = await integration.executeTool('db__query', { query: 'select * from users', params: [] }, {
      uuid: 'integration-uuid',
      config: '{}',
    } as any);

    expect(adapter.introspectSchema).toHaveBeenCalledTimes(1);
    expect(prisma.databaseIntegration.update).toHaveBeenCalledWith({
      where: { integration_uuid: 'integration-uuid' },
      data: { schema_cache: { tables: [{ name: 'users', columns: [] }] }, last_schema_sync: expect.any(Date) },
    });
    expect(result).toEqual({ rows: [{ id: 1 }], rowCount: 1 });
  });
});
