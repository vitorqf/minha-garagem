import { describe, expect, it } from "vitest";

import {
  parseLoginFormData,
  parseLoginInput,
  parseSignupFormData,
  parseSignupInput,
  toAuthErrorMap,
} from "@/features/auth/validation";

describe("auth validation", () => {
  it("validates login input and normalizes email", () => {
    const parsed = parseLoginInput({
      email: " Owner@Garage.com ",
      password: "12345678",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.email).toBe("owner@garage.com");
    }
  });

  it("rejects signup input when passwords do not match", () => {
    const parsed = parseSignupInput({
      email: "owner@garage.com",
      password: "12345678",
      confirmPassword: "87654321",
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const errors = toAuthErrorMap(parsed.error);
      expect(errors.confirmPassword).toContain("não coincidem");
    }
  });

  it("parses login and signup form data", () => {
    const loginForm = new FormData();
    loginForm.set("email", "owner@garage.com");
    loginForm.set("password", "12345678");

    const signupForm = new FormData();
    signupForm.set("email", "owner@garage.com");
    signupForm.set("password", "12345678");
    signupForm.set("confirmPassword", "12345678");

    expect(parseLoginFormData(loginForm)).toEqual({
      email: "owner@garage.com",
      password: "12345678",
    });

    expect(parseSignupFormData(signupForm)).toEqual({
      email: "owner@garage.com",
      password: "12345678",
      confirmPassword: "12345678",
    });
  });
});
