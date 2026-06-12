import { BadRequestException } from '@nestjs/common';
import { RolesService } from './roles.service';

describe('RolesService', () => {
  const prisma: any = {
    organizationMember: { findFirst: jest.fn() },
    organizationRole: {
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
    permission: {
      findMany: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.organizationMember.findFirst.mockResolvedValue({
      id: 1,
      organization: { id: 9, uuid: 'org-uuid' },
      role: {
        name: 'Owner',
        permissions: [],
      },
    });
  });

  it('does not delete system roles', async () => {
    prisma.organizationRole.findFirst.mockResolvedValue({ id: 3, uuid: 'role-uuid', is_system: true });
    const service = new RolesService(prisma);

    await expect(service.delete('user-uuid', 'org-uuid', 'role-uuid')).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.organizationRole.delete).not.toHaveBeenCalled();
  });

  it('wraps unexpected permission lookup failures', async () => {
    prisma.permission.findMany.mockRejectedValue(new Error('database offline'));
    const service = new RolesService(prisma);

    await expect(service.permissions()).rejects.toBeInstanceOf(BadRequestException);
  });
});
