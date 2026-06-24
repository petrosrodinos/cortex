import { PERMISSIONS } from './permissions';
import { PermissionsBootstrapService } from './permissions-bootstrap.service';

describe('PermissionsBootstrapService', () => {
  const prisma: any = {
    permission: {
      upsert: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
    },
    rolePermission: {
      findMany: jest.fn().mockResolvedValue([]),
      createMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.permission.upsert.mockResolvedValue({});
  });

  it('upserts every system permission when the API starts', async () => {
    const service = new PermissionsBootstrapService(prisma);

    await service.onApplicationBootstrap();

    expect(prisma.permission.upsert).toHaveBeenCalledTimes(PERMISSIONS.length);
    expect(prisma.permission.upsert).toHaveBeenCalledWith({
      where: { key: PERMISSIONS[0].key },
      update: {
        label: PERMISSIONS[0].label,
        group: PERMISSIONS[0].group,
      },
      create: PERMISSIONS[0],
    });
  });
});
