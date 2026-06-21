import { z } from 'zod';

export const ConnectComposioSchema = z.object({
  toolkit_slug: z.string().trim().min(1),
  connected_account_id: z.string().trim().min(1).optional(),
});

export const ComposioCallbackSchema = z.object({
  toolkit_slug: z.string().trim().min(1),
  connection_request_id: z.string().trim().min(1).optional(),
  connected_account_id: z.string().trim().min(1).optional(),
});

export type ConnectComposioType = z.infer<typeof ConnectComposioSchema>;
export type ComposioCallbackType = z.infer<typeof ComposioCallbackSchema>;
