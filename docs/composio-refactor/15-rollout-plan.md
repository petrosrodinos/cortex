# 15 — Rollout Plan

## Environments

| Env | Composio project | Notes |
|-----|------------------|-------|
| local | Dev project | `composio login` for CLI debug |
| development | Shared dev project | Auto sync on deploy |
| staging | Staging project | Full QA |
| production | Production project | Separate API key |

One Composio project per environment — never share keys.

## Deployment Sequence

### Step 1: Database migration
Deploy migration adding Composio tables. No behavior change yet.

### Step 2: API with Composio module
Deploy backend with:
- `COMPOSIO_API_KEY`
- `APP_URL`
- Startup sync runs
- Admin endpoints live

### Step 3: Admin bootstrap
SUPER_ADMIN:
1. Verifies sync completed
2. Enables starter toolkit set
3. Sets connection tiers
4. Verifies tool sync for each

### Step 4: Frontend admin + user UI
Deploy frontend with new integrations experience.

### Step 5: Verify agent Composio
Agent uses Composio meta tools once the API is deployed with enabled toolkits and connected accounts.

### Step 6: Remove legacy SaaS
Deploy Phase 5 enum/data cleanup after staging verification.

### Step 7: Triggers
Enable webhook URL in Composio dashboard per environment.
Deploy trigger processor.

## Environment Variables Rollout

```bash
# Required (all envs)
COMPOSIO_API_KEY=
APP_URL=https://app.example.com

# Staging/production
COMPOSIO_WEBHOOK_SECRET=

```

## Monitoring

### Metrics to track
- `composio_sync_duration_seconds`
- `composio_sync_toolkits_total`
- `composio_connect_requests_total`
- `composio_tool_executions_total` (from tool_calls)
- `composio_webhook_events_total`
- Agent execution failure rate (compare pre/post)

### Alerts
- Sync failed on startup
- Sync stale > 48h
- Webhook signature failures spike
- Composio API 5xx rate

### Logs
Structured logging in:
- `ComposioSyncService`
- `ComposioConnectionsService`
- `ComposioSessionService`
- Webhook handler

Include: `org_uuid`, `user_uuid`, `toolkit_slug`, `composio_session_id` (never tokens).

## Rollback Plan

| Phase | Rollback |
|-------|----------|
| Migration only | Tables exist but unused — no action |
| Composio module | Redeploy previous API build before Phase 5 enum cleanup |
| Agent Composio | Disable enabled toolkits / connected accounts while investigating |
| Legacy removed | **Cannot rollback without redeploying previous git tag** |

**Critical:** Do not deploy Phase 5 enum cleanup until staging verification passes.

## Staging Soak Criteria (1 week)

- [ ] 10+ successful OAuth connections across toolkits
- [ ] 50+ agent executions with Composio tools
- [ ] Zero sync failures for 7 days
- [ ] Triggers tested with at least 2 toolkit types
- [ ] No P0/P1 bugs open

## Production Cutover

1. Maintenance window **not required** — dev environment has no production users per scope
2. Deploy all phases in sequence
3. SUPER_ADMIN bootstrap production catalog
4. Smoke test: connect + agent message + trigger

## Post-Launch

- Weekly manual sync via admin (or cron if sync becomes slow)
- Review Composio usage dashboard for quota
- Evaluate toolkit version pinning after first month
- Consider org-admin toolkit enablement (future — currently admin-curated only)

## Communication

Internal team notification:
- SaaS credential forms removed
- New OAuth connect flow
- Admin must enable toolkits before users see them
- Agent behavior changes (meta tools vs named github__ tools)

## Success Criteria

| Metric | Target |
|--------|--------|
| SaaS providers in codebase | 0 custom modules |
| Composio toolkits enabled (starter) | ≥ 10 |
| OAuth connect success rate | > 95% |
| Agent tool execution success | ≥ legacy baseline |
| Startup sync time (enabled toolkits only) | < 60s |
| Security gaps (org path validation) | 0 open |
