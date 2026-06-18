import { Resend } from 'resend';
import { ResendActionResult } from '../interfaces/resend.interfaces';

export function wrapResult<T>(data: T): ResendActionResult<T> {
  return { success: true, data };
}

export function createResendClient(apiKey: string) {
  return new Resend(apiKey);
}

export async function verifyResendApiKey(apiKey: string): Promise<boolean> {
  const client = createResendClient(apiKey);
  const { error } = await client.domains.list();
  return !error;
}
