import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class ResolveUserChoiceDto {
  @ApiProperty({ example: ['project-abc'] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  selected_ids!: string[];
}
