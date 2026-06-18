import { ApiPropertyOptional } from '@nestjs/swagger';
import { CharacteristicLevel, ResponseStyle } from 'generated/prisma';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateConversationPersonalizationDto {
  @ApiPropertyOptional({ enum: ResponseStyle })
  @IsOptional()
  @IsEnum(ResponseStyle)
  response_style?: ResponseStyle;

  @ApiPropertyOptional({ enum: CharacteristicLevel })
  @IsOptional()
  @IsEnum(CharacteristicLevel)
  warm?: CharacteristicLevel;

  @ApiPropertyOptional({ enum: CharacteristicLevel })
  @IsOptional()
  @IsEnum(CharacteristicLevel)
  enthusiastic?: CharacteristicLevel;

  @ApiPropertyOptional({ enum: CharacteristicLevel })
  @IsOptional()
  @IsEnum(CharacteristicLevel)
  headers_lists?: CharacteristicLevel;

  @ApiPropertyOptional({ enum: CharacteristicLevel })
  @IsOptional()
  @IsEnum(CharacteristicLevel)
  emoji?: CharacteristicLevel;

  @ApiPropertyOptional({ maxLength: 8000 })
  @IsOptional()
  @IsString()
  @MaxLength(8000)
  custom_instructions?: string | null;
}
