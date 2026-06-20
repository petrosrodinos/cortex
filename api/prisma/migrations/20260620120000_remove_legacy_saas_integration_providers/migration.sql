DELETE FROM "integration_actions"
WHERE "integration_uuid" IN (
  SELECT "uuid"
  FROM "integrations"
  WHERE "provider" IN (
    'GITHUB',
    'SLACK',
    'STRIPE',
    'HUBSPOT',
    'LINEAR',
    'NOTION',
    'GOOGLE_DRIVE',
    'SMTP',
    'GMAIL',
    'RESEND',
    'SENDGRID',
    'POSTHOG',
    'INTERCOM'
  )
);

DELETE FROM "integrations"
WHERE "provider" IN (
  'GITHUB',
  'SLACK',
  'STRIPE',
  'HUBSPOT',
  'LINEAR',
  'NOTION',
  'GOOGLE_DRIVE',
  'SMTP',
  'GMAIL',
  'RESEND',
  'SENDGRID',
  'POSTHOG',
  'INTERCOM'
);

ALTER TYPE "IntegrationProvider" RENAME TO "IntegrationProvider_old";

CREATE TYPE "IntegrationProvider" AS ENUM (
  'DATABASE_PG',
  'DATABASE_MYSQL',
  'DATABASE_MONGO',
  'OPENAPI',
  'MCP'
);

ALTER TABLE "integrations"
  ALTER COLUMN "provider" TYPE "IntegrationProvider"
  USING "provider"::text::"IntegrationProvider";

DROP TYPE "IntegrationProvider_old";
