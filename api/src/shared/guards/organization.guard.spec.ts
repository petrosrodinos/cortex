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
        user: { organization_permissions: ['org:update'] },
      }),
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows requests when required permission is present', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['org:update']);
    const guard = new OrganizationGuard(reflector);

    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('returns 403 when required permission is missing', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['org:delete']);
    const guard = new OrganizationGuard(reflector);

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(ForbiddenException);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ORGANIZATION_PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  });
});
