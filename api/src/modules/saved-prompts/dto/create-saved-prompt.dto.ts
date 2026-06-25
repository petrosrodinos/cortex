import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateSavedPromptDto {
  @ApiProperty({ example: 'Weekly report summary' })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({ example: 'Summarize the key metrics from last week and highlight anomalies.' })
  @IsString()
  @MinLength(1)
  content: string;
}
