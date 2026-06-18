import { z } from 'zod';

export const UsageQuerySchema = z.object({
  date_from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'date_from must be YYYY-MM-DD')
    .optional(),
  date_to: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'date_to must be YYYY-MM-DD')
    .optional(),
  member_uuid: z.string().uuid().optional(),
  page: z
    .string()
    .optional()
    .transform((value) => (value ? parseInt(value, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((value) => (value ? parseInt(value, 10) : 20)),
});

export type UsageQueryType = z.infer<typeof UsageQuerySchema>;
