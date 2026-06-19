import { BadRequestException, Injectable } from '@nestjs/common';
import { DocumentType } from 'generated/prisma';
import { DocumentOutputService } from '../shared/document-output.service';
import type { GeneratedFileResult } from '../shared/generated-file.types';
import { WIDGET_MAX_TOTAL_BYTES, type WidgetGenerateParams } from './widget.types';

const WIDGET_MIME = 'text/html';
const EXTERNAL_SCRIPT_PATTERN = /<script\b[^>]*\ssrc\s*=\s*["'][^"']+["'][^>]*>/gi;

const WIDGET_FONT_LINKS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`;

const TAGS_TO_BALANCE = ['tbody', 'table', 'thead', 'tfoot', 'div', 'section', 'main', 'ul', 'ol'] as const;

const WIDGET_RUNTIME_HELPERS = `
function widgetRecords() {
  if (Array.isArray(WIDGET_DATA)) return WIDGET_DATA;
  if (WIDGET_DATA && typeof WIDGET_DATA === 'object') {
    for (const value of Object.values(WIDGET_DATA)) {
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') return value;
    }
  }
  return [];
}
function renderTableRows(tbodySelector, records, buildRow) {
  const tbody = document.querySelector(tbodySelector);
  if (!tbody || !Array.isArray(records)) return;
  tbody.replaceChildren();
  records.forEach((record, index) => {
    const row = buildRow(record, index);
    if (row) tbody.appendChild(row);
  });
}
function formatWidgetCurrency(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? '$' + amount.toFixed(2) : '$0.00';
}
function formatWidgetDate(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toISOString().slice(0, 10);
}
`.trim();

const WIDGET_BASE_CSS = `:root {
  color-scheme: light;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
*, *::before, *::after {
  box-sizing: border-box;
}
body {
  margin: 0;
  padding: 16px;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 400;
  color: #0f172a;
  background: #ffffff;
}
button, input, select, textarea {
  font: inherit;
}
h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.25;
  margin: 0 0 0.5em;
}
.card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
}
.metric-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}
.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}
.metric-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
input[type="range"] {
  width: 100%;
  accent-color: #2563eb;
}
`;

@Injectable()
export class WidgetGeneratorService {
  constructor(private readonly documentOutput: DocumentOutputService) {}

  async generate(
    organizationUuid: string,
    userUuid: string,
    params: WidgetGenerateParams,
  ): Promise<GeneratedFileResult> {
    const htmlBuffer = this.buildDocumentBuffer(params);

    return this.documentOutput.persist(
      organizationUuid,
      userUuid,
      htmlBuffer,
      'html',
      WIDGET_MIME,
      DocumentType.WIDGET,
    );
  }

  buildDocument(params: WidgetGenerateParams): string {
    const html = params.html?.trim();
    if (!html) {
      throw new BadRequestException('Widget html is required');
    }

    const css = params.css?.trim() ?? '';
    const js = params.js?.trim() ?? '';
    const title = params.title?.trim() || 'Widget';
    const dataJson = params.data !== undefined ? JSON.stringify(params.data) : '';

    this.assertWithinSizeLimit(html, css, js, dataJson);
    this.assertNoExternalScripts(html, css, js);

    const styleBlock = `<style>${WIDGET_BASE_CSS}${css ? `\n${css}` : ''}</style>`;
    const scriptBlock = this.buildScriptBlock(js, params.data);
    const bodyHtml = this.wrapBodyHtml(html);

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${this.escapeHtml(title)}</title>
${WIDGET_FONT_LINKS}
${styleBlock}
</head>
<body>
${bodyHtml}
${scriptBlock}
</body>
</html>`;
  }

  buildDocumentBuffer(params: WidgetGenerateParams): Buffer {
    return Buffer.from(this.buildDocument(params), 'utf-8');
  }

  private buildScriptBlock(js: string, data?: unknown): string {
    const parts: string[] = [];

    if (data !== undefined) {
      parts.push(`const WIDGET_DATA = ${JSON.stringify(data)};`);
      parts.push(WIDGET_RUNTIME_HELPERS);
    }

    if (js) {
      parts.push(this.wrapUserScript(js));
    }

    return parts.length > 0 ? `<script>${parts.join('\n')}</script>` : '';
  }

  private wrapBodyHtml(html: string): string {
    return `<div id="widget-root">${this.closeOpenTags(html)}</div>`;
  }

  private closeOpenTags(html: string): string {
    let result = html;

    for (const tag of TAGS_TO_BALANCE) {
      const opens = (result.match(new RegExp(`<${tag}(\\s|>|/)`, 'gi')) ?? []).length;
      const closes = (result.match(new RegExp(`</${tag}>`, 'gi')) ?? []).length;
      const diff = opens - closes;

      if (diff > 0) {
        result += `</${tag}>`.repeat(diff);
      }
    }

    return result;
  }

  private wrapUserScript(js: string): string {
    return `(function runWidget() {
  function init() {
${js}
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();`;
  }

  private assertWithinSizeLimit(html: string, css: string, js: string, dataJson = ''): void {
    const totalBytes = Buffer.byteLength(html + css + js + dataJson, 'utf-8');
    if (totalBytes > WIDGET_MAX_TOTAL_BYTES) {
      throw new BadRequestException(
        `Widget content exceeds maximum size of ${WIDGET_MAX_TOTAL_BYTES} bytes`,
      );
    }
  }

  private assertNoExternalScripts(html: string, css: string, js: string): void {
    const combined = `${html}\n${css}\n${js}`;
    if (EXTERNAL_SCRIPT_PATTERN.test(combined)) {
      throw new BadRequestException('External script sources are not allowed in widgets');
    }
    EXTERNAL_SCRIPT_PATTERN.lastIndex = 0;
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
