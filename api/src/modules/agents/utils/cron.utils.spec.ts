import { BadRequestException } from '@nestjs/common';
import {
  computeNextRunAt,
  validateCronExpression,
} from './cron.utils';

describe('cron.utils', () => {
  it('accepts valid 5-field cron expressions', () => {
    expect(() => validateCronExpression('0 9 * * *')).not.toThrow();
    expect(() => validateCronExpression('0 9 * * 1-5')).not.toThrow();
  });

  it('rejects invalid cron expressions', () => {
    expect(() => validateCronExpression('not-a-cron')).toThrow(BadRequestException);
    expect(() => validateCronExpression('0 9 * *')).toThrow(BadRequestException);
  });

  it('computes a future next run date', () => {
    const next = computeNextRunAt('0 9 * * *');
    expect(next.getTime()).toBeGreaterThan(Date.now());
  });
});
