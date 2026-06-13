import { z } from 'zod';
import { IntegrationProviders } from '../interfaces/integration.interface';

export const createIntegrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  provider: z.enum(Object.values(IntegrationProviders) as [string, ...string[]]),
  config: z.string().min(2, 'Config JSON is required').refine(
    (value) => {
      try {
        JSON.parse(value);
        return true;
      } catch {
        return false;
      }
    },
    { message: 'Config must be valid JSON' },
  ),
});

export type CreateIntegrationFormData = z.infer<typeof createIntegrationSchema>;
