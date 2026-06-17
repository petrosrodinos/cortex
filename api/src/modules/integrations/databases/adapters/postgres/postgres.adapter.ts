import { Pool } from 'pg';
import { DatabaseSchema, IDbAdapter, QueryResult } from '../db-adapter.interface';
import { withQueryTimeout } from '../database-query-safety';

export class PostgresAdapter implements IDbAdapter {
  constructor(private readonly pool: Pool) {}

  async testConnection(): Promise<boolean> {
    await withQueryTimeout(this.pool.query('select 1'));
    return true;
  }

  async introspectSchema(): Promise<DatabaseSchema> {
    const [columnsResult, primaryKeysResult] = await Promise.all([
      withQueryTimeout(
        this.pool.query<{
          table_name: string;
          column_name: string;
          data_type: string;
          is_nullable: 'YES' | 'NO';
          ordinal_position: number;
        }>(
          `
            select table_name, column_name, data_type, is_nullable, ordinal_position
            from information_schema.columns
            where table_schema = 'public'
            order by table_name, ordinal_position
          `,
        ),
      ),
      withQueryTimeout(
        this.pool.query<{ table_name: string; column_name: string }>(
          `
            select tc.table_name, kcu.column_name
            from information_schema.table_constraints tc
            join information_schema.key_column_usage kcu
              on tc.constraint_name = kcu.constraint_name
             and tc.table_schema = kcu.table_schema
            where tc.constraint_type = 'PRIMARY KEY'
              and tc.table_schema = 'public'
          `,
        ),
      ),
    ]);

    const primaryKeys = new Set(primaryKeysResult.rows.map((row) => `${row.table_name}.${row.column_name}`));
    const tables = new Map<string, DatabaseSchema['tables'][number]>();

    for (const column of columnsResult.rows) {
      const table = tables.get(column.table_name) ?? { name: column.table_name, columns: [] };
      table.columns.push({
        name: column.column_name,
        type: column.data_type,
        nullable: column.is_nullable === 'YES',
        primaryKey: primaryKeys.has(`${column.table_name}.${column.column_name}`),
      });
      tables.set(column.table_name, table);
    }

    return { tables: Array.from(tables.values()) };
  }

  async executeQuery(sql: string, params: any[] = []): Promise<QueryResult> {
    const result = await withQueryTimeout(this.pool.query(sql, params));

    return {
      rows: result.rows,
      rowCount: result.rowCount ?? undefined,
      fields: result.fields?.map((field) => field.name),
    };
  }
}
