export type OwnerUser = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type SignupInput = LoginInput & {
  confirmPassword: string;
};

export type AuthFormErrors = Partial<
  Record<"email" | "password" | "confirmPassword" | "form", string>
>;

export type LoginFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: AuthFormErrors;
};

export type SignupFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: AuthFormErrors;
};

export const initialLoginFormState: LoginFormState = {
  status: "idle",
  errors: {},
};

export const initialSignupFormState: SignupFormState = {
  status: "idle",
  errors: {},
};
