# Task: SaaS Integrations

## Objective
Implement all 11 SaaS integrations by extending `BaseIntegration`. Each integration must define its tool schemas, credential config, default actions, and a real HTTP execution layer.

## Requirements
- Each integration lives in `api/src/modules/integrations/saas/<provider>/`
- Each integration registers itself in `IntegrationRegistry` on module init
- All HTTP calls use the provider's official Node.js SDK where available, falling back to Axios
- No hardcoded credentials — always read from decrypted integration config

## Subtasks

For each of the 11 providers below, implement:
1. `<provider>.integration.ts` — extends `BaseIntegration`, implements `getTools()` and `executeTool()`
2. `<provider>.module.ts` — NestJS module, registers integration in registry on init
3. Seed `defaultActions()` array (the actions users can enable/disable)

### Providers & Their Tool Sets

#### GitHub (`github`)
Config: `{ accessToken }`
Actions:
- `github__list_repos` — list repositories
- `github__get_issues` — list issues with filters (repo, assignee, state)
- `github__create_issue` — create issue
- `github__update_issue` — update issue (title, body, labels, state)
- `github__list_pull_requests` — list PRs
- `github__get_pull_request` — get PR details
- `github__merge_pull_request` — merge PR
SDK: `@octokit/rest`

#### Slack (`slack`)
Config: `{ botToken }`
Actions:
- `slack__list_channels` — list public channels
- `slack__send_message` — post message to channel
- `slack__get_messages` — read channel messages (with limit)
- `slack__search_messages` — search messages
SDK: `@slack/web-api`

#### Stripe (`stripe`)
Config: `{ secretKey }`
Actions:
- `stripe__list_customers` — list customers with optional filters
- `stripe__get_customer` — get customer by ID
- `stripe__list_subscriptions` — list subscriptions
- `stripe__get_subscription` — get subscription
- `stripe__list_payments` — list payment intents
- `stripe__create_refund` — create refund
SDK: `stripe` (already installed)

#### HubSpot (`hubspot`)
Config: `{ accessToken }`
Actions:
- `hubspot__list_contacts` — list CRM contacts
- `hubspot__get_contact` — get contact by ID
- `hubspot__list_deals` — list deals
- `hubspot__get_deal` — get deal
- `hubspot__list_companies` — list companies
SDK: `@hubspot/api-client`

#### Linear (`linear`)
Config: `{ apiKey }`
Actions:
- `linear__list_issues` — list issues with filters
- `linear__create_issue` — create issue
- `linear__update_issue` — update issue status/assignee
- `linear__list_projects` — list projects
SDK: `@linear/sdk`

#### Notion (`notion`)
Config: `{ apiKey }`
Actions:
- `notion__search` — search pages and databases
- `notion__get_page` — get page content
- `notion__list_databases` — list databases
- `notion__query_database` — query database with filters
SDK: `@notionhq/client`

#### Google Drive (`google_drive`)
Config: `{ accessToken, refreshToken, clientId, clientSecret }`
Actions:
- `google_drive__list_files` — list files with optional query
- `google_drive__get_file` — get file metadata
- `google_drive__download_file` — download file content (text/pdf)
- `google_drive__search` — search files by name/content
SDK: `googleapis`

#### SMTP (`smtp`)
Config: `{ host, port, user, password, from }`
Actions:
- `smtp__send_email` — send email with subject, body, to, cc
SDK: `nodemailer`

#### Gmail (`gmail`)
Config: `{ accessToken, refreshToken, clientId, clientSecret }`
Actions:
- `gmail__list_messages` — list recent messages
- `gmail__get_message` — get message content
- `gmail__send_message` — send email
- `gmail__search_messages` — search by query string
SDK: `googleapis`

#### PostHog (`posthog`)
Config: `{ apiKey, host, projectId }`
Actions:
- `posthog__get_events` — fetch recent events
- `posthog__get_insights` — fetch dashboard insights
- `posthog__get_feature_flags` — list feature flags
- `posthog__query` — run HogQL query
SDK: `posthog-node` + Axios for query API

#### Intercom (`intercom`)
Config: `{ accessToken }`
Actions:
- `intercom__list_conversations` — list support conversations
- `intercom__get_conversation` — get conversation with messages
- `intercom__list_contacts` — list contacts
- `intercom__reply_conversation` — send reply to conversation
SDK: `intercom-client`

### Module Registration

- [ ] Create `SaasIntegrationsModule` that imports all 11 provider modules
- [ ] Import `SaasIntegrationsModule` in `IntegrationsModule`

### Frontend

- [ ] Integration config forms per provider (credential fields vary per provider)
  - Use a form schema map: `PROVIDER_CONFIG_FIELDS['github'] = [{ key: 'accessToken', label: 'Access Token', type: 'password' }]`
  - Render dynamically in the Add Integration modal

## Technical Notes
- `executeTool` must catch SDK errors and return `{ success: false, error: message }` — never throw raw SDK exceptions to the agent
- Rate limit errors from SDKs should be surfaced as `{ success: false, error: 'rate_limited', retryAfter: N }`
- For OAuth providers (Google Drive, Gmail), refresh access token before each call if `refreshToken` is present
- Tool input parameters must be validated with Zod before passing to SDK

## Acceptance Criteria
- [ ] Each integration registers with `IntegrationRegistry` on app start
- [ ] `testConnection` works for each provider
- [ ] Calling each enabled tool via `IntegrationRegistry.executeTool` returns real data
- [ ] Disabled actions return a 403-equivalent error, not SDK errors
- [ ] OAuth token refresh works transparently for Google Drive and Gmail
