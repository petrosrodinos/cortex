import { OutputType } from 'generated/prisma';

export interface OutputDetectionResult {
  outputType: OutputType;
  files: string[];
}

const ANALYSIS_PATTERNS = [
  /\banalyz(e|ing)\b/,
  /\bsummariz(e|ing)\b/,
  /\bextract\b/,
  /\bcompare\b/,
  /\bparse\b/,
  /\bread\b/,
  /\bq&a\b/,
  /\bwhat does\b.*\bsay\b/,
  /\btables? from\b/,
];

const GENERATION_PATTERNS = [
  /\bcreate\b/,
  /\bgenerate\b/,
  /\bexport\b/,
  /\bbuild\b/,
  /\bmake\b.*\b(report|file|document|spreadsheet|pdf|excel|word)\b/,
];

function isDocumentAnalysisRequest(message: string): boolean {
  const normalized = message.toLowerCase();
  const isAnalysis = ANALYSIS_PATTERNS.some((pattern) => pattern.test(normalized));
  const isGeneration = GENERATION_PATTERNS.some((pattern) => pattern.test(normalized));
  return isAnalysis && !isGeneration;
}

export function detectOutputType(userMessage: string, assistantContent: string, toolResults: unknown[]): OutputDetectionResult {
  const combined = `${userMessage}\n${assistantContent}`.toLowerCase();
  const files: string[] = [];
  let usedCodeInterpreter = false;
  let readUploadedDocument = false;

  for (const result of toolResults) {
    if (result && typeof result === 'object') {
      const record = result as Record<string, unknown>;
      if (typeof record.filename === 'string') {
        files.push(record.filename);
      }
      if (typeof record.file_url === 'string') {
        files.push(record.file_url);
      }
      if (Array.isArray(record.files)) {
        files.push(...record.files.filter((entry): entry is string => typeof entry === 'string'));
      }
      if ('stdout' in record || 'stderr' in record) {
        usedCodeInterpreter = true;
      }
      if ('content' in record && typeof record.content === 'string') {
        readUploadedDocument = true;
      }
    }
  }

  if ((isDocumentAnalysisRequest(userMessage) || readUploadedDocument) && usedCodeInterpreter && files.length === 0) {
    return { outputType: OutputType.TEXT, files };
  }

  if (readUploadedDocument && isDocumentAnalysisRequest(userMessage)) {
    return { outputType: OutputType.TEXT, files };
  }

  if (combined.includes('excel') || combined.includes('.xlsx') || combined.includes('spreadsheet')) {
    if (isDocumentAnalysisRequest(userMessage)) {
      return { outputType: OutputType.TEXT, files };
    }
    return { outputType: OutputType.FILE_EXCEL, files };
  }

  if (combined.includes('pdf') || combined.includes('.pdf')) {
    if (isDocumentAnalysisRequest(userMessage)) {
      return { outputType: OutputType.TEXT, files };
    }
    return { outputType: OutputType.FILE_PDF, files };
  }

  if (combined.includes('word') || combined.includes('.docx')) {
    if (isDocumentAnalysisRequest(userMessage)) {
      return { outputType: OutputType.TEXT, files };
    }
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

  if (combined.includes('image') || combined.includes('.png') || combined.includes('.jpg') || combined.includes('.jpeg')) {
    return { outputType: OutputType.TEXT, files };
  }

  return { outputType: OutputType.TEXT, files };
}
