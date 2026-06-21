import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class ResolveConnectionTiersDto {
  @ApiProperty({ example: { linear: 'ORG_SHARED' } })
  @IsObject()
  choices!: Record<string, string>;
}
