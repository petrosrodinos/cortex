import { BadRequestException } from '@nestjs/common';
import { PDF_MAX_CODE_BYTES } from '../pdf.types';

const BLOCKED_PATTERNS: Array<{ pattern: RegExp; message: string }> = [
  { pattern: /\brequire\s*\(/, message: 'require() is not allowed in PDF code' },
  { pattern: /\bimport\s+/, message: 'import is not allowed in PDF code' },
  { pattern: /\beval\s*\(/, message: 'eval() is not allowed in PDF code' },
  { pattern: /\bFunction\s*\(/, message: 'Function() is not allowed in PDF code' },
  { pattern: /\bprocess\./, message: 'process access is not allowed in PDF code' },
  { pattern: /\bchild_process\b/, message: 'child_process is not allowed in PDF code' },
  { pattern: /\bfs\./, message: 'fs access is not allowed in PDF code' },
  { pattern: /\b__dirname\b/, message: '__dirname is not allowed in PDF code' },
  { pattern: /\b__filename\b/, message: '__filename is not allowed in PDF code' },
  { pattern: /\bfetch\s*\(/, message: 'fetch() is not allowed in PDF code' },
  { pattern: /\bdoc\.end\s*\(/, message: 'doc.end() must not be called in PDF code' },
  { pattern: /\bwhile\s*\(\s*true\s*\)/, message: 'infinite loops are not allowed in PDF code' },
  { pattern: /\bfor\s*\(\s*;\s*;\s*\)/, message: 'infinite loops are not allowed in PDF code' },
];

export function assertPdfCodeIsValid(code: string): void {
  const trimmed = code?.trim();
  if (!trimmed) {
    throw new BadRequestException('PDF code is required');
  }

  const byteLength = Buffer.byteLength(trimmed, 'utf8');
  if (byteLength > PDF_MAX_CODE_BYTES) {
    throw new BadRequestException(`PDF code exceeds maximum size of ${PDF_MAX_CODE_BYTES} bytes`);
  }

  for (const { pattern, message } of BLOCKED_PATTERNS) {
    if (pattern.test(trimmed)) {
      throw new BadRequestException(message);
    }
  }
}

export function stripPdfCodeFences(value: string): string {
  const fenceMatch = value.match(/^```(?:javascript|js)?\s*([\s\S]*?)\s*```$/i);
  return fenceMatch ? fenceMatch[1].trim() : value.trim();
}

export function normalizePdfCodeResponse(raw: string): string | null {
  const stripped = stripPdfCodeFences(raw.trim());
  if (!stripped) {
    return null;
  }

  if (stripped.includes('async function') || stripped.includes('function build')) {
    const bodyMatch = stripped.match(/(?:async\s+)?function\s+\w+\s*\([^)]*\)\s*\{([\s\S]*)\}$/);
    return bodyMatch ? bodyMatch[1].trim() : null;
  }

  return stripped;
}
