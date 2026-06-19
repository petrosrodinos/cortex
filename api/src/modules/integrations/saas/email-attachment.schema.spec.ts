import { emailAttachmentSchema } from './email-attachment.schema';

describe('emailAttachmentSchema', () => {
  it('accepts valid base64 attachment content', () => {
    const parsed = emailAttachmentSchema.parse({
      filename: 'members.xlsx',
      content: Buffer.from('xlsx bytes').toString('base64'),
      encoding: 'base64',
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    expect(parsed.content).toBe(Buffer.from('xlsx bytes').toString('base64'));
  });

  it('rejects non-base64 attachment content', () => {
    expect(() =>
      emailAttachmentSchema.parse({
        filename: 'members.xlsx',
        content: '涫 ừ 辜庞窷',
      }),
    ).toThrow('Attachment content must be valid base64');
  });
});
