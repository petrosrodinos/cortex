import { z } from 'zod';
import { toJsonValue } from '@/shared/utils/json-value.utils';
import { LinearActionResult } from '../interfaces/linear.interfaces';

export const LINEAR_UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const linearOptionalString = z.preprocess(
  (value) => (value === null || value === '' ? undefined : value),
  z.string().optional(),
);

export const linearOptionalNumber = z.preprocess(
  (value) => (value === null || value === '' ? undefined : value),
  z.coerce.number().optional(),
);

export const linearOptionalLabelIds = z.preprocess(
  (value) => {
    if (!Array.isArray(value)) {
      return undefined;
    }

    const filtered = value.filter(
      (item) => item !== null && item !== undefined && item !== '',
    );

    return filtered.length ? filtered : undefined;
  },
  z.array(z.string()).optional(),
);

export function isLinearUuid(value: string): boolean {
  return LINEAR_UUID_REGEX.test(value);
}

export function wrapResult<T>(data: T): LinearActionResult<ReturnType<typeof toJsonValue<T>>> {
  return { success: true, data: toJsonValue(data) };
}

export function buildIdFilter(fields: Record<string, string | undefined>): Record<string, any> {
  const filter: Record<string, any> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) {
      filter[key] = { id: { eq: value } };
    }
  }
  return filter;
}

export function compactOptionalFields<T extends Record<string, unknown>>(input: T): Partial<T> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input)) {
    if (value === null || value === undefined || value === '') {
      continue;
    }

    if (Array.isArray(value)) {
      const filtered = value.filter(
        (item) => item !== null && item !== undefined && item !== '',
      );
      if (filtered.length) {
        result[key] = filtered;
      }
      continue;
    }

    result[key] = value;
  }

  return result as Partial<T>;
}

export function normalizeDueDate(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.toLowerCase() === 'today') {
    return new Date().toISOString().slice(0, 10);
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return trimmed;
}

export function serializeLinearEntity(entity: unknown): Record<string, unknown> {
  if (!entity || typeof entity !== 'object') {
    return {};
  }

  const result: Record<string, unknown> = {};

  for (const key of Object.keys(entity as Record<string, unknown>)) {
    if (key.startsWith('_')) {
      continue;
    }

    const value = (entity as Record<string, unknown>)[key];
    if (typeof value === 'function') {
      continue;
    }

    if (value instanceof Date) {
      result[key] = value.toISOString();
      continue;
    }

    result[key] = value;
  }

  return result;
}

export function serializeLinearConnection(connection: any) {
  if (!connection?.nodes) {
    return connection;
  }

  return {
    nodes: connection.nodes.map((node: unknown) => serializeLinearEntity(node)),
    pageInfo: connection.pageInfo
      ? {
          hasNextPage: connection.pageInfo.hasNextPage,
          hasPreviousPage: connection.pageInfo.hasPreviousPage,
          startCursor: connection.pageInfo.startCursor,
          endCursor: connection.pageInfo.endCursor,
        }
      : undefined,
  };
}

export function buildIssueLabelFilter({
  teamId,
  name,
}: {
  teamId?: string;
  name?: string;
}) {
  const filter: Record<string, any> = {
    ...buildIdFilter({ team: teamId }),
  };

  if (name) {
    filter.name = { eqIgnoreCase: name };
  }

  return filter;
}
