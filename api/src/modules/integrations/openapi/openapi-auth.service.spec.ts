import { OpenApiAuthType } from 'generated/prisma';
import { OpenApiAuthService } from './openapi-auth.service';

describe('OpenApiAuthService', () => {
  const service = new OpenApiAuthService();

  it('injects bearer token credentials into Authorization header', () => {
    expect(
      service.buildRequestAuth(
        { type: OpenApiAuthType.BEARER },
        { token: 'abc123' },
      ),
    ).toEqual({
      headers: { Authorization: 'Bearer abc123' },
      params: {},
    });
  });

  it('injects api key credentials according to configured location', () => {
    expect(
      service.buildRequestAuth(
        { type: OpenApiAuthType.API_KEY, name: 'X-Api-Key', in: 'header' },
        { apiKey: 'secret' },
      ),
    ).toEqual({
      headers: { 'X-Api-Key': 'secret' },
      params: {},
    });

    expect(
      service.buildRequestAuth(
        { type: OpenApiAuthType.API_KEY, name: 'api_key', in: 'query' },
        { apiKey: 'secret' },
      ),
    ).toEqual({
      headers: {},
      params: { api_key: 'secret' },
    });
  });

  it('injects custom headers without exposing unsupported shapes', () => {
    expect(
      service.buildRequestAuth(
        { type: OpenApiAuthType.CUSTOM_HEADERS },
        { headers: { 'X-Tenant': 'org_123', Authorization: 'Custom token' } },
      ),
    ).toEqual({
      headers: { 'X-Tenant': 'org_123', Authorization: 'Custom token' },
      params: {},
    });
  });
});
