import { ComposioConnectionTier, ComposioSyncType } from 'generated/prisma';
import { z } from 'zod';

const optionalQueryString = z.string().trim().min(1).optional();
const booleanQueryString = z.enum(['true', 'false']).optional();
const positiveIntegerQueryString = z
  .string()
  .regex(/^[1-9]\d*$/)
  .optional();

export const CreateComposioToolkitSchema = z.object({
  slug: z.string().trim().min(1),
});

export const ListComposioToolkitsSchema = z.object({
  search: optionalQueryString,
  category: optionalQueryString,
  is_enabled: booleanQueryString,
  page: positiveIntegerQueryString,
  limit: positiveIntegerQueryString,
});

export const SyncComposioSchema = z.object({
  sync_type: z.nativeEnum(ComposioSyncType).optional(),
  toolkit_slug: optionalQueryString,
});

export const UpdateComposioToolkitSchema = z.object({
  is_enabled: z.boolean().optional(),
  connection_tiers: z.array(z.nativeEnum(ComposioConnectionTier)).min(1).optional(),
});

export const UpdateComposioToolSchema = z.object({
  is_enabled: z.boolean(),
});

export type CreateComposioToolkitType = z.infer<
  typeof CreateComposioToolkitSchema
>;
export type ListComposioToolkitsType = z.infer<
  typeof ListComposioToolkitsSchema
>;
export type SyncComposioType = z.infer<typeof SyncComposioSchema>;
export type UpdateComposioToolkitType = z.infer<
  typeof UpdateComposioToolkitSchema
>;
export type UpdateComposioToolType = z.infer<typeof UpdateComposioToolSchema>;
