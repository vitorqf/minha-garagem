import { describe, expect, it } from "vitest";

import { InMemoryLoginRateLimiter } from "@/features/auth/login-rate-limit";

function createClock(start = 0) {
  let now = start;

  return {
    now: () => now,
    advance: (milliseconds: number) => {
      now += milliseconds;
    },
  };
}

describe("login rate limiter", () => {
  it("blocks after max failed attempts within the configured window", () => {
    const clock = createClock();
    const limiter = new InMemoryLoginRateLimiter({
      now: clock.now,
      maxAttempts: 3,
      windowMs: 60_000,
      blockDurationMs: 120_000,
    });

    const key = "owner@garage.com";

    expect(limiter.canAttempt(key)).toBe(true);
    limiter.recordFailure(key);
    limiter.recordFailure(key);
    expect(limiter.canAttempt(key)).toBe(true);

    limiter.recordFailure(key);
    expect(limiter.canAttempt(key)).toBe(false);

    clock.advance(120_000);
    expect(limiter.canAttempt(key)).toBe(true);
  });

  it("clears failed attempts after successful authentication", () => {
    const clock = createClock();
    const limiter = new InMemoryLoginRateLimiter({
      now: clock.now,
      maxAttempts: 3,
      windowMs: 60_000,
      blockDurationMs: 120_000,
    });

    const key = "owner@garage.com";

    limiter.recordFailure(key);
    limiter.recordFailure(key);
    limiter.recordSuccess(key);

    expect(limiter.canAttempt(key)).toBe(true);

    limiter.recordFailure(key);
    limiter.recordFailure(key);
    expect(limiter.canAttempt(key)).toBe(true);
  });
});
