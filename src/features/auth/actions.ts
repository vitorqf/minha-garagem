"use server";

import { redirect } from "next/navigation";

import { signIn, signOut } from "@/auth";
import { AUTH_COPY } from "@/features/auth/constants";
import { getOwnerUserRepository } from "@/features/auth/repositories";
import { registerOwner } from "@/features/auth/service";
import {
  initialLoginFormState,
  initialSignupFormState,
  type LoginFormState,
  type SignupFormState,
} from "@/features/auth/types";
import {
  parseLoginFormData,
  parseLoginInput,
  parseSignupFormData,
  toAuthErrorMap,
} from "@/features/auth/validation";

function isCredentialsSigninFailure(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  if (!("type" in error)) {
    return false;
  }

  return error.type === "CredentialsSignin";
}

export async function signupAction(
  previousState: SignupFormState = initialSignupFormState,
  formData: FormData,
): Promise<SignupFormState> {
  void previousState;

  const repository = getOwnerUserRepository();
  const result = await registerOwner(repository, parseSignupFormData(formData));

  if (!result.ok) {
    return {
      status: "error",
      message: result.message,
      errors: result.errors,
    };
  }

  redirect("/login?registered=1");
}

export async function loginAction(
  previousState: LoginFormState = initialLoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  void previousState;

  const parsed = parseLoginInput(parseLoginFormData(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: AUTH_COPY.invalidForm,
      errors: toAuthErrorMap(parsed.error),
    };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/summaries",
    });

    return {
      status: "success",
      errors: {},
    };
  } catch (error) {
    if (isCredentialsSigninFailure(error)) {
      return {
        status: "error",
        message: AUTH_COPY.invalidCredentials,
        errors: {
          form: AUTH_COPY.invalidCredentials,
        },
      };
    }

    throw error;
  }
}

export async function logoutAction(formData: FormData): Promise<void> {
  void formData;
  await signOut({
    redirectTo: "/login",
  });
}
