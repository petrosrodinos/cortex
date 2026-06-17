import { Collection, Db, Document, MongoClient } from 'mongodb';
import { DatabaseSchema, IDbAdapter, QueryResult } from '../interfaces/db-adapter.interface';
import { withQueryTimeout } from '../../database-query-safety';

export class MongoAdapter implements IDbAdapter {
  constructor(private readonly client: MongoClient) {}

  async testConnection(): Promise<boolean> {
    await withQueryTimeout(this.client.db().admin().ping());
    return true;
  }

  async introspectSchema(): Promise<DatabaseSchema> {
    const db = this.client.db();
    const collections = await withQueryTimeout(db.listCollections({}, { nameOnly: true }).toArray());
    const tables: DatabaseSchema['tables'] = [];

    for (const collectionInfo of collections) {
      const collection = db.collection(collectionInfo.name);
      const samples = await withQueryTimeout(collection.find({}).limit(100).toArray());
      const fields = inferMongoFields(samples);

      tables.push({
        name: collectionInfo.name,
        columns: fields.map(([name, types]) => ({
          name,
          type: Array.from(types).sort().join(' | '),
          nullable: true,
          primaryKey: name === '_id',
        })),
      });
    }

    return { tables };
  }

  async executeQuery(pipelineJson: string): Promise<QueryResult> {
    const { collection, pipeline } = parsePipelineQuery(pipelineJson);
    const rows = await withQueryTimeout(this.collection(collection).aggregate(pipeline).toArray());

    return {
      rows,
      rowCount: rows.length,
      fields: Array.from(new Set(rows.flatMap((row) => Object.keys(row)))),
    };
  }

  async insert(collectionName: string, document: Document): Promise<QueryResult> {
    const result = await withQueryTimeout(this.collection(collectionName).insertOne(document));

    return { acknowledged: result.acknowledged, insertedCount: result.acknowledged ? 1 : 0 };
  }

  async update(collectionName: string, filter: Document, update: Document): Promise<QueryResult> {
    const result = await withQueryTimeout(this.collection(collectionName).updateMany(filter, update));

    return { acknowledged: result.acknowledged, modifiedCount: result.modifiedCount };
  }

  async delete(collectionName: string, filter: Document): Promise<QueryResult> {
    const result = await withQueryTimeout(this.collection(collectionName).deleteMany(filter));

    return { acknowledged: result.acknowledged, deletedCount: result.deletedCount };
  }

  private collection(name: string): Collection {
    return this.db().collection(name);
  }

  private db(): Db {
    return this.client.db();
  }
}

function parsePipelineQuery(pipelineJson: string): { collection: string; pipeline: Document[] } {
  const parsed = JSON.parse(pipelineJson);

  if (!parsed?.collection || typeof parsed.collection !== 'string') {
    throw new Error('MongoDB query must include a collection string');
  }

  if (!Array.isArray(parsed.pipeline)) {
    throw new Error('MongoDB query must include a pipeline array');
  }

  return { collection: parsed.collection, pipeline: parsed.pipeline };
}

function inferMongoFields(samples: Document[]): Array<[string, Set<string>]> {
  const fields = new Map<string, Set<string>>();

  for (const sample of samples) {
    collectTypes(sample, fields);
  }

  return Array.from(fields.entries());
}

function collectTypes(document: Document, fields: Map<string, Set<string>>, prefix = '') {
  for (const [key, value] of Object.entries(document)) {
    const path = prefix ? `${prefix}.${key}` : key;
    const type = inferValueType(value);
    const types = fields.get(path) ?? new Set<string>();

    types.add(type);
    fields.set(path, types);

    if (type === 'object' && value && !(value instanceof Date)) {
      collectTypes(value as Document, fields, path);
    }
  }
}

function inferValueType(value: unknown): string {
  if (value === null || value === undefined) {
    return 'null';
  }

  if (Array.isArray(value)) {
    return 'array';
  }

  if (value instanceof Date) {
    return 'date';
  }

  return typeof value;
}
