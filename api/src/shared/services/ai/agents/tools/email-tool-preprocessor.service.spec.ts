import { EmailToolPreprocessorService } from './email-tool-preprocessor.service';

describe('EmailToolPreprocessorService', () => {
  const prisma = {
    document: {
      findMany: jest.fn(),
    },
  };
  const gcs = {
    downloadImage: jest.fn(),
  };

  let service: EmailToolPreprocessorService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new EmailToolPreprocessorService(prisma as any, gcs as any);
  });

  it('formats markdown tables into html for send_email tools', async () => {
    const result = await service.prepare('user-uuid', 'smtp__send_email', {
      to: 'petrosrodinos@gmail.com',
      subject: 'Members',
      body: '| Name | Email |\n| --- | --- |\n| Ada | ada@test.com |',
    });

    expect(result.toolName).toBe('smtp__send_email');
    expect(result.input.html).toContain('<table');
    expect(result.input.body).toContain('Ada');
  });

  it('routes attachment sends through send_email_with_attachments', async () => {
    prisma.document.findMany.mockResolvedValue([
      {
        uuid: 'doc-1',
        filename: 'members.xlsx',
        path: 'docs/members.xlsx',
        mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    ]);
    gcs.downloadImage.mockResolvedValue({ buffer: Buffer.from('excel') });

    const result = await service.prepare('user-uuid', 'smtp__send_email', {
      to: 'petrosrodinos@gmail.com',
      subject: 'Members',
      body: 'See attached',
      attachment_document_uuids: ['doc-1'],
    });

    expect(result.toolName).toBe('smtp__send_email_with_attachments');
    expect(result.input.attachments).toEqual([
      expect.objectContaining({
        filename: 'members.xlsx',
        content: Buffer.from('excel').toString('base64'),
      }),
    ]);
    expect(result.input.attachment_document_uuids).toBeUndefined();
  });
});
