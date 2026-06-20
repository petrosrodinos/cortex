import {
  ToolCallStatus,
  IntegrationProvider,
  IntegrationStatus,
} from 'generated/prisma';
import { ToolDispatcherService } from './tool-dispatcher.service';

describe('ToolDispatcherService', () => {
  const createService = (overrides?: {
    cached?: unknown;
    registryResult?: unknown;
    prepared?: { toolName: string; input: Record<string, unknown> };
    integration?: { uuid: string };
    action?: {
      required_permission_key?: string | null;
      integration?: { provider: IntegrationProvider };
    } | null;
  }) => {
    const prisma = {
      integration: {
        findFirst: jest
          .fn()
          .mockResolvedValue(
            overrides?.integration ?? { uuid: 'openapi-integration-uuid' },
          ),
      },
      integrationAction: {
        findFirst: jest
          .fn()
          .mockResolvedValue(
            overrides?.action === undefined
              ? {
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
        toolName: 'smtp__send_email',
        input: { to: 'person@example.com', attachment_ids: ['doc-uuid'] },
      },
      integration: { uuid: 'smtp-integration-uuid' },
      action: {
        required_permission_key: null,
        integration: { provider: IntegrationProvider.SMTP },
      },
    });

    await expect(
      service.dispatch(
        'org-uuid',
        'user-uuid',
        'smtp__send_email',
        { to: 'person@example.com', attachment_document_uuids: ['doc-uuid'] },
        'execution-uuid',
        [],
      ),
    ).resolves.toMatchObject({ success: true, result: { cached: true } });

    expect(idempotency.getCachedResult).toHaveBeenCalledWith(
      'execution-uuid',
      'smtp__send_email',
      { to: 'person@example.com', attachment_ids: ['doc-uuid'] },
    );
    expect(registry.executeTool).not.toHaveBeenCalled();
    expect(prisma.toolCall.create).not.toHaveBeenCalled();
  });
});
