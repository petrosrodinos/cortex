export function toJsonValue<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (key, val) => {
      if (key.startsWith('_')) {
        return undefined;
      }

      if (typeof val === 'function' || typeof val === 'symbol') {
        return undefined;
      }

      if (typeof val === 'bigint') {
        return val.toString();
      }

      return val;
    }),
  ) as T;
}
