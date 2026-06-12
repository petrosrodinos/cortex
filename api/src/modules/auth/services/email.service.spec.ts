import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { EmailAuthService } from './email.service';
import { OrganizationMemberStatus } from 'generated/prisma';

describe('EmailAuthService switchOrganization', () => {
  const prisma: any = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    organizationMember: { findFirst: jest.fn() },
  };
  const jwt_service: any = {
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
          { permission: { key: 'integrations:github:read_repos' } },
        ],
      },
    });
    const service = new EmailAuthService(prisma, jwt_service, mail_service, organizations_service);

    const result = await service.switchOrganization('user-uuid', { organization_uuid: 'organization-uuid' });

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
      organization_uuid: 'organization-uuid',
      organization_role: 'Admin',
      organization_permissions: ['org:update', 'integrations:github:read_repos'],
    });
  });

  it('rejects users who are not active members of the requested organization', async () => {
    prisma.organizationMember.findFirst.mockResolvedValue(null);
    const service = new EmailAuthService(prisma, jwt_service, mail_service, organizations_service);

    await expect(service.switchOrganization('user-uuid', { organization_uuid: 'organization-uuid' })).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('wraps unexpected switch organization failures', async () => {
    prisma.organizationMember.findFirst.mockRejectedValue(new Error('database offline'));
    const service = new EmailAuthService(prisma, jwt_service, mail_service, organizations_service);

    await expect(service.switchOrganization('user-uuid', { organization_uuid: 'organization-uuid' })).rejects.toBeInstanceOf(BadRequestException);
  });

  it('creates a default organization and returns a scoped owner token when registering', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      uuid: 'user-uuid',
      email: 'person@example.com',
      password: 'hashed-password',
      role: 'USER',
    });
    organizations_service.create.mockResolvedValue({ uuid: 'organization-uuid', name: 'Default Organisation' });
    prisma.organizationMember.findFirst.mockResolvedValue({
      role: {
        name: 'Owner',
        permissions: [{ permission: { key: 'org:read' } }, { permission: { key: 'org:delete' } }],
      },
    });
    const service = new EmailAuthService(prisma, jwt_service, mail_service, organizations_service);

    const result = await service.registerWithEmail({ email: 'person@example.com', password: 'password123' });

    expect(organizations_service.create).toHaveBeenCalledWith('user-uuid', { name: 'Default Organisation' });
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
      organization_uuid: 'organization-uuid',
      organization_role: 'Owner',
      organization_permissions: ['org:read', 'org:delete'],
    });
  });
});
