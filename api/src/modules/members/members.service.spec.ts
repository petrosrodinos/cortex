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
      create: jest.fn(),
    },
  };
  const organizations_service: any = {
    requireActiveMember: jest.fn(),
  };
  const jwt_service: any = {
    signToken: jest.fn(),
  };
  const member_invitation_mail_service: any = {
    sendInvitationEmail: jest.fn().mockResolvedValue(undefined),
  };
  const config_service: any = {
    get: jest.fn().mockReturnValue('7d'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    organizations_service.requireActiveMember.mockResolvedValue({
      role: { name: 'Owner', permissions: [] },
    });
    prisma.user.findUnique
      .mockResolvedValueOnce({ uuid: 'manager-uuid', email: 'manager@example.com' })
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ uuid: 'manager-uuid', email: 'manager@example.com' });
    prisma.user.create.mockResolvedValue({ uuid: 'member-user-uuid', email: 'member@example.com', password: '' });
    jwt_service.signToken.mockResolvedValue('invitation-token');
  });

  it('wraps unexpected member lookup failures', async () => {
    prisma.organizationMember.findMany.mockRejectedValue(new Error('database offline'));
    const service = new MembersService(
      prisma,
      organizations_service,
      jwt_service,
      member_invitation_mail_service,
      config_service,
    );

    await expect(service.findAll('user-uuid', 'organization-uuid')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('does not remove organization owners', async () => {
    prisma.organization.findUnique.mockResolvedValue({ uuid: 'organization-uuid' });
    prisma.organizationMember.findFirst.mockResolvedValue({
      uuid: 'member-uuid',
      role: { name: 'Owner' },
    });
    const service = new MembersService(
      prisma,
      organizations_service,
      jwt_service,
      member_invitation_mail_service,
      config_service,
    );

    await expect(service.remove('manager-uuid', 'organization-uuid', 'member-uuid')).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.organizationMember.delete).not.toHaveBeenCalled();
  });

  it('creates an invited member and sends an invitation email for unregistered users', async () => {
    prisma.organization.findUnique.mockResolvedValue({ uuid: 'organization-uuid', name: 'Acme Inc' });
    prisma.organizationRole.findFirst.mockResolvedValue({ uuid: 'role-uuid' });
    prisma.organizationMember.upsert.mockResolvedValue({
      uuid: 'organization-member-uuid',
      status: OrganizationMemberStatus.INVITED,
    });
    const service = new MembersService(
      prisma,
      organizations_service,
      jwt_service,
      member_invitation_mail_service,
      config_service,
    );

    await service.invite('manager-uuid', 'organization-uuid', {
      email: 'member@example.com',
      organization_role_uuid: 'role-uuid',
    });

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: 'member@example.com',
        password: '',
        role: 'USER',
      },
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
        status: OrganizationMemberStatus.INVITED,
        joined_at: null,
      }),
      update: expect.objectContaining({
        role_uuid: 'role-uuid',
        status: OrganizationMemberStatus.INVITED,
        joined_at: null,
      }),
      include: { role: true, user: true },
    });
    expect(jwt_service.signToken).toHaveBeenCalled();
    expect(member_invitation_mail_service.sendInvitationEmail).toHaveBeenCalledWith({
      to: 'member@example.com',
      organization_name: 'Acme Inc',
      inviter_email: 'manager@example.com',
      invitation_token: 'invitation-token',
    });
  });

  it('resends an invitation email for invited members without accounts', async () => {
    prisma.organization.findUnique.mockResolvedValue({ uuid: 'organization-uuid', name: 'Acme Inc' });
    prisma.organizationMember.findFirst.mockResolvedValue({
      uuid: 'organization-member-uuid',
      status: OrganizationMemberStatus.INVITED,
      user: { uuid: 'member-user-uuid', email: 'member@example.com', password: '' },
      role: { name: 'Employee' },
    });
    prisma.user.findUnique.mockResolvedValue({ uuid: 'manager-uuid', email: 'manager@example.com' });
    const service = new MembersService(
      prisma,
      organizations_service,
      jwt_service,
      member_invitation_mail_service,
      config_service,
    );

    await service.resendInvitation('manager-uuid', 'organization-uuid', 'organization-member-uuid');

    expect(jwt_service.signToken).toHaveBeenCalled();
    expect(member_invitation_mail_service.sendInvitationEmail).toHaveBeenCalledWith({
      to: 'member@example.com',
      organization_name: 'Acme Inc',
      inviter_email: 'manager@example.com',
      invitation_token: 'invitation-token',
    });
  });

  it('returns an invitation url for invited members without accounts', async () => {
    prisma.organization.findUnique.mockResolvedValue({ uuid: 'organization-uuid', name: 'Acme Inc' });
    prisma.organizationMember.findFirst.mockResolvedValue({
      uuid: 'organization-member-uuid',
      status: OrganizationMemberStatus.INVITED,
      user: { uuid: 'member-user-uuid', email: 'member@example.com', password: '' },
      role: { name: 'Employee' },
    });
    const service = new MembersService(
      prisma,
      organizations_service,
      jwt_service,
      member_invitation_mail_service,
      config_service,
    );

    const result = await service.getInvitationUrl('manager-uuid', 'organization-uuid', 'organization-member-uuid');

    expect(jwt_service.signToken).toHaveBeenCalled();
    expect(result).toEqual({
      invitation_url: expect.stringContaining('invitation_token=invitation-token'),
    });
    expect(member_invitation_mail_service.sendInvitationEmail).not.toHaveBeenCalled();
  });
});
