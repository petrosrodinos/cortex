import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { CharacteristicLevel, ResponseStyle } from 'generated/prisma';
import { OrganizationsService } from '@/modules/organizations/organizations.service';
import { UpdateConversationPersonalizationDto } from './dto/update-conversation-personalization.dto';

const DEFAULT_PERSONALIZATION = {
  response_style: ResponseStyle.DEFAULT,
  warm: CharacteristicLevel.DEFAULT,
  enthusiastic: CharacteristicLevel.DEFAULT,
  headers_lists: CharacteristicLevel.DEFAULT,
  emoji: CharacteristicLevel.DEFAULT,
  custom_instructions: null as string | null,
};

@Injectable()
export class ConversationPersonalizationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizations: OrganizationsService,
  ) {}

  async get(userUuid: string, organizationUuid: string) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);

    const personalization = await this.prisma.conversationPersonalization.findUnique({
      where: {
        user_uuid_org_uuid: {
          user_uuid: userUuid,
          org_uuid: organizationUuid,
        },
      },
    });

    if (!personalization) {
      return {
        ...DEFAULT_PERSONALIZATION,
        uuid: null,
        user_uuid: userUuid,
        org_uuid: organizationUuid,
        created_at: null,
        updated_at: null,
      };
    }

    return this.toResponse(personalization);
  }

  async upsert(userUuid: string, organizationUuid: string, dto: UpdateConversationPersonalizationDto) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);

    const personalization = await this.prisma.conversationPersonalization.upsert({
      where: {
        user_uuid_org_uuid: {
          user_uuid: userUuid,
          org_uuid: organizationUuid,
        },
      },
      create: {
        user_uuid: userUuid,
        org_uuid: organizationUuid,
        response_style: dto.response_style ?? ResponseStyle.DEFAULT,
        warm: dto.warm ?? CharacteristicLevel.DEFAULT,
        enthusiastic: dto.enthusiastic ?? CharacteristicLevel.DEFAULT,
        headers_lists: dto.headers_lists ?? CharacteristicLevel.DEFAULT,
        emoji: dto.emoji ?? CharacteristicLevel.DEFAULT,
        custom_instructions: this.normalizeCustomInstructions(dto.custom_instructions),
      },
      update: {
        ...(dto.response_style !== undefined ? { response_style: dto.response_style } : {}),
        ...(dto.warm !== undefined ? { warm: dto.warm } : {}),
        ...(dto.enthusiastic !== undefined ? { enthusiastic: dto.enthusiastic } : {}),
        ...(dto.headers_lists !== undefined ? { headers_lists: dto.headers_lists } : {}),
        ...(dto.emoji !== undefined ? { emoji: dto.emoji } : {}),
        ...(dto.custom_instructions !== undefined
          ? { custom_instructions: this.normalizeCustomInstructions(dto.custom_instructions) }
          : {}),
      },
    });

    return this.toResponse(personalization);
  }

  async getForPrompt(userUuid: string, organizationUuid: string) {
    const personalization = await this.prisma.conversationPersonalization.findUnique({
      where: {
        user_uuid_org_uuid: {
          user_uuid: userUuid,
          org_uuid: organizationUuid,
        },
      },
    });

    return personalization ?? DEFAULT_PERSONALIZATION;
  }

  private normalizeCustomInstructions(value?: string | null) {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
  }

  private toResponse(personalization: {
    uuid: string;
    user_uuid: string;
    org_uuid: string;
    response_style: ResponseStyle;
    warm: CharacteristicLevel;
    enthusiastic: CharacteristicLevel;
    headers_lists: CharacteristicLevel;
    emoji: CharacteristicLevel;
    custom_instructions: string | null;
    created_at: Date;
    updated_at: Date;
  }) {
    return {
      uuid: personalization.uuid,
      user_uuid: personalization.user_uuid,
      org_uuid: personalization.org_uuid,
      response_style: personalization.response_style,
      warm: personalization.warm,
      enthusiastic: personalization.enthusiastic,
      headers_lists: personalization.headers_lists,
      emoji: personalization.emoji,
      custom_instructions: personalization.custom_instructions,
      created_at: personalization.created_at,
      updated_at: personalization.updated_at,
    };
  }
}
