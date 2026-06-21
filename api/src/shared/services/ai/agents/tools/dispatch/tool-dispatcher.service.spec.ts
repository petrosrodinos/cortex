import {
  ToolCallStatus,
  IntegrationProvider,
  IntegrationStatus,
  DatabaseOperation,
} from 'generated/prisma';
import { ToolDispatcherService } from './tool-dispatcher.service';

describe('ToolDispatcherService', () => {
  const createService = (overrides?: {
    cached?: unknown;
    registryResult?: unknown;
    prepared?: { toolName: string; input: Record<string, unknown> };
    integration?: { uuid: string };
    integrationRecord?: {
      uuid: string;
      database?: { allowed_ops: DatabaseOperation[] } | null;
    } | null;
    action?: {
      enabled?: boolean;
      required_permission_key?: string | null;
      integration?: { provider: IntegrationProvider };
    } | null;
    scopedDatabaseIntegrations?: Array<{ uuid: string }>;
  }) => {
    const prisma = {
      integration: {
        findFirst: jest
          .fn()
          .mockResolvedValue(
            overrides?.integration ?? { uuid: 'openapi-integration-uuid' },
          ),
        findMany: jest
          .fn()
          .mockResolvedValue(overrides?.scopedDatabaseIntegrations ?? []),
      },
      integrationAction: {
        findFirst: jest
          .fn()
          .mockResolvedValue(
            overrides?.action === undefined
              ? {
                  enabled: true,
                  required_permission_key: null,
                  integration: { provider: IntegrationProvider.OPENAPI },
                }
              : overrides.action,
          ),
      },
      toolCall: {
        create: jest.fn(),
      },
    };

    if (overrides?.integrationRecord !== undefined) {
      prisma.integration.findFirst = jest
        .fn()
        .mockResolvedValueOnce(overrides.integration ?? { uuid: 'db-integration-uuid' })
        .mockResolvedValue(overrides.integrationRecord);
    }

    const registry = {
      executeTool: jest
        .fn()
        .mockResolvedValue(overrides?.registryResult ?? { ok: true }),
    };
    const idempotency = {
      getCachedResult: jest.fn().mockResolvedValue(overrides?.cached),
    };
    const emailToolPreprocessor = {
      prepare: jest.fn().mockResolvedValue(
        overrides?.prepared ?? {
          toolName: 'openapi_abcdef12__list_records',
          input: { limit: 10 },
        },
      ),
    };

    return {
      service: new ToolDispatcherService(
        prisma as any,
        registry as any,
        idempotency as any,
        emailToolPreprocessor as any,
      ),
      prisma,
      registry,
      idempotency,
      emailToolPreprocessor,
    };
  };

  it('logs provider metadata for successful legacy tool calls', async () => {
    const { service, prisma, registry } = createService();

    await expect(
      service.dispatch(
        'org-uuid',
        'user-uuid',
        'openapi_abcdef12__list_records',
        { limit: 10 },
        'execution-uuid',
        [],
      ),
    ).resolves.toMatchObject({ success: true, result: { ok: true } });

    expect(prisma.integration.findFirst).toHaveBeenCalledWith({
      where: {
        org_uuid: 'org-uuid',
        status: IntegrationStatus.ACTIVE,
        provider: IntegrationProvider.OPENAPI,
        uuid: { startsWith: 'abcdef12' },
      },
      select: { uuid: true },
    });
    expect(registry.executeTool).toHaveBeenCalledWith(
      'org-uuid',
      'openapi_abcdef12__list_records',
      { limit: 10 },
    );
    expect(prisma.toolCall.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        execution_uuid: 'execution-uuid',
        integration_uuid: 'openapi-integration-uuid',
        provider_type: 'OPENAPI',
        tool_name: 'openapi_abcdef12__list_records',
        status: ToolCallStatus.SUCCESS,
      }),
    });
  });

  it('uses prepared tool name and input for idempotency cache hits', async () => {
    const { service, prisma, registry, idempotency } = createService({
      cached: { cached: true },
      prepared: {
        toolName: 'openapi_abcdef12__send_email',
        input: { to: 'person@example.com', attachment_ids: ['doc-uuid'] },
      },
      integration: { uuid: 'openapi-integration-uuid' },
      action: {
        enabled: true,
        required_permission_key: null,
        integration: { provider: IntegrationProvider.OPENAPI },
      },
    });

    await expect(
      service.dispatch(
        'org-uuid',
        'user-uuid',
        'openapi_abcdef12__send_email',
        { to: 'person@example.com', attachment_document_uuids: ['doc-uuid'] },
        'execution-uuid',
        [],
      ),
    ).resolves.toMatchObject({ success: true, result: { cached: true } });

    expect(idempotency.getCachedResult).toHaveBeenCalledWith(
      'execution-uuid',
      'openapi_abcdef12__send_email',
      { to: 'person@example.com', attachment_ids: ['doc-uuid'] },
    );
    expect(registry.executeTool).not.toHaveBeenCalled();
    expect(prisma.toolCall.create).not.toHaveBeenCalled();
  });

  it('allows db__query from scoped database integrations without action rows', async () => {
    const dbUuid = 'e115bfd3-bc34-4510-b2ea-744e5c0f6d74';
    const prisma = {
      integration: {
        findFirst: jest.fn().mockResolvedValue({
          uuid: dbUuid,
          database: { allowed_ops: [DatabaseOperation.READ] },
        }),
        findMany: jest.fn().mockResolvedValue([{ uuid: dbUuid }]),
      },
      integrationAction: {
        findFirst: jest.fn().mockResolvedValue(null),
      },
      toolCall: {
        create: jest.fn(),
      },
    };
    const registry = {
      executeTool: jest.fn().mockResolvedValue({ rows: [] }),
    };
    const service = new ToolDispatcherService(
      prisma as any,
      registry as any,
      { getCachedResult: jest.fn().mockResolvedValue(undefined) } as any,
      {
        prepare: jest.fn().mockResolvedValue({
          toolName: 'db__query',
          input: { query: 'select * from expense_entries limit 1' },
        }),
      } as any,
    );

    await expect(
      service.dispatch(
        'org-uuid',
        'user-uuid',
        'db__query',
        { query: 'select * from expense_entries limit 1' },
        'execution-uuid',
        [],
        undefined,
        [dbUuid],
      ),
    ).resolves.toMatchObject({ success: true, result: { rows: [] } });

    expect(registry.executeTool).toHaveBeenCalledWith(
      'org-uuid',
      'db__query',
      {
        query: 'select * from expense_entries limit 1',
        integration_uuid: dbUuid,
      },
    );
    expect(prisma.toolCall.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        integration_uuid: dbUuid,
        provider_type: 'DATABASE',
        tool_name: 'db__query',
        status: ToolCallStatus.SUCCESS,
      }),
    });
  });

  it('uses the scoped database uuid when the model passes a display name instead of a uuid', async () => {
    const dbUuid = 'e115bfd3-bc34-4510-b2ea-744e5c0f6d74';
    const prisma = {
      integration: {
        findFirst: jest.fn().mockResolvedValue({
          uuid: dbUuid,
          database: { allowed_ops: [DatabaseOperation.READ] },
        }),
        findMany: jest.fn().mockResolvedValue([{ uuid: dbUuid }]),
      },
      integrationAction: {
        findFirst: jest.fn().mockResolvedValue(null),
      },
      toolCall: {
        create: jest.fn(),
      },
    };
    const registry = {
      executeTool: jest.fn().mockResolvedValue({ rows: [] }),
    };
    const service = new ToolDispatcherService(
      prisma as any,
      registry as any,
      { getCachedResult: jest.fn().mockResolvedValue(undefined) } as any,
      {
        prepare: jest.fn().mockResolvedValue({
          toolName: 'db__query',
          input: {
            query: 'select * from expense_entries limit 1',
            integration_uuid: 'sineverse',
          },
        }),
      } as any,
    );

    await expect(
      service.dispatch(
        'org-uuid',
        'user-uuid',
        'db__query',
        {
          query: 'select * from expense_entries limit 1',
          integration_uuid: 'sineverse',
        },
        'execution-uuid',
        [],
        undefined,
        [dbUuid],
      ),
    ).resolves.toMatchObject({ success: true, result: { rows: [] } });

    expect(registry.executeTool).toHaveBeenCalledWith(
      'org-uuid',
      'db__query',
      {
        query: 'select * from expense_entries limit 1',
        integration_uuid: dbUuid,
      },
    );
  });
});
