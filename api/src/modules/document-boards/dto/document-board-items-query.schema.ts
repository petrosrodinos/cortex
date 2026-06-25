import { z } from 'zod';

export const DocumentBoardItemsQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((value) => (value ? parseInt(value, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((value) => (value ? parseInt(value, 10) : 20)),
});

export type DocumentBoardItemsQueryType = z.infer<typeof DocumentBoardItemsQuerySchema>;
