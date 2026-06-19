import { BadRequestException } from '@nestjs/common';
import { WidgetGeneratorService } from './widget-generator.service';

describe('WidgetGeneratorService', () => {
  const widgetHtmlDebug = {
    fixHtml: jest.fn(async (_organizationUuid: string, html: string) => html),
  };

  const service = new WidgetGeneratorService({} as any, widgetHtmlDebug as any);

  it('assembles a complete HTML document from fragments', () => {
    const document = service.buildDocument({
      title: 'Sales Widget',
      html: '<div id="app">Hello</div>',
      css: 'body { font-family: sans-serif; }',
      js: 'console.log("ready");',
    });

    expect(document).toContain('<!DOCTYPE html>');
    expect(document).toContain('<title>Sales Widget</title>');
    expect(document).toContain('<div id="app">Hello</div>');
    expect(document).toContain('fonts.googleapis.com/css2?family=Inter');
    expect(document).toContain('body { font-family: sans-serif; }');
    expect(document).toContain('console.log("ready");');
  });

  it('includes modern Inter typography defaults', () => {
    const document = service.buildDocument({
      html: '<p>Hello</p>',
    });

    expect(document).toContain("font-family: Inter, ui-sans-serif");
    expect(document).toContain('-webkit-font-smoothing: antialiased');
  });

  it('injects structured data as WIDGET_DATA', () => {
    const document = service.buildDocument({
      html: '<div id="app"></div>',
      js: 'console.log(WIDGET_DATA);',
      data: { sales: [{ month: 'Jan', amount: 1200 }], growthRate: 0.08 },
    });

    expect(document).toContain('const WIDGET_DATA = {"sales":[{"month":"Jan","amount":1200}],"growthRate":0.08};');
    expect(document).toContain('console.log(WIDGET_DATA);');
  });

  it('escapes HTML in the title', () => {
    const document = service.buildDocument({
      html: '<p>ok</p>',
      title: '<script>alert(1)</script>',
    });

    expect(document).toContain('<title>&lt;script&gt;alert(1)&lt;/script&gt;</title>');
    expect(document).not.toContain('<title><script>');
  });

  it('rejects empty html', () => {
    expect(() => service.buildDocument({ html: '   ' })).toThrow(BadRequestException);
  });

  it('rejects external script sources', () => {
    expect(() =>
      service.buildDocument({
        html: '<div></div>',
        js: '<script src="https://evil.example/lib.js"></script>',
      }),
    ).toThrow(BadRequestException);
  });

  it('rejects payloads exceeding the size limit', () => {
    expect(() =>
      service.buildDocument({
        html: 'x'.repeat(513 * 1024),
      }),
    ).toThrow(BadRequestException);
  });

  it('closes unclosed table tags before the script block', () => {
    const document = service.buildDocument({
      html: "<table><thead><tr><th>ID</th></tr></thead><tbody>",
      js: 'console.log("ready");',
      data: [{ id: 1 }],
    });

    expect(document).toContain('</tbody></table></div>');
    expect(document).toContain('<script>');
    expect(document.indexOf('</tbody></table></div>')).toBeLessThan(document.indexOf('<script>'));
  });

  it('wraps user javascript in a DOMContentLoaded bootstrap', () => {
    const document = service.buildDocument({
      html: '<div id="app"></div>',
      js: 'console.log("ready");',
    });

    expect(document).toContain('function runWidget()');
    expect(document).toContain("document.addEventListener('DOMContentLoaded', init);");
    expect(document).toContain('console.log("ready");');
  });

  it('injects table rendering helpers when data is provided', () => {
    const document = service.buildDocument({
      html: '<table><tbody id="rows"></tbody></table>',
      js: 'renderTableRows("#rows", widgetRecords(), () => document.createElement("tr"));',
      data: [{ id: 1, amount: 10 }],
    });

    expect(document).toContain('function renderTableRows');
    expect(document).toContain('function widgetRecords');
    expect(document).toContain('function formatWidgetCurrency');
  });

  it('runs html debug validation during generate', async () => {
    const documentOutput = {
      persist: jest.fn().mockResolvedValue({
        file_url: 'https://example.com/widget.html',
        filename: 'widget.html',
        document_uuid: 'doc-1',
        media_type: 'text/html',
      }),
    };
    const generator = new WidgetGeneratorService(documentOutput as any, widgetHtmlDebug as any);
    const params = {
      title: 'Sales Widget',
      html: '<div id="app">Hello</div>',
      css: 'body { color: red; }',
      js: 'console.log("ready");',
    };

    await generator.generate('org-1', 'user-1', params);

    expect(widgetHtmlDebug.fixHtml).toHaveBeenCalledWith(
      'org-1',
      expect.stringContaining('<!DOCTYPE html>'),
    );
    expect(documentOutput.persist).toHaveBeenCalledWith(
      'org-1',
      'user-1',
      expect.any(Buffer),
      'html',
      'text/html',
      'WIDGET',
    );
  });
});
