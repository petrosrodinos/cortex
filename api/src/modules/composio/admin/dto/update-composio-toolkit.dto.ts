import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { ComposioConnectionTier } from 'generated/prisma';

export class UpdateComposioToolkitDto {
  @IsOptional()
  @IsBoolean()
  is_enabled?: boolean;

  @IsOptional()
  @IsEnum(ComposioConnectionTier)
  connection_tier?: ComposioConnectionTier;
}
