import { z } from 'zod';

const cronFieldPattern =
  /^(\*|[0-9]+(-[0-9]+)?(\/[0-9]+)?)(,(\*|[0-9]+(-[0-9]+)?(\/[0-9]+)?))*$/;

function isValidCronExpression(value: string): boolean {
  const parts = value.trim().split(/\s+/);
  if (parts.length !== 5) {
    return false;
  }
  return parts.every((part) => cronFieldPattern.test(part));
}

export const agentSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  prompt: z.string().trim().min(1, 'Prompt is required'),
  cron_expression: z
    .string()
    .trim()
    .min(1, 'Schedule is required')
    .refine(isValidCronExpression, 'Invalid cron expression (5 fields required)'),
  is_enabled: z.boolean().default(true),
});

export type AgentFormValues = z.infer<typeof agentSchema>;
