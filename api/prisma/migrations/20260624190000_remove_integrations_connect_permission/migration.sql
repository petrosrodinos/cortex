UPDATE "integration_actions"
SET "required_permission_key" = 'integrations:read'
WHERE "required_permission_key" = 'integrations:connect';

UPDATE "organisation_tool_permissions"
SET "required_permission_key" = 'integrations:read'
WHERE "required_permission_key" = 'integrations:connect';

DELETE FROM "role_permissions"
WHERE "permission_uuid" IN (
  SELECT "uuid" FROM "permissions" WHERE "key" = 'integrations:connect'
);

DELETE FROM "permissions" WHERE "key" = 'integrations:connect';
