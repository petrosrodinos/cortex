import { BadRequestException } from '@nestjs/common';
import { assertPdfCodeIsValid, normalizePdfCodeResponse, stripPdfCodeFences } from './pdf-code-validation.utils';

describe('pdf-code-validation.utils', () => {
  const validCode = `
h.drawCover(doc, { title: 'Report' });
h.drawSectionHeading(doc, 'Summary');
h.drawBody(doc, 'Overview text');
`;

  it('allows valid PDFKit code', () => {
    expect(() => assertPdfCodeIsValid(validCode)).not.toThrow();
  });

  it('rejects empty code', () => {
    expect(() => assertPdfCodeIsValid('')).toThrow(BadRequestException);
  });

  it('blocks require()', () => {
    expect(() => assertPdfCodeIsValid("require('fs')")).toThrow('require() is not allowed');
  });

  it('blocks import statements', () => {
    expect(() => assertPdfCodeIsValid("import fs from 'fs'")).toThrow('import is not allowed');
  });

  it('blocks doc.end()', () => {
    expect(() => assertPdfCodeIsValid('doc.end()')).toThrow('doc.end() must not be called');
  });

  it('blocks process access', () => {
    expect(() => assertPdfCodeIsValid('process.exit(1)')).toThrow('process access is not allowed');
  });

  it('strips markdown code fences', () => {
    expect(stripPdfCodeFences('```javascript\nh.drawCover(doc, { title: "A" });\n```')).toBe(
      'h.drawCover(doc, { title: "A" });',
    );
  });

  it('normalizes fenced code body responses', () => {
    expect(normalizePdfCodeResponse('```js\nh.drawBody(doc, "hi");\n```')).toBe('h.drawBody(doc, "hi");');
  });

  it('extracts function body from wrapped responses', () => {
    const wrapped = 'async function build(doc, h) {\n  h.drawCover(doc, { title: "A" });\n}';
    expect(normalizePdfCodeResponse(wrapped)).toBe('h.drawCover(doc, { title: "A" });');
  });
});
