import { formatEmailBody } from './email-body-formatter';

describe('formatEmailBody', () => {
  it('converts markdown tables to html and plain text', () => {
    const body = [
      'Member list',
      '',
      '| Name | Email |',
      '| --- | --- |',
      '| Petros | petros@gmail.com |',
    ].join('\n');

    const formatted = formatEmailBody(body);

    expect(formatted.text).toContain('Petros');
    expect(formatted.html).toContain('<table');
    expect(formatted.html).toContain('petros@gmail.com');
  });
});
