import { Injectable, Logger } from '@nestjs/common';
import { generateText } from 'ai';
import { AiProviderFactoryService } from '../../../providers/ai-provider-factory.service';
import { buildWidgetHtmlDebugPrompt } from './prompts/widget-html-debug.prompt';
import { normalizeWidgetHtmlResponse } from './utils/widget-html-response.utils';

@Injectable()
export class WidgetHtmlDebugService {
  private readonly logger = new Logger(WidgetHtmlDebugService.name);

  constructor(private readonly providerFactory: AiProviderFactoryService) {}

  async fixHtml(organizationUuid: string, html: string): Promise<string> {
    const trimmed = html.trim();
    if (!trimmed) {
      return html;
    }

    try {
      const resolved = await this.providerFactory.resolveProvider(organizationUuid);
      const prompt = buildWidgetHtmlDebugPrompt(trimmed);

      const result = await generateText({
        model: resolved.model,
        messages: [{ role: 'user', content: prompt }],
      });

      const normalized = normalizeWidgetHtmlResponse(result.text);
      if (!normalized) {
        this.logger.warn('Widget HTML debug returned empty output; using original document');
        return html;
      }

      return normalized;
    } catch (error) {
      this.logger.warn(
        `Widget HTML debug failed: ${error instanceof Error ? error.message : 'unknown error'}`,
      );
      return html;
    }
  }
}
