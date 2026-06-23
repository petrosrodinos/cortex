CREATE TYPE "AiResearchMode" AS ENUM ('DEFAULT', 'SEARCH', 'DEEP_RESEARCH');

ALTER TABLE "conversations"
ADD COLUMN "ai_research_mode" "AiResearchMode" NOT NULL DEFAULT 'DEFAULT';
