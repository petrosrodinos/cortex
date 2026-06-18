import sgClient from '@sendgrid/client';
import sgMail from '@sendgrid/mail';
import { SendGridActionResult } from '../interfaces/sendgrid.interfaces';

export function wrapResult<T>(data: T): SendGridActionResult<T> {
  return { success: true, data };
}

export function configureSendGrid(apiKey: string) {
  sgMail.setApiKey(apiKey);
  sgClient.setApiKey(apiKey);
}

export async function verifySendGridApiKey(apiKey: string): Promise<boolean> {
  configureSendGrid(apiKey);
  const [, response] = await sgClient.request({ url: '/v3/user/profile', method: 'GET' });
  return response.statusCode === 200;
}
