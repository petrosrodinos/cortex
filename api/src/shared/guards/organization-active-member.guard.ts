import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { OrganizationMemberStatus } from 'generated/prisma';

@Injectable()
export class OrganizationActiveMemberGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const organizationUuid = request.params?.organization_uuid;
    const userUuid = request.user?.uuid;

    if (!organizationUuid || !userUuid) {
      throw new ForbiddenException('Organization membership required');
    }

    const membership = await this.prisma.organizationMember.findFirst({
      where: {
        org_uuid: organizationUuid,
        user_uuid: userUuid,
        status: OrganizationMemberStatus.ACTIVE,
      },
      select: { uuid: true },
    });

    if (!membership) {
      throw new ForbiddenException('You are not an active member of this organization');
    }

    return true;
  }
}
