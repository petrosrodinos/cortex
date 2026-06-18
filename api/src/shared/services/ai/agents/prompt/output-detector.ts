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

function extractToolPayload(record: Record<string, unknown>): Record<string, unknown> {
  if (record.output && typeof record.output === 'object') {
    return record.output as Record<string, unknown>;
  }

  return record;
}

export function detectOutputType(userMessage: string, assistantContent: string, toolResults: unknown[]): OutputDetectionResult {
  const combined = `${userMessage}\n${assistantContent}`.toLowerCase();
  const files: string[] = [];
  let usedCodeInterpreter = false;
  let readUploadedDocument = false;
  let imageFileUrl: string | null = null;

  for (const result of toolResults) {
    if (result && typeof result === 'object') {
      const record = result as Record<string, unknown>;
      const toolName = typeof record.toolName === 'string' ? record.toolName : undefined;
      const payload = extractToolPayload(record);

      if (toolName === 'output__create_image' && typeof payload.file_url === 'string' && !imageFileUrl) {
        imageFileUrl = payload.file_url;
      }

      if (typeof payload.filename === 'string' && typeof payload.file_url === 'string') {
        files.push(payload.file_url);
      } else if (typeof payload.filename === 'string') {
        files.push(payload.filename);
      }

      if (typeof payload.file_url === 'string' && !files.includes(payload.file_url)) {
        files.push(payload.file_url);
      }

      if (Array.isArray(payload.files)) {
        files.push(...payload.files.filter((entry): entry is string => typeof entry === 'string'));
      }

      if ('stdout' in payload || 'stderr' in payload) {
        usedCodeInterpreter = true;
      }

      if ('content' in payload && typeof payload.content === 'string') {
        readUploadedDocument = true;
      }
    }
  }

  const uniqueFiles = imageFileUrl ? [imageFileUrl] : [...new Set(files)];

  if (imageFileUrl) {
    return { outputType: OutputType.CHART, files: uniqueFiles };
  }

  if ((isDocumentAnalysisRequest(userMessage) || readUploadedDocument) && usedCodeInterpreter && uniqueFiles.length === 0) {
    return { outputType: OutputType.TEXT, files: uniqueFiles };
  }

  if (readUploadedDocument && isDocumentAnalysisRequest(userMessage)) {
    return { outputType: OutputType.TEXT, files: uniqueFiles };
  }

  if (combined.includes('excel') || combined.includes('.xlsx') || combined.includes('spreadsheet')) {
    if (isDocumentAnalysisRequest(userMessage)) {
      return { outputType: OutputType.TEXT, files: uniqueFiles };
    }
    return { outputType: OutputType.FILE_EXCEL, files: uniqueFiles };
  }

  if (combined.includes('pdf') || combined.includes('.pdf')) {
    if (isDocumentAnalysisRequest(userMessage)) {
      return { outputType: OutputType.TEXT, files: uniqueFiles };
    }
    return { outputType: OutputType.FILE_PDF, files: uniqueFiles };
  }

  if (combined.includes('word') || combined.includes('.docx')) {
    if (isDocumentAnalysisRequest(userMessage)) {
      return { outputType: OutputType.TEXT, files: uniqueFiles };
    }
    return { outputType: OutputType.FILE_WORD, files: uniqueFiles };
  }

  if (combined.includes('chart') || combined.includes('graph') || combined.includes('plot')) {
    return { outputType: OutputType.CHART, files: uniqueFiles };
  }

  if (combined.includes('table') || combined.includes('tabular')) {
    return { outputType: OutputType.TABLE, files: uniqueFiles };
  }

  if (combined.includes('widget') || combined.includes('dashboard card')) {
    return { outputType: OutputType.WIDGET, files: uniqueFiles };
  }

  if (
    (combined.includes('image') ||
      combined.includes('portrait') ||
      combined.includes('illustration') ||
      combined.includes('.png') ||
      combined.includes('.jpg') ||
      combined.includes('.jpeg')) &&
    uniqueFiles.length > 0
  ) {
    return { outputType: OutputType.CHART, files: uniqueFiles };
  }

  return { outputType: OutputType.TEXT, files: uniqueFiles };
}
