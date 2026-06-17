import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isIP } from 'node:net';

@Injectable()
export class McpUrlValidatorService {
  constructor(private readonly configService: ConfigService) {}

  validate(serverUrl: string) {
    let parsed: URL;

    try {
      parsed = new URL(serverUrl);
    } catch {
      throw new BadRequestException('MCP server URL is invalid');
    }

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new BadRequestException('MCP server URL must use HTTP or HTTPS');
    }

    if (this.isProductionLike()) {
      if (parsed.protocol !== 'https:') {
        throw new BadRequestException('MCP server URL must use HTTPS in production');
      }

      if (this.isBlockedHost(parsed.hostname)) {
        throw new BadRequestException('MCP server URL points to a private or local network address');
      }
    }

    return parsed.toString();
  }

  private isProductionLike() {
    const env = this.configService.get<string>('NODE_ENV') ?? 'local';
    return !['local', 'development', 'test'].includes(env);
  }

  private isBlockedHost(hostname: string) {
    const normalized = hostname.toLowerCase();

    if (normalized === 'localhost' || normalized.endsWith('.localhost')) {
      return true;
    }

    if (normalized === '::1' || normalized === '[::1]') {
      return true;
    }

    const ipVersion = isIP(normalized);

    if (ipVersion === 4) {
      return this.isPrivateIpv4(normalized);
    }

    if (ipVersion === 6) {
      return normalized.startsWith('fc') || normalized.startsWith('fd') || normalized.startsWith('fe80');
    }

    return false;
  }

  private isPrivateIpv4(hostname: string) {
    const parts = hostname.split('.').map((part) => Number(part));

    if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
      return false;
    }

    const [a, b] = parts;

    if (a === 10) {
      return true;
    }

    if (a === 127) {
      return true;
    }

    if (a === 169 && b === 254) {
      return true;
    }

    if (a === 172 && b >= 16 && b <= 31) {
      return true;
    }

    if (a === 192 && b === 168) {
      return true;
    }

    return false;
  }
}
