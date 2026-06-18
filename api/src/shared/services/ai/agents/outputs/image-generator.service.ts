import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { createOpenAI } from '@ai-sdk/openai';
import { generateImage } from 'ai';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { GcsService } from '@/integrations/storage/gcs/services/gcs.service';
import { AiProviderFactoryService } from '../../providers/ai-provider-factory.service';
import { DocumentType } from 'generated/prisma';
import { randomUUID } from 'node:crypto';

const MAX_PROMPT_LENGTH = 4000;
const DEFAULT_IMAGE_MODEL = 'gpt-image-1';
const FALLBACK_IMAGE_MODEL = 'dall-e-3';

export interface GenerateImageParams {
  prompt: string;
  size?: '1024x1024' | '1536x1024' | '1024x1536' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
}

export interface GeneratedImageResult {
  file_url: string;
  filename: string;
  document_uuid: string;
  media_type: string;
  revised_prompt?: string;
}

@Injectable()
export class ImageGeneratorService {
  private readonly logger = new Logger(ImageGeneratorService.name);

  constructor(
    private readonly providerFactory: AiProviderFactoryService,
    private readonly gcs: GcsService,
    private readonly prisma: PrismaService,
  ) {}

  async generate(
    organizationUuid: string,
    userUuid: string,
    params: GenerateImageParams,
  ): Promise<GeneratedImageResult> {
    const prompt = params.prompt?.trim();
    if (!prompt) {
      throw new BadRequestException('Image prompt is required');
    }

    if (prompt.length > MAX_PROMPT_LENGTH) {
      throw new BadRequestException(`Image prompt must be at most ${MAX_PROMPT_LENGTH} characters`);
    }

    const apiKey = await this.providerFactory.resolveOpenAiApiKey(organizationUuid);
    if (!apiKey) {
      throw new BadRequestException(
        'Image generation requires an OpenAI API key. Configure an OpenAI provider for this organization.',
      );
    }

    const openai = createOpenAI({ apiKey });
    const size = params.size ?? '1024x1024';
    const modelId = size === '1792x1024' || size === '1024x1792' ? FALLBACK_IMAGE_MODEL : DEFAULT_IMAGE_MODEL;

    let imageResult;
    try {
      imageResult = await generateImage({
        model: openai.image(modelId),
        prompt,
        size,
        providerOptions:
          modelId === FALLBACK_IMAGE_MODEL
            ? {
                openai: {
                  quality: params.quality ?? 'standard',
                  style: params.style ?? 'vivid',
                },
              }
            : undefined,
      });
    } catch (error) {
      if (modelId === DEFAULT_IMAGE_MODEL) {
        this.logger.warn('Primary image model failed, retrying with dall-e-3');
        imageResult = await generateImage({
          model: openai.image(FALLBACK_IMAGE_MODEL),
          prompt,
          size: size === '1536x1024' ? '1792x1024' : size === '1024x1536' ? '1024x1792' : '1024x1024',
          providerOptions: {
            openai: {
              quality: params.quality ?? 'standard',
              style: params.style ?? 'vivid',
            },
          },
        });
      } else {
        throw error;
      }
    }

    const image = imageResult.image;
    const mediaType = image.mediaType ?? 'image/png';
    const extension = mediaType === 'image/webp' ? 'webp' : 'png';
    const filename = `generated-${randomUUID()}.${extension}`;
    const buffer = Buffer.from(image.uint8Array);

    const uploaded = await this.gcs.uploadImageFromBuffer(
      buffer,
      filename,
      mediaType,
      `orgs/${organizationUuid}/generated`,
    );

    const document = await this.prisma.document.create({
      data: {
        user_uuid: userUuid,
        filename,
        mimetype: mediaType,
        size: buffer.length,
        url: uploaded.url,
        path: uploaded.path,
        type: DocumentType.IMAGE,
      },
    });

    const revisedPrompt = imageResult.providerMetadata?.openai?.images?.[0]?.revisedPrompt;
    const revised_prompt = typeof revisedPrompt === 'string' ? revisedPrompt : undefined;

    return {
      file_url: uploaded.url,
      filename,
      document_uuid: document.uuid,
      media_type: mediaType,
      revised_prompt,
    };
  }
}
