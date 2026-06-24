import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { PERMISSIONS } from './permissions';

@Injectable()
export class PermissionsBootstrapService implements OnApplicationBootstrap {
  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap() {
    for (const permission of PERMISSIONS) {
      await this.prisma.permission.upsert({
        where: { key: permission.key },
        update: {
          label: permission.label,
          group: permission.group,
        },
        create: permission,
      });
    }
  }
}
