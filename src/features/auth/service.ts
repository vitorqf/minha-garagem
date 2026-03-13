import { AUTH_COPY } from "@/features/auth/constants";
import { hashPassword, verifyPasswordHash } from "@/features/auth/password";
import type { OwnerUserRepository } from "@/features/auth/repositories/owner-user-repository";
import type { AuthFormErrors, LoginInput, OwnerUser, SignupInput } from "@/features/auth/types";
import { parseLoginInput, parseSignupInput, toAuthErrorMap } from "@/features/auth/validation";

type RegisterOwnerSuccess = {
  ok: true;
  data: OwnerUser;
  message: string;
};

type RegisterOwnerFailure = {
  ok: false;
  message: string;
  errors?: AuthFormErrors;
};

export type RegisterOwnerResult = RegisterOwnerSuccess | RegisterOwnerFailure;

type RegisterOwnerOptions = {
  hashPasswordFn?: (password: string) => Promise<string>;
};

type VerifyCredentialsOptions = {
  verifyPasswordFn?: (inputPassword: string, passwordHash: string) => Promise<boolean>;
};

export async function registerOwner(
  repository: OwnerUserRepository,
  input: SignupInput,
  options?: RegisterOwnerOptions,
): Promise<RegisterOwnerResult> {
  const parsed = parseSignupInput(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: AUTH_COPY.invalidForm,
      errors: toAuthErrorMap(parsed.error),
    };
  }

  const ownerCount = await repository.count();
  if (ownerCount > 0) {
    return {
      ok: false,
      message: AUTH_COPY.signupDisabled,
      errors: { form: AUTH_COPY.signupDisabled },
    };
  }

  const existingUser = await repository.findByEmail(parsed.data.email);
  if (existingUser) {
    return {
      ok: false,
      message: AUTH_COPY.emailInUse,
      errors: { email: AUTH_COPY.emailInUse },
    };
  }

  const passwordHashFn = options?.hashPasswordFn ?? hashPassword;
  const passwordHash = await passwordHashFn(parsed.data.password);
  const owner = await repository.create({
    email: parsed.data.email,
    passwordHash,
  });

  return {
    ok: true,
    data: owner,
    message: AUTH_COPY.signupSuccess,
  };
}

export async function verifyOwnerCredentials(
  repository: OwnerUserRepository,
  input: LoginInput,
  options?: VerifyCredentialsOptions,
): Promise<OwnerUser | null> {
  const parsed = parseLoginInput(input);
  if (!parsed.success) {
    return null;
  }

  const owner = await repository.findByEmail(parsed.data.email);
  if (!owner) {
    return null;
  }

  const verifyPasswordFn = options?.verifyPasswordFn ?? verifyPasswordHash;
  const isPasswordValid = await verifyPasswordFn(parsed.data.password, owner.passwordHash);
  if (!isPasswordValid) {
    return null;
  }

  return owner;
}
