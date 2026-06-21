import { PdfCodeDebugService } from './pdf-code-debug.service';

jest.mock('ai', () => ({
  generateText: jest.fn(),
}));

import { generateText } from 'ai';

describe('PdfCodeDebugService', () => {
  const providerFactory = {
    resolveProvider: jest.fn().mockResolvedValue({ model: 'test-model' }),
  };

  const service = new PdfCodeDebugService(providerFactory as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns fixed code from the debug model response', async () => {
    (generateText as jest.Mock).mockResolvedValue({
      text: 'h.drawCover(doc, { title: "Fixed" });\nh.drawBody(doc, "ok");',
    });

    const fixed = await service.fixCode('org-uuid', 'h.drawCover(doc, { title: "Broken" });', 'SyntaxError');

    expect(fixed).toBe('h.drawCover(doc, { title: "Fixed" });\nh.drawBody(doc, "ok");');
    expect(generateText).toHaveBeenCalled();
  });

  it('returns null when debug response is empty', async () => {
    (generateText as jest.Mock).mockResolvedValue({ text: '   ' });

    const fixed = await service.fixCode('org-uuid', 'h.drawBody(doc, "x");', 'Error');

    expect(fixed).toBeNull();
  });

  it('returns null when debug call fails', async () => {
    (generateText as jest.Mock).mockRejectedValue(new Error('provider down'));

    const fixed = await service.fixCode('org-uuid', 'h.drawBody(doc, "x");', 'Error');

    expect(fixed).toBeNull();
  });
});
