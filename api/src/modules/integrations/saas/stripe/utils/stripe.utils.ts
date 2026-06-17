import { StripeActionResult } from '../interfaces/stripe.interfaces';

export function wrapResult<T>(data: T): StripeActionResult<T> {
  return { success: true, data };
}
