import { z } from 'zod';

export const CreateComposioTriggerSchema = z.object({
  toolkit_slug: z.string().trim().min(1),
  trigger_slug: z.string().trim().min(1),
  connected_account_id: z.string().trim().min(1),
  config: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateComposioTriggerSchema = z.object({
  is_enabled: z.boolean().optional(),
  config: z.record(z.string(), z.unknown()).optional(),
});

export type CreateComposioTriggerType = z.infer<
  typeof CreateComposioTriggerSchema
>;
export type UpdateComposioTriggerType = z.infer<
  typeof UpdateComposioTriggerSchema
>;
