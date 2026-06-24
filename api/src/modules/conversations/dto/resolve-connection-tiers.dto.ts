import { ApiProperty } from '@nestjs/swagger';
import { ComposioConnectionTier } from 'generated/prisma';
import { IsObject } from 'class-validator';

export class ResolveConnectionTiersDto {
  @ApiProperty({ example: { linear: ComposioConnectionTier.ORG_SHARED } })
  @IsObject()
  choices!: Record<string, string>;
}
