import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { OrganizationActiveMemberGuard } from '@/shared/guards/organization-active-member.guard';
import { OrganizationGuard } from '@/shared/guards/organization.guard';
import { OrganizationMatchGuard } from '@/shared/guards/organization-match.guard';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { ComposioConnectionsService } from './composio-connections.service';
import { ComposioConnectRateLimitGuard } from './composio-connect-rate-limit.guard';
import { ComposioCallbackDto } from './dto/composio-callback.dto';
import {
  ComposioCallbackSchema,
  ConnectComposioSchema,
} from './dto/composio-connections.schemas';
import { ConnectComposioDto } from './dto/connect-composio.dto';

@Controller('organizations/:organization_uuid/integrations/composio')
@UseGuards(
  JwtGuard,
  OrganizationMatchGuard,
  OrganizationActiveMemberGuard,
  OrganizationGuard,
)
export class ComposioConnectionsController {
  constructor(private readonly service: ComposioConnectionsService) {}

  @Post('connect')
  @UseGuards(ComposioConnectRateLimitGuard)
  connect(
    @Param('organization_uuid') organizationUuid: string,
    @CurrentUser() user: any,
    @Body(new ZodValidationPipe(ConnectComposioSchema)) dto: ConnectComposioDto,
  ) {
    return this.service.connect(organizationUuid, user, dto);
  }

  @Post('callback')
  verifyCallback(
    @Param('organization_uuid') organizationUuid: string,
    @CurrentUser() user: any,
    @Body(new ZodValidationPipe(ComposioCallbackSchema))
    dto: ComposioCallbackDto,
  ) {
    return this.service.verifyCallback(organizationUuid, user, dto);
  }

  @Get('accounts')
  listAccounts(
    @Param('organization_uuid') organizationUuid: string,
    @Query('toolkit_slug') toolkitSlug?: string,
  ) {
    return this.service.listAccounts(organizationUuid, toolkitSlug);
  }

  @Delete('accounts/:connected_account_id')
  disconnect(
    @Param('organization_uuid') organizationUuid: string,
    @CurrentUser() user: any,
    @Param('connected_account_id') connectedAccountId: string,
  ) {
    return this.service.disconnect(organizationUuid, user, connectedAccountId);
  }

  @Post('accounts/:connected_account_id/reconnect')
  @UseGuards(ComposioConnectRateLimitGuard)
  reconnect(
    @Param('organization_uuid') organizationUuid: string,
    @CurrentUser() user: any,
    @Param('connected_account_id') connectedAccountId: string,
  ) {
    return this.service.reconnect(organizationUuid, user, connectedAccountId);
  }
}
