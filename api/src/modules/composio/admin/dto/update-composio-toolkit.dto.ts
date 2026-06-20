import { IsArray, IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { ComposioConnectionTier } from 'generated/prisma';

export class UpdateComposioToolkitDto {
  @IsOptional()
  @IsBoolean()
  is_enabled?: boolean;

  @IsOptional()
  @IsArray()
  @IsEnum(ComposioConnectionTier, { each: true })
  connection_tiers?: ComposioConnectionTier[];
}
