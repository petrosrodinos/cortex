import { parseDate } from '@internationalized/date';
import type { DateValue } from '@internationalized/date';
import { DateTime } from 'luxon';

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

export function formatDateTime(value: string | Date): string {
  const date =
    typeof value === 'string' ? DateTime.fromISO(value) : DateTime.fromJSDate(value);

  if (!date.isValid) {
    return '';
  }

  const now = DateTime.now();
  const diffSeconds = now.diff(date, 'seconds').seconds;

  if (diffSeconds >= 0 && diffSeconds < 60) {
    return 'just now';
  }

  if (date.hasSame(now, 'day')) {
    return date.toRelative({ base: now, round: 'floor' }) ?? '';
  }

  return date.toLocaleString(DateTime.DATE_MED);
}