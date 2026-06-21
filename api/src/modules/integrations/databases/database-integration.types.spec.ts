import { DatabaseOperation } from 'generated/prisma';
import {
  databaseActionKeyToOperation,
  getEffectiveDatabaseActionKeys,
  isDatabaseActionEnabledForOps,
} from './database-integration.types';

describe('database integration action mapping', () => {
  it('maps query to READ', () => {
    expect(databaseActionKeyToOperation('query')).toBe(DatabaseOperation.READ);
  });

  it('enables query when READ is allowed', () => {
    expect(
      isDatabaseActionEnabledForOps('query', [DatabaseOperation.READ]),
    ).toBe(true);
  });

  it('does not enable query when READ is not allowed', () => {
    expect(
      isDatabaseActionEnabledForOps('query', [DatabaseOperation.INSERT]),
    ).toBe(false);
  });

  it('always enables get_schema', () => {
    expect(isDatabaseActionEnabledForOps('get_schema', [])).toBe(true);
  });

  it('derives effective database action keys from allowed ops', () => {
    expect(
      getEffectiveDatabaseActionKeys([
        DatabaseOperation.READ,
        DatabaseOperation.INSERT,
      ]),
    ).toEqual(['get_schema', 'query', 'insert']);
  });
});
