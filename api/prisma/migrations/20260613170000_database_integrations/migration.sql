-- CreateEnum
CREATE TYPE "DatabaseType" AS ENUM ('POSTGRESQL', 'MYSQL', 'MONGODB');

-- CreateEnum
CREATE TYPE "DatabaseOperation" AS ENUM ('READ', 'INSERT', 'UPDATE', 'DELETE');

-- CreateTable
CREATE TABLE "database_integrations" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "integration_uuid" TEXT NOT NULL,
    "db_type" "DatabaseType" NOT NULL,
    "connection_string" TEXT NOT NULL,
    "schema_cache" JSONB,
    "allowed_ops" "DatabaseOperation"[] NOT NULL DEFAULT ARRAY['READ']::"DatabaseOperation"[],
    "last_schema_sync" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "database_integrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "database_integrations_uuid_key" ON "database_integrations"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "database_integrations_integration_uuid_key" ON "database_integrations"("integration_uuid");

-- CreateIndex
CREATE INDEX "database_integrations_db_type_idx" ON "database_integrations"("db_type");

-- CreateIndex
CREATE INDEX "database_integrations_last_schema_sync_idx" ON "database_integrations"("last_schema_sync");

-- AddForeignKey
ALTER TABLE "database_integrations" ADD CONSTRAINT "database_integrations_integration_uuid_fkey" FOREIGN KEY ("integration_uuid") REFERENCES "integrations"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
