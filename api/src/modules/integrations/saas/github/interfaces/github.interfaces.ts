export interface GitHubConfig {
  accessToken: string;
}

export interface GitHubActionResult<T = any> {
  success: boolean;
  data: T;
}

// ── Repositories ────────────────────────────────────────────────────────────

export interface ListReposInput {
  limit?: number;
}

export interface RepoInput {
  owner: string;
  repo: string;
}

export interface CreateRepoInput {
  name: string;
  description?: string;
  private?: boolean;
  auto_init?: boolean;
}

export interface ListBranchesInput extends RepoInput {
  per_page?: number;
}

export interface GetBranchInput extends RepoInput {
  branch: string;
}

export interface ListCommitsInput extends RepoInput {
  sha?: string;
  per_page?: number;
}

export interface GetCommitInput extends RepoInput {
  ref: string;
}

export interface ListContributorsInput extends RepoInput {
  per_page?: number;
}

export interface GetFileContentInput extends RepoInput {
  path: string;
  ref?: string;
}

export interface CreateOrUpdateFileInput extends RepoInput {
  path: string;
  message: string;
  content: string;
  sha?: string;
  branch?: string;
}

// ── Issues ──────────────────────────────────────────────────────────────────

export interface GetIssueInput extends RepoInput {
  issue_number: number;
}

export interface ListIssuesInput extends RepoInput {
  assignee?: string;
  state?: 'open' | 'closed' | 'all';
}

export interface CreateIssueInput extends RepoInput {
  title: string;
  body?: string;
  labels?: string[];
  assignees?: string[];
}

export interface UpdateIssueInput extends RepoInput {
  issue_number: number;
  title?: string;
  body?: string;
  labels?: string[];
  state?: 'open' | 'closed';
}

export interface ListIssueCommentsInput extends RepoInput {
  issue_number: number;
}

export interface CreateIssueCommentInput extends RepoInput {
  issue_number: number;
  body: string;
}

export interface AddIssueLabelsInput extends RepoInput {
  issue_number: number;
  labels: string[];
}

export interface RemoveIssueLabelInput extends RepoInput {
  issue_number: number;
  name: string;
}

// ── Pull Requests ────────────────────────────────────────────────────────────

export interface ListPullRequestsInput extends RepoInput {
  state?: 'open' | 'closed' | 'all';
}

export interface PullRequestInput extends RepoInput {
  pull_number: number;
}

export interface CreatePullRequestInput extends RepoInput {
  title: string;
  head: string;
  base: string;
  body?: string;
}

export interface MergePullRequestInput extends PullRequestInput {
  merge_method?: 'merge' | 'squash' | 'rebase';
}

export interface RequestPrReviewInput extends PullRequestInput {
  reviewers: string[];
}

// ── Releases ─────────────────────────────────────────────────────────────────

export interface ListReleasesInput extends RepoInput {
  per_page?: number;
}

export interface CreateReleaseInput extends RepoInput {
  tag_name: string;
  name?: string;
  body?: string;
  draft?: boolean;
  prerelease?: boolean;
}

// ── Stars ────────────────────────────────────────────────────────────────────

export type StarRepoInput = RepoInput;

// ── Search ───────────────────────────────────────────────────────────────────

export interface SearchInput {
  query: string;
  per_page?: number;
}

// ── User ─────────────────────────────────────────────────────────────────────

export interface ListUserReposInput {
  username: string;
  per_page?: number;
}
