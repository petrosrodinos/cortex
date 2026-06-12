import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationMemberStatus } from 'generated/prisma';

describe('OrganizationsService', () => {
  const tx: any = {
    organization: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
    organizationRole: {
      createMany: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    organizationMember: {
      create: jest.fn(),
    },
    permission: {
      findMany: jest.fn(),
    },
    rolePermission: {
      createMany: jest.fn(),
    },
  };

  const prisma: any = {
    $transaction: jest.fn((callback) => callback(tx)),
    organization: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      delete: jest.fn(),
    },
    organizationMember: {
      findFirst: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    tx.organization.create.mockResolvedValue({ id: 7, uuid: 'org-uuid', name: 'Acme', slug: 'acme' });
    tx.organizationRole.findFirst.mockResolvedValue({ id: 11, uuid: 'owner-role-uuid', name: 'Owner' });
    tx.organizationRole.findMany.mockResolvedValue([
      { id: 11, uuid: 'owner-role-uuid', name: 'Owner' },
      { id: 12, uuid: 'admin-role-uuid', name: 'Admin' },
      { id: 13, uuid: 'manager-role-uuid', name: 'Manager' },
      { id: 14, uuid: 'employee-role-uuid', name: 'Employee' },
    ]);
    tx.permission.findMany.mockResolvedValue([
      { id: 1, uuid: 'org-update-permission-uuid', key: 'org:update' },
      { id: 2, uuid: 'files-read-permission-uuid', key: 'files:read' },
    ]);
  });

  it('creates an organization with system roles and makes the creator Owner', async () => {
    const service = new OrganizationsService(prisma);

    const result = await service.create('user-uuid', { name: 'Acme' });

    expect(result.uuid).toBe('org-uuid');
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(tx.organizationRole.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({ org_uuid: 'org-uuid', name: 'Owner', is_system: true }),
        expect.objectContaining({ org_uuid: 'org-uuid', name: 'Admin', is_system: true }),
        expect.objectContaining({ org_uuid: 'org-uuid', name: 'Manager', is_system: true }),
        expect.objectContaining({ org_uuid: 'org-uuid', name: 'Employee', is_system: true }),
      ]),
    });
    expect(tx.organizationMember.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        org_uuid: 'org-uuid',
        user_uuid: 'user-uuid',
        role_uuid: 'owner-role-uuid',
        status: OrganizationMemberStatus.ACTIVE,
      }),
    });
    expect(tx.rolePermission.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        { role_uuid: 'owner-role-uuid', permission_uuid: 'org-update-permission-uuid' },
        { role_uuid: 'owner-role-uuid', permission_uuid: 'files-read-permission-uuid' },
        { role_uuid: 'admin-role-uuid', permission_uuid: 'org-update-permission-uuid' },
        { role_uuid: 'admin-role-uuid', permission_uuid: 'files-read-permission-uuid' },
        { role_uuid: 'manager-role-uuid', permission_uuid: 'files-read-permission-uuid' },
        { role_uuid: 'employee-role-uuid', permission_uuid: 'files-read-permission-uuid' },
      ]),
      skipDuplicates: true,
    });
  });

  it('blocks organization deletion unless the user is Owner', async () => {
    prisma.organizationMember.findFirst.mockResolvedValue({ role: { name: 'Admin' } });
    const service = new OrganizationsService(prisma);

    await expect(service.delete('user-uuid', 'org-uuid')).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('does not delete the user final active organization', async () => {
    prisma.organizationMember.findFirst.mockResolvedValue({ role: { name: 'Owner' } });
    prisma.organization.count.mockResolvedValue(1);
    const service = new OrganizationsService(prisma);

    await expect(service.delete('user-uuid', 'org-uuid')).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.organization.delete).not.toHaveBeenCalled();
  });

  it('wraps unexpected organization lookup failures', async () => {
    prisma.organization.findMany.mockRejectedValue(new Error('database offline'));
    const service = new OrganizationsService(prisma);

    await expect(service.findAll('user-uuid')).rejects.toBeInstanceOf(BadRequestException);
  });
});
