import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { IntegrationProvider } from 'generated/prisma';
import { SaasActionDefinition, SaasIntegration, emptySchema, loadRuntimePackage, optionalString } from '../saas-integration.base';
import { GITHUB_PERMISSIONS, GITHUB_REQUIRED_CONFIG_KEYS } from './config/github.config';
import { GitHubService } from './services/github.service';

@Injectable()
export class GitHubIntegration extends SaasIntegration {
  provider = IntegrationProvider.GITHUB;

  protected readonly actions: SaasActionDefinition[] = [
    // ── Repositories ──────────────────────────────────────────────────────
    {
      key: 'list_repos',
      label: 'List repositories',
      description: 'List repositories visible to the authenticated GitHub user.',
      required_permission_key: GITHUB_PERMISSIONS.READ,
      schema: emptySchema,
      parameters: this.jsonSchema(),
    },
    {
      key: 'get_repo',
      label: 'Get repository',
      description: 'Get details for a specific GitHub repository.',
      required_permission_key: GITHUB_PERMISSIONS.READ,
      schema: z.object({ owner: z.string(), repo: z.string() }),
      parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' } }, ['owner', 'repo']),
    },
    {
      key: 'create_repo',
      label: 'Create repository',
      description: 'Create a new GitHub repository for the authenticated user.',
      required_permission_key: GITHUB_PERMISSIONS.WRITE,
      schema: z.object({ name: z.string(), description: optionalString, private: z.boolean().optional(), auto_init: z.boolean().optional() }),
      parameters: this.jsonSchema({ name: { type: 'string' }, description: { type: 'string' }, private: { type: 'boolean' }, auto_init: { type: 'boolean' } }, ['name']),
    },
    {
      key: 'delete_repo',
      label: 'Delete repository',
      description: 'Permanently delete a GitHub repository.',
      required_permission_key: GITHUB_PERMISSIONS.WRITE,
      schema: z.object({ owner: z.string(), repo: z.string() }),
      parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' } }, ['owner', 'repo']),
    },
    {
      key: 'list_branches',
      label: 'List branches',
      description: 'List branches in a GitHub repository.',
      required_permission_key: GITHUB_PERMISSIONS.READ,
      schema: z.object({ owner: z.string(), repo: z.string(), per_page: z.number().optional() }),
      parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, per_page: { type: 'number' } }, ['owner', 'repo']),
    },
    {
      key: 'get_branch',
      label: 'Get branch',
      description: 'Get details for a specific branch in a GitHub repository.',
      required_permission_key: GITHUB_PERMISSIONS.READ,
      schema: z.object({ owner: z.string(), repo: z.string(), branch: z.string() }),
      parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, branch: { type: 'string' } }, ['owner', 'repo', 'branch']),
    },
    {
      key: 'list_commits',
      label: 'List commits',
      description: 'List commits in a GitHub repository.',
      required_permission_key: GITHUB_PERMISSIONS.READ,
      schema: z.object({ owner: z.string(), repo: z.string(), sha: optionalString, per_page: z.number().optional() }),
      parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, sha: { type: 'string' }, per_page: { type: 'number' } }, ['owner', 'repo']),
    },
    {
      key: 'get_commit',
      label: 'Get commit',
      description: 'Get details for a specific commit.',
      required_permission_key: GITHUB_PERMISSIONS.READ,
      schema: z.object({ owner: z.string(), repo: z.string(), ref: z.string() }),
      parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, ref: { type: 'string' } }, ['owner', 'repo', 'ref']),
    },
    {
      key: 'list_contributors',
      label: 'List contributors',
      description: 'List contributors for a GitHub repository.',
      required_permission_key: GITHUB_PERMISSIONS.READ,
      schema: z.object({ owner: z.string(), repo: z.string(), per_page: z.number().optional() }),
      parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, per_page: { type: 'number' } }, ['owner', 'repo']),
    },
    {
      key: 'get_file_content',
      label: 'Get file content',
      description: 'Get the contents of a file in a GitHub repository.',
      required_permission_key: GITHUB_PERMISSIONS.READ,
      schema: z.object({ owner: z.string(), repo: z.string(), path: z.string(), ref: optionalString }),
      parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, path: { type: 'string' }, ref: { type: 'string' } }, ['owner', 'repo', 'path']),
    },
    {
      key: 'create_or_update_file',
      label: 'Create or update file',
      description: 'Create or update a file in a GitHub repository.',
      required_permission_key: GITHUB_PERMISSIONS.WRITE,
      schema: z.object({ owner: z.string(), repo: z.string(), path: z.string(), message: z.string(), content: z.string(), sha: optionalString, branch: optionalString }),
      parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, path: { type: 'string' }, message: { type: 'string' }, content: { type: 'string' }, sha: { type: 'string' }, branch: { type: 'string' } }, ['owner', 'repo', 'path', 'message', 'content']),
    },

    // ── Issues ────────────────────────────────────────────────────────────
    {
      key: 'get_issue',
      label: 'Get issue',
      description: 'Get details for a specific GitHub issue.',
      required_permission_key: GITHUB_PERMISSIONS.READ,
      schema: z.object({ owner: z.string(), repo: z.string(), issue_number: z.number() }),
      parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, issue_number: { type: 'number' } }, ['owner', 'repo', 'issue_number']),
    },
    {
      key: 'get_issues',
      label: 'List issues',
      description: 'List issues in a GitHub repository with optional filters.',
      required_permission_key: GITHUB_PERMISSIONS.READ,
      schema: z.object({ owner: z.string(), repo: z.string(), assignee: optionalString, state: optionalString }),
      parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, assignee: { type: 'string' }, state: { type: 'string', enum: ['open', 'closed', 'all'] } }, ['owner', 'repo']),
    },
    {
      key: 'create_issue',
      label: 'Create issue',
      description: 'Create a GitHub issue.',
      required_permission_key: GITHUB_PERMISSIONS.WRITE,
      schema: z.object({ owner: z.string(), repo: z.string(), title: z.string(), body: optionalString, labels: z.array(z.string()).optional(), assignees: z.array(z.string()).optional() }),
      parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, title: { type: 'string' }, body: { type: 'string' }, labels: { type: 'array', items: { type: 'string' } }, assignees: { type: 'array', items: { type: 'string' } } }, ['owner', 'repo', 'title']),
    },
    {
      key: 'update_issue',
      label: 'Update issue',
      description: 'Update a GitHub issue.',
      required_permission_key: GITHUB_PERMISSIONS.WRITE,
      schema: z.object({ owner: z.string(), repo: z.string(), issue_number: z.number(), title: optionalString, body: optionalString, labels: z.array(z.string()).optional(), state: optionalString }),
      parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, issue_number: { type: 'number' }, title: { type: 'string' }, body: { type: 'string' }, labels: { type: 'array', items: { type: 'string' } }, state: { type: 'string', enum: ['open', 'closed'] } }, ['owner', 'repo', 'issue_number']),
    },
    {
      key: 'list_issue_comments',
      label: 'List issue comments',
      description: 'List comments on a GitHub issue.',
      required_permission_key: GITHUB_PERMISSIONS.READ,
      schema: z.object({ owner: z.string(), repo: z.string(), issue_number: z.number() }),
      parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, issue_number: { type: 'number' } }, ['owner', 'repo', 'issue_number']),
    },
    {
      key: 'create_issue_comment',
      label: 'Create issue comment',
      description: 'Add a comment to a GitHub issue.',
      required_permission_key: GITHUB_PERMISSIONS.WRITE,
      schema: z.object({ owner: z.string(), repo: z.string(), issue_number: z.number(), body: z.string() }),
      parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, issue_number: { type: 'number' }, body: { type: 'string' } }, ['owner', 'repo', 'issue_number', 'body']),
    },
    {
      key: 'add_issue_labels',
      label: 'Add issue labels',
      description: 'Add labels to a GitHub issue.',
      required_permission_key: GITHUB_PERMISSIONS.WRITE,
      schema: z.object({ owner: z.string(), repo: z.string(), issue_number: z.number(), labels: z.array(z.string()) }),
      parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, issue_number: { type: 'number' }, labels: { type: 'array', items: { type: 'string' } } }, ['owner', 'repo', 'issue_number', 'labels']),
    },
    {
      key: 'remove_issue_label',
      label: 'Remove issue label',
      description: 'Remove a label from a GitHub issue.',
      required_permission_key: GITHUB_PERMISSIONS.WRITE,
      schema: z.object({ owner: z.string(), repo: z.string(), issue_number: z.number(), name: z.string() }),
      parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, issue_number: { type: 'number' }, name: { type: 'string' } }, ['owner', 'repo', 'issue_number', 'name']),
    },

    // ── Pull Requests ─────────────────────────────────────────────────────
    {
      key: 'list_pull_requests',
      label: 'List pull requests',
      description: 'List pull requests in a GitHub repository.',
      required_permission_key: GITHUB_PERMISSIONS.READ,
      schema: z.object({ owner: z.string(), repo: z.string(), state: optionalString }),
      parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, state: { type: 'string', enum: ['open', 'closed', 'all'] } }, ['owner', 'repo']),
    },
    {
      key: 'get_pull_request',
      label: 'Get pull request',
      description: 'Get GitHub pull request details.',
      required_permission_key: GITHUB_PERMISSIONS.READ,
      schema: z.object({ owner: z.string(), repo: z.string(), pull_number: z.number() }),
      parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, pull_number: { type: 'number' } }, ['owner', 'repo', 'pull_number']),
    },
    {
      key: 'create_pull_request',
      label: 'Create pull request',
      description: 'Create a new GitHub pull request.',
      required_permission_key: GITHUB_PERMISSIONS.WRITE,
      schema: z.object({ owner: z.string(), repo: z.string(), title: z.string(), head: z.string(), base: z.string(), body: optionalString }),
      parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, title: { type: 'string' }, head: { type: 'string' }, base: { type: 'string' }, body: { type: 'string' } }, ['owner', 'repo', 'title', 'head', 'base']),
    },
    {
      key: 'merge_pull_request',
      label: 'Merge pull request',
      description: 'Merge a GitHub pull request.',
      required_permission_key: GITHUB_PERMISSIONS.WRITE,
      schema: z.object({ owner: z.string(), repo: z.string(), pull_number: z.number(), merge_method: optionalString }),
      parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, pull_number: { type: 'number' }, merge_method: { type: 'string', enum: ['merge', 'squash', 'rebase'] } }, ['owner', 'repo', 'pull_number']),
    },
    {
      key: 'list_pr_reviews',
      label: 'List PR reviews',
      description: 'List reviews for a GitHub pull request.',
      required_permission_key: GITHUB_PERMISSIONS.READ,
      schema: z.object({ owner: z.string(), repo: z.string(), pull_number: z.number() }),
      parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, pull_number: { type: 'number' } }, ['owner', 'repo', 'pull_number']),
    },
    {
      key: 'request_pr_review',
      label: 'Request PR review',
      description: 'Request a review on a GitHub pull request.',
      required_permission_key: GITHUB_PERMISSIONS.WRITE,
      schema: z.object({ owner: z.string(), repo: z.string(), pull_number: z.number(), reviewers: z.array(z.string()) }),
      parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, pull_number: { type: 'number' }, reviewers: { type: 'array', items: { type: 'string' } } }, ['owner', 'repo', 'pull_number', 'reviewers']),
    },
    {
      key: 'list_pr_files',
      label: 'List PR files',
      description: 'List files changed in a GitHub pull request.',
      required_permission_key: GITHUB_PERMISSIONS.READ,
      schema: z.object({ owner: z.string(), repo: z.string(), pull_number: z.number() }),
      parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, pull_number: { type: 'number' } }, ['owner', 'repo', 'pull_number']),
    },

    // ── Releases ──────────────────────────────────────────────────────────
    {
      key: 'list_releases',
      label: 'List releases',
      description: 'List releases for a GitHub repository.',
      required_permission_key: GITHUB_PERMISSIONS.READ,
      schema: z.object({ owner: z.string(), repo: z.string(), per_page: z.number().optional() }),
      parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, per_page: { type: 'number' } }, ['owner', 'repo']),
    },
    {
      key: 'get_latest_release',
      label: 'Get latest release',
      description: 'Get the latest release for a GitHub repository.',
      required_permission_key: GITHUB_PERMISSIONS.READ,
      schema: z.object({ owner: z.string(), repo: z.string() }),
      parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' } }, ['owner', 'repo']),
    },
    {
      key: 'create_release',
      label: 'Create release',
      description: 'Create a new release for a GitHub repository.',
      required_permission_key: GITHUB_PERMISSIONS.WRITE,
      schema: z.object({ owner: z.string(), repo: z.string(), tag_name: z.string(), name: optionalString, body: optionalString, draft: z.boolean().optional(), prerelease: z.boolean().optional() }),
      parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' }, tag_name: { type: 'string' }, name: { type: 'string' }, body: { type: 'string' }, draft: { type: 'boolean' }, prerelease: { type: 'boolean' } }, ['owner', 'repo', 'tag_name']),
    },

    // ── Stars ─────────────────────────────────────────────────────────────
    {
      key: 'list_starred_repos',
      label: 'List starred repositories',
      description: 'List repositories starred by the authenticated user.',
      required_permission_key: GITHUB_PERMISSIONS.READ,
      schema: emptySchema,
      parameters: this.jsonSchema(),
    },
    {
      key: 'star_repo',
      label: 'Star repository',
      description: 'Star a GitHub repository.',
      required_permission_key: GITHUB_PERMISSIONS.WRITE,
      schema: z.object({ owner: z.string(), repo: z.string() }),
      parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' } }, ['owner', 'repo']),
    },
    {
      key: 'unstar_repo',
      label: 'Unstar repository',
      description: 'Unstar a GitHub repository.',
      required_permission_key: GITHUB_PERMISSIONS.WRITE,
      schema: z.object({ owner: z.string(), repo: z.string() }),
      parameters: this.jsonSchema({ owner: { type: 'string' }, repo: { type: 'string' } }, ['owner', 'repo']),
    },

    // ── Search ────────────────────────────────────────────────────────────
    {
      key: 'search_repos',
      label: 'Search repositories',
      description: 'Search GitHub repositories by query.',
      required_permission_key: GITHUB_PERMISSIONS.READ,
      schema: z.object({ query: z.string(), per_page: z.number().optional() }),
      parameters: this.jsonSchema({ query: { type: 'string' }, per_page: { type: 'number' } }, ['query']),
    },
    {
      key: 'search_issues',
      label: 'Search issues',
      description: 'Search GitHub issues and pull requests by query.',
      required_permission_key: GITHUB_PERMISSIONS.READ,
      schema: z.object({ query: z.string(), per_page: z.number().optional() }),
      parameters: this.jsonSchema({ query: { type: 'string' }, per_page: { type: 'number' } }, ['query']),
    },
    {
      key: 'search_code',
      label: 'Search code',
      description: 'Search code across GitHub repositories.',
      required_permission_key: GITHUB_PERMISSIONS.READ,
      schema: z.object({ query: z.string(), per_page: z.number().optional() }),
      parameters: this.jsonSchema({ query: { type: 'string' }, per_page: { type: 'number' } }, ['query']),
    },

    // ── User ──────────────────────────────────────────────────────────────
    {
      key: 'get_authenticated_user',
      label: 'Get authenticated user',
      description: 'Get details of the currently authenticated GitHub user.',
      required_permission_key: GITHUB_PERMISSIONS.READ,
      schema: emptySchema,
      parameters: this.jsonSchema(),
    },
    {
      key: 'list_user_repos',
      label: 'List user repositories',
      description: 'List public repositories for a specific GitHub user.',
      required_permission_key: GITHUB_PERMISSIONS.READ,
      schema: z.object({ username: z.string(), per_page: z.number().optional() }),
      parameters: this.jsonSchema({ username: { type: 'string' }, per_page: { type: 'number' } }, ['username']),
    },
  ];

  constructor(prisma: PrismaService, encryption: EncryptionService) {
    super(prisma, encryption);
  }

  protected requiredConfigKeys() {
    return [...GITHUB_REQUIRED_CONFIG_KEYS];
  }

  protected async executeValidatedTool(actionKey: string, input: Record<string, any>, config: Record<string, any>) {
    const { Octokit } = await loadRuntimePackage('@octokit/rest');
    const service = new GitHubService(new Octokit({ auth: config.accessToken }));

    const actions: Record<string, () => Promise<any>> = {
      // Repos
      list_repos: () => service.listRepos(input),
      get_repo: () => service.getRepo(input as any),
      create_repo: () => service.createRepo(input as any),
      delete_repo: () => service.deleteRepo(input as any),
      list_branches: () => service.listBranches(input as any),
      get_branch: () => service.getBranch(input as any),
      list_commits: () => service.listCommits(input as any),
      get_commit: () => service.getCommit(input as any),
      list_contributors: () => service.listContributors(input as any),
      get_file_content: () => service.getFileContent(input as any),
      create_or_update_file: () => service.createOrUpdateFile(input as any),
      // Issues
      get_issue: () => service.getIssue(input as any),
      get_issues: () => service.listIssues(input as any),
      create_issue: () => service.createIssue(input as any),
      update_issue: () => service.updateIssue(input as any),
      list_issue_comments: () => service.listIssueComments(input as any),
      create_issue_comment: () => service.createIssueComment(input as any),
      add_issue_labels: () => service.addIssueLabels(input as any),
      remove_issue_label: () => service.removeIssueLabel(input as any),
      // Pull Requests
      list_pull_requests: () => service.listPullRequests(input as any),
      get_pull_request: () => service.getPullRequest(input as any),
      create_pull_request: () => service.createPullRequest(input as any),
      merge_pull_request: () => service.mergePullRequest(input as any),
      list_pr_reviews: () => service.listPrReviews(input as any),
      request_pr_review: () => service.requestPrReview(input as any),
      list_pr_files: () => service.listPrFiles(input as any),
      // Releases
      list_releases: () => service.listReleases(input as any),
      get_latest_release: () => service.getLatestRelease(input as any),
      create_release: () => service.createRelease(input as any),
      // Stars
      list_starred_repos: () => service.listStarredRepos(),
      star_repo: () => service.starRepo(input as any),
      unstar_repo: () => service.unstarRepo(input as any),
      // Search
      search_repos: () => service.searchRepos(input as any),
      search_issues: () => service.searchIssues(input as any),
      search_code: () => service.searchCode(input as any),
      // User
      get_authenticated_user: () => service.getAuthenticatedUser(),
      list_user_repos: () => service.listUserRepos(input as any),
    };

    return actions[actionKey]();
  }
}
