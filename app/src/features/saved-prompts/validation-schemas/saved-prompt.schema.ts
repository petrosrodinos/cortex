import { z } from 'zod';

export const savedPromptSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  content: z.string().trim().min(1, 'Prompt content is required'),
});

export type SavedPromptFormValues = z.infer<typeof savedPromptSchema>;
