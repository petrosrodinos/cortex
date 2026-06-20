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

### Step 2: API with Composio module (feature-flagged)
Deploy backend with:
- `COMPOSIO_ENABLED=true` env flag
- Startup sync runs
- Admin endpoints live
- Agent still uses legacy if flag off

### Step 3: Admin bootstrap
SUPER_ADMIN:
1. Verifies sync completed
2. Enables starter toolkit set
3. Sets connection tiers
4. Verifies tool sync for each

### Step 4: Frontend admin + user UI
Deploy frontend with new integrations experience.

### Step 5: Enable agent Composio
Set `COMPOSIO_AGENT_ENABLED=true` — agent uses meta tools.

### Step 6: Remove legacy SaaS
Deploy Phase 5 deletion after 1 week staging soak.

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

# Feature flags (temporary)
COMPOSIO_ENABLED=true
COMPOSIO_AGENT_ENABLED=true
```

Remove feature flags after full cutover.

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
| Composio module | Set `COMPOSIO_ENABLED=false` |
| Agent Composio | Set `COMPOSIO_AGENT_ENABLED=false` — legacy SaaS must still exist |
| Legacy removed | **Cannot rollback without redeploying previous git tag** |

**Critical:** Do not deploy Phase 5 (SaaS deletion) until staging soak passes.

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
