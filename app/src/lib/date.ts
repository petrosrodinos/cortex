import { parseDate } from '@internationalized/date';
import type { DateValue } from '@internationalized/date';

export function parseIsoDate(value?: string): DateValue | null {
  if (!value) {
    return null;
  }

  try {
    return parseDate(value);
  } catch {
    return null;
  }
}

export function formatIsoDate(value: DateValue | null): string {
  return value ? value.toString() : '';
}
