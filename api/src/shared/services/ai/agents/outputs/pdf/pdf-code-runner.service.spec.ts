import { BadRequestException } from '@nestjs/common';
import { PdfCodeRunnerService } from './pdf-code-runner.service';

describe('PdfCodeRunnerService', () => {
  const service = new PdfCodeRunnerService();

  const sampleCode = `
h.drawCover(doc, { title: 'Organization Members', subtitle: 'Active Directory' });
h.drawSectionHeading(doc, 'Executive Summary');
h.drawBody(doc, 'Current active organization members.\\n• Two employees listed\\n• All roles are Employee');
h.drawSectionHeading(doc, 'Member List');
h.drawTable(doc, ['Name', 'Email', 'Role'], [
  ['Petros Rodinos', 'petros.rodinos@yahoo.com', 'Employee'],
  ['Petros1 Petros2', 'petros1petros2@gmail.com', 'Employee'],
]);
`;

  it('executes valid helper-based code and returns a PDF buffer', async () => {
    const buffer = await service.execute(sampleCode, 'Organization Members');

    expect(buffer.length).toBeGreaterThan(0);
    expect(buffer.subarray(0, 5).toString()).toBe('%PDF-');
  });

  it('rejects code with syntax errors', async () => {
    await expect(service.execute('h.drawCover(doc, { title: ', 'Bad PDF')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects blocked patterns before execution', async () => {
    await expect(service.execute("require('fs')", 'Bad PDF')).rejects.toThrow('require() is not allowed');
  });
});
