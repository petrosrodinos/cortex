import { IsEnum, IsString, MinLength } from 'class-validator';
import { IntegrationProvider } from 'generated/prisma';

export class TestDatabaseConnectionDto {
  @IsEnum(IntegrationProvider)
  provider: IntegrationProvider;

  @IsString()
  @MinLength(1)
  connectionString: string;
}
