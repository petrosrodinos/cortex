import { useState } from 'react';
import { cn } from '@/lib/utils';

type ScheduleMode = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'advanced';

interface CronState {
  mode: ScheduleMode;
  hour: number;
  minute: number;
  weekdays: number[];
  dayOfMonth: number;
  advancedCron: string;
}

const VALID_MINUTES = [0, 15, 30, 45];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const WEEKDAYS = [
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
  { label: 'Sun', value: 0 },
];

const WEEKDAY_ORDER = WEEKDAYS.map((w) => w.value);

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function ordinal(n: number): string {
  if (n >= 11 && n <= 13) return 'th';
  switch (n % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

function expandWeekdays(dow: string): number[] {
  const result: number[] = [];
  for (const part of dow.split(',')) {
    if (part.includes('-')) {
      const [from, to] = part.split('-').map(Number);
      for (let i = from; i <= to; i++) result.push(i);
    } else {
      const n = Number(part);
      if (!isNaN(n)) result.push(n);
    }
  }
  return result;
}

function parseCron(cron: string): CronState {
  const fallback: CronState = {
    mode: 'advanced',
    hour: 9,
    minute: 0,
    weekdays: [1],
    dayOfMonth: 1,
    advancedCron: cron,
  };

  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return fallback;

  const [minStr, hourStr, domStr, monthStr, dowStr] = parts;

  // Hourly: 0 * * * *
  if (minStr !== '*' && hourStr === '*' && domStr === '*' && monthStr === '*' && dowStr === '*') {
    return { ...fallback, mode: 'hourly', advancedCron: cron };
  }

  const h = parseInt(hourStr, 10);
  const m = parseInt(minStr, 10);

  if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) return fallback;
  if (!VALID_MINUTES.includes(m)) return fallback;

  // Daily: M H * * *
  if (domStr === '*' && monthStr === '*' && dowStr === '*') {
    return { ...fallback, mode: 'daily', hour: h, minute: m };
  }

  // Weekly: M H * * DOW
  if (domStr === '*' && monthStr === '*' && dowStr !== '*') {
    const weekdays = expandWeekdays(dowStr);
    if (weekdays.length === 0) return fallback;
    return { ...fallback, mode: 'weekly', hour: h, minute: m, weekdays };
  }

  // Monthly: M H DOM * *
  if (domStr !== '*' && monthStr === '*' && dowStr === '*') {
    const d = parseInt(domStr, 10);
    if (isNaN(d) || d < 1 || d > 31) return fallback;
    return { ...fallback, mode: 'monthly', hour: h, minute: m, dayOfMonth: d };
  }

  return fallback;
}

function buildCron(state: CronState): string {
  switch (state.mode) {
    case 'hourly':
      return '0 * * * *';
    case 'daily':
      return `${state.minute} ${state.hour} * * *`;
    case 'weekly': {
      const days = state.weekdays.length > 0
        ? [...state.weekdays].sort((a, b) => WEEKDAY_ORDER.indexOf(a) - WEEKDAY_ORDER.indexOf(b)).join(',')
        : '1';
      return `${state.minute} ${state.hour} * * ${days}`;
    }
    case 'monthly':
      return `${state.minute} ${state.hour} ${state.dayOfMonth} * *`;
    case 'advanced':
      return state.advancedCron;
  }
}

function humanSummary(state: CronState): string {
  switch (state.mode) {
    case 'hourly':
      return 'Runs at the top of every hour';
    case 'daily':
      return `Runs daily at ${pad(state.hour)}:${pad(state.minute)}`;
    case 'weekly': {
      if (state.weekdays.length === 0) return 'No days selected';
      const labels = [...state.weekdays]
        .sort((a, b) => WEEKDAY_ORDER.indexOf(a) - WEEKDAY_ORDER.indexOf(b))
        .map((d) => WEEKDAYS.find((w) => w.value === d)?.label ?? String(d))
        .join(', ');
      return `Runs every ${labels} at ${pad(state.hour)}:${pad(state.minute)}`;
    }
    case 'monthly':
      return `Runs on the ${state.dayOfMonth}${ordinal(state.dayOfMonth)} of each month at ${pad(state.hour)}:${pad(state.minute)}`;
    case 'advanced':
      return '';
  }
}

const MODES: { key: ScheduleMode; label: string }[] = [
  { key: 'hourly', label: 'Hourly' },
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'advanced', label: 'Advanced' },
];

interface CronScheduleBuilderProps {
  defaultValue: string;
  onChange: (cron: string) => void;
}

export function CronScheduleBuilder({ defaultValue, onChange }: CronScheduleBuilderProps) {
  const [state, setState] = useState<CronState>(() => parseCron(defaultValue));

  const update = (patch: Partial<CronState>) => {
    const next = { ...state, ...patch };
    setState(next);
    onChange(buildCron(next));
  };

  const showTimePicker = state.mode === 'daily' || state.mode === 'weekly' || state.mode === 'monthly';
  const summary = humanSummary(state);

  return (
    <div className="grid gap-3 rounded-lg border border-border p-3">
      {/* Frequency pills */}
      <div className="flex flex-wrap gap-1.5">
        {MODES.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => update({ mode: key })}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              state.mode === key
                ? 'border-accent bg-accent text-accent-foreground'
                : 'border-border text-muted hover:border-foreground/30 hover:text-foreground',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Time picker */}
      {showTimePicker && (
        <div className="flex items-center gap-2">
          <span className="w-14 shrink-0 text-xs text-muted">Time</span>
          <select
            value={state.hour}
            onChange={(e) => update({ hour: parseInt(e.target.value, 10) })}
            className="h-8 rounded-md border border-border bg-surface px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {HOURS.map((h) => (
              <option key={h} value={h}>{pad(h)}</option>
            ))}
          </select>
          <span className="text-muted">:</span>
          <select
            value={state.minute}
            onChange={(e) => update({ minute: parseInt(e.target.value, 10) })}
            className="h-8 rounded-md border border-border bg-surface px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {VALID_MINUTES.map((m) => (
              <option key={m} value={m}>{pad(m)}</option>
            ))}
          </select>
        </div>
      )}

      {/* Weekday picker */}
      {state.mode === 'weekly' && (
        <div className="flex items-start gap-2">
          <span className="mt-1.5 w-14 shrink-0 text-xs text-muted">Days</span>
          <div className="flex flex-wrap gap-1">
            {WEEKDAYS.map(({ label, value }) => {
              const selected = state.weekdays.includes(value);
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    const next = selected
                      ? state.weekdays.filter((d) => d !== value)
                      : [...state.weekdays, value];
                    update({ weekdays: next.length > 0 ? next : [value] });
                  }}
                  className={cn(
                    'h-8 w-10 rounded-md text-xs font-medium transition-colors',
                    selected
                      ? 'bg-accent text-accent-foreground'
                      : 'border border-border text-muted hover:border-foreground/30 hover:text-foreground',
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Day of month */}
      {state.mode === 'monthly' && (
        <div className="flex items-center gap-2">
          <span className="w-14 shrink-0 text-xs text-muted">Day</span>
          <input
            type="number"
            min={1}
            max={31}
            value={state.dayOfMonth}
            onChange={(e) => {
              const d = parseInt(e.target.value, 10);
              if (!isNaN(d) && d >= 1 && d <= 31) update({ dayOfMonth: d });
            }}
            className="h-8 w-16 rounded-md border border-border bg-surface px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <span className="text-xs text-muted">of the month</span>
        </div>
      )}

      {/* Advanced expression */}
      {state.mode === 'advanced' && (
        <div className="grid gap-1.5">
          <input
            value={state.advancedCron}
            onChange={(e) => update({ advancedCron: e.target.value })}
            placeholder="0 9 * * *"
            className="h-9 w-full rounded-md border border-border bg-surface px-3 font-mono text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <span className="text-xs text-muted">minute · hour · day · month · weekday</span>
        </div>
      )}

      {/* Human summary */}
      {summary && (
        <p className="text-xs text-muted">{summary}</p>
      )}
    </div>
  );
}
