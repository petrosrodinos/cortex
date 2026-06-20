import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateComposioTriggerDto {
  @IsString()
  toolkit_slug: string;

  @IsString()
  trigger_slug: string;

  @IsString()
  connected_account_id: string;

  @IsOptional()
  @IsObject()
  config?: Record<string, unknown>;
}
