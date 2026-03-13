import { describe, expect, it } from "vitest";

import { extractOwnerIdFromSession } from "@/features/auth/auth-callbacks";

describe("auth session guard helpers", () => {
  it("returns null when session is missing user id", () => {
    expect(extractOwnerIdFromSession(null)).toBeNull();
    expect(
      extractOwnerIdFromSession({
        expires: "2099-01-01T00:00:00.000Z",
        user: {
          email: "owner@garage.com",
        },
      }),
    ).toBeNull();
  });

  it("returns owner id when session is valid", () => {
    expect(
      extractOwnerIdFromSession({
        expires: "2099-01-01T00:00:00.000Z",
        user: {
          id: "owner-1",
          email: "owner@garage.com",
        },
      }),
    ).toBe("owner-1");
  });
});
