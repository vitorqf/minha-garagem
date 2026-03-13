import { z } from "zod";

import { AUTH_COPY } from "@/features/auth/constants";
import type { LoginInput, SignupInput } from "@/features/auth/types";

const emailSchema = z
  .string()
  .trim()
  .min(1, AUTH_COPY.requiredEmail)
  .email(AUTH_COPY.invalidEmail)
  .transform((value) => value.toLowerCase());

const passwordSchema = z
  .string()
  .min(1, AUTH_COPY.requiredPassword)
  .min(8, AUTH_COPY.invalidPassword);

export const loginInputSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupInputSchema = loginInputSchema
  .extend({
    confirmPassword: z.string().min(1, AUTH_COPY.requiredConfirmPassword),
  })
  .superRefine(({ password, confirmPassword }, context) => {
    if (password !== confirmPassword) {
      context.addIssue({
        code: "custom",
        message: AUTH_COPY.passwordMismatch,
        path: ["confirmPassword"],
      });
    }
  });

export function parseLoginInput(input: LoginInput) {
  return loginInputSchema.safeParse(input);
}

export function parseSignupInput(input: SignupInput) {
  return signupInputSchema.safeParse(input);
}

export function parseLoginFormData(formData: FormData): LoginInput {
  return {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
}

export function parseSignupFormData(formData: FormData): SignupInput {
  return {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  };
}

export function toAuthErrorMap(error: z.ZodError): Record<string, string> {
  const fieldErrors = error.flatten().fieldErrors as Record<string, string[] | undefined>;
  const getFieldError = (field: string) => fieldErrors[field]?.[0] ?? "";

  return {
    email: getFieldError("email"),
    password: getFieldError("password"),
    confirmPassword: getFieldError("confirmPassword"),
    form: getFieldError("form"),
  };
}
