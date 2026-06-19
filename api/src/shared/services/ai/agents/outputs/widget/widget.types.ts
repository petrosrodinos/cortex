export interface WidgetGenerateParams {
  html: string;
  css?: string;
  js?: string;
  title?: string;
  data?: unknown;
}

export const WIDGET_MAX_TOTAL_BYTES = 512 * 1024;
