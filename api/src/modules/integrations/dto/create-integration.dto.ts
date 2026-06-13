import { IsEnum, IsObject, IsOptional, IsString, MinLength } from 'class-validator';
import { IntegrationProvider } from 'generated/prisma';

export class CreateIntegrationDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(IntegrationProvider)
  provider: IntegrationProvider;

  @IsObject()
  config: Record<string, any>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
