import { TAGS_TO_BALANCE, WIDGET_RUNTIME_HELPERS } from './widget-document.constants';

export function escapeWidgetHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function closeOpenWidgetTags(html: string): string {
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

export function wrapWidgetBodyHtml(html: string): string {
  return `<div id="widget-root">${closeOpenWidgetTags(html)}</div>`;
}

export function wrapWidgetUserScript(js: string): string {
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

export function buildWidgetScriptBlock(js: string, data?: unknown): string {
  const parts: string[] = [];

  if (data !== undefined) {
    parts.push(`const WIDGET_DATA = ${JSON.stringify(data)};`);
    parts.push(WIDGET_RUNTIME_HELPERS);
  }

  if (js) {
    parts.push(wrapWidgetUserScript(js));
  }

  return parts.length > 0 ? `<script>${parts.join('\n')}</script>` : '';
}
