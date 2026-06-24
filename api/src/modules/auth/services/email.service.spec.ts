import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { EmailAuthService } from './email.service';
import { OrganizationMemberStatus } from 'generated/prisma';

describe('EmailAuthService switchOrganization', () => {
  const prisma: any = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    organization: {
      findFirst: jest.fn(),
    },
    organizationMember: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };
  const jwt_service: any = {
    verifyToken: jest.fn(),
    signToken: jest.fn(),
    getExpirationTime: jest.fn(),
  };
  const mail_service: any = {};
  const organizations_service: any = {
    create: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jwt_service.signToken.mockResolvedValue('scoped-token');
    jwt_service.getExpirationTime.mockReturnValue(999);
  });

  it('issues a scoped token for an active organization member', async () => {
    prisma.organizationMember.findFirst.mockResolvedValue({
      role: {
        name: 'Admin',
        permissions: [
          { permission: { key: 'org:update' } },
          { permission: { key: 'integrations:manage' } },
        ],
      },
      user: {
        role: 'USER',
      },
    });
    const service = new EmailAuthService(
      prisma,
      jwt_service,
      mail_service,
      organizations_service,
    );

    const result = await service.switchOrganization('user-uuid', {
      organization_uuid: 'organization-uuid',
    });

    expect(result.access_token).toBe('scoped-token');
    expect(prisma.organizationMember.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: OrganizationMemberStatus.ACTIVE,
        }),
      }),
    );
    expect(jwt_service.signToken).toHaveBeenCalledWith({
      uuid: 'user-uuid',
      role: 'USER',
      organization_uuid: 'organization-uuid',
      organization_role: 'Admin',
      organization_permissions: ['org:update', 'integrations:manage'],
    });
  });

  it('returns a scoped owner token when logging in with an active organization', async () => {
    prisma.user.findUnique.mockResolvedValue({
      uuid: 'user-uuid',
      email: 'person@example.com',
      password: '$2b$10$eImiTXuWVxfM37uY4JANjQ==',
      role: 'USER',
    });
    prisma.organization.findFirst.mockResolvedValue({
      uuid: 'organization-uuid',
      name: 'Acme',
    });
    prisma.organizationMember.findFirst.mockResolvedValue({
      role: {
        name: 'Owner',
        permissions: [
          { permission: { key: 'org:read' } },
          { permission: { key: 'org:update' } },
        ],
      },
      user: {
        role: 'USER',
      },
    });
    const bcrypt = await import('bcrypt');
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as never);
    const service = new EmailAuthService(
      prisma,
      jwt_service,
      mail_service,
      organizations_service,
    );

    const result = await service.loginWithEmail({
      email: 'person@example.com',
      password: 'password123',
    });

    expect(organizations_service.create).not.toHaveBeenCalled();
    expect(jwt_service.signToken).toHaveBeenCalledWith({
      uuid: 'user-uuid',
      role: 'USER',
      organization_uuid: 'organization-uuid',
      organization_role: 'Owner',
      organization_permissions: ['org:read', 'org:update'],
    });
    expect(result).toMatchObject({
      access_token: 'scoped-token',
      organization_uuid: 'organization-uuid',
      organization_role: 'Owner',
      organization_permissions: ['org:read', 'org:update'],
    });
    expect(result.user.password).toBeUndefined();
  });

  it('creates a default organization when logging in without an active organization', async () => {
    prisma.user.findUnique.mockResolvedValue({
      uuid: 'user-uuid',
      email: 'person@example.com',
      password: '$2b$10$eImiTXuWVxfM37uY4JANjQ==',
      role: 'SUPER_ADMIN',
    });
    prisma.organization.findFirst.mockResolvedValue(null);
    organizations_service.create.mockResolvedValue({
      uuid: 'new-organization-uuid',
      name: 'Default Organisation',
    });
    prisma.organizationMember.findFirst.mockResolvedValue({
      role: {
        name: 'Owner',
        permissions: [{ permission: { key: 'org:read' } }],
      },
      user: {
        role: 'SUPER_ADMIN',
      },
    });
    const bcrypt = await import('bcrypt');
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as never);
    const service = new EmailAuthService(
      prisma,
      jwt_service,
      mail_service,
      organizations_service,
    );

    const result = await service.loginWithEmail({
      email: 'person@example.com',
      password: 'password123',
    });

    expect(organizations_service.create).toHaveBeenCalledWith('user-uuid', {
      name: 'Default Organisation',
    });
    expect(jwt_service.signToken).toHaveBeenCalledWith({
      uuid: 'user-uuid',
      role: 'SUPER_ADMIN',
      organization_uuid: 'new-organization-uuid',
      organization_role: 'Owner',
      organization_permissions: ['org:read'],
    });
    expect(result.organization_uuid).toBe('new-organization-uuid');
  });

  it('rejects users who are not active members of the requested organization', async () => {
    prisma.organizationMember.findFirst.mockResolvedValue(null);
    const service = new EmailAuthService(
      prisma,
      jwt_service,
      mail_service,
      organizations_service,
    );

    await expect(
      service.switchOrganization('user-uuid', {
        organization_uuid: 'organization-uuid',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('wraps unexpected switch organization failures', async () => {
    prisma.organizationMember.findFirst.mockRejectedValue(
      new Error('database offline'),
    );
    const service = new EmailAuthService(
      prisma,
      jwt_service,
      mail_service,
      organizations_service,
    );

    await expect(
      service.switchOrganization('user-uuid', {
        organization_uuid: 'organization-uuid',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('creates a default organization and returns a scoped owner token when registering', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      uuid: 'user-uuid',
      email: 'person@example.com',
      password: 'hashed-password',
      role: 'USER',
    });
    organizations_service.create.mockResolvedValue({
      uuid: 'organization-uuid',
      name: 'Default Organisation',
    });
    prisma.organizationMember.findFirst.mockResolvedValue({
      role: {
        name: 'Owner',
        permissions: [
          { permission: { key: 'org:read' } },
          { permission: { key: 'org:delete' } },
        ],
      },
      user: {
        role: 'USER',
      },
    });
    const service = new EmailAuthService(
      prisma,
      jwt_service,
      mail_service,
      organizations_service,
    );

    const result = await service.registerWithEmail({
      first_name: 'John',
      last_name: 'Doe',
      email: 'person@example.com',
      password: 'password123',
    });

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        first_name: 'John',
        last_name: 'Doe',
        email: 'person@example.com',
        role: 'USER',
      }),
    });

    expect(organizations_service.create).toHaveBeenCalledWith('user-uuid', {
      name: 'Default Organisation',
    });
    expect(result).toMatchObject({
      access_token: 'scoped-token',
      expires_in: 999,
      organization_uuid: 'organization-uuid',
      organization_role: 'Owner',
      organization_permissions: ['org:read', 'org:delete'],
      user: {
        uuid: 'user-uuid',
        email: 'person@example.com',
      },
    });
    expect(result.user.password).toBeUndefined();
    expect(jwt_service.signToken).toHaveBeenCalledWith({
      uuid: 'user-uuid',
      role: 'USER',
      organization_uuid: 'organization-uuid',
      organization_role: 'Owner',
      organization_permissions: ['org:read', 'org:delete'],
    });
  });

  it('stores first and last name when registering from an invitation', async () => {
    jwt_service.verifyToken.mockResolvedValue({
      type: 'organization_invitation',
      member_uuid: 'member-uuid',
      user_uuid: 'user-uuid',
      organization_uuid: 'organization-uuid',
      email: 'person@example.com',
    });
    prisma.organizationMember.findFirst
      .mockResolvedValueOnce({
        uuid: 'member-uuid',
        user_uuid: 'user-uuid',
        user: {
          uuid: 'user-uuid',
          email: 'person@example.com',
          password: '',
        },
      })
      .mockResolvedValueOnce({
        role: {
          name: 'Member',
          permissions: [{ permission: { key: 'files:read' } }],
        },
        user: {
          role: 'USER',
        },
      });
    prisma.user.update.mockResolvedValue({
      uuid: 'user-uuid',
      email: 'person@example.com',
      first_name: 'Jane',
      last_name: 'Doe',
      password: 'hashed-password',
    });
    prisma.organizationMember.update.mockResolvedValue({
      uuid: 'member-uuid',
      status: OrganizationMemberStatus.ACTIVE,
    });
    const service = new EmailAuthService(
      prisma,
      jwt_service,
      mail_service,
      organizations_service,
    );

    const result = await service.registerFromInvitation({
      invitation_token: 'invitation-token',
      first_name: ' Jane ',
      last_name: ' Doe ',
      password: 'password123',
    });

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { uuid: 'user-uuid' },
      data: {
        first_name: 'Jane',
        last_name: 'Doe',
        password: expect.any(String),
      },
    });
    expect(prisma.organizationMember.update).toHaveBeenCalledWith({
      where: { uuid: 'member-uuid' },
      data: {
        status: OrganizationMemberStatus.ACTIVE,
        joined_at: expect.any(Date),
      },
    });
    expect(result.user.password).toBeUndefined();
  });
});
