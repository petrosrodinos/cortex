import { LegacyIntegrationToolProvider } from './legacy-integration-tool.provider';

describe('LegacyIntegrationToolProvider', () => {
  it('exposes send_email tools but hides raw attachment email integration tools', async () => {
    const registry = {
      getAllTools: jest.fn().mockResolvedValue([
        {
          function: {
            name: 'smtp__send_email',
            description: 'Send email',
            parameters: {
              type: 'object',
              properties: {
                to: { type: 'string' },
                subject: { type: 'string' },
                body: { type: 'string' },
              },
            },
          },
        },
        {
          function: {
            name: 'smtp__send_email_with_attachments',
            description: 'Send email with attachments',
            parameters: { type: 'object', properties: {} },
          },
        },
      ]),
    };
    const prisma = {
      integrationAction: { findMany: jest.fn().mockResolvedValue([]) },
    };
    const factory = new LegacyIntegrationToolProvider(
      registry as any,
      prisma as any,
      {} as any,
    );

    const tools = await factory.buildTools({
      organizationUuid: 'org-uuid',
      userUuid: 'user-uuid',
      conversationUuid: 'conversation-uuid',
      executionUuid: 'execution-uuid',
      userPermissions: [],
      documentUuids: [],
    });

    expect(Object.keys(tools)).toContain('smtp__send_email');
    expect(Object.keys(tools)).not.toContain(
      'smtp__send_email_with_attachments',
    );
    expect((tools.smtp__send_email as any).needsApproval).toBe(false);
  });
});
