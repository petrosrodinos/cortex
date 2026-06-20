import { ComposioConnectionTier } from 'generated/prisma';
import { z } from 'zod';

const optionalQueryString = z.string().trim().min(1).optional();
const booleanQueryString = z.enum(['true', 'false']).optional();
const positiveIntegerQueryString = z
  .string()
  .regex(/^[1-9]\d*$/)
  .optional();

export const ListOrgToolkitsSchema = z.object({
  search: optionalQueryString,
  category: optionalQueryString,
  connected: booleanQueryString,
  tier: z.nativeEnum(ComposioConnectionTier).optional(),
  page: positiveIntegerQueryString,
  limit: positiveIntegerQueryString,
});

export const UpdateOrgToolPermissionSchema = z.object({
  enabled: z.boolean().optional(),
  requires_approval: z.boolean().optional(),
  required_permission_key: z.string().trim().min(1).optional(),
});

export type ListOrgToolkitsType = z.infer<typeof ListOrgToolkitsSchema>;
export type UpdateOrgToolPermissionType = z.infer<
  typeof UpdateOrgToolPermissionSchema
>;
