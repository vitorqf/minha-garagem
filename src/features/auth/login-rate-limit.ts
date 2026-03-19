type LoginRateLimiterOptions = {
  now?: () => number;
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
};

type AttemptState = {
  attempts: number;
  firstAttemptAt: number;
  blockedUntil: number;
};

const DEFAULT_OPTIONS: LoginRateLimiterOptions = {
  now: () => Date.now(),
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,
  blockDurationMs: 15 * 60 * 1000,
};

function isExpiredBlock(state: AttemptState, now: number): boolean {
  return state.blockedUntil > 0 && state.blockedUntil <= now;
}

function isWindowExpired(state: AttemptState, now: number, windowMs: number): boolean {
  return now - state.firstAttemptAt > windowMs;
}

export class InMemoryLoginRateLimiter {
  private readonly attempts = new Map<string, AttemptState>();
  private readonly now: () => number;
  private readonly maxAttempts: number;
  private readonly windowMs: number;
  private readonly blockDurationMs: number;

  constructor(options: LoginRateLimiterOptions = DEFAULT_OPTIONS) {
    this.now = options.now ?? DEFAULT_OPTIONS.now!;
    this.maxAttempts = options.maxAttempts;
    this.windowMs = options.windowMs;
    this.blockDurationMs = options.blockDurationMs;
  }

  canAttempt(key: string): boolean {
    const state = this.attempts.get(key);
    if (!state) {
      return true;
    }

    const now = this.now();

    if (isExpiredBlock(state, now)) {
      this.attempts.delete(key);
      return true;
    }

    return !(state.blockedUntil > now);
  }

  recordFailure(key: string): void {
    const now = this.now();
    const current = this.attempts.get(key);

    if (!current) {
      this.attempts.set(key, {
        attempts: 1,
        firstAttemptAt: now,
        blockedUntil: 0,
      });
      return;
    }

    if (isExpiredBlock(current, now) || isWindowExpired(current, now, this.windowMs)) {
      this.attempts.set(key, {
        attempts: 1,
        firstAttemptAt: now,
        blockedUntil: 0,
      });
      return;
    }

    const attempts = current.attempts + 1;
    if (attempts >= this.maxAttempts) {
      this.attempts.set(key, {
        attempts: 0,
        firstAttemptAt: now,
        blockedUntil: now + this.blockDurationMs,
      });
      return;
    }

    this.attempts.set(key, {
      attempts,
      firstAttemptAt: current.firstAttemptAt,
      blockedUntil: current.blockedUntil,
    });
  }

  recordSuccess(key: string): void {
    this.attempts.delete(key);
  }
}

export const loginRateLimiter = new InMemoryLoginRateLimiter();
