import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { createPool as createMysqlPool, Pool as MysqlPool } from 'mysql2/promise';
import { MongoClient } from 'mongodb';
import { Pool as PgPool } from 'pg';
import { DatabaseType } from 'generated/prisma';
import { IDbAdapter } from '../interfaces/db-adapter.interface';
import { MongoAdapter } from '../mongo/mongo.adapter';
import { MysqlAdapter } from '../mysql/mysql.adapter';
import { PostgresAdapter } from '../postgres/postgres.adapter';

type CachedClient = {
  type: DatabaseType;
  client: PgPool | MysqlPool | MongoClient;
  adapter: IDbAdapter;
};

@Injectable()
export class DatabaseAdapterFactory implements OnModuleDestroy {
  private readonly clients = new Map<string, CachedClient>();

  async getAdapter(integrationUuid: string, dbType: DatabaseType, connectionString: string): Promise<IDbAdapter> {
    const cached = this.clients.get(integrationUuid);

    if (cached?.type === dbType) {
      return cached.adapter;
    }

    if (cached) {
      await this.closeClient(cached);
      this.clients.delete(integrationUuid);
    }

    const created = await this.createClient(dbType, connectionString);
    this.clients.set(integrationUuid, created);
    return created.adapter;
  }

  async onModuleDestroy() {
    await Promise.all(Array.from(this.clients.values()).map((client) => this.closeClient(client)));
    this.clients.clear();
  }

  private async createClient(dbType: DatabaseType, connectionString: string): Promise<CachedClient> {
    switch (dbType) {
      case DatabaseType.POSTGRESQL: {
        const client = new PgPool({ connectionString, max: 5 });
        return { type: dbType, client, adapter: new PostgresAdapter(client) };
      }
      case DatabaseType.MYSQL: {
        const client = createMysqlPool(connectionString);
        return { type: dbType, client, adapter: new MysqlAdapter(client) };
      }
      case DatabaseType.MONGODB: {
        const client = new MongoClient(connectionString, { maxPoolSize: 5 });
        await client.connect();
        return { type: dbType, client, adapter: new MongoAdapter(client) };
      }
    }
  }

  private async closeClient(cached: CachedClient) {
    if (cached.type === DatabaseType.POSTGRESQL) {
      await (cached.client as PgPool).end();
      return;
    }

    if (cached.type === DatabaseType.MYSQL) {
      await (cached.client as MysqlPool).end();
      return;
    }

    await (cached.client as MongoClient).close();
  }
}
