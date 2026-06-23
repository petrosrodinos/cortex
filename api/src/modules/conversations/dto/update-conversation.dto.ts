import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { AiProviderType } from 'generated/prisma';

export class UpdateConversationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @ApiPropertyOptional({ enum: AiProviderType })
  @IsOptional()
  @IsEnum(AiProviderType)
  ai_provider?: AiProviderType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  ai_model?: string;
}
