import { SlackActionResult } from '../interfaces/slack.interfaces';

export function wrapResult<T>(data: T): SlackActionResult<T> {
  return { success: true, data };
}
