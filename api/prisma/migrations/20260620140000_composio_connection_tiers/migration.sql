ALTER TABLE "composio_toolkits" ADD COLUMN "connection_tiers" "ComposioConnectionTier"[] NOT NULL DEFAULT ARRAY[]::"ComposioConnectionTier"[];

UPDATE "composio_toolkits"
SET "connection_tiers" = ARRAY["connection_tier"]::"ComposioConnectionTier"[]
WHERE "connection_tier" IS NOT NULL;

DROP INDEX IF EXISTS "composio_toolkits_connection_tier_idx";

ALTER TABLE "composio_toolkits" DROP COLUMN "connection_tier";

CREATE INDEX "composio_toolkits_connection_tiers_idx" ON "composio_toolkits" USING GIN ("connection_tiers");
