UPDATE "integration_actions"
SET "required_permission_key" = 'integrations:read'
WHERE "required_permission_key" = 'org:integrations:use';

UPDATE "integration_actions"
SET "required_permission_key" = 'integrations:manage'
WHERE "required_permission_key" = 'org:integrations:manage';

UPDATE "organisation_tool_permissions"
SET "required_permission_key" = 'integrations:read'
WHERE "required_permission_key" = 'org:integrations:use';

UPDATE "organisation_tool_permissions"
SET "required_permission_key" = 'integrations:manage'
WHERE "required_permission_key" = 'org:integrations:manage';

INSERT INTO "role_permissions" ("uuid", "role_uuid", "permission_uuid")
SELECT gen_random_uuid(), "role_permissions"."role_uuid", "new_permission"."uuid"
FROM "role_permissions"
INNER JOIN "permissions" AS "old_permission"
  ON "old_permission"."uuid" = "role_permissions"."permission_uuid"
  AND "old_permission"."key" = 'org:integrations:use'
INNER JOIN "permissions" AS "new_permission"
  ON "new_permission"."key" = 'integrations:read'
ON CONFLICT ("role_uuid", "permission_uuid") DO NOTHING;

INSERT INTO "role_permissions" ("uuid", "role_uuid", "permission_uuid")
SELECT gen_random_uuid(), "role_permissions"."role_uuid", "new_permission"."uuid"
FROM "role_permissions"
INNER JOIN "permissions" AS "old_permission"
  ON "old_permission"."uuid" = "role_permissions"."permission_uuid"
  AND "old_permission"."key" = 'org:integrations:manage'
INNER JOIN "permissions" AS "new_permission"
  ON "new_permission"."key" = 'integrations:manage'
ON CONFLICT ("role_uuid", "permission_uuid") DO NOTHING;

DELETE FROM "role_permissions"
WHERE "permission_uuid" IN (
  SELECT "uuid" FROM "permissions" WHERE "key" IN ('org:integrations:manage', 'org:integrations:use')
);

DELETE FROM "permissions" WHERE "key" IN ('org:integrations:manage', 'org:integrations:use');
