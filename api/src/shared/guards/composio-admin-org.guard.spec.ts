import { ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { AuthRole, OrganizationMemberStatus } from 'generated/prisma';
import { OrganizationActiveMemberGuard } from './organization-active-member.guard';
import { OrganizationMatchGuard } from './organization-match.guard';
import { SuperAdminGuard } from './super-admin.guard';
import { ComposioConnectRateLimitGuard } from '@/modules/composio/connections/composio-connect-rate-limit.guard';

const createContext = (request: Record<string, any>): any => ({
  switchToHttp: () => ({
    getRequest: () => request,
  }),
});

describe('Composio admin and organization guards', () => {
  it('allows SUPER_ADMIN users through the admin guard', () => {
    const guard = new SuperAdminGuard();

    expect(
      guard.canActivate(
        createContext({ user: { role: AuthRole.SUPER_ADMIN } }),
      ),
    ).toBe(true);
  });

  it('rejects non-super-admin users from admin routes', () => {
    const guard = new SuperAdminGuard();

    expect(() =>
      guard.canActivate(createContext({ user: { role: AuthRole.USER } })),
    ).toThrow(ForbiddenException);
  });

  it('rejects organization path/token mismatches', () => {
    const guard = new OrganizationMatchGuard();

    expect(() =>
      guard.canActivate(
        createContext({
          params: { organization_uuid: 'org-a' },
          user: { organization_uuid: 'org-b' },
        }),
      ),
    ).toThrow(ForbiddenException);
  });

  it('requires an active organization membership', async () => {
    const prisma: any = {
      organizationMember: {
        findFirst: jest.fn().mockResolvedValue({ uuid: 'member-uuid' }),
      },
    };
    const guard = new OrganizationActiveMemberGuard(prisma);

    await expect(
      guard.canActivate(
        createContext({
          params: { organization_uuid: 'org-uuid' },
          user: { uuid: 'user-uuid' },
        }),
      ),
    ).resolves.toBe(true);
    expect(prisma.organizationMember.findFirst).toHaveBeenCalledWith({
      where: {
        org_uuid: 'org-uuid',
        user_uuid: 'user-uuid',
        status: OrganizationMemberStatus.ACTIVE,
      },
      select: { uuid: true },
    });
  });

  it('rate limits repeated connect requests for the same user/org/toolkit bucket', () => {
    const guard = new ComposioConnectRateLimitGuard();
    const context = createContext({
      user: { uuid: 'user-uuid' },
      params: { organization_uuid: 'org-uuid' },
      body: { toolkit_slug: 'slack' },
    });

    for (let index = 0; index < 10; index += 1) {
      expect(guard.canActivate(context)).toBe(true);
    }

    expect(() => guard.canActivate(context)).toThrow(
      new HttpException(
        'Too many Composio connect requests',
        HttpStatus.TOO_MANY_REQUESTS,
      ),
    );
  });
});
