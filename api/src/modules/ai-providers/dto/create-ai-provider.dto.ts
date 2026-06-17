import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, MinLength } from 'class-validator';
import { AiProviderType } from 'generated/prisma';

export class CreateAiProviderDto {
  @ApiProperty({ enum: AiProviderType })
  @IsEnum(AiProviderType)
  provider: AiProviderType;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  api_key: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  default_model: string;

  @ApiPropertyOptional()
  @IsOptional()
  model_routing?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  usage_limit_tokens?: number;

  @ApiPropertyOptional()
  @IsOptional()
  usage_limit_cost_usd?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}
