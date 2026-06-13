import { formatDatabaseSchema } from './database-schema.formatter';
import { DatabaseSchema } from './db-adapter.interface';

describe('formatDatabaseSchema', () => {
  it('formats tables and primary keys for AI context', () => {
    const schema: DatabaseSchema = {
      tables: [
        {
          name: 'users',
          columns: [
            { name: 'id', type: 'int', nullable: false, primaryKey: true },
            { name: 'email', type: 'varchar', nullable: false, primaryKey: false },
            { name: 'deleted_at', type: 'timestamp', nullable: true, primaryKey: false },
          ],
        },
      ],
    };

    expect(formatDatabaseSchema(schema)).toBe('Table: users, Columns: id(int PK), email(varchar), deleted_at(timestamp nullable)');
  });

  it('returns a clear empty-schema message', () => {
    expect(formatDatabaseSchema({ tables: [] })).toBe('No tables or collections were found in the cached schema.');
  });
});
