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
import {
  buildIdFilter,
  buildIssueLabelFilter,
  compactOptionalFields,
  isLinearUuid,
  normalizeDueDate,
  serializeLinearConnection,
  serializeLinearEntity,
  wrapResult,
} from '../utils/linear.utils';

const ASSIGNEE_ALIASES = new Set(['me', 'self', 'current', 'viewer']);

export class LinearService {
  constructor(private readonly client: any) {}

  async listIssues({ teamId, assigneeId, stateId, labelId, priority, first }: ListIssuesInput = {}) {
    const filter: any = {
      ...buildIdFilter({ team: teamId, assignee: assigneeId, state: stateId }),
    };
    if (labelId) filter.labels = { id: { eq: labelId } };
    if (priority !== undefined) filter.priority = { eq: priority };
    const connection = await this.client.issues({ filter, first: first ?? LINEAR_DEFAULTS.PAGE_SIZE });
    return wrapResult(serializeLinearConnection(connection));
  }

  async getIssue({ issueId }: GetIssueInput) {
    const issue = await this.client.issue(issueId);
    return wrapResult(serializeLinearEntity(issue));
  }

  async createIssue(rawInput: CreateIssueInput) {
    const input = await this.prepareIssueFields(rawInput);

    if (!input.title) {
      throw new Error('title is required');
    }

    if (!input.teamId && !input.projectId) {
      throw new Error('teamId or projectId is required');
    }

    const payload = await this.client.createIssue(input);
    const issue = payload?.issue ?? payload;
    return wrapResult(serializeLinearEntity(issue));
  }

  async updateIssue({ issueId, ...rest }: UpdateIssueInput) {
    const input = await this.prepareIssueFields(rest);
    return wrapResult(await this.client.updateIssue(issueId, input));
  }

  async deleteIssue({ issueId }: DeleteIssueInput) {
    return wrapResult(await this.client.deleteIssue(issueId));
  }

  async listIssueComments({ issueId }: ListIssueCommentsInput) {
    const issue = await this.client.issue(issueId);
    const connection = await issue.comments();
    return wrapResult(serializeLinearConnection(connection));
  }

  async createIssueComment({ issueId, body }: CreateIssueCommentInput) {
    return wrapResult(await this.client.createComment({ issueId, body }));
  }

  async listProjects() {
    const connection = await this.client.projects({ first: LINEAR_DEFAULTS.PAGE_SIZE });
    return wrapResult(serializeLinearConnection(connection));
  }

  async getProject({ projectId }: GetProjectInput) {
    const project = await this.client.project(projectId);
    return wrapResult(serializeLinearEntity(project));
  }

  async createProject(input: CreateProjectInput) {
    return wrapResult(await this.client.createProject(compactOptionalFields({ ...input })));
  }

  async updateProject({ projectId, ...rest }: UpdateProjectInput) {
    return wrapResult(await this.client.updateProject(projectId, compactOptionalFields(rest)));
  }

  async listTeams() {
    const connection = await this.client.teams({ first: LINEAR_DEFAULTS.PAGE_SIZE });
    return wrapResult(serializeLinearConnection(connection));
  }

  async getTeam({ teamId }: GetTeamInput) {
    const team = await this.client.team(teamId);
    return wrapResult(serializeLinearEntity(team));
  }

  async listUsers() {
    const connection = await this.client.users({ first: LINEAR_DEFAULTS.PAGE_SIZE });
    return wrapResult(serializeLinearConnection(connection));
  }

  async getViewer() {
    const viewer = await this.client.viewer;
    return wrapResult(serializeLinearEntity(viewer));
  }

  async listCycles({ teamId }: ListCyclesInput = {}) {
    const filter = teamId ? buildIdFilter({ team: teamId }) : undefined;
    const connection = await this.client.cycles({
      ...(filter ? { filter } : {}),
      first: LINEAR_DEFAULTS.PAGE_SIZE,
    });
    return wrapResult(serializeLinearConnection(connection));
  }

  async getCycle({ cycleId }: GetCycleInput) {
    const cycle = await this.client.cycle(cycleId);
    return wrapResult(serializeLinearEntity(cycle));
  }

  async listLabels({ teamId, name }: ListLabelsInput = {}) {
    const filter = buildIssueLabelFilter({ teamId, name });
    const connection = await this.client.issueLabels({
      ...(Object.keys(filter).length ? { filter } : {}),
      first: LINEAR_DEFAULTS.PAGE_SIZE,
    });
    return wrapResult(serializeLinearConnection(connection));
  }

  async listStates({ teamId }: ListStatesInput = {}) {
    const filter = teamId ? buildIdFilter({ team: teamId }) : undefined;
    const connection = await this.client.workflowStates({
      ...(filter ? { filter } : {}),
      first: LINEAR_DEFAULTS.PAGE_SIZE,
    });
    return wrapResult(serializeLinearConnection(connection));
  }

  async listRoadmaps() {
    const connection = await this.client.roadmaps({ first: LINEAR_DEFAULTS.PAGE_SIZE });
    return wrapResult(serializeLinearConnection(connection));
  }

  private async prepareIssueFields(rawInput: Partial<CreateIssueInput>) {
    const input = compactOptionalFields({
      ...rawInput,
      dueDate: normalizeDueDate(rawInput.dueDate),
    }) as Partial<CreateIssueInput>;

    if (input.assigneeId && !isLinearUuid(input.assigneeId)) {
      if (ASSIGNEE_ALIASES.has(input.assigneeId.toLowerCase())) {
        const viewer = await this.client.viewer;
        input.assigneeId = viewer.id;
      } else {
        input.assigneeId = await this.resolveUserId(input.assigneeId);
      }
    }

    if (input.projectId && !isLinearUuid(input.projectId)) {
      input.projectId = await this.resolveProjectId(input.projectId);
    }

    if (input.teamId && !isLinearUuid(input.teamId)) {
      input.teamId = await this.resolveTeamId(input.teamId);
    }

    if (!input.teamId && input.projectId) {
      input.teamId = await this.resolveTeamIdFromProject(input.projectId);
    }

    if (input.labelIds?.length) {
      input.labelIds = await this.resolveLabelIds(input.labelIds, input.teamId);
    }

    return input;
  }

  private async resolveProjectId(nameOrId: string): Promise<string> {
    if (isLinearUuid(nameOrId)) {
      return nameOrId;
    }

    const connection = await this.client.projects({ first: LINEAR_DEFAULTS.PAGE_SIZE });
    const match = connection.nodes?.find(
      (project: any) => project.name.toLowerCase() === nameOrId.toLowerCase(),
    );

    if (!match) {
      throw new Error(`Project "${nameOrId}" not found`);
    }

    return match.id;
  }

  private async resolveTeamId(nameOrId: string): Promise<string> {
    if (isLinearUuid(nameOrId)) {
      return nameOrId;
    }

    const connection = await this.client.teams({ first: LINEAR_DEFAULTS.PAGE_SIZE });
    const match = connection.nodes?.find(
      (team: any) => team.name.toLowerCase() === nameOrId.toLowerCase(),
    );

    if (!match) {
      throw new Error(`Team "${nameOrId}" not found`);
    }

    return match.id;
  }

  private async resolveTeamIdFromProject(projectId: string): Promise<string> {
    const project = await this.client.project(projectId);
    const teams = await project.teams();
    const firstTeam = teams.nodes?.[0];

    if (!firstTeam?.id) {
      throw new Error(`No team found for project ${projectId}`);
    }

    return firstTeam.id;
  }

  private async resolveUserId(nameOrId: string): Promise<string> {
    if (isLinearUuid(nameOrId)) {
      return nameOrId;
    }

    const connection = await this.client.users({ first: LINEAR_DEFAULTS.PAGE_SIZE });
    const normalized = nameOrId.toLowerCase();
    const match = connection.nodes?.find((user: any) => {
      const displayName = user.displayName?.toLowerCase();
      const email = user.email?.toLowerCase();
      const name = user.name?.toLowerCase();
      return displayName === normalized || email === normalized || name === normalized;
    });

    if (!match) {
      throw new Error(`User "${nameOrId}" not found`);
    }

    return match.id;
  }

  private async resolveLabelIds(labelIdsOrNames: string[], teamId?: string): Promise<string[]> {
    const resolved: string[] = [];
    const pendingNames: string[] = [];

    for (const value of labelIdsOrNames) {
      if (isLinearUuid(value)) {
        resolved.push(value);
      } else {
        pendingNames.push(value);
      }
    }

    if (!pendingNames.length) {
      return resolved;
    }

    const filter = teamId ? buildIdFilter({ team: teamId }) : {};
    const connection = await this.client.issueLabels({
      ...(Object.keys(filter).length ? { filter } : {}),
      first: 250,
    });

    const labels = connection.nodes ?? [];
    const labelsByName = new Map<string, string>();

    for (const label of labels) {
      labelsByName.set(label.name.toLowerCase(), label.id);
    }

    for (const name of pendingNames) {
      const labelId = labelsByName.get(name.toLowerCase());
      if (!labelId) {
        throw new Error(`Label "${name}" not found`);
      }
      resolved.push(labelId);
    }

    return resolved;
  }
}
