import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { DocumentBoardsService } from '@/modules/document-boards/document-boards.service';

export interface DocumentBoardToolsContext {
  organizationUuid: string;
  userUuid: string;
}

@Injectable()
export class DocumentBoardToolsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly documentBoards: DocumentBoardsService,
  ) {}

  async listBoards(context: DocumentBoardToolsContext) {
    const boards = await this.prisma.documentBoard.findMany({
      where: { org_uuid: context.organizationUuid },
      orderBy: { updated_at: 'desc' },
      include: {
        _count: { select: { items: true } },
      },
    });

    return {
      boards: boards.map((board) => ({
        board_uuid: board.uuid,
        name: board.name,
        description: board.description,
        document_count: board._count.items,
        created_at: board.created_at,
        updated_at: board.updated_at,
      })),
    };
  }

  async getBoard(
    context: DocumentBoardToolsContext,
    input: { board_uuid?: string; board_name?: string },
  ) {
    if (!input.board_uuid?.trim() && !input.board_name?.trim()) {
      throw new BadRequestException('Provide board_uuid or board_name');
    }

    const board = await this.resolveBoard(context, input);
    const detail = await this.documentBoards.findOne(
      context.userUuid,
      context.organizationUuid,
      board.uuid,
    );

    return {
      board: {
        board_uuid: detail.uuid,
        name: detail.name,
        description: detail.description,
        created_at: detail.created_at,
        updated_at: detail.updated_at,
        documents: detail.items.map((item) => ({
          item_uuid: item.uuid,
          title: item.title ?? item.document.filename,
          document_uuid: item.document_uuid,
          filename: item.document.filename,
          mimetype: item.document.mimetype,
          size: item.document.size,
          file_url: item.document.url,
          added_at: item.created_at,
        })),
      },
    };
  }

  async createBoard(
    context: DocumentBoardToolsContext,
    input: { name: string; description?: string },
  ) {
    const name = input.name?.trim();
    if (!name) {
      throw new BadRequestException('Board name is required');
    }

    const board = await this.documentBoards.create(
      context.userUuid,
      context.organizationUuid,
      {
        name,
        description: input.description?.trim(),
      },
    );

    return {
      board: {
        board_uuid: board.uuid,
        name: board.name,
        description: board.description,
        created_at: board.created_at,
        updated_at: board.updated_at,
      },
    };
  }

  async addDocument(
    context: DocumentBoardToolsContext,
    input: {
      board_uuid?: string;
      board_name?: string;
      document_uuid: string;
      title?: string;
    },
  ) {
    if (!input.board_uuid?.trim() && !input.board_name?.trim()) {
      throw new BadRequestException('Provide board_uuid or board_name');
    }

    const board = await this.resolveBoard(context, {
      board_uuid: input.board_uuid,
      board_name: input.board_name,
    });

    const item = await this.documentBoards.addItem(
      context.userUuid,
      context.organizationUuid,
      board.uuid,
      {
        document_uuid: input.document_uuid,
        title: input.title?.trim(),
      },
    );

    return {
      item: {
        item_uuid: item.uuid,
        board_uuid: board.uuid,
        board_name: board.name,
        title: item.title ?? item.document.filename,
        document_uuid: item.document_uuid,
        filename: item.document.filename,
        mimetype: item.document.mimetype,
        file_url: item.document.url,
        added_at: item.created_at,
      },
    };
  }

  private async resolveBoard(
    context: DocumentBoardToolsContext,
    input: { board_uuid?: string; board_name?: string },
  ) {
    if (input.board_uuid?.trim()) {
      const board = await this.prisma.documentBoard.findFirst({
        where: {
          uuid: input.board_uuid.trim(),
          org_uuid: context.organizationUuid,
        },
      });

      if (!board) {
        throw new NotFoundException('Document board not found');
      }

      return board;
    }

    const query = input.board_name?.trim();
    if (!query) {
      throw new BadRequestException('Provide board_uuid or board_name');
    }

    const boards = await this.prisma.documentBoard.findMany({
      where: {
        org_uuid: context.organizationUuid,
        name: { contains: query, mode: 'insensitive' },
      },
      orderBy: { updated_at: 'desc' },
    });

    if (boards.length === 0) {
      throw new NotFoundException(`No document board matching "${query}"`);
    }

    const exact = boards.filter(
      (board) => board.name.toLowerCase() === query.toLowerCase(),
    );
    const candidates = exact.length > 0 ? exact : boards;

    if (candidates.length > 1) {
      throw new BadRequestException(
        `Multiple boards match "${query}": ${candidates.map((board) => board.name).join(', ')}. Use board_uuid from document_board__list_boards.`,
      );
    }

    return candidates[0];
  }
}
