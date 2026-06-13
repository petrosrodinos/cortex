import { Module, OnModuleInit } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { IntegrationFrameworkModule } from '../framework/integration-framework.module';
import { IntegrationRegistry } from '../framework/integration-registry.service';
import { DatabaseAdapterFactory } from './adapters/database-adapter.factory';
import { DatabaseIntegrationsController } from './database-integrations.controller';
import { DatabaseIntegrationsService } from './database-integrations.service';
import {
  MongoDatabaseIntegration,
  MysqlDatabaseIntegration,
  PostgresDatabaseIntegration,
} from './database.integration';

class DatabaseIntegrationsRegistrar implements OnModuleInit {
  constructor(
    private readonly registry: IntegrationRegistry,
    private readonly postgres: PostgresDatabaseIntegration,
    private readonly mysql: MysqlDatabaseIntegration,
    private readonly mongo: MongoDatabaseIntegration,
  ) {}

  onModuleInit() {
    this.registry.register(this.postgres);
    this.registry.register(this.mysql);
    this.registry.register(this.mongo);
  }
}

@Module({
  imports: [PrismaModule, IntegrationFrameworkModule],
  controllers: [DatabaseIntegrationsController],
  providers: [
    DatabaseAdapterFactory,
    DatabaseIntegrationsService,
    PostgresDatabaseIntegration,
    MysqlDatabaseIntegration,
    MongoDatabaseIntegration,
    DatabaseIntegrationsRegistrar,
  ],
  exports: [DatabaseIntegrationsService, DatabaseAdapterFactory],
})
export class DatabaseIntegrationsModule {}
