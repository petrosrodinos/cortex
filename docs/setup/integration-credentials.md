# Integration Credentials Setup Guide

Most SaaS integrations now connect through Composio. Users should not paste
provider OAuth tokens, refresh tokens, SMTP passwords, or app secrets into
Cortex for Gmail, Google Drive, Slack, GitHub, HubSpot, Linear, Notion, Stripe,
PostHog, Intercom, Resend, SendGrid, or similar SaaS apps.

## Composio-Managed SaaS Apps

1. Set `COMPOSIO_API_KEY` in the API environment.
2. Set `COMPOSIO_WEBHOOK_SECRET` when trigger webhooks are enabled.
3. Set `APP_URL` to the frontend origin so OAuth callbacks return to
   `/dashboard/integrations/callback`.
4. In the admin Composio dashboard, sync toolkits and enable the starter
   toolkits for the organization.
5. In the user integrations page, select the toolkit and use the Connect flow.

Composio owns the provider authorization flow and stores provider credentials.
Cortex stores only local metadata such as toolkit slug, connected account id,
organization, user ownership, status, and trigger configuration.

## Custom Database Integrations

Database credentials are still configured directly in Cortex for custom
database connections.

Use least-privilege credentials whenever possible:

- Read-only credentials for query-only agents.
- Separate development and production credentials.
- Network allowlists for the API runtime where the database supports them.

## Custom OpenAPI Integrations

OpenAPI integrations can still use direct authentication configured in Cortex.
Store only the credentials required by the target API, such as:

- API key headers.
- Bearer tokens.
- Basic auth username and password.

Do not add SaaS apps here when a Composio toolkit exists for that app.

## MCP Integrations

MCP integrations can still require their own connection settings. For MCP
servers that use OAuth or external API credentials, configure the server-side
credentials required by that MCP server and keep scopes minimal.

Composio-managed SaaS credentials should not be duplicated in MCP or OpenAPI
integrations unless there is a specific custom server requirement.
