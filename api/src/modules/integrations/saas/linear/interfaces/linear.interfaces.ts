// ── Issues ────────────────────────────────────────────────────────────────────

export interface ListIssuesInput {
  teamId?: string;
  assigneeId?: string;
  stateId?: string;
  labelId?: string;
  priority?: number;
  first?: number;
}

export interface GetIssueInput {
  issueId: string;
}

export interface CreateIssueInput {
  teamId?: string;
  title: string;
  description?: string;
  assigneeId?: string;
  stateId?: string;
  labelIds?: string[];
  priority?: number;
  estimate?: number;
  cycleId?: string;
  projectId?: string;
  dueDate?: string;
}

export interface UpdateIssueInput {
  issueId: string;
  title?: string;
  description?: string;
  assigneeId?: string;
  stateId?: string;
  priority?: number;
  estimate?: number;
  dueDate?: string;
  labelIds?: string[];
  cycleId?: string;
  projectId?: string;
}

export interface DeleteIssueInput {
  issueId: string;
}

export interface ListIssueCommentsInput {
  issueId: string;
}

export interface CreateIssueCommentInput {
  issueId: string;
  body: string;
}

// ── Projects ──────────────────────────────────────────────────────────────────

export interface GetProjectInput {
  projectId: string;
}

export interface CreateProjectInput {
  teamIds: string[];
  name: string;
  description?: string;
  state?: string;
  targetDate?: string;
}

export interface UpdateProjectInput {
  projectId: string;
  name?: string;
  description?: string;
  state?: string;
  targetDate?: string;
}

// ── Teams ─────────────────────────────────────────────────────────────────────

export interface GetTeamInput {
  teamId: string;
}

// ── Cycles ────────────────────────────────────────────────────────────────────

export interface ListCyclesInput {
  teamId?: string;
}

export interface GetCycleInput {
  cycleId: string;
}

// ── Labels ────────────────────────────────────────────────────────────────────

export interface ListLabelsInput {
  teamId?: string;
  name?: string;
}

// ── Workflow States ───────────────────────────────────────────────────────────

export interface ListStatesInput {
  teamId?: string;
}

// ── Result ────────────────────────────────────────────────────────────────────

export interface LinearActionResult<T = any> {
  success: boolean;
  data: T;
}
