import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { McpAuthType } from 'generated/prisma';
import type { OAuthClientProvider, OAuthTokens } from '@ai-sdk/mcp';
import { McpAuthConfig, McpCredentials } from '../types/mcp.types';

export interface McpTransportAuth {
  headers: Record<string, string>;
  authProvider?: OAuthClientProvider;
}

@Injectable()
export class McpAuthService {
  buildTransportAuth(
    authType: McpAuthType,
    authConfig: McpAuthConfig,
    credentials: McpCredentials,
    onTokensRefreshed?: (tokens: McpCredentials) => Promise<void>,
  ): McpTransportAuth {
    const headers: Record<string, string> = {};

    if (authType === McpAuthType.NONE) {
      return { headers };
    }

    if (authType === McpAuthType.BEARER) {
      const token = credentials.token ?? credentials.accessToken;

      if (!token) {
        throw new BadRequestException('Bearer token is required for this MCP integration');
      }

      headers.Authorization = `Bearer ${token}`;
      return { headers };
    }

    if (authType === McpAuthType.CUSTOM_HEADERS) {
      const customHeaders = credentials.headers;

      if (!customHeaders || typeof customHeaders !== 'object' || Array.isArray(customHeaders)) {
        throw new BadRequestException('Custom headers must be an object');
      }

      for (const [key, value] of Object.entries(customHeaders)) {
        headers[key] = String(value);
      }

      return { headers };
    }

    if (authType === McpAuthType.OAUTH) {
      return {
        headers,
        authProvider: this.createOAuthProvider(authConfig, credentials, onTokensRefreshed),
      };
    }

    return { headers };
  }

  async refreshOAuthCredentialsIfNeeded(
    authConfig: McpAuthConfig,
    credentials: McpCredentials,
  ): Promise<McpCredentials> {
    if (!credentials.tokenEndpoint || !credentials.refreshToken) {
      return credentials;
    }

    if (!credentials.expiresAt || credentials.expiresAt > Date.now() + 60_000) {
      return credentials;
    }

    const refreshed = await axios.post(
      credentials.tokenEndpoint,
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: credentials.refreshToken,
        ...(credentials.clientId ? { client_id: credentials.clientId } : {}),
        ...(credentials.clientSecret ? { client_secret: credentials.clientSecret } : {}),
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 15_000 },
    );

    const data = refreshed.data as OAuthTokens;

    return {
      ...credentials,
      accessToken: data.access_token,
      token: data.access_token,
      refreshToken: data.refresh_token ?? credentials.refreshToken,
      expiresAt: data.expires_in ? Date.now() + data.expires_in * 1000 : credentials.expiresAt,
    };
  }

  private createOAuthProvider(
    authConfig: McpAuthConfig,
    credentials: McpCredentials,
    onTokensRefreshed?: (tokens: McpCredentials) => Promise<void>,
  ): OAuthClientProvider {
    const allowedOrigins = new Set(authConfig.allowedAuthorizationServerOrigins ?? []);
    let storedTokens = this.toOAuthTokens(credentials);
    let codeVerifierValue = '';

    return {
      get redirectUrl() {
        return undefined;
      },
      get clientMetadata() {
        return {
          client_name: 'cortex-mcp-client',
          redirect_uris: [],
          grant_types: ['refresh_token', 'client_credentials'],
          response_types: ['token'],
          token_endpoint_auth_method: 'client_secret_post',
        };
      },
      clientInformation() {
        if (!credentials.clientId) {
          return undefined;
        }

        return {
          client_id: credentials.clientId,
          client_secret: credentials.clientSecret,
        };
      },
      tokens() {
        return storedTokens;
      },
      async saveTokens(tokens: OAuthTokens) {
        storedTokens = tokens;
        await onTokensRefreshed?.({
          ...credentials,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token ?? credentials.refreshToken,
          expiresAt: tokens.expires_in ? Date.now() + tokens.expires_in * 1000 : credentials.expiresAt,
        });
      },
      async redirectToAuthorization() {
        throw new BadRequestException('Interactive OAuth authorization is not supported for MCP server connections');
      },
      saveCodeVerifier(codeVerifier: string) {
        codeVerifierValue = codeVerifier;
      },
      codeVerifier() {
        return codeVerifierValue;
      },
      validateAuthorizationServerURL(_serverUrl: string | URL, authorizationServerUrl: string | URL) {
        if (allowedOrigins.size === 0) {
          return;
        }

        const origin = new URL(authorizationServerUrl).origin;

        if (!allowedOrigins.has(origin)) {
          throw new BadRequestException(`OAuth authorization server origin is not allowed: ${origin}`);
        }
      },
    };
  }

  private toOAuthTokens(credentials: McpCredentials): OAuthTokens | undefined {
    const accessToken = credentials.accessToken ?? credentials.token;

    if (!accessToken) {
      return undefined;
    }

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      refresh_token: credentials.refreshToken,
      expires_in: credentials.expiresAt
        ? Math.max(0, Math.floor((credentials.expiresAt - Date.now()) / 1000))
        : undefined,
    };
  }
}
