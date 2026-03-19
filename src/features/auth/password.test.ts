import { describe, expect, it } from "vitest";

import { hashPassword, verifyPasswordHash } from "@/features/auth/password";

describe("auth password", () => {
  it("hashes and verifies a valid password", async () => {
    const plainPassword = "12345678";
    const passwordHash = await hashPassword(plainPassword);

    expect(passwordHash).not.toBe(plainPassword);
    await expect(verifyPasswordHash(plainPassword, passwordHash)).resolves.toBe(true);
  });

  it("rejects invalid password verification", async () => {
    const passwordHash = await hashPassword("12345678");

    await expect(verifyPasswordHash("wrong-password", passwordHash)).resolves.toBe(false);
  });
});
