import { Injectable, Logger } from '@nestjs/common';
import { generateText } from 'ai';
import { AiProviderFactoryService } from '../../../providers/ai-provider-factory.service';
import { buildPdfCodeDebugPrompt } from './prompts/pdf-code-debug.prompt';
import { normalizePdfCodeResponse } from './utils/pdf-code-validation.utils';

@Injectable()
export class PdfCodeDebugService {
  private readonly logger = new Logger(PdfCodeDebugService.name);

  constructor(private readonly providerFactory: AiProviderFactoryService) {}

  async fixCode(organizationUuid: string, code: string, error: string): Promise<string | null> {
    const trimmed = code.trim();
    if (!trimmed) {
      return null;
    }

    try {
      const resolved = await this.providerFactory.resolveProvider(organizationUuid);
      const prompt = buildPdfCodeDebugPrompt(trimmed, error);

      const result = await generateText({
        model: resolved.model,
        messages: [{ role: 'user', content: prompt }],
      });

      const normalized = normalizePdfCodeResponse(result.text);
      if (!normalized) {
        this.logger.warn('PDF code debug returned empty output');
        return null;
      }

      return normalized;
    } catch (fixError) {
      this.logger.warn(
        `PDF code debug failed: ${fixError instanceof Error ? fixError.message : 'unknown error'}`,
      );
      return null;
    }
  }
}
