import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';

@Injectable()
export class IntegrationActionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getActions(integrationUuid: string) {
    try {
      return await this.prisma.integrationAction.findMany({
        where: { integration_uuid: integrationUuid },
        orderBy: { label: 'asc' },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async toggleAction(integrationUuid: string, actionUuid: string, enabled: boolean) {
    try {
      return await this.prisma.integrationAction.update({
        where: {
          uuid_integration_uuid: {
            uuid: actionUuid,
            integration_uuid: integrationUuid,
          },
        },
        data: { enabled },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown): never {
    if (error instanceof HttpException) {
      throw error;
    }

    const message = error instanceof Error ? error.message : 'Unexpected integration action error';
    throw new BadRequestException(message);
  }
}
