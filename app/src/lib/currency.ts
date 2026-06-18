export function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

export function formatUsd(value: unknown, fractionDigits = 4) {
  return `$${toNumber(value).toFixed(fractionDigits)}`;
}

export function formatUsdCompact(value: unknown) {
  const amount = toNumber(value);

  if (amount >= 1) {
    return `$${amount.toFixed(2)}`;
  }

  return `$${amount.toFixed(4)}`;
}
