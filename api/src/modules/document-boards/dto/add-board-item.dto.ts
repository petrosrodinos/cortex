import { IsUUID } from 'class-validator';

export class AddBoardItemDto {
  @IsUUID()
  document_uuid: string;
}
