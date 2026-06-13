import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { IntegrationProvider } from 'generated/prisma';
import { SaasActionDefinition, SaasIntegration, optionalNumber } from '../saas-integration.base';

@Injectable()
export class PostHogIntegration extends SaasIntegration {
  provider = IntegrationProvider.POSTHOG;
  protected readonly actions: SaasActionDefinition[] = [
    { key: 'get_events', label: 'Get events', description: 'Fetch recent PostHog events.', schema: z.object({ limit: optionalNumber }), parameters: this.jsonSchema({ limit: { type: 'number' } }) },
    { key: 'get_insights', label: 'Get insights', description: 'Fetch PostHog insights.', schema: z.object({ limit: optionalNumber }), parameters: this.jsonSchema({ limit: { type: 'number' } }) },
    { key: 'get_feature_flags', label: 'Get feature flags', description: 'List PostHog feature flags.', schema: z.object({ limit: optionalNumber }), parameters: this.jsonSchema({ limit: { type: 'number' } }) },
    { key: 'query', label: 'Run HogQL query', description: 'Run a PostHog HogQL query.', schema: z.object({ query: z.string() }), parameters: this.jsonSchema({ query: { type: 'string' } }, ['query']) },
  ];

  constructor(prisma: PrismaService, encryption: EncryptionService) { super(prisma, encryption); }
  protected requiredConfigKeys() { return ['apiKey', 'projectId']; }

  protected async executeValidatedTool(actionKey: string, input: Record<string, any>, config: Record<string, any>) {
    const host = config.host ?? 'https://app.posthog.com';
    const projectId = config.projectId;
    const headers = { Authorization: `Bearer ${config.apiKey}` };
    const endpoints: Record<string, any> = {
      get_events: { method: 'GET', url: `${host}/api/projects/${projectId}/events/`, params: { limit: input.limit ?? 100 } },
      get_insights: { method: 'GET', url: `${host}/api/projects/${projectId}/insights/`, params: { limit: input.limit ?? 100 } },
      get_feature_flags: { method: 'GET', url: `${host}/api/projects/${projectId}/feature_flags/`, params: { limit: input.limit ?? 100 } },
      query: { method: 'POST', url: `${host}/api/projects/${projectId}/query/`, data: { query: { kind: 'HogQLQuery', query: input.query } } },
    };
    return await this.axiosRequest({ ...endpoints[actionKey], headers });
  }
}
