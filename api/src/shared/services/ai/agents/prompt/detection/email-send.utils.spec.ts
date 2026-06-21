import {
  extractGeneratedDocuments,
  hasSuccessfulEmailSend,
  isEmailSendRequest,
} from './email-send.utils';

describe('email-send.utils', () => {
  it('detects email send requests', () => {
    expect(isEmailSendRequest('send it to my email')).toBe(true);
    expect(isEmailSendRequest('also send it to petrosrodinos@gmail.com')).toBe(true);
    expect(isEmailSendRequest('make it an excel')).toBe(false);
  });

  it('detects successful integration email sends', () => {
    const toolResults = [
      {
        toolName: 'smtp__send_email',
        output: {
          messageId: 'abc-123',
        },
      },
    ];

    expect(hasSuccessfulEmailSend(toolResults)).toBe(true);
  });

  it('extracts generated document metadata from tool results', () => {
    const documents = extractGeneratedDocuments([
      {
        toolName: 'output__create_excel',
        output: {
          document_uuid: 'doc-123',
          filename: 'members.xlsx',
          file_url: 'https://example.com/members.xlsx',
        },
      },
    ]);

    expect(documents).toEqual([
      {
        document_uuid: 'doc-123',
        filename: 'members.xlsx',
        file_url: 'https://example.com/members.xlsx',
      },
    ]);
  });
});
