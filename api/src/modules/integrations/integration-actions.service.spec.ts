import { IntegrationActionsService } from './integration-actions.service';

describe('IntegrationActionsService', () => {
  const prisma: any = {
    integrationAction: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('toggles an action scoped to its integration', async () => {
    prisma.integrationAction.update.mockResolvedValue({ uuid: 'action-uuid', enabled: false });
    const service = new IntegrationActionsService(prisma);

    await service.toggleAction('integration-uuid', 'action-uuid', false);

    expect(prisma.integrationAction.update).toHaveBeenCalledWith({
      where: {
        uuid_integration_uuid: {
          uuid: 'action-uuid',
          integration_uuid: 'integration-uuid',
        },
      },
      data: { enabled: false },
    });
  });
});
