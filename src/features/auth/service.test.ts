import { describe, expect, it } from "vitest";

import { InMemoryOwnerUserRepository } from "@/features/auth/repositories/in-memory-owner-user-repository";
import type { OwnerUserRepository } from "@/features/auth/repositories/owner-user-repository";
import { registerOwner, verifyOwnerCredentials } from "@/features/auth/service";

describe("auth service", () => {
  it("creates multiple accounts with distinct emails", async () => {
    const repository = new InMemoryOwnerUserRepository();

    const first = await registerOwner(
      repository,
      {
        email: "owner@garage.com",
        password: "12345678",
        confirmPassword: "12345678",
      },
      {
        hashPasswordFn: async (password) => `hashed-${password}`,
      },
    );

    expect(first.ok).toBe(true);
    if (!first.ok) {
      return;
    }

    expect(first.data.passwordHash).toBe("hashed-12345678");

    const second = await registerOwner(repository, {
      email: "second@garage.com",
      password: "12345678",
      confirmPassword: "12345678",
    });

    expect(second.ok).toBe(true);
    if (second.ok) {
      expect(second.data.email).toBe("second@garage.com");
    }
  });

  it("rejects signup when email is already in use", async () => {
    const repository = new InMemoryOwnerUserRepository();

    await registerOwner(
      repository,
      {
        email: "owner@garage.com",
        password: "12345678",
        confirmPassword: "12345678",
      },
      {
        hashPasswordFn: async () => "hash-1",
      },
    );

    const duplicated = await registerOwner(repository, {
      email: "owner@garage.com",
      password: "12345678",
      confirmPassword: "12345678",
    });

    expect(duplicated.ok).toBe(false);
    if (!duplicated.ok) {
      expect(duplicated.errors?.email).toContain("já está em uso");
    }
  });

  it("verifies credentials with stored password hash", async () => {
    const repository = new InMemoryOwnerUserRepository();

    await registerOwner(
      repository,
      {
        email: "owner@garage.com",
        password: "12345678",
        confirmPassword: "12345678",
      },
      {
        hashPasswordFn: async () => "hash-1",
      },
    );

    const valid = await verifyOwnerCredentials(
      repository,
      {
        email: "owner@garage.com",
        password: "12345678",
      },
      {
        verifyPasswordFn: async (inputPassword, passwordHash) =>
          inputPassword === "12345678" && passwordHash === "hash-1",
      },
    );

    const invalid = await verifyOwnerCredentials(
      repository,
      {
        email: "owner@garage.com",
        password: "wrong-password",
      },
      {
        verifyPasswordFn: async () => false,
      },
    );

    expect(valid?.email).toBe("owner@garage.com");
    expect(invalid).toBeNull();
  });

  it("maps concurrent unique-email constraint errors to a domain validation error", async () => {
    const repository: OwnerUserRepository = {
      count: async () => 0,
      findByEmail: async () => null,
      create: async () => {
        throw { code: "P2002" };
      },
    };

    const result = await registerOwner(repository, {
      email: "owner@garage.com",
      password: "12345678",
      confirmPassword: "12345678",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors?.email).toContain("já está em uso");
    }
  });
});
