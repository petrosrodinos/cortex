import { BadRequestException } from '@nestjs/common';
import { OrganizationRoleTypes } from '@/modules/roles/permissions';
import { RolesService } from './roles.service';

describe('RolesService', () => {
  const organizationsService: any = {
    requireActiveMember: jest.fn(),
  };

  const prisma: any = {
    organizationMember: { findFirst: jest.fn() },
    organizationRole: {
      findFirst: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
    },
    permission: {
      findMany: jest.fn(),
    },
    rolePermission: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.$transaction.mockImplementation((callback) => callback(prisma));
    organizationsService.requireActiveMember.mockResolvedValue({
      organization: { uuid: 'org-uuid' },
      role: {
        name: OrganizationRoleTypes.OWNER,
        permissions: [],
      },
    });
  });

  function createService() {
    return new RolesService(prisma, organizationsService);
  }

  it('does not delete system roles', async () => {
    prisma.organizationRole.findFirst.mockResolvedValue({ id: 3, uuid: 'role-uuid', is_system: true });
    const service = createService();

    await expect(service.delete('user-uuid', 'org-uuid', 'role-uuid')).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.organizationRole.delete).not.toHaveBeenCalled();
  });

  it('does not update Owner role permissions', async () => {
    prisma.organizationRole.findFirst.mockResolvedValue({ id: 3, uuid: 'role-uuid', name: OrganizationRoleTypes.OWNER, is_system: true });
    const service = createService();

    await expect(
      service.setPermissions('user-uuid', 'org-uuid', 'role-uuid', {
        permission_keys: ['org:roles:read'],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.rolePermission.deleteMany).not.toHaveBeenCalled();
  });

  it('updates permission links for non-owner system roles without changing the role itself', async () => {
    prisma.organizationRole.findFirst.mockResolvedValue({ id: 3, uuid: 'role-uuid', name: OrganizationRoleTypes.ADMIN, is_system: true });
    prisma.permission.findMany.mockResolvedValue([{ uuid: 'permission-uuid', key: 'org:roles:read' }]);
    prisma.organizationRole.findUnique.mockResolvedValue({
      id: 3,
      uuid: 'role-uuid',
      name: OrganizationRoleTypes.ADMIN,
      is_system: true,
      permissions: [{ permission: { uuid: 'permission-uuid', key: 'org:roles:read' } }],
    });
    const service = createService();

    await expect(
      service.setPermissions('user-uuid', 'org-uuid', 'role-uuid', {
        permission_keys: ['org:roles:read'],
      }),
    ).resolves.toMatchObject({ uuid: 'role-uuid', is_system: true });
    expect(prisma.rolePermission.deleteMany).toHaveBeenCalledWith({ where: { role_uuid: 'role-uuid' } });
    expect(prisma.rolePermission.createMany).toHaveBeenCalledWith({
      data: [{ role_uuid: 'role-uuid', permission_uuid: 'permission-uuid' }],
      skipDuplicates: true,
    });
    expect(prisma.organizationRole.delete).not.toHaveBeenCalled();
  });

  it('wraps unexpected permission lookup failures', async () => {
    prisma.permission.findMany.mockRejectedValue(new Error('database offline'));
    const service = createService();

    await expect(service.permissions()).rejects.toBeInstanceOf(BadRequestException);
  });
});
