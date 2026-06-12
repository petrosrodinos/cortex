import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { MembersService } from './members.service';
import { OrganizationMemberStatus } from 'generated/prisma';

describe('MembersService', () => {
  const prisma: any = {
    organization: {
      findUnique: jest.fn(),
    },
    organizationMember: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    organizationRole: {
      findFirst: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };
  const organizations_service: any = {
    requireActiveMember: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    organizations_service.requireActiveMember.mockResolvedValue({
      role: { name: 'Owner', permissions: [] },
    });
  });

  it('wraps unexpected member lookup failures', async () => {
    prisma.organizationMember.findMany.mockRejectedValue(new Error('database offline'));
    const service = new MembersService(prisma, organizations_service);

    await expect(service.findAll('user-uuid', 'organization-uuid')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('does not remove organization owners', async () => {
    prisma.organization.findUnique.mockResolvedValue({ uuid: 'organization-uuid' });
    prisma.organizationMember.findFirst.mockResolvedValue({
      uuid: 'member-uuid',
      role: { name: 'Owner' },
    });
    const service = new MembersService(prisma, organizations_service);

    await expect(service.remove('manager-uuid', 'organization-uuid', 'member-uuid')).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.organizationMember.delete).not.toHaveBeenCalled();
  });

  it('adds a registered user as an active member so their organizations list includes it', async () => {
    prisma.organization.findUnique.mockResolvedValue({ uuid: 'organization-uuid' });
    prisma.organizationRole.findFirst.mockResolvedValue({ uuid: 'role-uuid' });
    prisma.user.findUnique.mockResolvedValue({ uuid: 'member-user-uuid', email: 'member@example.com' });
    prisma.organizationMember.upsert.mockResolvedValue({
      uuid: 'organization-member-uuid',
      status: OrganizationMemberStatus.ACTIVE,
    });
    const service = new MembersService(prisma, organizations_service);

    await service.invite('manager-uuid', 'organization-uuid', {
      email: 'member@example.com',
      organization_role_uuid: 'role-uuid',
    });

    expect(prisma.organizationMember.upsert).toHaveBeenCalledWith({
      where: {
        org_uuid_user_uuid: {
          org_uuid: 'organization-uuid',
          user_uuid: 'member-user-uuid',
        },
      },
      create: expect.objectContaining({
        org_uuid: 'organization-uuid',
        user_uuid: 'member-user-uuid',
        role_uuid: 'role-uuid',
        status: OrganizationMemberStatus.ACTIVE,
        joined_at: expect.any(Date),
      }),
      update: expect.objectContaining({
        role_uuid: 'role-uuid',
        status: OrganizationMemberStatus.ACTIVE,
        joined_at: expect.any(Date),
      }),
      include: { role: true, user: true },
    });
  });
});
