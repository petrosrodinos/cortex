import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { OrganizationsService } from '@/modules/organizations/organizations.service';

@Injectable()
export class AuditLogsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizations: OrganizationsService,
  ) {}

  async findAll(
    userUuid: string,
    organizationUuid: string,
    page: number = 1,
    limit: number = 20,
    action?: string,
  ) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { org_uuid: organizationUuid };
    if (action) {
      where['action'] = { contains: action };
    }

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { data, total, page, limit };
  }
}
