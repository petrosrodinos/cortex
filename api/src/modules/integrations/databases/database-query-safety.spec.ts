import { ForbiddenException } from '@nestjs/common';
import { DatabaseOperation } from 'generated/prisma';
import { assertSqlQueryAllowed, inferSqlOperation } from './database-query-safety';

describe('database query safety', () => {
  it('blocks dangerous ddl and permission statements before execution', () => {
    expect(() => assertSqlQueryAllowed('select * from users; drop table users;', [DatabaseOperation.READ])).toThrow(
      ForbiddenException,
    );
    expect(() => assertSqlQueryAllowed('TRUNCATE TABLE users', [DatabaseOperation.DELETE])).toThrow(ForbiddenException);
    expect(() => assertSqlQueryAllowed('grant select on users to app', [DatabaseOperation.READ])).toThrow(ForbiddenException);
  });

  it('infers the required operation from sql', () => {
    expect(inferSqlOperation('select * from users')).toBe(DatabaseOperation.READ);
    expect(inferSqlOperation('with active_users as (select * from users) select * from active_users')).toBe(
      DatabaseOperation.READ,
    );
    expect(inferSqlOperation('insert into users(email) values($1)')).toBe(DatabaseOperation.INSERT);
    expect(inferSqlOperation('update users set email = $1 where id = $2')).toBe(DatabaseOperation.UPDATE);
    expect(inferSqlOperation('delete from users where id = $1')).toBe(DatabaseOperation.DELETE);
  });

  it('rejects writes that are not explicitly allowed', () => {
    expect(() => assertSqlQueryAllowed('update users set email = $1 where id = $2', [DatabaseOperation.READ])).toThrow(
      ForbiddenException,
    );
    expect(() =>
      assertSqlQueryAllowed('with changed as (update users set email = $1 returning id) select * from changed', [
        DatabaseOperation.READ,
      ]),
    ).toThrow(ForbiddenException);
    expect(() =>
      assertSqlQueryAllowed('insert into users(email) values($1)', [DatabaseOperation.READ, DatabaseOperation.INSERT]),
    ).not.toThrow();
  });
});
