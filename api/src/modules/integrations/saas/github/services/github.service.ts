import { GITHUB_DEFAULTS } from '../config/github.config';
import {
  AddIssueLabelsInput,
  CreateIssueCommentInput,
  CreateIssueInput,
  CreateOrUpdateFileInput,
  CreatePullRequestInput,
  CreateReleaseInput,
  CreateRepoInput,
  GetBranchInput,
  GetCommitInput,
  GetFileContentInput,
  GetIssueInput,
  ListBranchesInput,
  ListCommitsInput,
  ListContributorsInput,
  ListIssueCommentsInput,
  ListIssuesInput,
  ListPullRequestsInput,
  ListReleasesInput,
  ListReposInput,
  ListUserReposInput,
  MergePullRequestInput,
  PullRequestInput,
  RemoveIssueLabelInput,
  RepoInput,
  RequestPrReviewInput,
  SearchInput,
  StarRepoInput,
  UpdateIssueInput,
} from '../interfaces/github.interfaces';
import { deletedResult, encodeBase64, extractData } from '../utils/github.utils';

export class GitHubService {
  constructor(private readonly client: any) {}

  // ── Repositories ──────────────────────────────────────────────────────────

  listRepos({ limit }: ListReposInput = {}) {
    return this.client.repos
      .listForAuthenticatedUser({ per_page: limit ?? GITHUB_DEFAULTS.PER_PAGE })
      .then(extractData);
  }

  getRepo({ owner, repo }: RepoInput) {
    return this.client.repos.get({ owner, repo }).then(extractData);
  }

  createRepo({ name, description, private: isPrivate, auto_init }: CreateRepoInput) {
    return this.client.repos
      .createForAuthenticatedUser({ name, description, private: isPrivate, auto_init })
      .then(extractData);
  }

  async deleteRepo({ owner, repo }: RepoInput) {
    await this.client.repos.delete({ owner, repo });
    return deletedResult(`Repository ${owner}/${repo} deleted.`);
  }

  listBranches({ owner, repo, per_page }: ListBranchesInput) {
    return this.client.repos
      .listBranches({ owner, repo, per_page: per_page ?? GITHUB_DEFAULTS.PER_PAGE })
      .then(extractData);
  }

  getBranch({ owner, repo, branch }: GetBranchInput) {
    return this.client.repos.getBranch({ owner, repo, branch }).then(extractData);
  }

  listCommits({ owner, repo, sha, per_page }: ListCommitsInput) {
    return this.client.repos
      .listCommits({ owner, repo, sha, per_page: per_page ?? GITHUB_DEFAULTS.PER_PAGE })
      .then(extractData);
  }

  getCommit({ owner, repo, ref }: GetCommitInput) {
    return this.client.repos.getCommit({ owner, repo, ref }).then(extractData);
  }

  listContributors({ owner, repo, per_page }: ListContributorsInput) {
    return this.client.repos
      .listContributors({ owner, repo, per_page: per_page ?? GITHUB_DEFAULTS.PER_PAGE })
      .then(extractData);
  }

  getFileContent({ owner, repo, path, ref }: GetFileContentInput) {
    return this.client.repos.getContent({ owner, repo, path, ref }).then(extractData);
  }

  createOrUpdateFile({ owner, repo, path, message, content, sha, branch }: CreateOrUpdateFileInput) {
    return this.client.repos
      .createOrUpdateFileContents({ owner, repo, path, message, content: encodeBase64(content), sha, branch })
      .then(extractData);
  }

  // ── Issues ────────────────────────────────────────────────────────────────

  getIssue({ owner, repo, issue_number }: GetIssueInput) {
    return this.client.issues.get({ owner, repo, issue_number }).then(extractData);
  }

  listIssues(input: ListIssuesInput) {
    return this.client.issues.listForRepo(input).then(extractData);
  }

  createIssue(input: CreateIssueInput) {
    return this.client.issues.create(input).then(extractData);
  }

  updateIssue(input: UpdateIssueInput) {
    return this.client.issues.update(input).then(extractData);
  }

  listIssueComments({ owner, repo, issue_number }: ListIssueCommentsInput) {
    return this.client.issues.listComments({ owner, repo, issue_number }).then(extractData);
  }

  createIssueComment({ owner, repo, issue_number, body }: CreateIssueCommentInput) {
    return this.client.issues.createComment({ owner, repo, issue_number, body }).then(extractData);
  }

  addIssueLabels({ owner, repo, issue_number, labels }: AddIssueLabelsInput) {
    return this.client.issues.addLabels({ owner, repo, issue_number, labels }).then(extractData);
  }

  removeIssueLabel({ owner, repo, issue_number, name }: RemoveIssueLabelInput) {
    return this.client.issues.removeLabel({ owner, repo, issue_number, name }).then(extractData);
  }

  // ── Pull Requests ─────────────────────────────────────────────────────────

  listPullRequests(input: ListPullRequestsInput) {
    return this.client.pulls.list(input).then(extractData);
  }

  getPullRequest({ owner, repo, pull_number }: PullRequestInput) {
    return this.client.pulls.get({ owner, repo, pull_number }).then(extractData);
  }

  createPullRequest(input: CreatePullRequestInput) {
    return this.client.pulls.create(input).then(extractData);
  }

  mergePullRequest({ owner, repo, pull_number, merge_method }: MergePullRequestInput) {
    return this.client.pulls
      .merge({ owner, repo, pull_number, merge_method: merge_method ?? GITHUB_DEFAULTS.MERGE_METHOD })
      .then(extractData);
  }

  listPrReviews({ owner, repo, pull_number }: PullRequestInput) {
    return this.client.pulls.listReviews({ owner, repo, pull_number }).then(extractData);
  }

  requestPrReview({ owner, repo, pull_number, reviewers }: RequestPrReviewInput) {
    return this.client.pulls.requestReviewers({ owner, repo, pull_number, reviewers }).then(extractData);
  }

  listPrFiles({ owner, repo, pull_number }: PullRequestInput) {
    return this.client.pulls.listFiles({ owner, repo, pull_number }).then(extractData);
  }

  // ── Releases ──────────────────────────────────────────────────────────────

  listReleases({ owner, repo, per_page }: ListReleasesInput) {
    return this.client.repos
      .listReleases({ owner, repo, per_page: per_page ?? GITHUB_DEFAULTS.PER_PAGE })
      .then(extractData);
  }

  getLatestRelease({ owner, repo }: RepoInput) {
    return this.client.repos.getLatestRelease({ owner, repo }).then(extractData);
  }

  createRelease(input: CreateReleaseInput) {
    return this.client.repos.createRelease(input).then(extractData);
  }

  // ── Stars ─────────────────────────────────────────────────────────────────

  listStarredRepos() {
    return this.client.activity
      .listReposStarredByAuthenticatedUser({ per_page: GITHUB_DEFAULTS.PER_PAGE })
      .then(extractData);
  }

  async starRepo({ owner, repo }: StarRepoInput) {
    await this.client.activity.starRepoForAuthenticatedUser({ owner, repo });
    return deletedResult(`Starred ${owner}/${repo}.`);
  }

  async unstarRepo({ owner, repo }: StarRepoInput) {
    await this.client.activity.unstarRepoForAuthenticatedUser({ owner, repo });
    return deletedResult(`Unstarred ${owner}/${repo}.`);
  }

  // ── Search ────────────────────────────────────────────────────────────────

  searchRepos({ query, per_page }: SearchInput) {
    return this.client.search
      .repos({ q: query, per_page: per_page ?? GITHUB_DEFAULTS.PER_PAGE })
      .then(extractData);
  }

  searchIssues({ query, per_page }: SearchInput) {
    return this.client.search
      .issuesAndPullRequests({ q: query, per_page: per_page ?? GITHUB_DEFAULTS.PER_PAGE })
      .then(extractData);
  }

  searchCode({ query, per_page }: SearchInput) {
    return this.client.search
      .code({ q: query, per_page: per_page ?? GITHUB_DEFAULTS.PER_PAGE })
      .then(extractData);
  }

  // ── User ──────────────────────────────────────────────────────────────────

  getAuthenticatedUser() {
    return this.client.users.getAuthenticated().then(extractData);
  }

  listUserRepos({ username, per_page }: ListUserReposInput) {
    return this.client.repos
      .listForUser({ username, per_page: per_page ?? GITHUB_DEFAULTS.PER_PAGE })
      .then(extractData);
  }
}
