import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { AuthRole } from 'generated/prisma';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (request.user?.role !== AuthRole.SUPER_ADMIN) {
      throw new ForbiddenException('SUPER_ADMIN access required');
    }

    return true;
  }
}
