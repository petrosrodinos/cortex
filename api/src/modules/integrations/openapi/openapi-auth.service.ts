import { BadRequestException, Injectable } from '@nestjs/common';
import { OpenApiAuthType } from 'generated/prisma';

export type OpenApiAuthConfig =
  | { type: typeof OpenApiAuthType.NONE }
  | { type: typeof OpenApiAuthType.BEARER }
  | { type: typeof OpenApiAuthType.OAUTH2 }
  | { type: typeof OpenApiAuthType.API_KEY; name: string; in: 'header' | 'query' }
  | { type: typeof OpenApiAuthType.CUSTOM_HEADERS };

@Injectable()
export class OpenApiAuthService {
  inferAuthConfig(securitySchemes: Record<string, any>, requested?: Partial<OpenApiAuthConfig>): OpenApiAuthConfig {
    if (requested?.type && requested.type !== OpenApiAuthType.NONE) {
      return requested as OpenApiAuthConfig;
    }

    const firstScheme = Object.values(securitySchemes)[0] as any;

    if (!firstScheme) {
      return { type: OpenApiAuthType.NONE };
    }

    if (firstScheme.type === 'http' && firstScheme.scheme?.toLowerCase() === 'bearer') {
      return { type: OpenApiAuthType.BEARER };
    }

    if (firstScheme.type === 'oauth2') {
      return { type: OpenApiAuthType.OAUTH2 };
    }

    if (firstScheme.type === 'apiKey') {
      return {
        type: OpenApiAuthType.API_KEY,
        name: firstScheme.name,
        in: firstScheme.in === 'query' ? 'query' : 'header',
      };
    }

    return { type: OpenApiAuthType.NONE };
  }

  buildRequestAuth(authConfig: OpenApiAuthConfig, decryptedCredentials: Record<string, any>) {
    const headers: Record<string, string> = {};
    const params: Record<string, string> = {};

    if (authConfig.type === OpenApiAuthType.NONE) {
      return { headers, params };
    }

    if (authConfig.type === OpenApiAuthType.BEARER || authConfig.type === OpenApiAuthType.OAUTH2) {
      const token = decryptedCredentials.token ?? decryptedCredentials.accessToken;

      if (!token) {
        throw new BadRequestException('Bearer token is required for this OpenAPI integration');
      }

      headers.Authorization = `Bearer ${token}`;
      return { headers, params };
    }

    if (authConfig.type === OpenApiAuthType.API_KEY) {
      const apiKey = decryptedCredentials.apiKey ?? decryptedCredentials.key;

      if (!apiKey) {
        throw new BadRequestException('API key is required for this OpenAPI integration');
      }

      if (authConfig.in === 'query') {
        params[authConfig.name] = String(apiKey);
      } else {
        headers[authConfig.name] = String(apiKey);
      }

      return { headers, params };
    }

    if (authConfig.type === OpenApiAuthType.CUSTOM_HEADERS) {
      const customHeaders = decryptedCredentials.headers;

      if (!customHeaders || typeof customHeaders !== 'object' || Array.isArray(customHeaders)) {
        throw new BadRequestException('Custom headers must be an object');
      }

      for (const [key, value] of Object.entries(customHeaders)) {
        headers[key] = String(value);
      }

      return { headers, params };
    }

    return { headers, params };
  }
}
