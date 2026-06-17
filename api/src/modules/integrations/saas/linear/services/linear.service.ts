import { LINEAR_DEFAULTS } from '../config/linear.config';
import {
  CreateIssueCommentInput,
  CreateIssueInput,
  CreateProjectInput,
  DeleteIssueInput,
  GetCycleInput,
  GetIssueInput,
  GetProjectInput,
  GetTeamInput,
  ListCyclesInput,
  ListIssueCommentsInput,
  ListIssuesInput,
  ListLabelsInput,
  ListStatesInput,
  UpdateIssueInput,
  UpdateProjectInput,
} from '../interfaces/linear.interfaces';
import { buildIdFilter, wrapResult } from '../utils/linear.utils';

export class LinearService {
  constructor(private readonly client: any) {}

  // ── Issues ────────────────────────────────────────────────────────────────

  async listIssues({ teamId, assigneeId, stateId, labelId, priority, first }: ListIssuesInput = {}) {
    const filter: any = {
      ...buildIdFilter({ team: teamId, assignee: assigneeId, state: stateId }),
    };
    if (labelId) filter.labels = { id: { eq: labelId } };
    if (priority !== undefined) filter.priority = { eq: priority };
    return wrapResult(await this.client.issues({ filter, first: first ?? LINEAR_DEFAULTS.PAGE_SIZE }));
  }

  async getIssue({ issueId }: GetIssueInput) {
    return wrapResult(await this.client.issue(issueId));
  }

  async createIssue(input: CreateIssueInput) {
    return wrapResult(await this.client.createIssue(input));
  }

  async updateIssue({ issueId, ...rest }: UpdateIssueInput) {
    return wrapResult(await this.client.updateIssue(issueId, rest));
  }

  async deleteIssue({ issueId }: DeleteIssueInput) {
    return wrapResult(await this.client.deleteIssue(issueId));
  }

  async listIssueComments({ issueId }: ListIssueCommentsInput) {
    const issue = await this.client.issue(issueId);
    return wrapResult(await issue.comments());
  }

  async createIssueComment({ issueId, body }: CreateIssueCommentInput) {
    return wrapResult(await this.client.createComment({ issueId, body }));
  }

  // ── Projects ──────────────────────────────────────────────────────────────

  async listProjects() {
    return wrapResult(await this.client.projects());
  }

  async getProject({ projectId }: GetProjectInput) {
    return wrapResult(await this.client.project(projectId));
  }

  async createProject(input: CreateProjectInput) {
    return wrapResult(await this.client.createProject(input));
  }

  async updateProject({ projectId, ...rest }: UpdateProjectInput) {
    return wrapResult(await this.client.updateProject(projectId, rest));
  }

  // ── Teams ─────────────────────────────────────────────────────────────────

  async listTeams() {
    return wrapResult(await this.client.teams());
  }

  async getTeam({ teamId }: GetTeamInput) {
    return wrapResult(await this.client.team(teamId));
  }

  // ── Users ─────────────────────────────────────────────────────────────────

  async listUsers() {
    return wrapResult(await this.client.users());
  }

  async getViewer() {
    return wrapResult(await this.client.viewer);
  }

  // ── Cycles ────────────────────────────────────────────────────────────────

  async listCycles({ teamId }: ListCyclesInput = {}) {
    const filter = teamId ? buildIdFilter({ team: teamId }) : {};
    return wrapResult(await this.client.cycles({ filter }));
  }

  async getCycle({ cycleId }: GetCycleInput) {
    return wrapResult(await this.client.cycle(cycleId));
  }

  // ── Labels ────────────────────────────────────────────────────────────────

  async listLabels({ teamId }: ListLabelsInput = {}) {
    const filter = teamId ? buildIdFilter({ team: teamId }) : {};
    return wrapResult(await this.client.issueLabels({ filter }));
  }

  // ── Workflow States ───────────────────────────────────────────────────────

  async listStates({ teamId }: ListStatesInput = {}) {
    const filter = teamId ? buildIdFilter({ team: teamId }) : {};
    return wrapResult(await this.client.workflowStates({ filter }));
  }

  // ── Roadmaps ──────────────────────────────────────────────────────────────

  async listRoadmaps() {
    return wrapResult(await this.client.roadmaps());
  }
}
