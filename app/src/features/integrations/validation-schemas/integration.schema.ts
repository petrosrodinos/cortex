import { z } from 'zod';
import { IntegrationProviders } from '../common/interfaces/integration.interface';
import { DatabaseOperations } from '../database/interfaces/database.interface';

export const createIntegrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  provider: z.enum(Object.values(IntegrationProviders) as [string, ...string[]]),
  config: z.record(z.string(), z.union([z.string(), z.number(), z.undefined()])).optional(),
  allowedOps: z.array(z.enum(Object.values(DatabaseOperations) as [string, ...string[]])).optional(),
});

export type CreateIntegrationFormData = z.infer<typeof createIntegrationSchema>;
