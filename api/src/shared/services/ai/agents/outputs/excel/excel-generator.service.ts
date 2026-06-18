import { BadRequestException, Injectable } from '@nestjs/common';
import { DocumentType } from 'generated/prisma';
import ExcelJS from 'exceljs';
import { DocumentOutputService } from '../shared/document-output.service';
import type { GeneratedFileResult } from '../shared/generated-file.types';
import type { ExcelGenerateParams } from './excel.types';

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const MAX_SHEET_NAME_LENGTH = 31;

@Injectable()
export class ExcelGeneratorService {
  constructor(private readonly documentOutput: DocumentOutputService) {}

  async generate(
    organizationUuid: string,
    userUuid: string,
    params: ExcelGenerateParams,
  ): Promise<GeneratedFileResult> {
    const buffer = await this.generateBuffer(params);

    return this.documentOutput.persist(
      organizationUuid,
      userUuid,
      buffer,
      'xlsx',
      XLSX_MIME,
      DocumentType.DOCUMENT,
    );
  }

  async generateBuffer(params: ExcelGenerateParams): Promise<Buffer> {
    if (!params.sheets?.length) {
      throw new BadRequestException('At least one sheet is required');
    }

    const workbook = new ExcelJS.Workbook();

    params.sheets.forEach((sheet, index) => {
      if (!sheet.headers?.length) {
        throw new BadRequestException(`Sheet ${index + 1} must include headers`);
      }

      const sheetName = this.normalizeSheetName(sheet.name, index);
      const worksheet = workbook.addWorksheet(sheetName);

      worksheet.addRow(sheet.headers);
      worksheet.getRow(1).font = { bold: true };

      for (const row of sheet.rows ?? []) {
        worksheet.addRow(row);
      }

      worksheet.columns.forEach((column) => {
        let maxLength = sheet.headers[column.number! - 1]?.length ?? 10;

        column.eachCell?.({ includeEmpty: true }, (cell) => {
          const value = cell.value == null ? '' : String(cell.value);
          if (value.length > maxLength) {
            maxLength = value.length;
          }
        });

        column.width = Math.min(maxLength + 2, 50);
      });
    });

    const arrayBuffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(arrayBuffer);
  }

  private normalizeSheetName(name: string | undefined, index: number): string {
    const fallback = `Sheet${index + 1}`;
    const trimmed = (name?.trim() || fallback).replace(/[\\/?*[\]:]/g, '').slice(0, MAX_SHEET_NAME_LENGTH);
    return trimmed || fallback;
  }
}
