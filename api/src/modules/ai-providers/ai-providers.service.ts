import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { OrganizationsService } from '@/modules/organizations/organizations.service';
import { CreateAiProviderDto } from './dto/create-ai-provider.dto';
import { UpdateAiProviderDto } from './dto/update-ai-provider.dto';

@Injectable()
export class AiProvidersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: EncryptionService,
    private readonly organizations: OrganizationsService,
  ) {}

  async findAll(userUuid: string, organizationUuid: string) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);

    const providers = await this.prisma.aiProvider.findMany({
      where: { org_uuid: organizationUuid },
      orderBy: { created_at: 'desc' },
    });

    return providers.map((provider) => this.sanitize(provider));
  }

  async create(userUuid: string, organizationUuid: string, dto: CreateAiProviderDto) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);

    if (dto.is_default) {
      await this.prisma.aiProvider.updateMany({
        where: { org_uuid: organizationUuid, is_default: true },
        data: { is_default: false },
      });
    }

    const provider = await this.prisma.aiProvider.create({
      data: {
        org_uuid: organizationUuid,
        provider: dto.provider,
        api_key: this.encryption.encrypt(dto.api_key),
        default_model: dto.default_model,
        model_routing: dto.model_routing as object,
        usage_limit_tokens: dto.usage_limit_tokens,
        usage_limit_cost_usd: dto.usage_limit_cost_usd,
        is_default: dto.is_default ?? false,
      },
    });

    return this.sanitize(provider);
  }

  async update(userUuid: string, organizationUuid: string, providerUuid: string, dto: UpdateAiProviderDto) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);
    const existing = await this.getProvider(organizationUuid, providerUuid);

    if (dto.is_default) {
      await this.prisma.aiProvider.updateMany({
        where: { org_uuid: organizationUuid, is_default: true },
        data: { is_default: false },
      });
    }

    const provider = await this.prisma.aiProvider.update({
      where: { uuid: existing.uuid },
      data: {
        provider: dto.provider,
        api_key: dto.api_key ? this.encryption.encrypt(dto.api_key) : undefined,
        default_model: dto.default_model,
        model_routing: dto.model_routing as object,
        usage_limit_tokens: dto.usage_limit_tokens,
        usage_limit_cost_usd: dto.usage_limit_cost_usd,
        is_default: dto.is_default,
      },
    });

    return this.sanitize(provider);
  }

  async delete(userUuid: string, organizationUuid: string, providerUuid: string) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);
    const existing = await this.getProvider(organizationUuid, providerUuid);
    await this.prisma.aiProvider.delete({ where: { uuid: existing.uuid } });
    return { deleted: true };
  }

  private async getProvider(organizationUuid: string, providerUuid: string) {
    const provider = await this.prisma.aiProvider.findFirst({
      where: { uuid: providerUuid, org_uuid: organizationUuid },
    });

    if (!provider) {
      throw new NotFoundException('AI provider not found');
    }

    return provider;
  }

  private sanitize(provider: { api_key: string } & Record<string, unknown>) {
    return {
      ...provider,
      api_key: undefined,
      has_api_key: Boolean(provider.api_key),
    };
  }
}
