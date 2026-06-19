import { generateText } from 'ai';
import { WidgetHtmlDebugService } from './widget-html-debug.service';

jest.mock('ai', () => ({
  generateText: jest.fn(),
}));

describe('WidgetHtmlDebugService', () => {
  const providerFactory = {
    resolveProvider: jest.fn(),
  };

  const service = new WidgetHtmlDebugService(providerFactory as any);
  const generateTextMock = generateText as jest.MockedFunction<typeof generateText>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the original html when the debug call fails', async () => {
    providerFactory.resolveProvider.mockRejectedValue(new Error('provider unavailable'));
    const html = '<!DOCTYPE html><html><body>ok</body></html>';

    await expect(service.fixHtml('org-1', html)).resolves.toBe(html);
  });

  it('returns fixed html from the model response', async () => {
    const original = '<!DOCTYPE html><html><body>broken</body></html>';
    const fixed = '<!DOCTYPE html><html><body>fixed</body></html>';

    providerFactory.resolveProvider.mockResolvedValue({
      model: {},
    });
    generateTextMock.mockResolvedValue({
      text: fixed,
    } as any);

    await expect(service.fixHtml('org-1', original)).resolves.toBe(fixed);
  });

  it('returns the original html when model output is not a full document', async () => {
    const original = '<!DOCTYPE html><html><body>ok</body></html>';

    providerFactory.resolveProvider.mockResolvedValue({
      model: {},
    });
    generateTextMock.mockResolvedValue({
      text: '<div>partial</div>',
    } as any);

    await expect(service.fixHtml('org-1', original)).resolves.toBe(original);
  });
});
