CREATE TYPE "ConversationKind" AS ENUM ('STANDARD', 'SCHEDULED_AGENT');

ALTER TABLE "conversations" ADD COLUMN "kind" "ConversationKind" NOT NULL DEFAULT 'STANDARD';

CREATE TABLE "scheduled_agents" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "org_uuid" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "cron_expression" TEXT NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "conversation_uuid" TEXT NOT NULL,
    "last_run_at" TIMESTAMP(3),
    "next_run_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scheduled_agents_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "scheduled_agents_uuid_key" ON "scheduled_agents"("uuid");
CREATE UNIQUE INDEX "scheduled_agents_conversation_uuid_key" ON "scheduled_agents"("conversation_uuid");
CREATE INDEX "scheduled_agents_org_uuid_idx" ON "scheduled_agents"("org_uuid");
CREATE INDEX "scheduled_agents_user_uuid_idx" ON "scheduled_agents"("user_uuid");
CREATE INDEX "scheduled_agents_is_enabled_idx" ON "scheduled_agents"("is_enabled");

ALTER TABLE "scheduled_agents" ADD CONSTRAINT "scheduled_agents_org_uuid_fkey" FOREIGN KEY ("org_uuid") REFERENCES "organizations"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "scheduled_agents" ADD CONSTRAINT "scheduled_agents_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "scheduled_agents" ADD CONSTRAINT "scheduled_agents_conversation_uuid_fkey" FOREIGN KEY ("conversation_uuid") REFERENCES "conversations"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
