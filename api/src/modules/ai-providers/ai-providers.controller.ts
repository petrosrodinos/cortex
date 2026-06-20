import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { OrganizationActiveMemberGuard } from '@/shared/guards/organization-active-member.guard';
import { OrganizationGuard } from '@/shared/guards/organization.guard';
import { OrganizationMatchGuard } from '@/shared/guards/organization-match.guard';
import { CreateAiProviderDto } from './dto/create-ai-provider.dto';
import { UpdateAiProviderDto } from './dto/update-ai-provider.dto';
import { AiProvidersService } from './ai-providers.service';

@Controller('organizations/:organization_uuid/ai-providers')
@UseGuards(
  JwtGuard,
  OrganizationMatchGuard,
  OrganizationActiveMemberGuard,
  OrganizationGuard,
)
export class AiProvidersController {
  constructor(private readonly service: AiProvidersService) {}

  @Get()
  findAll(@CurrentUser('uuid') userUuid: string, @Param('organization_uuid') organizationUuid: string) {
    return this.service.findAll(userUuid, organizationUuid);
  }

  @Post()
  create(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Body() dto: CreateAiProviderDto,
  ) {
    return this.service.create(userUuid, organizationUuid, dto);
  }

  @Patch(':provider_uuid')
  update(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('provider_uuid') providerUuid: string,
    @Body() dto: UpdateAiProviderDto,
  ) {
    return this.service.update(userUuid, organizationUuid, providerUuid, dto);
  }

  @Delete(':provider_uuid')
  delete(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('provider_uuid') providerUuid: string,
  ) {
    return this.service.delete(userUuid, organizationUuid, providerUuid);
  }
}
