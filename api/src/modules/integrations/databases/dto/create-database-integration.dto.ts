import { IsArray, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { DatabaseOperation, IntegrationProvider } from 'generated/prisma';

export class CreateDatabaseIntegrationDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(IntegrationProvider)
  provider: IntegrationProvider;

  @IsString()
  @MinLength(1)
  connectionString: string;

  @IsArray()
  @IsEnum(DatabaseOperation, { each: true })
  allowedOps: DatabaseOperation[];
}
