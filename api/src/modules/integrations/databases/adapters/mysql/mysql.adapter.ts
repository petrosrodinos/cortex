import { Pool, RowDataPacket } from 'mysql2/promise';
import { DatabaseSchema, IDbAdapter, QueryResult } from '../interfaces/db-adapter.interface';
import { withQueryTimeout } from '../../database-query-safety';

interface MysqlColumnRow extends RowDataPacket {
  TABLE_NAME: string;
  COLUMN_NAME: string;
  DATA_TYPE: string;
  IS_NULLABLE: 'YES' | 'NO';
  COLUMN_KEY: string;
}

export class MysqlAdapter implements IDbAdapter {
  constructor(private readonly pool: Pool) {}

  async testConnection(): Promise<boolean> {
    await withQueryTimeout(this.pool.query('select 1'));
    return true;
  }

  async introspectSchema(): Promise<DatabaseSchema> {
    const [rows] = await withQueryTimeout(
      this.pool.query<MysqlColumnRow[]>(
        `
          select TABLE_NAME, COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY
          from information_schema.columns
          where table_schema = database()
          order by TABLE_NAME, ORDINAL_POSITION
        `,
      ),
    );
    const tables = new Map<string, DatabaseSchema['tables'][number]>();

    for (const column of rows) {
      const table = tables.get(column.TABLE_NAME) ?? { name: column.TABLE_NAME, columns: [] };
      table.columns.push({
        name: column.COLUMN_NAME,
        type: column.DATA_TYPE,
        nullable: column.IS_NULLABLE === 'YES',
        primaryKey: column.COLUMN_KEY === 'PRI',
      });
      tables.set(column.TABLE_NAME, table);
    }

    return { tables: Array.from(tables.values()) };
  }

  async executeQuery(sql: string, params: any[] = []): Promise<QueryResult> {
    const [rows, fields] = await withQueryTimeout(this.pool.execute(sql, params));
    const recordRows = Array.isArray(rows) ? (rows as Record<string, any>[]) : [];

    return {
      rows: recordRows,
      rowCount: 'affectedRows' in (rows as any) ? (rows as any).affectedRows : recordRows.length,
      fields: Array.isArray(fields) ? fields.map((field) => field.name) : undefined,
    };
  }
}
