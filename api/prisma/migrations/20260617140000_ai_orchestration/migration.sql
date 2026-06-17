CREATE TYPE "AiProviderType" AS ENUM ('OPENAI', 'CLAUDE', 'GROK');
CREATE TYPE "MessageRole" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM', 'TOOL');
CREATE TYPE "AgentExecutionStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'AWAITING_APPROVAL');
CREATE TYPE "ToolCallStatus" AS ENUM ('SUCCESS', 'FAILED');
CREATE TYPE "OutputType" AS ENUM ('TEXT', 'FILE_PDF', 'FILE_EXCEL', 'FILE_WORD', 'CHART', 'TABLE', 'WIDGET');

ALTER TABLE "integration_actions" ADD COLUMN "requires_approval" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "ai_providers" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "org_uuid" TEXT NOT NULL,
    "provider" "AiProviderType" NOT NULL,
    "api_key" TEXT NOT NULL,
    "default_model" TEXT NOT NULL,
    "model_routing" JSONB,
    "usage_limit_tokens" INTEGER,
    "usage_limit_cost_usd" DECIMAL(65,30),
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_providers_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "conversations" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "org_uuid" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "title" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "conversation_uuid" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "agent_executions" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "message_uuid" TEXT NOT NULL,
    "conversation_uuid" TEXT NOT NULL,
    "org_uuid" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "status" "AgentExecutionStatus" NOT NULL DEFAULT 'PENDING',
    "input" JSONB,
    "output" JSONB,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_executions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tool_calls" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "execution_uuid" TEXT NOT NULL,
    "integration_uuid" TEXT,
    "tool_name" TEXT NOT NULL,
    "input" JSONB,
    "output" JSONB,
    "status" "ToolCallStatus" NOT NULL,
    "error" TEXT,
    "tokens_used" INTEGER NOT NULL DEFAULT 0,
    "cost_usd" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "duration_ms" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tool_calls_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ai_providers_uuid_key" ON "ai_providers"("uuid");
CREATE INDEX "ai_providers_org_uuid_idx" ON "ai_providers"("org_uuid");
CREATE INDEX "ai_providers_provider_idx" ON "ai_providers"("provider");

CREATE UNIQUE INDEX "conversations_uuid_key" ON "conversations"("uuid");
CREATE INDEX "conversations_org_uuid_idx" ON "conversations"("org_uuid");
CREATE INDEX "conversations_user_uuid_idx" ON "conversations"("user_uuid");

CREATE UNIQUE INDEX "messages_uuid_key" ON "messages"("uuid");
CREATE INDEX "messages_conversation_uuid_idx" ON "messages"("conversation_uuid");
CREATE INDEX "messages_created_at_idx" ON "messages"("created_at");

CREATE UNIQUE INDEX "agent_executions_uuid_key" ON "agent_executions"("uuid");
CREATE INDEX "agent_executions_org_uuid_idx" ON "agent_executions"("org_uuid");
CREATE INDEX "agent_executions_user_uuid_idx" ON "agent_executions"("user_uuid");
CREATE INDEX "agent_executions_conversation_uuid_idx" ON "agent_executions"("conversation_uuid");
CREATE INDEX "agent_executions_status_idx" ON "agent_executions"("status");

CREATE UNIQUE INDEX "tool_calls_uuid_key" ON "tool_calls"("uuid");
CREATE INDEX "tool_calls_execution_uuid_idx" ON "tool_calls"("execution_uuid");
CREATE INDEX "tool_calls_integration_uuid_idx" ON "tool_calls"("integration_uuid");
CREATE INDEX "tool_calls_created_at_idx" ON "tool_calls"("created_at");

ALTER TABLE "ai_providers" ADD CONSTRAINT "ai_providers_org_uuid_fkey" FOREIGN KEY ("org_uuid") REFERENCES "organizations"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "conversations" ADD CONSTRAINT "conversations_org_uuid_fkey" FOREIGN KEY ("org_uuid") REFERENCES "organizations"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_uuid_fkey" FOREIGN KEY ("conversation_uuid") REFERENCES "conversations"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "agent_executions" ADD CONSTRAINT "agent_executions_message_uuid_fkey" FOREIGN KEY ("message_uuid") REFERENCES "messages"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "agent_executions" ADD CONSTRAINT "agent_executions_conversation_uuid_fkey" FOREIGN KEY ("conversation_uuid") REFERENCES "conversations"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "agent_executions" ADD CONSTRAINT "agent_executions_org_uuid_fkey" FOREIGN KEY ("org_uuid") REFERENCES "organizations"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "agent_executions" ADD CONSTRAINT "agent_executions_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tool_calls" ADD CONSTRAINT "tool_calls_execution_uuid_fkey" FOREIGN KEY ("execution_uuid") REFERENCES "agent_executions"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tool_calls" ADD CONSTRAINT "tool_calls_integration_uuid_fkey" FOREIGN KEY ("integration_uuid") REFERENCES "integrations"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
