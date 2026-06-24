import { BadRequestException } from '@nestjs/common';
import { parseExpression } from 'cron-parser';

export function validateCronExpression(expression: string): void {
  const trimmed = expression.trim();
  const parts = trimmed.split(/\s+/);

  if (parts.length !== 5) {
    throw new BadRequestException(
      'Cron expression must have exactly 5 fields (minute hour day month weekday)',
    );
  }

  try {
    parseExpression(trimmed);
  } catch {
    throw new BadRequestException('Invalid cron expression');
  }
}

export function computeNextRunAt(expression: string, from = new Date()): Date {
  validateCronExpression(expression);
  const interval = parseExpression(expression.trim(), { currentDate: from });
  return interval.next().toDate();
}

export function agentRepeatableJobId(uuid: string): string {
  return `agent-${uuid}`;
}

export function legacyAgentRepeatableJobId(uuid: string): string {
  return `scheduled-agent-${uuid}`;
}
