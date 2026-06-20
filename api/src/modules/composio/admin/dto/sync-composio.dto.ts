import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ComposioSyncType } from 'generated/prisma';

export class SyncComposioDto {
  @IsOptional()
  @IsEnum(ComposioSyncType)
  sync_type?: ComposioSyncType;

  @IsOptional()
  @IsString()
  toolkit_slug?: string;
}
