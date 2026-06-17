export interface DatabaseColumn {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
}

export interface DatabaseTable {
  name: string;
  columns: DatabaseColumn[];
}

export interface DatabaseSchema {
  tables: DatabaseTable[];
}

export interface QueryResult {
  rows?: Record<string, any>[];
  rowCount?: number;
  fields?: string[];
  acknowledged?: boolean;
  insertedCount?: number;
  modifiedCount?: number;
  deletedCount?: number;
}

export interface IDbAdapter {
  testConnection(): Promise<boolean>;
  introspectSchema(): Promise<DatabaseSchema>;
  executeQuery(query: string, params?: any[]): Promise<QueryResult>;
}
