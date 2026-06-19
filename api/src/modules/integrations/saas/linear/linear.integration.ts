import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { IntegrationProvider } from 'generated/prisma';
import { SaasActionDefinition, SaasIntegration, emptySchema, loadRuntimePackage } from '../saas-integration.base';
import { LINEAR_REQUIRED_CONFIG_KEYS } from './config/linear.config';
import { LinearService } from './services/linear.service';
import {
  linearOptionalLabelIds,
  linearOptionalNumber,
  linearOptionalString,
} from './utils/linear.utils';

@Injectable()
export class LinearIntegration extends SaasIntegration {
  provider = IntegrationProvider.LINEAR;

  protected readonly actions: SaasActionDefinition[] = [
    // ── Issues ────────────────────────────────────────────────────────────
    {
      key: 'list_issues',
      label: 'List issues',
      description: 'List Linear issues with optional filters.',
      schema: z.object({ teamId: linearOptionalString, assigneeId: linearOptionalString, stateId: linearOptionalString, labelId: linearOptionalString, priority: linearOptionalNumber, first: linearOptionalNumber }),
      parameters: this.jsonSchema({ teamId: { type: 'string' }, assigneeId: { type: 'string' }, stateId: { type: 'string' }, labelId: { type: 'string' }, priority: { type: 'number' }, first: { type: 'number' } }),
    },
    {
      key: 'get_issue',
      label: 'Get issue',
      description: 'Get a Linear issue by ID.',
      schema: z.object({ issueId: z.string() }),
      parameters: this.jsonSchema({ issueId: { type: 'string' } }, ['issueId']),
    },
    {
      key: 'create_issue',
      label: 'Create issue',
      description: 'Create a new Linear issue. teamId and projectId accept names or UUIDs. labelIds accept label names or UUIDs. assigneeId accepts "me" or a user name/email/UUID. dueDate accepts YYYY-MM-DD or "today". Optional fields can be omitted.',
      schema: z.object({ teamId: linearOptionalString, title: z.string(), description: linearOptionalString, assigneeId: linearOptionalString, stateId: linearOptionalString, labelIds: linearOptionalLabelIds, priority: linearOptionalNumber, estimate: linearOptionalNumber, cycleId: linearOptionalString, projectId: linearOptionalString, dueDate: linearOptionalString }),
      parameters: this.jsonSchema({ teamId: { type: 'string' }, title: { type: 'string' }, description: { type: 'string' }, assigneeId: { type: 'string' }, stateId: { type: 'string' }, labelIds: { type: 'array', items: { type: 'string' } }, priority: { type: 'number' }, estimate: { type: 'number' }, cycleId: { type: 'string' }, projectId: { type: 'string' }, dueDate: { type: 'string' } }, ['title']),
    },
    {
      key: 'update_issue',
      label: 'Update issue',
      description: 'Update a Linear issue by ID.',
      schema: z.object({ issueId: z.string(), title: linearOptionalString, description: linearOptionalString, assigneeId: linearOptionalString, stateId: linearOptionalString, priority: linearOptionalNumber, estimate: linearOptionalNumber, dueDate: linearOptionalString, labelIds: linearOptionalLabelIds, cycleId: linearOptionalString, projectId: linearOptionalString }),
      parameters: this.jsonSchema({ issueId: { type: 'string' }, title: { type: 'string' }, description: { type: 'string' }, assigneeId: { type: 'string' }, stateId: { type: 'string' }, priority: { type: 'number' }, estimate: { type: 'number' }, dueDate: { type: 'string' }, labelIds: { type: 'array', items: { type: 'string' } }, cycleId: { type: 'string' }, projectId: { type: 'string' } }, ['issueId']),
    },
    {
      key: 'delete_issue',
      label: 'Delete issue',
      description: 'Delete a Linear issue by ID.',
      schema: z.object({ issueId: z.string() }),
      parameters: this.jsonSchema({ issueId: { type: 'string' } }, ['issueId']),
    },
    {
      key: 'list_issue_comments',
      label: 'List issue comments',
      description: 'List comments on a Linear issue.',
      schema: z.object({ issueId: z.string() }),
      parameters: this.jsonSchema({ issueId: { type: 'string' } }, ['issueId']),
    },
    {
      key: 'create_issue_comment',
      label: 'Create issue comment',
      description: 'Add a comment to a Linear issue.',
      schema: z.object({ issueId: z.string(), body: z.string() }),
      parameters: this.jsonSchema({ issueId: { type: 'string' }, body: { type: 'string' } }, ['issueId', 'body']),
    },

    // ── Projects ──────────────────────────────────────────────────────────
    {
      key: 'list_projects',
      label: 'List projects',
      description: 'List Linear projects.',
      schema: emptySchema,
      parameters: this.jsonSchema(),
    },
    {
      key: 'get_project',
      label: 'Get project',
      description: 'Get a Linear project by ID.',
      schema: z.object({ projectId: z.string() }),
      parameters: this.jsonSchema({ projectId: { type: 'string' } }, ['projectId']),
    },
    {
      key: 'create_project',
      label: 'Create project',
      description: 'Create a new Linear project.',
      schema: z.object({ teamIds: z.array(z.string()), name: z.string(), description: linearOptionalString, state: linearOptionalString, targetDate: linearOptionalString }),
      parameters: this.jsonSchema({ teamIds: { type: 'array', items: { type: 'string' } }, name: { type: 'string' }, description: { type: 'string' }, state: { type: 'string' }, targetDate: { type: 'string' } }, ['teamIds', 'name']),
    },
    {
      key: 'update_project',
      label: 'Update project',
      description: 'Update a Linear project by ID.',
      schema: z.object({ projectId: z.string(), name: linearOptionalString, description: linearOptionalString, state: linearOptionalString, targetDate: linearOptionalString }),
      parameters: this.jsonSchema({ projectId: { type: 'string' }, name: { type: 'string' }, description: { type: 'string' }, state: { type: 'string' }, targetDate: { type: 'string' } }, ['projectId']),
    },

    // ── Teams ─────────────────────────────────────────────────────────────
    {
      key: 'list_teams',
      label: 'List teams',
      description: 'List all Linear teams.',
      schema: emptySchema,
      parameters: this.jsonSchema(),
    },
    {
      key: 'get_team',
      label: 'Get team',
      description: 'Get a Linear team by ID.',
      schema: z.object({ teamId: z.string() }),
      parameters: this.jsonSchema({ teamId: { type: 'string' } }, ['teamId']),
    },

    // ── Users ─────────────────────────────────────────────────────────────
    {
      key: 'list_users',
      label: 'List users',
      description: 'List all Linear workspace members.',
      schema: emptySchema,
      parameters: this.jsonSchema(),
    },
    {
      key: 'get_viewer',
      label: 'Get current user',
      description: 'Get the currently authenticated Linear user.',
      schema: emptySchema,
      parameters: this.jsonSchema(),
    },

    // ── Cycles ────────────────────────────────────────────────────────────
    {
      key: 'list_cycles',
      label: 'List cycles',
      description: 'List Linear cycles, optionally filtered by team.',
      schema: z.object({ teamId: linearOptionalString }),
      parameters: this.jsonSchema({ teamId: { type: 'string' } }),
    },
    {
      key: 'get_cycle',
      label: 'Get cycle',
      description: 'Get a Linear cycle by ID.',
      schema: z.object({ cycleId: z.string() }),
      parameters: this.jsonSchema({ cycleId: { type: 'string' } }, ['cycleId']),
    },

    // ── Labels ────────────────────────────────────────────────────────────
    {
      key: 'list_labels',
      label: 'List labels',
      description: 'List Linear issue labels. Returns label id and name. Optional name filter accepts a label name.',
      schema: z.object({ teamId: linearOptionalString, name: linearOptionalString }),
      parameters: this.jsonSchema({ teamId: { type: 'string' }, name: { type: 'string' } }),
    },

    // ── Workflow States ───────────────────────────────────────────────────
    {
      key: 'list_states',
      label: 'List workflow states',
      description: 'List Linear workflow states, optionally filtered by team.',
      schema: z.object({ teamId: linearOptionalString }),
      parameters: this.jsonSchema({ teamId: { type: 'string' } }),
    },

    // ── Roadmaps ──────────────────────────────────────────────────────────
    {
      key: 'list_roadmaps',
      label: 'List roadmaps',
      description: 'List Linear roadmaps.',
      schema: emptySchema,
      parameters: this.jsonSchema(),
    },
  ];

  constructor(prisma: PrismaService, encryption: EncryptionService) {
    super(prisma, encryption);
  }

  protected requiredConfigKeys() {
    return [...LINEAR_REQUIRED_CONFIG_KEYS];
  }

  protected async executeValidatedTool(actionKey: string, input: Record<string, any>, config: Record<string, any>) {
    const { LinearClient } = await loadRuntimePackage('@linear/sdk');
    const service = new LinearService(new LinearClient({ apiKey: config.apiKey }));

    const actions: Record<string, () => Promise<any>> = {
      // Issues
      list_issues: () => service.listIssues(input),
      get_issue: () => service.getIssue(input as any),
      create_issue: () => service.createIssue(input as any),
      update_issue: () => service.updateIssue(input as any),
      delete_issue: () => service.deleteIssue(input as any),
      list_issue_comments: () => service.listIssueComments(input as any),
      create_issue_comment: () => service.createIssueComment(input as any),
      // Projects
      list_projects: () => service.listProjects(),
      get_project: () => service.getProject(input as any),
      create_project: () => service.createProject(input as any),
      update_project: () => service.updateProject(input as any),
      // Teams
      list_teams: () => service.listTeams(),
      get_team: () => service.getTeam(input as any),
      // Users
      list_users: () => service.listUsers(),
      get_viewer: () => service.getViewer(),
      // Cycles
      list_cycles: () => service.listCycles(input),
      get_cycle: () => service.getCycle(input as any),
      // Labels
      list_labels: () => service.listLabels(input),
      // States
      list_states: () => service.listStates(input),
      // Roadmaps
      list_roadmaps: () => service.listRoadmaps(),
    };

    return actions[actionKey]();
  }
}
