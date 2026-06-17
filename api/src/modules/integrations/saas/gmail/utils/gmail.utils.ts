import { GmailActionResult, SendMessageInput } from '../interfaces/gmail.interfaces';

export function extractData<T>(response: { data: T }): GmailActionResult<T> {
  return { success: true, data: response.data };
}

export function deletedResult(message: string): GmailActionResult<{ message: string }> {
  return { success: true, data: { message } };
}

export function encodeEmail(input: SendMessageInput): string {
  const headers = [
    `To: ${input.to}`,
    input.cc ? `Cc: ${input.cc}` : null,
    input.bcc ? `Bcc: ${input.bcc}` : null,
    input.replyTo ? `Reply-To: ${input.replyTo}` : null,
    input.inReplyTo ? `In-Reply-To: ${input.inReplyTo}` : null,
    input.references ? `References: ${input.references}` : null,
    `Subject: ${input.subject}`,
    'Content-Type: text/plain; charset=utf-8',
    '',
    input.body,
  ];
  return Buffer.from(headers.filter(Boolean).join('\n')).toString('base64url');
}
