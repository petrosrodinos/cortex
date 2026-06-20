import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { SuperAdminGuard } from '@/shared/guards/super-admin.guard';
import { CreateComposioToolkitDto } from '../admin/dto/create-composio-toolkit.dto';
import { ListComposioToolkitsDto } from '../admin/dto/list-composio-toolkits.dto';
import { SyncComposioDto } from '../admin/dto/sync-composio.dto';
import { UpdateComposioToolkitDto } from '../admin/dto/update-composio-toolkit.dto';
import {
  CreateComposioToolkitSchema,
  ListComposioToolkitsSchema,
  SyncComposioSchema,
  UpdateComposioToolSchema,
  UpdateComposioToolkitSchema,
} from '../admin/dto/composio-toolkits.schemas';
import { ComposioToolkitsService } from './composio-toolkits.service';

@Controller(['admin/composio', 'admin/integrations/apps'])
@UseGuards(JwtGuard, SuperAdminGuard)
export class ComposioToolkitsController {
  constructor(private readonly service: ComposioToolkitsService) {}

  @Get('toolkits')
  findAll(
    @Query(new ZodValidationPipe(ListComposioToolkitsSchema))
    query: ListComposioToolkitsDto,
  ) {
    return this.service.findAll(query);
  }

  @Post('sync')
  sync(@Body(new ZodValidationPipe(SyncComposioSchema)) dto: SyncComposioDto) {
    return this.service.sync(dto);
  }

  @Get('sync')
  listSyncRuns(@Query('limit') limit?: string) {
    return this.service.listSyncRuns(limit);
  }

  @Get('sync/:sync_run_uuid')
  getSyncRun(@Param('sync_run_uuid') syncRunUuid: string) {
    return this.service.getSyncRun(syncRunUuid);
  }

  @Post('toolkits')
  create(
    @Body(new ZodValidationPipe(CreateComposioToolkitSchema))
    dto: CreateComposioToolkitDto,
  ) {
    return this.service.create(dto);
  }

  @Get('toolkits/:slug')
  findOne(@Param('slug') slug: string) {
    return this.service.findOne(slug);
  }

  @Patch('toolkits/:slug')
  update(
    @Param('slug') slug: string,
    @Body(new ZodValidationPipe(UpdateComposioToolkitSchema))
    dto: UpdateComposioToolkitDto,
  ) {
    return this.service.update(slug, dto);
  }

  @Delete('toolkits/:slug')
  remove(@Param('slug') slug: string) {
    return this.service.remove(slug);
  }

  @Post('toolkits/:slug/refresh')
  refresh(@Param('slug') slug: string) {
    return this.service.refreshToolkit(slug);
  }

  @Post('toolkits/:slug/sync-tools')
  syncTools(@Param('slug') slug: string) {
    return this.service.refreshTools(slug);
  }

  @Get('toolkits/:slug/tools')
  findTools(
    @Param('slug') slug: string,
    @Query(new ZodValidationPipe(ListComposioToolkitsSchema))
    query: ListComposioToolkitsDto,
  ) {
    return this.service.findTools(slug, query);
  }

  @Patch('toolkits/:slug/tools/:tool_slug')
  updateTool(
    @Param('slug') slug: string,
    @Param('tool_slug') toolSlug: string,
    @Body(new ZodValidationPipe(UpdateComposioToolSchema))
    dto: { is_enabled: boolean },
  ) {
    return this.service.updateTool(slug, toolSlug, dto.is_enabled);
  }

  @Get('toolkits/:slug/stats')
  getStats(@Param('slug') slug: string) {
    return this.service.getStats(slug);
  }
}
