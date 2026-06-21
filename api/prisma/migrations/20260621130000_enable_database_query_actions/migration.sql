UPDATE "integration_actions" ia
SET "enabled" = true
FROM "database_integrations" di
WHERE ia."integration_uuid" = di."integration_uuid"
  AND ia."key" = 'query'
  AND 'READ' = ANY (di."allowed_ops")
  AND ia."enabled" = false;
