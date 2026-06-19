import { BadRequestException, Injectable } from '@nestjs/common';
import { DocumentType } from 'generated/prisma';
import { DocumentOutputService } from '../shared/document-output.service';
import type { GeneratedFileResult } from '../shared/generated-file.types';
import { WidgetHtmlDebugService } from './widget-html-debug.service';
import type { WidgetGenerateParams } from './widget.types';
import { WIDGET_BASE_CSS, WIDGET_FONT_LINKS, WIDGET_MIME } from './utils/widget-document.constants';
import {
  buildWidgetScriptBlock,
  escapeWidgetHtml,
  wrapWidgetBodyHtml,
} from './utils/widget-document.utils';
import {
  assertWidgetHasNoExternalScripts,
  assertWidgetWithinSizeLimit,
} from './utils/widget-validation.utils';

@Injectable()
export class WidgetGeneratorService {
  constructor(
    private readonly documentOutput: DocumentOutputService,
    private readonly widgetHtmlDebug: WidgetHtmlDebugService,
  ) {}

  async generate(
    organizationUuid: string,
    userUuid: string,
    params: WidgetGenerateParams,
  ): Promise<GeneratedFileResult> {
    const document = this.buildDocument(params);
    const validatedDocument = await this.widgetHtmlDebug.fixHtml(organizationUuid, document);
    const htmlBuffer = Buffer.from(validatedDocument, 'utf-8');

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

    assertWidgetWithinSizeLimit(html, css, js, dataJson);
    assertWidgetHasNoExternalScripts(html, css, js);

    const styleBlock = `<style>${WIDGET_BASE_CSS}${css ? `\n${css}` : ''}</style>`;
    const scriptBlock = buildWidgetScriptBlock(js, params.data);
    const bodyHtml = wrapWidgetBodyHtml(html);

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeWidgetHtml(title)}</title>
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
}
