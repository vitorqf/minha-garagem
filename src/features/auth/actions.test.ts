import { beforeEach, describe, expect, it, vi } from "vitest";

const mockRegisterOwner = vi.fn();
const mockSignIn = vi.fn();
const mockSignOut = vi.fn();

vi.mock("@/features/auth/repositories", () => ({
  getOwnerUserRepository: () => ({}),
}));

vi.mock("@/features/auth/service", () => ({
  registerOwner: (...args: unknown[]) => mockRegisterOwner(...args),
}));

vi.mock("@/auth", () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));

describe("auth actions", () => {
  beforeEach(() => {
    vi.resetModules();
    mockRegisterOwner.mockReset();
    mockSignIn.mockReset();
    mockSignOut.mockReset();
  });

  it("maps signup validation/service errors to form state", async () => {
    mockRegisterOwner.mockResolvedValue({
      ok: false,
      message: "Revise os campos informados.",
      errors: {
        email: "E-mail inválido.",
      },
    });

    const { signupAction } = await import("@/features/auth/actions");

    const formData = new FormData();
    formData.set("email", "invalid-email");
    formData.set("password", "12345678");
    formData.set("confirmPassword", "12345678");

    const state = await signupAction(undefined, formData);

    expect(state.status).toBe("error");
    expect(state.message).toContain("Revise");
    expect(state.errors?.email).toContain("E-mail");
  });

  it("returns field errors for invalid login payload", async () => {
    const { loginAction } = await import("@/features/auth/actions");

    const formData = new FormData();
    formData.set("email", "");
    formData.set("password", "123");

    const state = await loginAction(undefined, formData);

    expect(state.status).toBe("error");
    expect(state.errors?.email).toContain("obrigatório");
    expect(state.errors?.password).toContain("8 caracteres");
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it("calls signOut for logout action", async () => {
    const { logoutAction } = await import("@/features/auth/actions");

    await logoutAction(new FormData());

    expect(mockSignOut).toHaveBeenCalledWith({
      redirectTo: "/login",
    });
  });

  it("maps credentials sign-in failures to a user-facing error state", async () => {
    mockSignIn.mockRejectedValue({
      type: "CredentialsSignin",
    });

    const { loginAction } = await import("@/features/auth/actions");

    const formData = new FormData();
    formData.set("email", "owner@garage.com");
    formData.set("password", "12345678");

    const state = await loginAction(undefined, formData);
    expect(state.status).toBe("error");
    expect(state.message).toContain("inválidos");
  });

  it("rethrows non-credential auth errors", async () => {
    mockSignIn.mockRejectedValue({
      type: "AccessDenied",
    });

    const { loginAction } = await import("@/features/auth/actions");

    const formData = new FormData();
    formData.set("email", "owner@garage.com");
    formData.set("password", "12345678");

    await expect(loginAction(undefined, formData)).rejects.toEqual({
      type: "AccessDenied",
    });
  });
});
