import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { IntegrationProvider } from 'generated/prisma';
import { SaasActionDefinition, SaasIntegration, emptySchema, loadRuntimePackage, optionalString } from '../saas-integration.base';

@Injectable()
export class LinearIntegration extends SaasIntegration {
  provider = IntegrationProvider.LINEAR;
  protected readonly actions: SaasActionDefinition[] = [
    { key: 'list_issues', label: 'List issues', description: 'List Linear issues.', schema: z.object({ teamId: optionalString, assigneeId: optionalString }), parameters: this.jsonSchema({ teamId: { type: 'string' }, assigneeId: { type: 'string' } }) },
    { key: 'create_issue', label: 'Create issue', description: 'Create a Linear issue.', schema: z.object({ teamId: z.string(), title: z.string(), description: optionalString, assigneeId: optionalString }), parameters: this.jsonSchema({ teamId: { type: 'string' }, title: { type: 'string' }, description: { type: 'string' }, assigneeId: { type: 'string' } }, ['teamId', 'title']) },
    { key: 'update_issue', label: 'Update issue', description: 'Update a Linear issue.', schema: z.object({ issueId: z.string(), title: optionalString, description: optionalString, assigneeId: optionalString, stateId: optionalString }), parameters: this.jsonSchema({ issueId: { type: 'string' }, title: { type: 'string' }, description: { type: 'string' }, assigneeId: { type: 'string' }, stateId: { type: 'string' } }, ['issueId']) },
    { key: 'list_projects', label: 'List projects', description: 'List Linear projects.', schema: emptySchema, parameters: this.jsonSchema() },
  ];

  constructor(prisma: PrismaService, encryption: EncryptionService) { super(prisma, encryption); }
  protected requiredConfigKeys() { return ['apiKey']; }

  protected async executeValidatedTool(actionKey: string, input: Record<string, any>, config: Record<string, any>) {
    const { LinearClient } = await loadRuntimePackage('@linear/sdk');
    const client: any = new LinearClient({ apiKey: config.apiKey });
    const actions: Record<string, () => Promise<any>> = {
      list_issues: () => client.issues({ filter: { team: input.teamId ? { id: { eq: input.teamId } } : undefined, assignee: input.assigneeId ? { id: { eq: input.assigneeId } } : undefined } }),
      create_issue: () => client.createIssue(input),
      update_issue: () => client.updateIssue(input.issueId, input),
      list_projects: () => client.projects(),
    };
    return { success: true, data: await actions[actionKey]() };
  }
}
