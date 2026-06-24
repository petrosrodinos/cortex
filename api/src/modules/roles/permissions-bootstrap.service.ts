import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { DEPRECATED_TO_NEW_PERMISSION_KEYS } from '@/shared/utils/organization-permission.utils';
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

    await this.migrateDeprecatedRolePermissions();
  }

  private async migrateDeprecatedRolePermissions() {
    const permissions = await this.prisma.permission.findMany();
    const permissionsByKey = new Map(permissions.map((permission) => [permission.key, permission.uuid]));

    for (const [deprecatedKey, newKey] of Object.entries(DEPRECATED_TO_NEW_PERMISSION_KEYS)) {
      const deprecatedUuid = permissionsByKey.get(deprecatedKey);
      const newUuid = permissionsByKey.get(newKey);

      if (!deprecatedUuid || !newUuid) {
        continue;
      }

      const assignments = await this.prisma.rolePermission.findMany({
        where: { permission_uuid: deprecatedUuid },
      });

      if (assignments.length === 0) {
        continue;
      }

      await this.prisma.rolePermission.createMany({
        data: assignments.map((assignment) => ({
          role_uuid: assignment.role_uuid,
          permission_uuid: newUuid,
        })),
        skipDuplicates: true,
      });
    }
  }
}
