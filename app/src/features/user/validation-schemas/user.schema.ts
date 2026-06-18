import { z } from 'zod';

export const UpdateProfileSchema = z.object({
  email: z.string().min(1, { message: 'Please enter your email' }).email({ message: 'Please enter a valid email' }),
  phone: z.string().optional(),
});

export const UpdatePasswordSchema = z
  .object({
    current_password: z.string().min(1, { message: 'Please enter your current password' }),
    new_password: z
      .string()
      .min(1, { message: 'Please enter a new password' })
      .min(6, { message: 'Password must be at least 6 characters long' }),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match.",
    path: ['confirm_password'],
  });

export type UpdateProfileFormValues = z.infer<typeof UpdateProfileSchema>;
export type UpdatePasswordFormValues = z.infer<typeof UpdatePasswordSchema>;
