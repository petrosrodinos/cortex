import { BadRequestException, ForbiddenException, RequestTimeoutException } from '@nestjs/common';
import { DatabaseOperation } from 'generated/prisma';

const DANGEROUS_SQL_PATTERN = /\b(drop|truncate|alter|create|grant)\b/i;
const WRITE_SQL_PATTERN = /\b(insert|update|delete)\b/i;
const SQL_TIMEOUT_MS = 10_000;

export function inferSqlOperation(sql: string): DatabaseOperation {
  const normalized = stripSqlComments(sql).trim().toLowerCase();
  const firstKeyword = normalized.match(/^[a-z]+/)?.[0];

  switch (firstKeyword) {
    case 'select':
    case 'with':
    case 'show':
    case 'describe':
    case 'explain':
      return DatabaseOperation.READ;
    case 'insert':
      return DatabaseOperation.INSERT;
    case 'update':
      return DatabaseOperation.UPDATE;
    case 'delete':
      return DatabaseOperation.DELETE;
    default:
      throw new BadRequestException('Only SELECT, INSERT, UPDATE, and DELETE database operations are supported');
  }
}

export function assertSqlQueryAllowed(sql: string, allowedOps: DatabaseOperation[]): DatabaseOperation {
  if (!sql || !sql.trim()) {
    throw new BadRequestException('Query cannot be empty');
  }

  const withoutComments = stripSqlComments(sql);

  if (DANGEROUS_SQL_PATTERN.test(withoutComments)) {
    throw new ForbiddenException('Query contains a blocked SQL statement');
  }

  const operation = inferSqlOperation(withoutComments);

  if (operation === DatabaseOperation.READ && WRITE_SQL_PATTERN.test(withoutComments)) {
    throw new ForbiddenException('Read queries cannot contain write statements');
  }

  if (!allowedOps.includes(operation)) {
    throw new ForbiddenException(`${operation} operation is not allowed for this database integration`);
  }

  return operation;
}

export async function withQueryTimeout<T>(operation: Promise<T>, timeoutMs = SQL_TIMEOUT_MS): Promise<T> {
  let timeout: NodeJS.Timeout | undefined;

  try {
    return await Promise.race([
      operation,
      new Promise<T>((_resolve, reject) => {
        timeout = setTimeout(() => reject(new RequestTimeoutException('Database query timed out')), timeoutMs);
      }),
    ]);
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
}

function stripSqlComments(sql: string) {
  return sql.replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
}
