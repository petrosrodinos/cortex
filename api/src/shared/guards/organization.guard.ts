import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ORGANIZATION_PERMISSIONS_KEY } from '../decorators/organization-permission.decorator';
import { hasOrganizationPermission } from '../utils/organization-permission.utils';

@Injectable()
export class OrganizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(ORGANIZATION_PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const permissions = request.user?.organization_permissions ?? [];
    const organizationRole = request.user?.organization_role ?? null;
    const hasEveryPermission = requiredPermissions.every((permission) =>
      hasOrganizationPermission(permissions, organizationRole, permission),
    );

    if (!hasEveryPermission) {
      throw new ForbiddenException('Missing organization permission');
    }

    return true;
  }
}
