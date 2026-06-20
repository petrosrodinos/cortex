-- DropIndex
DROP INDEX "composio_toolkits_connection_tiers_idx";

-- CreateIndex
CREATE INDEX "composio_toolkits_connection_tiers_idx" ON "composio_toolkits"("connection_tiers");
