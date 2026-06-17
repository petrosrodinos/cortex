import { Injectable, OnModuleInit } from '@nestjs/common';
import { IntegrationRegistry } from '../../framework/registry/integration-registry.service';
import {
  MongoDatabaseIntegration,
  MysqlDatabaseIntegration,
  PostgresDatabaseIntegration,
} from '../database.integration';

@Injectable()
export class DatabaseIntegrationRegistrar implements OnModuleInit {
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
