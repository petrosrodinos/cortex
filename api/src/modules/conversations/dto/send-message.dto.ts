import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ComposioConnectionTier } from 'generated/prisma';
import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class SendMessageDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  content: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  documentUuids?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  integrationUuids?: string[];

  @ApiProperty({
    required: false,
    type: [String],
    description: 'Composio toolkit slugs used to scope the agent session.',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  toolkitSlugs?: string[];

  @ApiProperty({
    required: false,
    type: [String],
    description: 'Snake_case alias for toolkitSlugs.',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  toolkit_slugs?: string[];

  @ApiPropertyOptional({
    example: { linear: ComposioConnectionTier.ORG_SHARED },
    description: 'Preferred Composio connection tier per toolkit slug.',
  })
  @IsOptional()
  @IsObject()
  toolkitConnectionTiers?: Record<string, string>;

  @ApiPropertyOptional({
    example: { linear: ComposioConnectionTier.ORG_SHARED },
    description: 'Snake_case alias for toolkitConnectionTiers.',
  })
  @IsOptional()
  @IsObject()
  toolkit_connection_tiers?: Record<string, string>;
}
