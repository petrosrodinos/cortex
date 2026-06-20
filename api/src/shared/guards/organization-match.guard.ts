import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class OrganizationMatchGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const pathOrganizationUuid = request.params?.organization_uuid;
    const tokenOrganizationUuid = request.user?.organization_uuid;

    if (!pathOrganizationUuid || !tokenOrganizationUuid || pathOrganizationUuid !== tokenOrganizationUuid) {
      throw new ForbiddenException('Organization context mismatch');
    }

    return true;
  }
}
