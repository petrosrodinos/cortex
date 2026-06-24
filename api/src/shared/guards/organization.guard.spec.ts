import { OrganizationRoleTypes, PermissionKeys } from '@/modules/roles/permissions';
import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OrganizationGuard } from './organization.guard';
import { ORGANIZATION_PERMISSIONS_KEY } from '../decorators/organization-permission.decorator';

describe('OrganizationGuard', () => {
  const reflector = {
    getAllAndOverride: jest.fn(),
  } as unknown as Reflector;

  const context: any = {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({
        user: { organization_permissions: [PermissionKeys.ORG_UPDATE] },
      }),
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows requests when required permission is present', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([PermissionKeys.ORG_UPDATE]);
    const guard = new OrganizationGuard(reflector);

    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('allows Owner role without explicit permission', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([PermissionKeys.ORG_DELETE]);
    const ownerContext: any = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          user: { organization_role: OrganizationRoleTypes.OWNER, organization_permissions: [] },
        }),
      }),
    };
    const guard = new OrganizationGuard(reflector);

    await expect(guard.canActivate(ownerContext)).resolves.toBe(true);
  });

  it('accepts legacy permission aliases', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([PermissionKeys.DOCUMENTS_WRITE]);
    const aliasContext: any = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          user: { organization_permissions: [PermissionKeys.FILES_WRITE] },
        }),
      }),
    };
    const guard = new OrganizationGuard(reflector);

    await expect(guard.canActivate(aliasContext)).resolves.toBe(true);
  });

  it('returns 403 when required permission is missing', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([PermissionKeys.ORG_DELETE]);
    const guard = new OrganizationGuard(reflector);

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(ForbiddenException);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ORGANIZATION_PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  });
});
