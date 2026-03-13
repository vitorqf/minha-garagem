import { describe, expect, it } from "vitest";

import {
  attachTokenUserIdToSession,
  attachUserIdToToken,
  extractOwnerIdFromSession,
} from "@/features/auth/auth-callbacks";

describe("auth callbacks", () => {
  it("stores user id in jwt token", () => {
    const token = attachUserIdToToken({}, { id: "owner-1", email: "owner@garage.com" });

    expect(token.userId).toBe("owner-1");
  });

  it("maps token user id to session user", () => {
    const session = attachTokenUserIdToSession(
      {
        expires: "2099-01-01T00:00:00.000Z",
        user: {
          email: "owner@garage.com",
        },
      },
      { userId: "owner-1" },
    );

    expect(session.user?.id).toBe("owner-1");
  });

  it("extracts owner id from session", () => {
    const session = {
      expires: "2099-01-01T00:00:00.000Z",
      user: {
        id: "owner-1",
        email: "owner@garage.com",
      },
    };

    expect(extractOwnerIdFromSession(session)).toBe("owner-1");
    expect(extractOwnerIdFromSession(null)).toBeNull();
  });
});
