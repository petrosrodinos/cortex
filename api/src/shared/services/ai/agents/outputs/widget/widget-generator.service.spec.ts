import { BadRequestException } from '@nestjs/common';
import { WidgetGeneratorService } from './widget-generator.service';

describe('WidgetGeneratorService', () => {
  const service = new WidgetGeneratorService({} as any);

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
});
