import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { EmailAuthService } from './email.service';
import { OrganizationMemberStatus } from 'generated/prisma';

describe('EmailAuthService switch_organization', () => {
  const prisma: any = {
    organizationMember: { findFirst: jest.fn() },
  };
  const jwt_service: any = {
    signToken: jest.fn(),
    getExpirationTime: jest.fn(),
  };
  const mail_service: any = {};

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
    const service = new EmailAuthService(prisma, jwt_service, mail_service);

    const result = await service.switch_organization('user-uuid', { organization_uuid: 'organization-uuid' });

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
    const service = new EmailAuthService(prisma, jwt_service, mail_service);

    await expect(service.switch_organization('user-uuid', { organization_uuid: 'organization-uuid' })).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('wraps unexpected switch organization failures', async () => {
    prisma.organizationMember.findFirst.mockRejectedValue(new Error('database offline'));
    const service = new EmailAuthService(prisma, jwt_service, mail_service);

    await expect(service.switch_organization('user-uuid', { organization_uuid: 'organization-uuid' })).rejects.toBeInstanceOf(BadRequestException);
  });
});
