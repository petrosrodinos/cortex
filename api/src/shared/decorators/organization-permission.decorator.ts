import { SetMetadata } from '@nestjs/common';

export const ORGANIZATION_PERMISSIONS_KEY = 'organization_permissions';
export const OrganizationPermission = (...permissions: string[]) => SetMetadata(ORGANIZATION_PERMISSIONS_KEY, permissions);
