CREATE TABLE "saved_prompts" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "org_uuid" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saved_prompts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "saved_prompts_uuid_key" ON "saved_prompts"("uuid");

CREATE INDEX "saved_prompts_org_uuid_idx" ON "saved_prompts"("org_uuid");

CREATE INDEX "saved_prompts_user_uuid_idx" ON "saved_prompts"("user_uuid");

ALTER TABLE "saved_prompts" ADD CONSTRAINT "saved_prompts_org_uuid_fkey" FOREIGN KEY ("org_uuid") REFERENCES "organizations"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "saved_prompts" ADD CONSTRAINT "saved_prompts_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
