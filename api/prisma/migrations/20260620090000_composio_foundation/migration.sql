-- CreateEnum
CREATE TYPE "ComposioConnectionTier" AS ENUM ('ORG_SHARED', 'USER_PERSONAL');

-- CreateEnum
CREATE TYPE "ComposioSyncType" AS ENUM ('FULL', 'TOOLKIT', 'TOOLS');

-- CreateEnum
CREATE TYPE "ComposioSyncStatus" AS ENUM ('RUNNING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ComposioAccountStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'EXPIRED', 'PENDING');

-- AlterTable
ALTER TABLE "conversations" ADD COLUMN "composio_session_id" TEXT;

-- AlterTable
ALTER TABLE "tool_calls" ADD COLUMN "provider_type" TEXT,
ADD COLUMN "composio_tool_slug" TEXT,
ADD COLUMN "composio_session_id" TEXT;

-- CreateTable
CREATE TABLE "composio_toolkits" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "logo_url" TEXT,
    "categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tool_count" INTEGER NOT NULL DEFAULT 0,
    "auth_schemes" JSONB NOT NULL DEFAULT '[]',
    "connection_tiers" "ComposioConnectionTier"[] NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT false,
    "composio_metadata" JSONB,
    "last_synced_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "composio_toolkits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "composio_toolkit_tools" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "toolkit_uuid" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "input_schema" JSONB NOT NULL,
    "output_schema" JSONB,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "composio_version" TEXT,
    "last_synced_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "composio_toolkit_tools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "composio_sync_runs" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "sync_type" "ComposioSyncType" NOT NULL,
    "status" "ComposioSyncStatus" NOT NULL DEFAULT 'RUNNING',
    "toolkits_upserted" INTEGER NOT NULL DEFAULT 0,
    "tools_upserted" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "composio_sync_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organisation_enabled_toolkits" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "org_uuid" TEXT NOT NULL,
    "toolkit_uuid" TEXT NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organisation_enabled_toolkits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organisation_tool_permissions" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "org_uuid" TEXT NOT NULL,
    "tool_uuid" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "requires_approval" BOOLEAN NOT NULL DEFAULT false,
    "required_permission_key" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organisation_tool_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "composio_connected_accounts" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "composio_account_id" TEXT NOT NULL,
    "composio_user_id" TEXT NOT NULL,
    "org_uuid" TEXT NOT NULL,
    "user_uuid" TEXT,
    "toolkit_uuid" TEXT NOT NULL,
    "status" "ComposioAccountStatus" NOT NULL DEFAULT 'PENDING',
    "account_label" TEXT,
    "last_synced_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "composio_connected_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "composio_triggers" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "composio_trigger_id" TEXT NOT NULL,
    "org_uuid" TEXT NOT NULL,
    "composio_user_id" TEXT NOT NULL,
    "toolkit_uuid" TEXT NOT NULL,
    "trigger_slug" TEXT NOT NULL,
    "connected_account_id" TEXT NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB NOT NULL DEFAULT '{}',
    "webhook_subscription_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "composio_triggers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "conversations_composio_session_id_key" ON "conversations"("composio_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "composio_toolkits_uuid_key" ON "composio_toolkits"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "composio_toolkits_slug_key" ON "composio_toolkits"("slug");

-- CreateIndex
CREATE INDEX "composio_toolkits_is_enabled_idx" ON "composio_toolkits"("is_enabled");

-- CreateIndex
CREATE INDEX "composio_toolkits_connection_tiers_idx" ON "composio_toolkits" USING GIN ("connection_tiers");

-- CreateIndex
CREATE UNIQUE INDEX "composio_toolkit_tools_uuid_key" ON "composio_toolkit_tools"("uuid");

-- CreateIndex
CREATE INDEX "composio_toolkit_tools_toolkit_uuid_idx" ON "composio_toolkit_tools"("toolkit_uuid");

-- CreateIndex
CREATE INDEX "composio_toolkit_tools_is_enabled_idx" ON "composio_toolkit_tools"("is_enabled");

-- CreateIndex
CREATE UNIQUE INDEX "composio_toolkit_tools_toolkit_uuid_slug_key" ON "composio_toolkit_tools"("toolkit_uuid", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "composio_sync_runs_uuid_key" ON "composio_sync_runs"("uuid");

-- CreateIndex
CREATE INDEX "composio_sync_runs_status_idx" ON "composio_sync_runs"("status");

-- CreateIndex
CREATE INDEX "composio_sync_runs_started_at_idx" ON "composio_sync_runs"("started_at");

-- CreateIndex
CREATE UNIQUE INDEX "organisation_enabled_toolkits_uuid_key" ON "organisation_enabled_toolkits"("uuid");

-- CreateIndex
CREATE INDEX "organisation_enabled_toolkits_org_uuid_idx" ON "organisation_enabled_toolkits"("org_uuid");

-- CreateIndex
CREATE INDEX "organisation_enabled_toolkits_toolkit_uuid_idx" ON "organisation_enabled_toolkits"("toolkit_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "organisation_enabled_toolkits_org_uuid_toolkit_uuid_key" ON "organisation_enabled_toolkits"("org_uuid", "toolkit_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "organisation_tool_permissions_uuid_key" ON "organisation_tool_permissions"("uuid");

-- CreateIndex
CREATE INDEX "organisation_tool_permissions_org_uuid_idx" ON "organisation_tool_permissions"("org_uuid");

-- CreateIndex
CREATE INDEX "organisation_tool_permissions_tool_uuid_idx" ON "organisation_tool_permissions"("tool_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "organisation_tool_permissions_org_uuid_tool_uuid_key" ON "organisation_tool_permissions"("org_uuid", "tool_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "composio_connected_accounts_uuid_key" ON "composio_connected_accounts"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "composio_connected_accounts_composio_account_id_key" ON "composio_connected_accounts"("composio_account_id");

-- CreateIndex
CREATE INDEX "composio_connected_accounts_org_uuid_idx" ON "composio_connected_accounts"("org_uuid");

-- CreateIndex
CREATE INDEX "composio_connected_accounts_user_uuid_idx" ON "composio_connected_accounts"("user_uuid");

-- CreateIndex
CREATE INDEX "composio_connected_accounts_toolkit_uuid_idx" ON "composio_connected_accounts"("toolkit_uuid");

-- CreateIndex
CREATE INDEX "composio_connected_accounts_composio_user_id_idx" ON "composio_connected_accounts"("composio_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "composio_triggers_uuid_key" ON "composio_triggers"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "composio_triggers_composio_trigger_id_key" ON "composio_triggers"("composio_trigger_id");

-- CreateIndex
CREATE INDEX "composio_triggers_org_uuid_idx" ON "composio_triggers"("org_uuid");

-- CreateIndex
CREATE INDEX "composio_triggers_toolkit_uuid_idx" ON "composio_triggers"("toolkit_uuid");

-- CreateIndex
CREATE INDEX "composio_triggers_is_enabled_idx" ON "composio_triggers"("is_enabled");

-- AddForeignKey
ALTER TABLE "composio_toolkit_tools" ADD CONSTRAINT "composio_toolkit_tools_toolkit_uuid_fkey" FOREIGN KEY ("toolkit_uuid") REFERENCES "composio_toolkits"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organisation_enabled_toolkits" ADD CONSTRAINT "organisation_enabled_toolkits_org_uuid_fkey" FOREIGN KEY ("org_uuid") REFERENCES "organizations"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organisation_enabled_toolkits" ADD CONSTRAINT "organisation_enabled_toolkits_toolkit_uuid_fkey" FOREIGN KEY ("toolkit_uuid") REFERENCES "composio_toolkits"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organisation_tool_permissions" ADD CONSTRAINT "organisation_tool_permissions_org_uuid_fkey" FOREIGN KEY ("org_uuid") REFERENCES "organizations"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organisation_tool_permissions" ADD CONSTRAINT "organisation_tool_permissions_tool_uuid_fkey" FOREIGN KEY ("tool_uuid") REFERENCES "composio_toolkit_tools"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "composio_connected_accounts" ADD CONSTRAINT "composio_connected_accounts_org_uuid_fkey" FOREIGN KEY ("org_uuid") REFERENCES "organizations"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "composio_connected_accounts" ADD CONSTRAINT "composio_connected_accounts_toolkit_uuid_fkey" FOREIGN KEY ("toolkit_uuid") REFERENCES "composio_toolkits"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "composio_triggers" ADD CONSTRAINT "composio_triggers_org_uuid_fkey" FOREIGN KEY ("org_uuid") REFERENCES "organizations"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "composio_triggers" ADD CONSTRAINT "composio_triggers_toolkit_uuid_fkey" FOREIGN KEY ("toolkit_uuid") REFERENCES "composio_toolkits"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
