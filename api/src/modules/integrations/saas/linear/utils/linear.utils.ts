import { LinearActionResult } from '../interfaces/linear.interfaces';

export function wrapResult<T>(data: T): LinearActionResult<T> {
  return { success: true, data };
}

export function buildIdFilter(fields: Record<string, string | undefined>): Record<string, any> {
  const filter: Record<string, any> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) filter[key] = { id: { eq: value } };
  }
  return filter;
}
