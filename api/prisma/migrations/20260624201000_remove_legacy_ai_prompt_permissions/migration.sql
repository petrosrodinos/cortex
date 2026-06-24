INSERT INTO "role_permissions" ("uuid", "role_uuid", "permission_uuid")
SELECT gen_random_uuid(), "role_permissions"."role_uuid", "new_permission"."uuid"
FROM "role_permissions"
INNER JOIN "permissions" AS "old_permission"
  ON "old_permission"."uuid" = "role_permissions"."permission_uuid"
  AND "old_permission"."key" = 'ai:prompts:read'
INNER JOIN "permissions" AS "new_permission"
  ON "new_permission"."key" = 'agents:read'
ON CONFLICT ("role_uuid", "permission_uuid") DO NOTHING;

INSERT INTO "role_permissions" ("uuid", "role_uuid", "permission_uuid")
SELECT gen_random_uuid(), "role_permissions"."role_uuid", "new_permission"."uuid"
FROM "role_permissions"
INNER JOIN "permissions" AS "old_permission"
  ON "old_permission"."uuid" = "role_permissions"."permission_uuid"
  AND "old_permission"."key" = 'ai:prompts:write'
INNER JOIN "permissions" AS "new_permission"
  ON "new_permission"."key" = 'agents:write'
ON CONFLICT ("role_uuid", "permission_uuid") DO NOTHING;

DELETE FROM "role_permissions"
WHERE "permission_uuid" IN (
  SELECT "uuid" FROM "permissions" WHERE "key" IN ('ai:prompts:read', 'ai:prompts:write')
);

DELETE FROM "permissions" WHERE "key" IN ('ai:prompts:read', 'ai:prompts:write');
