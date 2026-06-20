ALTER TABLE "organizations" ADD COLUMN "user_uuid" TEXT NOT NULL;

CREATE INDEX "organizations_user_uuid_idx" ON "organizations"("user_uuid");

ALTER TABLE "organizations"
  ADD CONSTRAINT "organizations_user_uuid_fkey"
  FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid")
  ON DELETE CASCADE
  ON UPDATE CASCADE;
