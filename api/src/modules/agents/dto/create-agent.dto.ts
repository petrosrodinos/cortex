import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateAgentDto {
  @ApiProperty({ example: 'Daily sales summary' })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({ example: 'Summarize yesterday sales and highlight anomalies.' })
  @IsString()
  @MinLength(1)
  prompt: string;

  @ApiProperty({ example: '0 9 * * *', description: '5-field cron expression' })
  @IsString()
  @MinLength(1)
  cron_expression: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  is_enabled?: boolean;
}
