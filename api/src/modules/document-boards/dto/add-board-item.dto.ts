import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class AddBoardItemDto {
  @IsUUID()
  document_uuid: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;
}
