import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { IntegrationProvider } from 'generated/prisma';
import { SaasActionDefinition, SaasIntegration, emptySchema, optionalNumber, optionalString } from '../saas-integration.base';
import { POSTHOG_DEFAULTS, POSTHOG_REQUIRED_CONFIG_KEYS } from './config/posthog.config';
import { PostHogService } from './services/posthog.service';

@Injectable()
export class PostHogIntegration extends SaasIntegration {
  provider = IntegrationProvider.POSTHOG;

  protected readonly actions: SaasActionDefinition[] = [
    // ── Events ────────────────────────────────────────────────────────────
    {
      key: 'get_events',
      label: 'Get events',
      description: 'Fetch recent PostHog events.',
      schema: z.object({ limit: optionalNumber, event: optionalString, distinctId: optionalString, after: optionalString, before: optionalString }),
      parameters: this.jsonSchema({ limit: { type: 'number' }, event: { type: 'string' }, distinctId: { type: 'string' }, after: { type: 'string' }, before: { type: 'string' } }),
    },
    {
      key: 'capture_event',
      label: 'Capture event',
      description: 'Send a custom event to PostHog.',
      schema: z.object({ distinctId: z.string(), event: z.string(), properties: z.record(z.any()).optional() }),
      parameters: this.jsonSchema({ distinctId: { type: 'string' }, event: { type: 'string' }, properties: { type: 'object' } }, ['distinctId', 'event']),
    },

    // ── Insights ──────────────────────────────────────────────────────────
    {
      key: 'get_insights',
      label: 'Get insights',
      description: 'Fetch PostHog insights.',
      schema: z.object({ limit: optionalNumber }),
      parameters: this.jsonSchema({ limit: { type: 'number' } }),
    },
    {
      key: 'get_insight',
      label: 'Get insight',
      description: 'Get a specific PostHog insight by ID.',
      schema: z.object({ insightId: z.number() }),
      parameters: this.jsonSchema({ insightId: { type: 'number' } }, ['insightId']),
    },

    // ── Feature Flags ─────────────────────────────────────────────────────
    {
      key: 'get_feature_flags',
      label: 'Get feature flags',
      description: 'List PostHog feature flags.',
      schema: z.object({ limit: optionalNumber }),
      parameters: this.jsonSchema({ limit: { type: 'number' } }),
    },
    {
      key: 'get_feature_flag',
      label: 'Get feature flag',
      description: 'Get a specific PostHog feature flag by ID.',
      schema: z.object({ flagId: z.number() }),
      parameters: this.jsonSchema({ flagId: { type: 'number' } }, ['flagId']),
    },
    {
      key: 'create_feature_flag',
      label: 'Create feature flag',
      description: 'Create a new PostHog feature flag.',
      schema: z.object({ key: z.string(), name: optionalString, active: z.boolean().optional(), rolloutPercentage: optionalNumber }),
      parameters: this.jsonSchema({ key: { type: 'string' }, name: { type: 'string' }, active: { type: 'boolean' }, rolloutPercentage: { type: 'number' } }, ['key']),
    },
    {
      key: 'update_feature_flag',
      label: 'Update feature flag',
      description: 'Update a PostHog feature flag.',
      schema: z.object({ flagId: z.number(), key: optionalString, name: optionalString, active: z.boolean().optional(), rolloutPercentage: optionalNumber }),
      parameters: this.jsonSchema({ flagId: { type: 'number' }, key: { type: 'string' }, name: { type: 'string' }, active: { type: 'boolean' }, rolloutPercentage: { type: 'number' } }, ['flagId']),
    },
    {
      key: 'delete_feature_flag',
      label: 'Delete feature flag',
      description: 'Delete a PostHog feature flag.',
      schema: z.object({ flagId: z.number() }),
      parameters: this.jsonSchema({ flagId: { type: 'number' } }, ['flagId']),
    },

    // ── Persons ───────────────────────────────────────────────────────────
    {
      key: 'list_persons',
      label: 'List persons',
      description: 'List PostHog persons (identified users).',
      schema: z.object({ limit: optionalNumber, search: optionalString }),
      parameters: this.jsonSchema({ limit: { type: 'number' }, search: { type: 'string' } }),
    },
    {
      key: 'get_person',
      label: 'Get person',
      description: 'Get a PostHog person by ID.',
      schema: z.object({ personId: z.string() }),
      parameters: this.jsonSchema({ personId: { type: 'string' } }, ['personId']),
    },
    {
      key: 'delete_person',
      label: 'Delete person',
      description: 'Delete a PostHog person and their associated data.',
      schema: z.object({ personId: z.string() }),
      parameters: this.jsonSchema({ personId: { type: 'string' } }, ['personId']),
    },

    // ── Cohorts ───────────────────────────────────────────────────────────
    {
      key: 'list_cohorts',
      label: 'List cohorts',
      description: 'List PostHog cohorts.',
      schema: emptySchema,
      parameters: this.jsonSchema(),
    },
    {
      key: 'get_cohort',
      label: 'Get cohort',
      description: 'Get a PostHog cohort by ID.',
      schema: z.object({ cohortId: z.number() }),
      parameters: this.jsonSchema({ cohortId: { type: 'number' } }, ['cohortId']),
    },

    // ── Dashboards ────────────────────────────────────────────────────────
    {
      key: 'list_dashboards',
      label: 'List dashboards',
      description: 'List PostHog dashboards.',
      schema: emptySchema,
      parameters: this.jsonSchema(),
    },
    {
      key: 'get_dashboard',
      label: 'Get dashboard',
      description: 'Get a PostHog dashboard by ID.',
      schema: z.object({ dashboardId: z.number() }),
      parameters: this.jsonSchema({ dashboardId: { type: 'number' } }, ['dashboardId']),
    },

    // ── Actions ───────────────────────────────────────────────────────────
    {
      key: 'list_actions',
      label: 'List actions',
      description: 'List PostHog actions.',
      schema: emptySchema,
      parameters: this.jsonSchema(),
    },
    {
      key: 'get_action',
      label: 'Get action',
      description: 'Get a PostHog action by ID.',
      schema: z.object({ actionId: z.number() }),
      parameters: this.jsonSchema({ actionId: { type: 'number' } }, ['actionId']),
    },

    // ── Annotations ───────────────────────────────────────────────────────
    {
      key: 'list_annotations',
      label: 'List annotations',
      description: 'List PostHog annotations.',
      schema: emptySchema,
      parameters: this.jsonSchema(),
    },
    {
      key: 'create_annotation',
      label: 'Create annotation',
      description: 'Create a PostHog annotation.',
      schema: z.object({ content: z.string(), dateMarker: optionalString, scope: optionalString }),
      parameters: this.jsonSchema({ content: { type: 'string' }, dateMarker: { type: 'string' }, scope: { type: 'string', enum: ['organization', 'project'] } }, ['content']),
    },

    // ── Project ───────────────────────────────────────────────────────────
    {
      key: 'get_project',
      label: 'Get project',
      description: 'Get PostHog project details and settings.',
      schema: emptySchema,
      parameters: this.jsonSchema(),
    },

    // ── Query ─────────────────────────────────────────────────────────────
    {
      key: 'query',
      label: 'Run HogQL query',
      description: 'Run a PostHog HogQL query.',
      schema: z.object({ query: z.string() }),
      parameters: this.jsonSchema({ query: { type: 'string' } }, ['query']),
    },
  ];

  constructor(prisma: PrismaService, encryption: EncryptionService) {
    super(prisma, encryption);
  }

  protected requiredConfigKeys() {
    return [...POSTHOG_REQUIRED_CONFIG_KEYS];
  }

  protected async executeValidatedTool(actionKey: string, input: Record<string, any>, config: Record<string, any>) {
    const host = config.host ?? POSTHOG_DEFAULTS.HOST;
    const projectId = config.projectId;
    const headers = { Authorization: `Bearer ${config.apiKey}` };
    const requester = (opts: any) => this.axiosRequest({ ...opts, headers });
    const service = new PostHogService(
      `${host}/api/projects/${projectId}/`,
      `${host}/capture/`,
      requester,
    );

    const actions: Record<string, () => Promise<any>> = {
      // Events
      get_events: () => service.getEvents(input),
      capture_event: () => service.captureEvent(input as any),
      // Insights
      get_insights: () => service.getInsights(input),
      get_insight: () => service.getInsight(input as any),
      // Feature Flags
      get_feature_flags: () => service.getFeatureFlags(input),
      get_feature_flag: () => service.getFeatureFlag(input as any),
      create_feature_flag: () => service.createFeatureFlag(input as any),
      update_feature_flag: () => service.updateFeatureFlag(input as any),
      delete_feature_flag: () => service.deleteFeatureFlag(input as any),
      // Persons
      list_persons: () => service.listPersons(input),
      get_person: () => service.getPerson(input as any),
      delete_person: () => service.deletePerson(input as any),
      // Cohorts
      list_cohorts: () => service.listCohorts(),
      get_cohort: () => service.getCohort(input as any),
      // Dashboards
      list_dashboards: () => service.listDashboards(),
      get_dashboard: () => service.getDashboard(input as any),
      // Actions
      list_actions: () => service.listActions(),
      get_action: () => service.getAction(input as any),
      // Annotations
      list_annotations: () => service.listAnnotations(),
      create_annotation: () => service.createAnnotation(input as any),
      // Project
      get_project: () => service.getProject(),
      // Query
      query: () => service.query(input as any),
    };

    return actions[actionKey]();
  }
}
