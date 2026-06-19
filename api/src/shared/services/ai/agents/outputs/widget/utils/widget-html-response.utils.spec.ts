import { normalizeWidgetHtmlResponse, stripWidgetHtmlCodeFences } from './widget-html-response.utils';

describe('widget-html-response.utils', () => {
  it('extracts a valid html document from fenced model output', () => {
    const fixed = '<!DOCTYPE html><html><body>fixed</body></html>';
    const normalized = normalizeWidgetHtmlResponse('```html\n' + fixed + '\n```');

    expect(normalized).toBe(fixed);
  });

  it('returns null when model output is not a full document', () => {
    expect(normalizeWidgetHtmlResponse('<div>partial</div>')).toBeNull();
  });

  it('strips code fences without html language tag', () => {
    expect(stripWidgetHtmlCodeFences('```\ncontent\n```')).toBe('content');
  });
});
