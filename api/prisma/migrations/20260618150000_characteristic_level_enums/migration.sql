CREATE TYPE "CharacteristicLevel" AS ENUM ('LESS', 'DEFAULT', 'MORE');

ALTER TABLE "conversation_personalizations" ALTER COLUMN "warm" DROP DEFAULT;
ALTER TABLE "conversation_personalizations" ALTER COLUMN "enthusiastic" DROP DEFAULT;
ALTER TABLE "conversation_personalizations" ALTER COLUMN "headers_lists" DROP DEFAULT;
ALTER TABLE "conversation_personalizations" ALTER COLUMN "emoji" DROP DEFAULT;

ALTER TABLE "conversation_personalizations"
  ALTER COLUMN "warm" TYPE "CharacteristicLevel" USING (
    CASE WHEN "warm" = true THEN 'MORE'::"CharacteristicLevel" ELSE 'DEFAULT'::"CharacteristicLevel" END
  ),
  ALTER COLUMN "enthusiastic" TYPE "CharacteristicLevel" USING (
    CASE WHEN "enthusiastic" = true THEN 'MORE'::"CharacteristicLevel" ELSE 'DEFAULT'::"CharacteristicLevel" END
  ),
  ALTER COLUMN "headers_lists" TYPE "CharacteristicLevel" USING (
    CASE WHEN "headers_lists" = true THEN 'MORE'::"CharacteristicLevel" ELSE 'DEFAULT'::"CharacteristicLevel" END
  ),
  ALTER COLUMN "emoji" TYPE "CharacteristicLevel" USING (
    CASE WHEN "emoji" = true THEN 'MORE'::"CharacteristicLevel" ELSE 'DEFAULT'::"CharacteristicLevel" END
  );

ALTER TABLE "conversation_personalizations" ALTER COLUMN "warm" SET DEFAULT 'DEFAULT';
ALTER TABLE "conversation_personalizations" ALTER COLUMN "enthusiastic" SET DEFAULT 'DEFAULT';
ALTER TABLE "conversation_personalizations" ALTER COLUMN "headers_lists" SET DEFAULT 'DEFAULT';
ALTER TABLE "conversation_personalizations" ALTER COLUMN "emoji" SET DEFAULT 'DEFAULT';
