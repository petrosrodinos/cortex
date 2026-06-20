import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Composio } from '@composio/core';
import { VercelProvider } from '@composio/vercel';

@Injectable()
export class ComposioClientService {
  private readonly client: Composio<VercelProvider>;

  constructor(private readonly configService: ConfigService) {
    this.client = new Composio({
      apiKey: this.configService.getOrThrow<string>('COMPOSIO_API_KEY'),
      provider: new VercelProvider(),
    });
  }

  getClient(): Composio<VercelProvider> {
    return this.client;
  }
}
