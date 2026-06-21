import { BadRequestException } from '@nestjs/common';
import { PdfGeneratorService } from './pdf-generator.service';

describe('PdfGeneratorService', () => {
  const documentOutput = {
    persist: jest.fn().mockResolvedValue({
      file_url: 'https://example.com/file.pdf',
      filename: 'generated.pdf',
      document_uuid: 'doc-uuid',
      media_type: 'application/pdf',
    }),
  };

  const pdfCodeRunner = {
    execute: jest.fn(),
  };

  const pdfCodeDebug = {
    fixCode: jest.fn(),
  };

  const service = new PdfGeneratorService(
    documentOutput as any,
    pdfCodeRunner as any,
    pdfCodeDebug as any,
  );

  const sampleCode = `
h.drawCover(doc, { title: 'Organization Members' });
h.drawTable(doc, ['Name', 'Email'], [['Alice', 'alice@example.com']]);
`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('generates and persists a valid PDF buffer', async () => {
    const buffer = Buffer.from('%PDF-1.4 sample');
    pdfCodeRunner.execute.mockResolvedValue(buffer);

    const result = await service.generate('org-uuid', 'user-uuid', {
      title: 'Organization Members',
      code: sampleCode,
    });

    expect(pdfCodeRunner.execute).toHaveBeenCalledWith(sampleCode.trim(), 'Organization Members');
    expect(documentOutput.persist).toHaveBeenCalled();
    expect(result.file_url).toBe('https://example.com/file.pdf');
  });

  it('retries with debug-fixed code after first runner failure', async () => {
    const buffer = Buffer.from('%PDF-1.4 fixed');
    pdfCodeRunner.execute
      .mockRejectedValueOnce(new BadRequestException('SyntaxError'))
      .mockResolvedValueOnce(buffer);
    pdfCodeDebug.fixCode.mockResolvedValue('h.drawCover(doc, { title: "Fixed" });');

    const result = await service.generateBuffer('org-uuid', {
      title: 'Report',
      code: 'broken code',
    });

    expect(pdfCodeDebug.fixCode).toHaveBeenCalledWith('org-uuid', 'broken code', 'SyntaxError');
    expect(pdfCodeRunner.execute).toHaveBeenCalledTimes(2);
    expect(result).toBe(buffer);
  });

  it('rejects missing title', async () => {
    await expect(
      service.generateBuffer('org-uuid', { title: '', code: sampleCode }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects missing code', async () => {
    await expect(
      service.generateBuffer('org-uuid', { title: 'Report', code: '' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
