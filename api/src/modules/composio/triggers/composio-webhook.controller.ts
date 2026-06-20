import {
  Body,
  Controller,
  Headers,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'crypto';
import { ComposioTriggersService } from './composio-triggers.service';

@Controller('webhooks/composio')
export class ComposioWebhookController {
  constructor(
    private readonly configService: ConfigService,
    private readonly triggersService: ComposioTriggersService,
  ) {}

  @Post()
  async handle(
    @Headers('x-composio-signature') signature: string | undefined,
    @Body() body: any,
    @Req() request: any,
  ) {
    this.verifySignature(
      signature,
      request.rawBody ?? Buffer.from(JSON.stringify(body)),
    );
    return this.triggersService.handleEvent(body);
  }

  private verifySignature(
    signature: string | undefined,
    body: Buffer | string,
  ): void {
    const secret = this.configService.get<string>('COMPOSIO_WEBHOOK_SECRET');

    if (!secret || !signature) {
      throw new UnauthorizedException('Invalid Composio webhook signature');
    }

    const expected = createHmac('sha256', secret).update(body).digest('hex');
    const provided = signature.startsWith('sha256=')
      ? signature.slice('sha256='.length)
      : signature;

    if (!this.safeCompare(expected, provided)) {
      throw new UnauthorizedException('Invalid Composio webhook signature');
    }
  }

  private safeCompare(expected: string, provided: string): boolean {
    const expectedBuffer = Buffer.from(expected);
    const providedBuffer = Buffer.from(provided);

    return (
      expectedBuffer.length === providedBuffer.length &&
      timingSafeEqual(expectedBuffer, providedBuffer)
    );
  }
}
