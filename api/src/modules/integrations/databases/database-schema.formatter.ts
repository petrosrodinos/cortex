import { DatabaseSchema } from './db-adapter.interface';

export function formatDatabaseSchema(schema?: DatabaseSchema | null): string {
  if (!schema?.tables?.length) {
    return 'No tables or collections were found in the cached schema.';
  }

  return schema.tables
    .map((table) => {
      const columns = table.columns
        .map((column) => {
          const markers = [column.primaryKey ? 'PK' : null, column.nullable ? 'nullable' : null].filter(Boolean);
          const suffix = markers.length ? ` ${markers.join(' ')}` : '';
          return `${column.name}(${column.type}${suffix})`;
        })
        .join(', ');

      return `Table: ${table.name}, Columns: ${columns}`;
    })
    .join('\n');
}
