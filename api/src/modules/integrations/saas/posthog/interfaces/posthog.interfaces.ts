// ── Shared ────────────────────────────────────────────────────────────────────

export interface ListInput {
  limit?: number;
}

export type Requester = (opts: { method: string; url: string; params?: Record<string, any>; data?: any }) => Promise<any>;

// ── Events ────────────────────────────────────────────────────────────────────

export interface GetEventsInput {
  limit?: number;
  event?: string;
  distinctId?: string;
  after?: string;
  before?: string;
}

export interface CaptureEventInput {
  distinctId: string;
  event: string;
  properties?: Record<string, any>;
}

// ── Insights ──────────────────────────────────────────────────────────────────

export interface GetInsightsInput {
  limit?: number;
}

export interface GetInsightInput {
  insightId: number;
}

// ── Feature Flags ─────────────────────────────────────────────────────────────

export interface GetFeatureFlagsInput {
  limit?: number;
}

export interface GetFeatureFlagInput {
  flagId: number;
}

export interface CreateFeatureFlagInput {
  key: string;
  name?: string;
  active?: boolean;
  rolloutPercentage?: number;
}

export interface UpdateFeatureFlagInput {
  flagId: number;
  key?: string;
  name?: string;
  active?: boolean;
  rolloutPercentage?: number;
}

export interface DeleteFeatureFlagInput {
  flagId: number;
}

// ── Persons ───────────────────────────────────────────────────────────────────

export interface ListPersonsInput {
  limit?: number;
  search?: string;
}

export interface GetPersonInput {
  personId: string;
}

export interface DeletePersonInput {
  personId: string;
}

// ── Cohorts ───────────────────────────────────────────────────────────────────

export interface GetCohortInput {
  cohortId: number;
}

// ── Dashboards ────────────────────────────────────────────────────────────────

export interface GetDashboardInput {
  dashboardId: number;
}

// ── Actions ───────────────────────────────────────────────────────────────────

export interface GetActionInput {
  actionId: number;
}

// ── Annotations ───────────────────────────────────────────────────────────────

export interface CreateAnnotationInput {
  content: string;
  dateMarker?: string;
  scope?: 'organization' | 'project';
}

// ── Query ─────────────────────────────────────────────────────────────────────

export interface QueryInput {
  query: string;
}

// ── Result ────────────────────────────────────────────────────────────────────

export interface PostHogActionResult<T = any> {
  success: boolean;
  data: T;
}
