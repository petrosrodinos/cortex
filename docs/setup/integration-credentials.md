# Integration Credentials Setup Guide

This guide explains how to obtain credentials for each integration supported by Cortex. All credentials are stored encrypted at rest — you only provide them once during setup.

---

## Overview: API Keys vs OAuth Tokens

**API key / access token** — Copy a single token from the provider's dashboard and paste it in. Most integrations use this approach (GitHub, Slack, Stripe, etc.).

**OAuth 2.0** — Requires creating an OAuth app in the provider's developer console, running a browser-based authorization flow, and capturing both an access token *and* a refresh token. Cortex uses the refresh token to obtain new access tokens automatically when they expire. Google Drive and Gmail use this flow.

---

## GitHub

- **Token type**: Personal access token (fine-grained recommended)
- **Where**: github.com/settings/tokens/new

### Steps
1. Go to **Settings → Developer settings → Personal access tokens → Fine-grained tokens**.
2. Click **Generate new token**, set an expiry, and select the target repositories.
3. Grant the following permissions:
   - Contents: Read
   - Issues: Read and write
   - Pull requests: Read and write
   - Metadata: Read (required automatically)
4. Copy the generated token — it is only shown once.

> **Note**: Classic tokens can be set to no expiry but are less secure. Fine-grained tokens are recommended for production.

---

## Slack

- **Token type**: Bot token (`xoxb-...`)
- **Where**: api.slack.com/apps

### Steps
1. Go to **api.slack.com/apps** and create a new app (from scratch).
2. Under **OAuth & Permissions → Scopes → Bot Token Scopes**, add:
   - `channels:read`
   - `chat:write`
   - `users:read`
   - `files:read`
3. Click **Install to Workspace** at the top of the OAuth & Permissions page.
4. Copy the **Bot User OAuth Token** (starts with `xoxb-`).

> The app must be installed to the workspace before the token becomes active.

---

## Stripe

- **Token type**: Secret key (`sk_live_...` or `sk_test_...`)
- **Where**: dashboard.stripe.com/apikeys

### Steps
1. Go to the **Stripe Dashboard → Developers → API keys**.
2. For production, create a **Restricted key** and enable only the API resources the agent needs (e.g. Customers, PaymentIntents, Invoices).
3. Copy the secret key.

> Use `sk_test_...` keys during development. Never expose secret keys in client-side code.

---

## HubSpot

- **Token type**: Private app access token
- **Where**: app.hubspot.com/private-apps

### Steps
1. Go to **HubSpot → Settings → Integrations → Private Apps → Create a private app**.
2. Under **Scopes**, add the CRM scopes the agent needs (e.g. `crm.objects.contacts.read`, `crm.objects.contacts.write`).
3. Click **Create app** and copy the access token from the **Auth** tab.

---

## Linear

- **Token type**: Personal API key
- **Where**: linear.app/settings/api

### Steps
1. Go to **Linear → Settings → API → Personal API keys**.
2. Click **Create key**, give it a descriptive label, and copy it.

---

## Notion

- **Token type**: Internal integration secret
- **Where**: notion.so/my-integrations

### Steps
1. Go to **notion.so/my-integrations → New integration**.
2. Set the required capabilities (Read content, Update content, etc.) and submit.
3. Copy the **Internal Integration Secret**.
4. **Important**: For each Notion database you want the agent to access, open the database page, click the `•••` menu → **Connections**, and add your integration.

---

## Google OAuth (Google Drive & Gmail)

Google Drive and Gmail both use OAuth 2.0 and require a Google Cloud project.

### 1. Create a Google Cloud project

1. Open [Google Cloud Console](https://console.cloud.google.com).
2. Click the project selector → **New Project** → give it a name → **Create**.

### 2. Enable the required API

- For Google Drive: **APIs & Services → Library → search "Google Drive API" → Enable**.
- For Gmail: **APIs & Services → Library → search "Gmail API" → Enable**.

### 3. Configure the OAuth consent screen

1. Go to **APIs & Services → OAuth consent screen**.
2. Choose **External** (unless you are within a Google Workspace organization) → **Create**.
3. Fill in the app name, support email, and developer contact email.
4. Under **Scopes**, add:
   - Google Drive: `https://www.googleapis.com/auth/drive`
   - Gmail: `https://www.googleapis.com/auth/gmail.modify` (or `.readonly` for read-only)
5. Save and continue through the remaining screens.

### 4. Create OAuth client credentials

1. Go to **APIs & Services → Credentials → Create credentials → OAuth client ID**.
2. Application type: **Web application**.
3. Under **Authorized redirect URIs**, add your callback URL.
   - For local testing you can add `http://localhost`.
   - For production add your actual callback URL.
4. Click **Create**. Copy the **Client ID** and **Client Secret**.

### 5. Obtain an access token and refresh token

**Option A — Google OAuth Playground** (easiest for manual setup):
1. Go to [developers.google.com/oauthplayground](https://developers.google.com/oauthplayground).
2. Click the gear icon → check **"Use your own OAuth credentials"** → enter your Client ID and Client Secret.
3. In step 1, select the required scope and click **Authorize APIs**.
4. In step 2, click **Exchange authorization code for tokens**.
5. Copy the **Access token** and **Refresh token**.

**Option B — oauth2l CLI**:
```sh
oauth2l fetch \
  --credentials=client_secret.json \
  --scope=https://www.googleapis.com/auth/drive \
  --output_format=json
```

### Token refresh

The access token expires after ~1 hour. Cortex uses the refresh token to obtain a new access token automatically, provided the Client ID and Client Secret are also stored. If the refresh token expires (uncommon unless explicitly revoked), repeat step 5.

---

## Auth0 and Custom OAuth Providers (MCP integrations)

When connecting an MCP server that uses OAuth, you need:

| Field | Where to find it |
|---|---|
| Client ID | Auth0 application settings → Client ID |
| Client Secret | Auth0 application settings → Client Secret |
| Token endpoint | `https://<your-tenant>.auth0.com/oauth/token` |
| Access token | Obtained by running the authorization flow against the token endpoint |
| Refresh token | Returned alongside the access token if `offline_access` scope is requested |
| Allowed origins | The domain(s) from which your MCP client initiates the authorization request |

### Steps (Auth0)
1. Go to **Auth0 Dashboard → Applications → Create Application → Machine to Machine** (for server-to-server) or **Regular Web Application** (for user-delegated flows).
2. Under **APIs**, authorize the application to call the API you need.
3. Copy the **Domain**, **Client ID**, and **Client Secret** from the Settings tab.
4. The token endpoint is `https://<your-domain>/oauth/token`.
5. Request a token:
```sh
curl -X POST https://<your-domain>/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "<CLIENT_ID>",
    "client_secret": "<CLIENT_SECRET>",
    "audience": "<API_AUDIENCE>",
    "grant_type": "client_credentials"
  }'
```
6. Use the returned `access_token` in the Cortex MCP integration form.

---

## SMTP

SMTP credentials depend on your mail provider.

**Gmail**:
1. Enable 2-Step Verification on your Google Account.
2. Go to **Google Account → Security → App Passwords → Generate**.
3. Use `smtp.gmail.com`, port `587` (STARTTLS) or `465` (SSL/TLS).
4. Username: your Gmail address. Password: the generated app password (not your account password).

**SendGrid (SMTP relay)**:
1. Go to **SendGrid → Settings → API Keys → Create API Key** with "Mail Send" permission.
2. Host: `smtp.sendgrid.net`, port `587`. Username: `apikey`. Password: your API key.

**Mailgun**:
1. Go to **Mailgun → Sending → Domains → your domain → SMTP credentials**.
2. Use the provided hostname, port, login, and password.

---

## Resend

Native Resend API integration (recommended over SMTP when using Resend).

1. Sign in at [resend.com](https://resend.com) and verify your sending domain under **Domains**.
2. Go to **API Keys** and create a key with sending access.
3. Copy the API key (starts with `re_`) into the Cortex integration form.
4. Set **From email** to an address on your verified domain (e.g. `hello@yourdomain.com`).

---

## SendGrid

Native SendGrid API integration (recommended over SMTP when using SendGrid).

1. Sign in to SendGrid and complete sender authentication for your domain or single sender.
2. Go to **Settings → API Keys → Create API Key** with **Mail Send** permission.
3. Copy the API key (starts with `SG.`) into the Cortex integration form.
4. Set **From email** to your verified sender address.
