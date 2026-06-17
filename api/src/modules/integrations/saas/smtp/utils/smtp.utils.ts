import { SMTP_SECURE_PORT } from '../config/smtp.config';
import { SmtpActionResult, SmtpConfig } from '../interfaces/smtp.interfaces';

export function wrapResult<T>(data: T): SmtpActionResult<T> {
  return { success: true, data };
}

export function buildTransport(nodemailer: any, config: SmtpConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure ?? config.port === SMTP_SECURE_PORT,
    auth: config.user || config.password ? { user: config.user, pass: config.password } : undefined,
  });
}
