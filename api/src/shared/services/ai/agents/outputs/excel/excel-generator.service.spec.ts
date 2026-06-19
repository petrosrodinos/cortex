import { BadRequestException } from '@nestjs/common';
import ExcelJS = require('exceljs');
import { ExcelGeneratorService } from './excel-generator.service';

describe('ExcelGeneratorService', () => {
  const service = new ExcelGeneratorService({} as any);

  it('generates a readable workbook from structured rows', async () => {
    const buffer = await service.generateBuffer({
      sheets: [
        {
          name: 'Members',
          headers: ['Name', 'Email', 'Role', 'Joined On'],
          rows: [
            ['Petros Rodinos', 'petros.rodinos@yahoo.com', 'Employee', 'June 18, 2026'],
            ['Petros1 Petros2', 'petros1petros2@gmail.com', 'Employee', 'June 18, 2026'],
            ['You (Owner)', 'petros@gmail.com', 'Owner', 'June 17, 2026'],
          ],
        },
      ],
    });

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as unknown as Parameters<typeof workbook.xlsx.load>[0]);
    const worksheet = workbook.getWorksheet('Members');

    expect(worksheet).toBeDefined();
    expect(worksheet?.getCell('A1').value).toBe('Name');
    expect(worksheet?.getCell('B2').value).toBe('petros.rodinos@yahoo.com');
    expect(worksheet?.getCell('C4').value).toBe('Owner');
  });

  it('rejects workbook input without sheets', async () => {
    await expect(service.generateBuffer({ sheets: [] })).rejects.toBeInstanceOf(BadRequestException);
  });
});
