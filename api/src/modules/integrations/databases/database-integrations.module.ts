import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { IntegrationFrameworkModule } from '../framework/integration-framework.module';
import { DatabaseAdapterFactory } from './adapters/factory/database-adapter.factory';
import { DatabaseIntegrationsController } from './database-integrations.controller';
import { DatabaseIntegrationsService } from './database-integrations.service';
import {
  MongoDatabaseIntegration,
  MysqlDatabaseIntegration,
  PostgresDatabaseIntegration,
} from './database.integration';
import { DatabaseIntegrationRegistrar } from './integration/database-integration.registrar';

@Module({
  imports: [PrismaModule, IntegrationFrameworkModule],
  controllers: [DatabaseIntegrationsController],
  providers: [
    DatabaseAdapterFactory,
    DatabaseIntegrationsService,
    PostgresDatabaseIntegration,
    MysqlDatabaseIntegration,
    MongoDatabaseIntegration,
    DatabaseIntegrationRegistrar,
  ],
  exports: [DatabaseIntegrationsService, DatabaseAdapterFactory],
})
export class DatabaseIntegrationsModule {}
