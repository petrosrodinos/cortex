import { BadRequestException, Injectable } from '@nestjs/common';
import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import type { DocxGenerateParams } from './docx.types';

@Injectable()
export class DocxGeneratorService {
  async generateBuffer(params: DocxGenerateParams): Promise<Buffer> {
    const title = params.title?.trim();
    if (!title) {
      throw new BadRequestException('Document title is required');
    }

    if (!params.sections?.length) {
      throw new BadRequestException('At least one section is required');
    }

    const children: (Paragraph | Table)[] = [
      new Paragraph({
        text: title,
        heading: HeadingLevel.TITLE,
      }),
    ];

    for (const section of params.sections) {
      if (section.heading?.trim()) {
        children.push(
          new Paragraph({
            text: section.heading.trim(),
            heading: HeadingLevel.HEADING_1,
          }),
        );
      }

      const bodyLines = section.body.split('\n');
      for (const line of bodyLines) {
        const trimmed = line.trim();
        if (!trimmed) {
          continue;
        }

        children.push(
          new Paragraph({
            children: [new TextRun(trimmed)],
          }),
        );
      }
    }

    for (const table of params.tables ?? []) {
      if (!table.headers?.length) {
        continue;
      }

      const headerRow = new TableRow({
        children: table.headers.map(
          (header) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: header, bold: true })],
                }),
              ],
              width: {
                size: Math.floor(100 / table.headers.length),
                type: WidthType.PERCENTAGE,
              },
            }),
        ),
      });

      const dataRows = table.rows.map(
        (row) =>
          new TableRow({
            children: table.headers.map((_, index) => {
              const value = row[index];
              return new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun(value == null ? '' : String(value))],
                  }),
                ],
              });
            }),
          }),
      );

      children.push(new Table({ rows: [headerRow, ...dataRows] }));
    }

    const doc = new Document({
      sections: [{ children }],
    });

    return Buffer.from(await Packer.toBuffer(doc));
  }
}
