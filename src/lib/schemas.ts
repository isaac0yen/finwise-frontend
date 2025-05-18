// src/lib/schemas.ts
import { z } from 'zod';

export const signUpSchema = z.object({
  nin: z.string().min(1, { message: "NIN is required" }), // Add more specific NIN validation if needed
  email: z.string().email({ message: "Valid email is required" }),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const verifyEmailSchema = z.object({
  code: z.string().min(6, { message: "Verification code must be 6 digits" }).max(6),
});

export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;

export const setPasswordSchema = z.object({
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
});

export type SetPasswordFormData = z.infer<typeof setPasswordSchema>;

export const loginSchema = z.object({
  email: z.string().email({ message: "Valid email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;