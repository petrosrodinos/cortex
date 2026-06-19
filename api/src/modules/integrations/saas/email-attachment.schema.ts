import { z } from 'zod';

function normalizeBase64(value: string) {
  return value.replace(/\s/g, '');
}

function isBase64(value: string) {
  if (!value || value.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(value)) {
    return false;
  }

  return Buffer.from(value, 'base64').length > 0;
}

export const emailAttachmentSchema = z.object({
  filename: z.string().min(1),
  content: z.string().transform(normalizeBase64).refine(isBase64, 'Attachment content must be valid base64'),
  encoding: z.literal('base64').optional(),
  contentType: z.string().optional(),
});
