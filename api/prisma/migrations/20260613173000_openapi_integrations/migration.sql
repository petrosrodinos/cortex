-- CreateEnum
CREATE TYPE "OpenApiAuthType" AS ENUM ('NONE', 'API_KEY', 'BEARER', 'OAUTH2', 'CUSTOM_HEADERS');

-- CreateTable
CREATE TABLE "openapi_integrations" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "integration_uuid" TEXT NOT NULL,
    "spec_url" TEXT,
    "spec_json" JSONB NOT NULL,
    "base_url" TEXT NOT NULL,
    "auth_type" "OpenApiAuthType" NOT NULL DEFAULT 'NONE',
    "auth_config" TEXT NOT NULL,
    "generated_tools" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "openapi_integrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "openapi_integrations_uuid_key" ON "openapi_integrations"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "openapi_integrations_integration_uuid_key" ON "openapi_integrations"("integration_uuid");

-- CreateIndex
CREATE INDEX "openapi_integrations_auth_type_idx" ON "openapi_integrations"("auth_type");

-- AddForeignKey
ALTER TABLE "openapi_integrations" ADD CONSTRAINT "openapi_integrations_integration_uuid_fkey" FOREIGN KEY ("integration_uuid") REFERENCES "integrations"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
