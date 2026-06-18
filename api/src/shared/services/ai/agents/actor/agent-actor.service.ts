import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { OrganizationMemberStatus } from 'generated/prisma';

export interface AgentActor {
  userUuid: string;
  email: string;
  memberUuid: string;
  roleName: string;
  organizationUuid: string;
}

@Injectable()
export class AgentActorService {
  constructor(private readonly prisma: PrismaService) {}

  async resolve(userUuid: string, organizationUuid: string): Promise<AgentActor> {
    const membership = await this.prisma.organizationMember.findFirst({
      where: {
        user_uuid: userUuid,
        org_uuid: organizationUuid,
        status: OrganizationMemberStatus.ACTIVE,
      },
      include: {
        role: true,
        user: { select: { uuid: true, email: true } },
      },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this organization');
    }

    const email = membership.user?.email?.trim();
    if (!email) {
      throw new NotFoundException('Authenticated user email is unavailable');
    }

    return {
      userUuid: membership.user!.uuid,
      email,
      memberUuid: membership.uuid,
      roleName: membership.role.name,
      organizationUuid,
    };
  }
}
