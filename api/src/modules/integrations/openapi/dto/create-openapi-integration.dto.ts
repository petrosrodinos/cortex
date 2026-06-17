import { IsEnum, IsObject, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';
import { OpenApiAuthType } from 'generated/prisma';

export class CreateOpenApiIntegrationDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @ValidateIf((dto) => !dto.rawJson)
  @IsString()
  specUrl?: string;

  @ValidateIf((dto) => !dto.specUrl)
  rawJson?: Record<string, any> | string;

  @IsOptional()
  @IsEnum(OpenApiAuthType)
  authType?: OpenApiAuthType;

  @IsOptional()
  @IsObject()
  authConfig?: Record<string, any>;

  @IsOptional()
  @IsObject()
  credentials?: Record<string, any>;
}
