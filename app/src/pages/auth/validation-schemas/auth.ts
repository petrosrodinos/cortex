import { z } from "zod";

export const SignInSchema = z.object({
    email: z.string().min(1, { message: "Please enter your email" }),
    password: z
        .string()
        .min(1, {
            message: "Please enter your password",
        })
        .min(6, {
            message: "Password must be at least 6 characters long",
        }),
});

export const SignUpSchema = z.object({
    first_name: z.string().min(1, { message: "Please enter your first name" }),
    last_name: z.string().min(1, { message: "Please enter your last name" }),
    email: z.string().min(1, { message: "Please enter your email" }),
    password: z
        .string()
        .min(1, {
            message: "Please enter your password",
        })
        .min(6, {
            message: "Password must be at least 6 characters long",
        }),
});

export const InvitationSignUpSchema = z.object({
    password: z
        .string()
        .min(1, {
            message: "Please enter your password",
        })
        .min(6, {
            message: "Password must be at least 6 characters long",
        }),
});


export type SignInFormValues = z.infer<typeof SignInSchema>;
export type SignUpFormValues = z.infer<typeof SignUpSchema>;
export type InvitationSignUpFormValues = z.infer<typeof InvitationSignUpSchema>;
