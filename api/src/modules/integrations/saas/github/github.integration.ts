import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { IntegrationProvider } from 'generated/prisma';
import { SaasActionDefinition, SaasIntegration, emptySchema, loadRuntimePackage, optionalString } from '../saas-integration.base';

@Injectable()
export class GitHubIntegration extends SaasIntegration {
  provider = IntegrationProvider.GITHUB;
  protected readonly actions: SaasActionDefinition[] = [
    { key: 'list_repos', label: 'List repositories', description: 'List repositories visible to the authenticated GitHub user.', required_permission_key: 'integrations:github:read_repos', schema: emptySchema, parameters: this.jsonSchema() },
    { key: 'get_issues', label: 'List issues', description: 'List issues in a GitHub repository with optional filters.', required_permission_key: 'integrations:github:read_repos', schema: z.object({ owner: z.string(), repo: z.string(), assignee: optionalString, state: optionalString }), parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, assignee: { type: 'string' }, state: { type: 'string', enum: ['open', 'closed', 'all'] } }, ['owner', 'repo']) },
    { key: 'create_issue', label: 'Create issue', description: 'Create a GitHub issue.', required_permission_key: 'integrations:github:connect', schema: z.object({ owner: z.string(), repo: z.string(), title: z.string(), body: optionalString, labels: z.array(z.string()).optional() }), parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, title: { type: 'string' }, body: { type: 'string' }, labels: { type: 'array', items: { type: 'string' } } }, ['owner', 'repo', 'title']) },
    { key: 'update_issue', label: 'Update issue', description: 'Update a GitHub issue.', required_permission_key: 'integrations:github:connect', schema: z.object({ owner: z.string(), repo: z.string(), issue_number: z.number(), title: optionalString, body: optionalString, labels: z.array(z.string()).optional(), state: optionalString }), parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, issue_number: { type: 'number' }, title: { type: 'string' }, body: { type: 'string' }, labels: { type: 'array', items: { type: 'string' } }, state: { type: 'string', enum: ['open', 'closed'] } }, ['owner', 'repo', 'issue_number']) },
    { key: 'list_pull_requests', label: 'List pull requests', description: 'List pull requests in a GitHub repository.', required_permission_key: 'integrations:github:read_repos', schema: z.object({ owner: z.string(), repo: z.string(), state: optionalString }), parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, state: { type: 'string', enum: ['open', 'closed', 'all'] } }, ['owner', 'repo']) },
    { key: 'get_pull_request', label: 'Get pull request', description: 'Get GitHub pull request details.', required_permission_key: 'integrations:github:read_repos', schema: z.object({ owner: z.string(), repo: z.string(), pull_number: z.number() }), parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, pull_number: { type: 'number' } }, ['owner', 'repo', 'pull_number']) },
    { key: 'merge_pull_request', label: 'Merge pull request', description: 'Merge a GitHub pull request.', required_permission_key: 'integrations:github:connect', schema: z.object({ owner: z.string(), repo: z.string(), pull_number: z.number(), merge_method: optionalString }), parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, pull_number: { type: 'number' }, merge_method: { type: 'string', enum: ['merge', 'squash', 'rebase'] } }, ['owner', 'repo', 'pull_number']) },
  ];

  constructor(prisma: PrismaService, encryption: EncryptionService) {
    super(prisma, encryption);
  }

  protected requiredConfigKeys() {
    return ['accessToken'];
  }

  protected async executeValidatedTool(actionKey: string, input: Record<string, any>, config: Record<string, any>) {
    const { Octokit } = await loadRuntimePackage('@octokit/rest');
    const client: any = new Octokit({ auth: config.accessToken });
    const actions: Record<string, () => Promise<any>> = {
      list_repos: () => client.repos.listForAuthenticatedUser({ per_page: input.limit ?? 100 }),
      get_issues: () => client.issues.listForRepo(input),
      create_issue: () => client.issues.create(input),
      update_issue: () => client.issues.update(input),
      list_pull_requests: () => client.pulls.list(input),
      get_pull_request: () => client.pulls.get(input),
      merge_pull_request: () => client.pulls.merge(input),
    };
    const response = await actions[actionKey]();
    return { success: true, data: response.data };
  }
}
