import { IsBoolean, IsObject, IsOptional } from 'class-validator';

export class UpdateComposioTriggerDto {
  @IsOptional()
  @IsBoolean()
  is_enabled?: boolean;

  @IsOptional()
  @IsObject()
  config?: Record<string, unknown>;
}
