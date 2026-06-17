import { OutputType } from 'generated/prisma';

export interface OutputDetectionResult {
  outputType: OutputType;
  files: string[];
}

export function detectOutputType(userMessage: string, assistantContent: string, toolResults: unknown[]): OutputDetectionResult {
  const combined = `${userMessage}\n${assistantContent}`.toLowerCase();
  const files: string[] = [];

  for (const result of toolResults) {
    if (result && typeof result === 'object') {
      const record = result as Record<string, unknown>;
      if (typeof record.filename === 'string') {
        files.push(record.filename);
      }
      if (typeof record.file_url === 'string') {
        files.push(record.file_url);
      }
    }
  }

  if (combined.includes('excel') || combined.includes('.xlsx') || combined.includes('spreadsheet')) {
    return { outputType: OutputType.FILE_EXCEL, files };
  }

  if (combined.includes('pdf') || combined.includes('.pdf')) {
    return { outputType: OutputType.FILE_PDF, files };
  }

  if (combined.includes('word') || combined.includes('.docx')) {
    return { outputType: OutputType.FILE_WORD, files };
  }

  if (combined.includes('chart') || combined.includes('graph') || combined.includes('plot')) {
    return { outputType: OutputType.CHART, files };
  }

  if (combined.includes('table') || combined.includes('tabular')) {
    return { outputType: OutputType.TABLE, files };
  }

  if (combined.includes('widget') || combined.includes('dashboard card')) {
    return { outputType: OutputType.WIDGET, files };
  }

  return { outputType: OutputType.TEXT, files };
}
