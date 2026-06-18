CREATE TYPE "ResponseStyle" AS ENUM ('DEFAULT', 'PROFESSIONAL', 'FRIENDLY', 'CANDID', 'QUIRKY', 'EFFICIENT', 'CYNICAL');

CREATE TABLE "conversation_personalizations" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "org_uuid" TEXT NOT NULL,
    "response_style" "ResponseStyle" NOT NULL DEFAULT 'DEFAULT',
    "warm" BOOLEAN NOT NULL DEFAULT false,
    "enthusiastic" BOOLEAN NOT NULL DEFAULT false,
    "headers_lists" BOOLEAN NOT NULL DEFAULT false,
    "emoji" BOOLEAN NOT NULL DEFAULT false,
    "custom_instructions" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversation_personalizations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "conversation_personalizations_uuid_key" ON "conversation_personalizations"("uuid");
CREATE UNIQUE INDEX "conversation_personalizations_user_uuid_org_uuid_key" ON "conversation_personalizations"("user_uuid", "org_uuid");
CREATE INDEX "conversation_personalizations_user_uuid_idx" ON "conversation_personalizations"("user_uuid");
CREATE INDEX "conversation_personalizations_org_uuid_idx" ON "conversation_personalizations"("org_uuid");

ALTER TABLE "conversation_personalizations" ADD CONSTRAINT "conversation_personalizations_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "conversation_personalizations" ADD CONSTRAINT "conversation_personalizations_org_uuid_fkey" FOREIGN KEY ("org_uuid") REFERENCES "organizations"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
