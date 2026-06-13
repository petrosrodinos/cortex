-- CreateEnum
CREATE TYPE "IntegrationProvider" AS ENUM ('GITHUB', 'SLACK', 'STRIPE', 'HUBSPOT', 'LINEAR', 'NOTION', 'GOOGLE_DRIVE', 'SMTP', 'GMAIL', 'POSTHOG', 'INTERCOM', 'DATABASE_PG', 'DATABASE_MYSQL', 'DATABASE_MONGO', 'OPENAPI');

-- CreateEnum
CREATE TYPE "IntegrationStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ERROR');

-- CreateTable
CREATE TABLE "integrations" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "org_uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "provider" "IntegrationProvider" NOT NULL,
    "status" "IntegrationStatus" NOT NULL DEFAULT 'ACTIVE',
    "config" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integration_actions" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "integration_uuid" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "required_permission_key" TEXT,

    CONSTRAINT "integration_actions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "integrations_uuid_key" ON "integrations"("uuid");

-- CreateIndex
CREATE INDEX "integrations_org_uuid_idx" ON "integrations"("org_uuid");

-- CreateIndex
CREATE INDEX "integrations_provider_idx" ON "integrations"("provider");

-- CreateIndex
CREATE INDEX "integrations_status_idx" ON "integrations"("status");

-- CreateIndex
CREATE UNIQUE INDEX "integration_actions_uuid_key" ON "integration_actions"("uuid");

-- CreateIndex
CREATE INDEX "integration_actions_integration_uuid_idx" ON "integration_actions"("integration_uuid");

-- CreateIndex
CREATE INDEX "integration_actions_key_idx" ON "integration_actions"("key");

-- CreateIndex
CREATE UNIQUE INDEX "integration_actions_integration_uuid_key_key" ON "integration_actions"("integration_uuid", "key");

-- CreateIndex
CREATE UNIQUE INDEX "integration_actions_uuid_integration_uuid_key" ON "integration_actions"("uuid", "integration_uuid");

-- AddForeignKey
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_org_uuid_fkey" FOREIGN KEY ("org_uuid") REFERENCES "organizations"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integration_actions" ADD CONSTRAINT "integration_actions_integration_uuid_fkey" FOREIGN KEY ("integration_uuid") REFERENCES "integrations"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
