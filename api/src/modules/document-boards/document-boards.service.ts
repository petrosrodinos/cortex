import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { OrganizationsService } from '@/modules/organizations/organizations.service';
import { CreateDocumentBoardDto } from './dto/create-document-board.dto';
import { UpdateDocumentBoardDto } from './dto/update-document-board.dto';
import { AddBoardItemDto } from './dto/add-board-item.dto';

@Injectable()
export class DocumentBoardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizations: OrganizationsService,
  ) {}

  async findAll(userUuid: string, organizationUuid: string) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);

    return this.prisma.documentBoard.findMany({
      where: { org_uuid: organizationUuid },
      orderBy: { updated_at: 'desc' },
    });
  }

  async findOne(
    userUuid: string,
    organizationUuid: string,
    boardUuid: string,
  ) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);

    const board = await this.prisma.documentBoard.findFirst({
      where: { uuid: boardUuid, org_uuid: organizationUuid },
      include: {
        items: {
          include: {
            document: {
              include: {
                user: { select: { uuid: true, first_name: true, last_name: true, email: true } },
              },
            },
          },
          orderBy: { created_at: 'desc' },
        },
      },
    });

    if (!board) {
      throw new NotFoundException('Document board not found');
    }

    return board;
  }

  async create(
    userUuid: string,
    organizationUuid: string,
    dto: CreateDocumentBoardDto,
  ) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);

    return this.prisma.documentBoard.create({
      data: {
        org_uuid: organizationUuid,
        name: dto.name.trim(),
        description: dto.description?.trim() ?? null,
        created_by: userUuid,
      },
    });
  }

  async update(
    userUuid: string,
    organizationUuid: string,
    boardUuid: string,
    dto: UpdateDocumentBoardDto,
  ) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);
    await this.requireBoard(organizationUuid, boardUuid);

    const data: Prisma.DocumentBoardUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name.trim();
    if (dto.description !== undefined) data.description = dto.description.trim();

    return this.prisma.documentBoard.update({
      where: { uuid: boardUuid },
      data,
    });
  }

  async remove(
    userUuid: string,
    organizationUuid: string,
    boardUuid: string,
  ) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);
    await this.requireBoard(organizationUuid, boardUuid);

    await this.prisma.documentBoard.delete({ where: { uuid: boardUuid } });
    return { deleted: true };
  }

  async addItem(
    userUuid: string,
    organizationUuid: string,
    boardUuid: string,
    dto: AddBoardItemDto,
  ) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);
    await this.requireBoard(organizationUuid, boardUuid);

    const document = await this.prisma.document.findUnique({
      where: { uuid: dto.document_uuid },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    try {
      return await this.prisma.documentBoardItem.create({
        data: {
          board_uuid: boardUuid,
          document_uuid: dto.document_uuid,
          added_by: userUuid,
          title: dto.title?.trim() ?? null,
        },
        include: { document: true },
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException('Document already in this board');
      }
      throw error;
    }
  }

  async removeItem(
    userUuid: string,
    organizationUuid: string,
    boardUuid: string,
    itemUuid: string,
  ) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);
    await this.requireBoard(organizationUuid, boardUuid);

    const item = await this.prisma.documentBoardItem.findFirst({
      where: { uuid: itemUuid, board_uuid: boardUuid },
    });

    if (!item) {
      throw new NotFoundException('Board item not found');
    }

    await this.prisma.documentBoardItem.delete({ where: { uuid: itemUuid } });
    return { deleted: true };
  }

  private async requireBoard(organizationUuid: string, boardUuid: string) {
    const board = await this.prisma.documentBoard.findFirst({
      where: { uuid: boardUuid, org_uuid: organizationUuid },
    });

    if (!board) {
      throw new NotFoundException('Document board not found');
    }

    return board;
  }
}
