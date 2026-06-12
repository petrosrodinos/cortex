# Task: Multi-Tenancy Foundation — Organizations, Members & RBAC

## Objective
Implement multi-tenant architecture: organizations, organization membership, organization-level RBAC with system and custom roles, and organization-context switching in the JWT auth flow.

## Requirements
- A user can belong to multiple orgs with different roles in each
- Org data is strictly isolated — every query must scope to `org_id`
- JWT must carry `organizationUuid` and the user's role/permissions for that organization
- Switching org reissues a scoped JWT without requiring re-login
- System roles: Owner, Admin, Manager, Employee (non-deletable)
- Custom roles with arbitrary permission keys per org
- Permission keys follow the pattern: `resource:action` e.g. `integrations:github:read_repos`

## Subtasks

### Backend

- [ ] Extend Prisma schema
  - Add `Organization` model: `id, uuid, name, slug (unique), logo_url?, created_at, updated_at`
  - Add `OrganizationMember` model: `id, org_id, user_id, role_id, status(ACTIVE|INVITED|SUSPENDED), invited_at, joined_at?`
  - Add `OrganizationRole` model: `id, org_id, name, is_system: Boolean`
  - Add `Permission` model: `id, key, label, group` (seeded, not user-created)
  - Add `RolePermission` join: `role_id, permission_id`
  - Add `AuditLog` model (stub): `id, org_id, user_id, action, resource_type, resource_id, metadata: Json, created_at`
  - Run `prisma migrate dev`

- [ ] Seed system permissions
  - Create `prisma/seeds/permissions.seed.ts` with all permission keys (group by: org, integrations, ai, files)
  - Run seed as part of `prisma db seed`

- [ ] Implement `OrganizationsModule` (`api/src/modules/organizations/`)
  - `organizations.service.ts`: create, findAll (for user), findOne, update, delete
  - `organizations.controller.ts`: CRUD routes under `/organizations`
  - Enforce: only Owner can delete org

- [ ] Implement `MembersModule` (`api/src/modules/members/`)
  - `members.service.ts`: invite (create with INVITED status), update role/status, remove
  - `members.controller.ts`: routes under `/organizations/:organizationUuid/members`

- [ ] Implement `RolesModule` (`api/src/modules/roles/`)
  - `roles.service.ts`: CRUD for custom roles, bulk-set permissions on a role
  - Seed system roles (Owner/Admin/Manager/Employee) when an org is created
  - `roles.controller.ts`: routes under `/organizations/:organizationUuid/roles`

- [ ] Extend JWT strategy
  - Add `organizationUuid`, `organizationRole`, `organizationPermissions[]` to JWT payload when `POST /auth/switch-organization` is called
  - `switch-organization.dto.ts`: `{ organizationUuid: string }`
  - Validate user is an ACTIVE member of the requested org before issuing token

- [ ] Implement `OrgGuard`
  - Decorator `@OrgPermission('integrations:github:read_repos')`
  - Guard reads `organizationPermissions` from JWT and checks presence of required key
  - Returns 403 if missing

- [ ] Register all new modules in `AppModule`

### Frontend

- [ ] Add `Organization` and `OrganizationMember` TypeScript interfaces in `app/src/interfaces/`
- [ ] Create `organizations.service.ts` in `app/src/services/` (API calls)
- [ ] Zustand store: `app/src/stores/organization/` — current org, user's orgs list
- [ ] Organization switcher component: sidebar bottom section showing current organization name + avatar, dropdown of accessible organizations, calls `POST /auth/switch-organization` and refreshes JWT
- [ ] Members management page: `app/src/pages/organizations/members/`
- [ ] Roles management page: `app/src/pages/organizations/roles/`

## Technical Notes
- Slug must be unique across orgs — use `nanoid` or slugify on org name with collision retry
- `is_system` roles must never appear in delete endpoints (guard in service layer)
- Permission keys are seeded centrally; custom roles merely reference them
- Use Prisma `$transaction` when creating org (org + seed roles + add creator as Owner)
- AuditLog entries are fire-and-forget (use BullMQ queue, not inline) — implement stub queue in Phase 8

## Acceptance Criteria
- [ ] User can create an org and is automatically the Owner
- [ ] User can invite another user by email; invited user appears with INVITED status
- [ ] User can switch organizations; new JWT contains correct `organizationUuid` and permissions
- [ ] Admin can create custom role, assign permissions, assign role to member
- [ ] All org endpoints return 403 if user is not a member of the org
- [ ] System roles cannot be deleted
