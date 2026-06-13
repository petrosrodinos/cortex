import { z } from 'zod';
import { IntegrationProviders } from '../interfaces/integration.interface';

export const createIntegrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  provider: z.enum(Object.values(IntegrationProviders) as [string, ...string[]]),
  config: z.record(z.string(), z.union([z.string(), z.number(), z.undefined()])).optional(),
});

export type CreateIntegrationFormData = z.infer<typeof createIntegrationSchema>;
