import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { OrganizationRoleTypes, PermissionKeys, getInitialRolePermissionKeys } from '@/modules/roles/permissions';
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

  const mockPermissions = [
    { id: 1, uuid: 'org-read-permission-uuid', key: PermissionKeys.ORG_READ },
    { id: 2, uuid: 'org-update-permission-uuid', key: PermissionKeys.ORG_UPDATE },
    { id: 3, uuid: 'org-delete-permission-uuid', key: PermissionKeys.ORG_DELETE },
    { id: 4, uuid: 'documents-read-permission-uuid', key: PermissionKeys.DOCUMENTS_READ },
    { id: 5, uuid: 'documents-write-permission-uuid', key: PermissionKeys.DOCUMENTS_WRITE },
    { id: 6, uuid: 'conversations-write-permission-uuid', key: PermissionKeys.CONVERSATIONS_WRITE },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    tx.organization.create.mockResolvedValue({ id: 7, uuid: 'org-uuid', name: 'Acme', slug: 'acme' });
    tx.organizationRole.findFirst.mockResolvedValue({ id: 11, uuid: 'owner-role-uuid', name: OrganizationRoleTypes.OWNER });
    tx.organizationRole.findMany.mockResolvedValue([
      { id: 11, uuid: 'owner-role-uuid', name: OrganizationRoleTypes.OWNER },
      { id: 12, uuid: 'admin-role-uuid', name: OrganizationRoleTypes.ADMIN },
      { id: 13, uuid: 'manager-role-uuid', name: OrganizationRoleTypes.MANAGER },
      { id: 14, uuid: 'employee-role-uuid', name: OrganizationRoleTypes.EMPLOYEE },
    ]);
    tx.permission.findMany.mockResolvedValue(mockPermissions);
  });

  it('creates an organization with system roles and makes the creator Owner', async () => {
    const service = new OrganizationsService(prisma);

    const result = await service.create('user-uuid', { name: 'Acme' });

    expect(result.uuid).toBe('org-uuid');
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(tx.organization.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        user_uuid: 'user-uuid',
        name: 'Acme',
      }),
    });
    expect(tx.organizationRole.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({ org_uuid: 'org-uuid', name: OrganizationRoleTypes.OWNER, is_system: true }),
        expect.objectContaining({ org_uuid: 'org-uuid', name: OrganizationRoleTypes.ADMIN, is_system: true }),
        expect.objectContaining({ org_uuid: 'org-uuid', name: OrganizationRoleTypes.MANAGER, is_system: true }),
        expect.objectContaining({ org_uuid: 'org-uuid', name: OrganizationRoleTypes.EMPLOYEE, is_system: true }),
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
    expect(tx.rolePermission.createMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.arrayContaining([
          { role_uuid: 'owner-role-uuid', permission_uuid: 'org-read-permission-uuid' },
          { role_uuid: 'owner-role-uuid', permission_uuid: 'org-update-permission-uuid' },
          { role_uuid: 'owner-role-uuid', permission_uuid: 'org-delete-permission-uuid' },
          { role_uuid: 'owner-role-uuid', permission_uuid: 'documents-read-permission-uuid' },
          { role_uuid: 'owner-role-uuid', permission_uuid: 'documents-write-permission-uuid' },
          { role_uuid: 'owner-role-uuid', permission_uuid: 'conversations-write-permission-uuid' },
          { role_uuid: 'admin-role-uuid', permission_uuid: 'org-update-permission-uuid' },
          { role_uuid: 'admin-role-uuid', permission_uuid: 'documents-read-permission-uuid' },
          { role_uuid: 'manager-role-uuid', permission_uuid: 'documents-write-permission-uuid' },
          { role_uuid: 'manager-role-uuid', permission_uuid: 'conversations-write-permission-uuid' },
          { role_uuid: 'employee-role-uuid', permission_uuid: 'org-read-permission-uuid' },
          { role_uuid: 'employee-role-uuid', permission_uuid: 'conversations-write-permission-uuid' },
          { role_uuid: 'employee-role-uuid', permission_uuid: 'documents-write-permission-uuid' },
        ]),
        skipDuplicates: true,
      }),
    );
    expect(tx.rolePermission.createMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.not.arrayContaining([
          { role_uuid: 'admin-role-uuid', permission_uuid: 'org-delete-permission-uuid' },
          { role_uuid: 'manager-role-uuid', permission_uuid: 'org-delete-permission-uuid' },
          { role_uuid: 'employee-role-uuid', permission_uuid: 'org-update-permission-uuid' },
        ]),
      }),
    );
  });

  it('blocks organization deletion unless the user is Owner', async () => {
    prisma.organizationMember.findFirst.mockResolvedValue({ role: { name: OrganizationRoleTypes.ADMIN } });
    const service = new OrganizationsService(prisma);

    await expect(service.delete('user-uuid', 'org-uuid')).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('does not delete the user final active organization', async () => {
    prisma.organizationMember.findFirst.mockResolvedValue({ role: { name: OrganizationRoleTypes.OWNER } });
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

describe('getInitialRolePermissionKeys', () => {
  const allPermissionKeys = mockPermissionsFromDescribe();

  it('grants Owner every permission in the database', () => {
    expect(getInitialRolePermissionKeys(OrganizationRoleTypes.OWNER, allPermissionKeys)).toEqual(allPermissionKeys);
  });

  it('grants Admin explicit permissions without org delete', () => {
    const keys = getInitialRolePermissionKeys(OrganizationRoleTypes.ADMIN, allPermissionKeys);

    expect(keys).toContain(PermissionKeys.ORG_UPDATE);
    expect(keys).not.toContain(PermissionKeys.ORG_DELETE);
  });

  it('grants Manager operational permissions', () => {
    const keys = getInitialRolePermissionKeys(OrganizationRoleTypes.MANAGER, allPermissionKeys);

    expect(keys).toContain(PermissionKeys.CONVERSATIONS_WRITE);
    expect(keys).toContain(PermissionKeys.ORG_MEMBERS_UPDATE);
    expect(keys).not.toContain(PermissionKeys.ORG_UPDATE);
    expect(keys).not.toContain(PermissionKeys.ORG_DELETE);
  });

  it('grants Employee contributor permissions', () => {
    const keys = getInitialRolePermissionKeys(OrganizationRoleTypes.EMPLOYEE, allPermissionKeys);

    expect(keys).toContain(PermissionKeys.CONVERSATIONS_WRITE);
    expect(keys).toContain(PermissionKeys.DOCUMENTS_WRITE);
    expect(keys).not.toContain(PermissionKeys.ORG_UPDATE);
    expect(keys).not.toContain(PermissionKeys.INTEGRATIONS_MANAGE);
  });
});

function mockPermissionsFromDescribe() {
  return [
    PermissionKeys.ORG_READ,
    PermissionKeys.ORG_UPDATE,
    PermissionKeys.ORG_DELETE,
    PermissionKeys.DOCUMENTS_READ,
    PermissionKeys.DOCUMENTS_WRITE,
    PermissionKeys.CONVERSATIONS_WRITE,
  ];
}
