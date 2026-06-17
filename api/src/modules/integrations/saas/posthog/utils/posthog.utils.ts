import { PostHogActionResult } from '../interfaces/posthog.interfaces';

export function wrapResult<T>(data: T): PostHogActionResult<T> {
  return { success: true, data };
}
