import { BadRequestException } from '@nestjs/common';
import { WIDGET_MAX_TOTAL_BYTES } from '../widget.types';
import { EXTERNAL_SCRIPT_PATTERN } from './widget-document.constants';

export function assertWidgetWithinSizeLimit(
  html: string,
  css: string,
  js: string,
  dataJson = '',
): void {
  const totalBytes = Buffer.byteLength(html + css + js + dataJson, 'utf-8');
  if (totalBytes > WIDGET_MAX_TOTAL_BYTES) {
    throw new BadRequestException(
      `Widget content exceeds maximum size of ${WIDGET_MAX_TOTAL_BYTES} bytes`,
    );
  }
}

export function assertWidgetHasNoExternalScripts(html: string, css: string, js: string): void {
  const combined = `${html}\n${css}\n${js}`;
  if (EXTERNAL_SCRIPT_PATTERN.test(combined)) {
    throw new BadRequestException('External script sources are not allowed in widgets');
  }
  EXTERNAL_SCRIPT_PATTERN.lastIndex = 0;
}
