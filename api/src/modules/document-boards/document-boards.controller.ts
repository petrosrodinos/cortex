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
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { OrganizationPermission } from '@/shared/decorators/organization-permission.decorator';
import { PermissionKeys } from '@/modules/roles/permissions';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { OrganizationActiveMemberGuard } from '@/shared/guards/organization-active-member.guard';
import { OrganizationGuard } from '@/shared/guards/organization.guard';
import { OrganizationMatchGuard } from '@/shared/guards/organization-match.guard';
import { AddBoardItemDto } from './dto/add-board-item.dto';
import { CreateDocumentBoardDto } from './dto/create-document-board.dto';
import { UpdateDocumentBoardDto } from './dto/update-document-board.dto';
import {
  DocumentBoardItemsQuerySchema,
  type DocumentBoardItemsQueryType,
} from './dto/document-board-items-query.schema';
import { DocumentBoardsService } from './document-boards.service';

@Controller('organizations/:organization_uuid/document-boards')
@UseGuards(
  JwtGuard,
  OrganizationMatchGuard,
  OrganizationActiveMemberGuard,
  OrganizationGuard,
)
export class DocumentBoardsController {
  constructor(private readonly boards: DocumentBoardsService) {}

  @Get()
  @OrganizationPermission(PermissionKeys.DOCUMENTS_READ)
  findAll(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
  ) {
    return this.boards.findAll(userUuid, organizationUuid);
  }

  @Post()
  @OrganizationPermission(PermissionKeys.DOCUMENTS_WRITE)
  create(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Body() dto: CreateDocumentBoardDto,
  ) {
    return this.boards.create(userUuid, organizationUuid, dto);
  }

  @Get(':board_uuid')
  @OrganizationPermission(PermissionKeys.DOCUMENTS_READ)
  findOne(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('board_uuid') boardUuid: string,
  ) {
    return this.boards.findOne(userUuid, organizationUuid, boardUuid);
  }

  @Patch(':board_uuid')
  @OrganizationPermission(PermissionKeys.DOCUMENTS_WRITE)
  update(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('board_uuid') boardUuid: string,
    @Body() dto: UpdateDocumentBoardDto,
  ) {
    return this.boards.update(userUuid, organizationUuid, boardUuid, dto);
  }

  @Delete(':board_uuid')
  @OrganizationPermission(PermissionKeys.DOCUMENTS_DELETE)
  remove(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('board_uuid') boardUuid: string,
  ) {
    return this.boards.remove(userUuid, organizationUuid, boardUuid);
  }

  @Get(':board_uuid/items')
  @OrganizationPermission(PermissionKeys.DOCUMENTS_READ)
  findItems(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('board_uuid') boardUuid: string,
    @Query(new ZodValidationPipe(DocumentBoardItemsQuerySchema))
    query: DocumentBoardItemsQueryType,
  ) {
    return this.boards.findItems(userUuid, organizationUuid, boardUuid, query);
  }

  @Post(':board_uuid/items')
  @OrganizationPermission(PermissionKeys.DOCUMENTS_WRITE)
  addItem(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('board_uuid') boardUuid: string,
    @Body() dto: AddBoardItemDto,
  ) {
    return this.boards.addItem(userUuid, organizationUuid, boardUuid, dto);
  }

  @Delete(':board_uuid/items/:item_uuid')
  @OrganizationPermission(PermissionKeys.DOCUMENTS_WRITE)
  removeItem(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('board_uuid') boardUuid: string,
    @Param('item_uuid') itemUuid: string,
  ) {
    return this.boards.removeItem(userUuid, organizationUuid, boardUuid, itemUuid);
  }
}
