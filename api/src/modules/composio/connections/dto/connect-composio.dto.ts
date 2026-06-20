import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ComposioConnectionTier } from 'generated/prisma';

export class ConnectComposioDto {
  @IsString()
  toolkit_slug: string;

  @IsOptional()
  @IsString()
  connected_account_id?: string;

  @IsOptional()
  @IsEnum(ComposioConnectionTier)
  connection_tier?: ComposioConnectionTier;
}
