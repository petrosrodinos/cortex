import { POSTHOG_DEFAULTS } from '../config/posthog.config';
import {
  CaptureEventInput,
  CreateAnnotationInput,
  CreateFeatureFlagInput,
  DeleteFeatureFlagInput,
  DeletePersonInput,
  GetActionInput,
  GetCohortInput,
  GetDashboardInput,
  GetEventsInput,
  GetFeatureFlagInput,
  GetFeatureFlagsInput,
  GetInsightInput,
  GetInsightsInput,
  GetPersonInput,
  ListPersonsInput,
  QueryInput,
  Requester,
  UpdateFeatureFlagInput,
} from '../interfaces/posthog.interfaces';
import { wrapResult } from '../utils/posthog.utils';

export class PostHogService {
  constructor(
    private readonly projectUrl: string,
    private readonly captureUrl: string,
    private readonly request: Requester,
  ) {}

  private url(path: string) {
    return `${this.projectUrl}${path}`;
  }

  // ── Events ────────────────────────────────────────────────────────────────

  async getEvents({ limit, event, distinctId, after, before }: GetEventsInput = {}) {
    return wrapResult(await this.request({
      method: 'GET',
      url: this.url('events/'),
      params: { limit: limit ?? POSTHOG_DEFAULTS.LIMIT, event, distinct_id: distinctId, after, before },
    }));
  }

  async captureEvent({ distinctId, event, properties }: CaptureEventInput) {
    return wrapResult(await this.request({
      method: 'POST',
      url: this.captureUrl,
      data: { distinct_id: distinctId, event, properties },
    }));
  }

  // ── Insights ──────────────────────────────────────────────────────────────

  async getInsights({ limit }: GetInsightsInput = {}) {
    return wrapResult(await this.request({
      method: 'GET',
      url: this.url('insights/'),
      params: { limit: limit ?? POSTHOG_DEFAULTS.LIMIT },
    }));
  }

  async getInsight({ insightId }: GetInsightInput) {
    return wrapResult(await this.request({ method: 'GET', url: this.url(`insights/${insightId}/`) }));
  }

  // ── Feature Flags ─────────────────────────────────────────────────────────

  async getFeatureFlags({ limit }: GetFeatureFlagsInput = {}) {
    return wrapResult(await this.request({
      method: 'GET',
      url: this.url('feature_flags/'),
      params: { limit: limit ?? POSTHOG_DEFAULTS.LIMIT },
    }));
  }

  async getFeatureFlag({ flagId }: GetFeatureFlagInput) {
    return wrapResult(await this.request({ method: 'GET', url: this.url(`feature_flags/${flagId}/`) }));
  }

  async createFeatureFlag({ key, name, active, rolloutPercentage }: CreateFeatureFlagInput) {
    return wrapResult(await this.request({
      method: 'POST',
      url: this.url('feature_flags/'),
      data: { key, name, active: active ?? true, rollout_percentage: rolloutPercentage },
    }));
  }

  async updateFeatureFlag({ flagId, key, name, active, rolloutPercentage }: UpdateFeatureFlagInput) {
    return wrapResult(await this.request({
      method: 'PATCH',
      url: this.url(`feature_flags/${flagId}/`),
      data: { key, name, active, rollout_percentage: rolloutPercentage },
    }));
  }

  async deleteFeatureFlag({ flagId }: DeleteFeatureFlagInput) {
    return wrapResult(await this.request({ method: 'DELETE', url: this.url(`feature_flags/${flagId}/`) }));
  }

  // ── Persons ───────────────────────────────────────────────────────────────

  async listPersons({ limit, search }: ListPersonsInput = {}) {
    return wrapResult(await this.request({
      method: 'GET',
      url: this.url('persons/'),
      params: { limit: limit ?? POSTHOG_DEFAULTS.LIMIT, search },
    }));
  }

  async getPerson({ personId }: GetPersonInput) {
    return wrapResult(await this.request({ method: 'GET', url: this.url(`persons/${personId}/`) }));
  }

  async deletePerson({ personId }: DeletePersonInput) {
    return wrapResult(await this.request({ method: 'DELETE', url: this.url(`persons/${personId}/`) }));
  }

  // ── Cohorts ───────────────────────────────────────────────────────────────

  async listCohorts() {
    return wrapResult(await this.request({ method: 'GET', url: this.url('cohorts/') }));
  }

  async getCohort({ cohortId }: GetCohortInput) {
    return wrapResult(await this.request({ method: 'GET', url: this.url(`cohorts/${cohortId}/`) }));
  }

  // ── Dashboards ────────────────────────────────────────────────────────────

  async listDashboards() {
    return wrapResult(await this.request({ method: 'GET', url: this.url('dashboards/') }));
  }

  async getDashboard({ dashboardId }: GetDashboardInput) {
    return wrapResult(await this.request({ method: 'GET', url: this.url(`dashboards/${dashboardId}/`) }));
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async listActions() {
    return wrapResult(await this.request({ method: 'GET', url: this.url('actions/') }));
  }

  async getAction({ actionId }: GetActionInput) {
    return wrapResult(await this.request({ method: 'GET', url: this.url(`actions/${actionId}/`) }));
  }

  // ── Annotations ───────────────────────────────────────────────────────────

  async listAnnotations() {
    return wrapResult(await this.request({ method: 'GET', url: this.url('annotations/') }));
  }

  async createAnnotation({ content, dateMarker, scope }: CreateAnnotationInput) {
    return wrapResult(await this.request({
      method: 'POST',
      url: this.url('annotations/'),
      data: { content, date_marker: dateMarker, scope: scope ?? 'project' },
    }));
  }

  // ── Project ───────────────────────────────────────────────────────────────

  async getProject() {
    return wrapResult(await this.request({ method: 'GET', url: this.projectUrl }));
  }

  // ── Query ─────────────────────────────────────────────────────────────────

  async query({ query }: QueryInput) {
    return wrapResult(await this.request({
      method: 'POST',
      url: this.url('query/'),
      data: { query: { kind: 'HogQLQuery', query } },
    }));
  }
}
