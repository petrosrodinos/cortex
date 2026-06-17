ALTER TABLE "agent_executions" ADD COLUMN "tokens_used" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "agent_executions" ADD COLUMN "cost_usd" DECIMAL(65,30) NOT NULL DEFAULT 0;
