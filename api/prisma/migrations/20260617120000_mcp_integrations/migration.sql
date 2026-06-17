-- AlterEnum
ALTER TYPE "IntegrationProvider" ADD VALUE 'MCP';

-- CreateEnum
CREATE TYPE "McpTransportType" AS ENUM ('HTTP', 'SSE');

-- CreateEnum
CREATE TYPE "McpAuthType" AS ENUM ('NONE', 'BEARER', 'CUSTOM_HEADERS', 'OAUTH');

-- CreateTable
CREATE TABLE "mcp_integrations" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "integration_uuid" TEXT NOT NULL,
    "server_url" TEXT NOT NULL,
    "transport_type" "McpTransportType" NOT NULL DEFAULT 'HTTP',
    "auth_type" "McpAuthType" NOT NULL DEFAULT 'NONE',
    "auth_config" TEXT NOT NULL,
    "server_name" TEXT,
    "discovered_tools" JSONB NOT NULL DEFAULT '[]',
    "last_tool_sync" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mcp_integrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mcp_integrations_uuid_key" ON "mcp_integrations"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "mcp_integrations_integration_uuid_key" ON "mcp_integrations"("integration_uuid");

-- CreateIndex
CREATE INDEX "mcp_integrations_transport_type_idx" ON "mcp_integrations"("transport_type");

-- CreateIndex
CREATE INDEX "mcp_integrations_auth_type_idx" ON "mcp_integrations"("auth_type");

-- AddForeignKey
ALTER TABLE "mcp_integrations" ADD CONSTRAINT "mcp_integrations_integration_uuid_fkey" FOREIGN KEY ("integration_uuid") REFERENCES "integrations"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
