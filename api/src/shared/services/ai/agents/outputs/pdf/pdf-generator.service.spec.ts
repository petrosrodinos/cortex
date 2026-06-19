import { BadRequestException } from '@nestjs/common';
import { PdfGeneratorService } from './pdf-generator.service';

describe('PdfGeneratorService', () => {
  const service = new PdfGeneratorService({} as any);

  it('generates a valid PDF buffer from structured content', async () => {
    const buffer = await service.generateBuffer({
      title: 'Organization Members',
      sections: [{ heading: 'Active Members', body: 'Current active organization members.' }],
      tables: [
        {
          headers: ['Name', 'Email', 'Role'],
          rows: [
            ['Petros Rodinos', 'petros.rodinos@yahoo.com', 'Employee'],
            ['Petros1 Petros2', 'petros1petros2@gmail.com', 'Employee'],
          ],
        },
      ],
    });

    expect(buffer.length).toBeGreaterThan(0);
    expect(buffer.subarray(0, 5).toString()).toBe('%PDF-');
  });

  it('rejects empty document input', async () => {
    await expect(
      service.generateBuffer({
        title: '',
        sections: [],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
