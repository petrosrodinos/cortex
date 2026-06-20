import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ComposioConnectionTier } from 'generated/prisma';

export class ComposioCallbackDto {
  @IsString()
  toolkit_slug: string;

  @IsOptional()
  @IsString()
  connection_request_id?: string;

  @IsOptional()
  @IsEnum(ComposioConnectionTier)
  connection_tier?: ComposioConnectionTier;
}
