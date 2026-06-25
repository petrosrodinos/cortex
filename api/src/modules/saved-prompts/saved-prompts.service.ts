import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { OrganizationsService } from '@/modules/organizations/organizations.service';
import { CreateSavedPromptDto } from './dto/create-saved-prompt.dto';
import { UpdateSavedPromptDto } from './dto/update-saved-prompt.dto';

@Injectable()
export class SavedPromptsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizations: OrganizationsService,
  ) {}

  async findAll(userUuid: string, organizationUuid: string) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);

    return this.prisma.savedPrompt.findMany({
      where: { org_uuid: organizationUuid, user_uuid: userUuid },
      orderBy: { updated_at: 'desc' },
    });
  }

  async findOne(
    userUuid: string,
    organizationUuid: string,
    promptUuid: string,
  ) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);
    return this.getPrompt(userUuid, organizationUuid, promptUuid);
  }

  async create(
    userUuid: string,
    organizationUuid: string,
    dto: CreateSavedPromptDto,
  ) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);

    return this.prisma.savedPrompt.create({
      data: {
        org_uuid: organizationUuid,
        user_uuid: userUuid,
        title: dto.title.trim(),
        content: dto.content.trim(),
      },
    });
  }

  async update(
    userUuid: string,
    organizationUuid: string,
    promptUuid: string,
    dto: UpdateSavedPromptDto,
  ) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);
    await this.getPrompt(userUuid, organizationUuid, promptUuid);

    const data: Prisma.SavedPromptUpdateInput = {};

    if (dto.title !== undefined) {
      data.title = dto.title.trim();
    }

    if (dto.content !== undefined) {
      data.content = dto.content.trim();
    }

    return this.prisma.savedPrompt.update({
      where: { uuid: promptUuid },
      data,
    });
  }

  async remove(
    userUuid: string,
    organizationUuid: string,
    promptUuid: string,
  ) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);
    await this.getPrompt(userUuid, organizationUuid, promptUuid);

    await this.prisma.savedPrompt.delete({ where: { uuid: promptUuid } });

    return { deleted: true };
  }

  private async getPrompt(
    userUuid: string,
    organizationUuid: string,
    promptUuid: string,
  ) {
    const prompt = await this.prisma.savedPrompt.findFirst({
      where: {
        uuid: promptUuid,
        org_uuid: organizationUuid,
        user_uuid: userUuid,
      },
    });

    if (!prompt) {
      throw new NotFoundException('Saved prompt not found');
    }

    return prompt;
  }
}
