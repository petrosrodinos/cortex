import {
  Controller,
  Get,
  Header,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { OrganizationActiveMemberGuard } from '@/shared/guards/organization-active-member.guard';
import { OrganizationGuard } from '@/shared/guards/organization.guard';
import { OrganizationMatchGuard } from '@/shared/guards/organization-match.guard';
import { DocumentsService } from './documents.service';

@Controller('organizations/:organization_uuid/documents')
@UseGuards(
  JwtGuard,
  OrganizationMatchGuard,
  OrganizationActiveMemberGuard,
  OrganizationGuard,
)
export class DocumentsController {
  constructor(private readonly documents: DocumentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @UploadedFile() file: { buffer: Buffer; originalname: string; mimetype: string; size: number },
  ) {
    return this.documents.upload(userUuid, organizationUuid, file);
  }

  @Get()
  findAll(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
  ) {
    return this.documents.findAll(userUuid, organizationUuid);
  }

  @Get(':document_uuid/widget-content')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getWidgetContent(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('document_uuid') documentUuid: string,
  ) {
    return this.documents.getWidgetContent(userUuid, organizationUuid, documentUuid);
  }
}
