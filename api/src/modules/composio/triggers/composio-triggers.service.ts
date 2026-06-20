import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { ComposioClientService } from '@/integrations/composio/composio-client.service';
import { Prisma } from 'generated/prisma';
import { CreateComposioTriggerDto } from './dto/create-composio-trigger.dto';
import { UpdateComposioTriggerDto } from './dto/update-composio-trigger.dto';

@Injectable()
export class ComposioTriggersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly composioClient: ComposioClientService,
  ) {}

  async list(organizationUuid: string) {
    return {
      data: await this.prisma.composioTrigger.findMany({
        where: { org_uuid: organizationUuid },
        include: {
          toolkit: {
            select: { uuid: true, slug: true, name: true, logo_url: true },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
    };
  }

  async create(organizationUuid: string, dto: CreateComposioTriggerDto) {
    const toolkit = await this.prisma.composioToolkit.findFirst({
      where: { slug: dto.toolkit_slug, is_enabled: true },
      select: { uuid: true },
    });

    if (!toolkit) {
      throw new NotFoundException('Composio toolkit not found');
    }

    const account = await this.prisma.composioConnectedAccount.findFirst({
      where: {
        org_uuid: organizationUuid,
        toolkit_uuid: toolkit.uuid,
        composio_account_id: dto.connected_account_id,
      },
    });

    if (!account) {
      throw new NotFoundException('Connected account not found');
    }

    const remoteTrigger = await (
      this.composioClient.getClient() as any
    ).triggers.create(account.composio_user_id, dto.trigger_slug, {
      connectedAccountId: dto.connected_account_id,
      config: dto.config ?? {},
    });
    const composioTriggerId = this.getRemoteId(remoteTrigger);

    if (!composioTriggerId) {
      throw new BadRequestException(
        'Composio trigger creation did not return an id',
      );
    }

    return this.prisma.composioTrigger.upsert({
      where: { composio_trigger_id: composioTriggerId },
      create: {
        composio_trigger_id: composioTriggerId,
        org_uuid: organizationUuid,
        composio_user_id: account.composio_user_id,
        toolkit_uuid: toolkit.uuid,
        trigger_slug: dto.trigger_slug,
        connected_account_id: dto.connected_account_id,
        is_enabled: true,
        config: (dto.config ?? {}) as Prisma.InputJsonValue,
        webhook_subscription_id:
          remoteTrigger.webhookSubscriptionId ??
          remoteTrigger.webhook_subscription_id ??
          remoteTrigger.webhookId,
      },
      update: {
        composio_user_id: account.composio_user_id,
        connected_account_id: dto.connected_account_id,
        is_enabled: true,
        config: (dto.config ?? {}) as Prisma.InputJsonValue,
      },
      include: {
        toolkit: {
          select: { uuid: true, slug: true, name: true, logo_url: true },
        },
      },
    });
  }

  async update(
    organizationUuid: string,
    triggerUuid: string,
    dto: UpdateComposioTriggerDto,
  ) {
    const trigger = await this.findTrigger(organizationUuid, triggerUuid);

    if (dto.is_enabled !== undefined) {
      await this.setRemoteEnabled(trigger.composio_trigger_id, dto.is_enabled);
    }

    return this.prisma.composioTrigger.update({
      where: { uuid: triggerUuid },
      data: {
        ...(dto.is_enabled !== undefined ? { is_enabled: dto.is_enabled } : {}),
        ...(dto.config !== undefined
          ? { config: dto.config as Prisma.InputJsonValue }
          : {}),
      },
      include: {
        toolkit: {
          select: { uuid: true, slug: true, name: true, logo_url: true },
        },
      },
    });
  }

  async remove(organizationUuid: string, triggerUuid: string) {
    const trigger = await this.findTrigger(organizationUuid, triggerUuid);
    await this.deleteRemote(trigger.composio_trigger_id);
    await this.prisma.composioTrigger.delete({ where: { uuid: triggerUuid } });

    return { success: true };
  }

  async handleEvent(payload: any) {
    const composioTriggerId =
      payload?.triggerId ??
      payload?.trigger_id ??
      payload?.trigger?.id ??
      payload?.data?.triggerId ??
      payload?.data?.trigger_id;

    const trigger = composioTriggerId
      ? await this.prisma.composioTrigger.findUnique({
          where: { composio_trigger_id: composioTriggerId },
          include: { toolkit: { select: { slug: true } } },
        })
      : null;

    return {
      accepted: true,
      trigger_uuid: trigger?.uuid ?? null,
      toolkit_slug: trigger?.toolkit.slug ?? null,
    };
  }

  private async findTrigger(organizationUuid: string, triggerUuid: string) {
    const trigger = await this.prisma.composioTrigger.findFirst({
      where: { uuid: triggerUuid, org_uuid: organizationUuid },
    });

    if (!trigger) {
      throw new NotFoundException('Composio trigger not found');
    }

    return trigger;
  }

  private async setRemoteEnabled(composioTriggerId: string, enabled: boolean) {
    const triggers = (this.composioClient.getClient() as any).triggers;

    if (typeof triggers.update === 'function') {
      return triggers.update(composioTriggerId, { enabled });
    }

    if (enabled && typeof triggers.enable === 'function') {
      return triggers.enable(composioTriggerId);
    }

    if (!enabled && typeof triggers.disable === 'function') {
      return triggers.disable(composioTriggerId);
    }
  }

  private async deleteRemote(composioTriggerId: string) {
    const triggers = (this.composioClient.getClient() as any).triggers;

    if (typeof triggers.delete === 'function') {
      return triggers.delete(composioTriggerId);
    }

    if (typeof triggers.remove === 'function') {
      return triggers.remove(composioTriggerId);
    }
  }

  private getRemoteId(remoteTrigger: any): string | undefined {
    return (
      remoteTrigger?.id ??
      remoteTrigger?.uuid ??
      remoteTrigger?.nanoid ??
      remoteTrigger?.triggerId
    );
  }
}
