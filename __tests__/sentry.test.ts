import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ErrorEvent, EventHint } from '@sentry/nextjs';

import {
  getCommonSentryConfig,
  scrubPII,
  isNoiseEvent,
  beforeSend,
} from '$utils/sentry';

// --- Helper: create a minimal ErrorEvent ---
function makeEvent(overrides: Partial<ErrorEvent> = {}): ErrorEvent {
  return {
    exception: { values: [] },
    ...overrides,
  } as ErrorEvent;
}

function makeHint(): EventHint {
  return {} as EventHint;
}

// ============================================================
// getCommonSentryConfig
// ============================================================
describe('getCommonSentryConfig', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Reset relevant env vars before each test
    delete process.env.NEXT_PUBLIC_SENTRY_DSN;
    delete process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT;
    delete process.env.NEXT_PUBLIC_SENTRY_RELEASE;
    delete process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('returns DSN from NEXT_PUBLIC_SENTRY_DSN when set', () => {
    process.env.NEXT_PUBLIC_SENTRY_DSN = 'https://test@sentry.io/123';
    const config = getCommonSentryConfig();
    expect(config.dsn).toBe('https://test@sentry.io/123');
  });

  it('returns empty string DSN when env var not set', () => {
    const config = getCommonSentryConfig();
    expect(config.dsn).toBe('');
  });

  it('returns environment from NEXT_PUBLIC_SENTRY_ENVIRONMENT when set', () => {
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT = 'staging';
    const config = getCommonSentryConfig();
    expect(config.environment).toBe('staging');
  });

  it('derives environment "production" from NODE_ENV when env var not set', () => {
    process.env.NODE_ENV = 'production';
    const config = getCommonSentryConfig();
    expect(config.environment).toBe('production');
  });

  it('derives environment "development" when NODE_ENV is not production', () => {
    process.env.NODE_ENV = 'development';
    const config = getCommonSentryConfig();
    expect(config.environment).toBe('development');
  });

  it('defaults environment to "development" when no env vars set', () => {
    const config = getCommonSentryConfig();
    expect(config.environment).toBe('development');
  });

  it('returns release from NEXT_PUBLIC_SENTRY_RELEASE when set', () => {
    process.env.NEXT_PUBLIC_SENTRY_RELEASE = 'v2.0.0-abc123';
    const config = getCommonSentryConfig();
    expect(config.release).toBe('v2.0.0-abc123');
  });

  it('returns undefined release when env var not set', () => {
    const config = getCommonSentryConfig();
    expect(config.release).toBeUndefined();
  });

  it('includes a beforeSend function', () => {
    const config = getCommonSentryConfig();
    expect(typeof config.beforeSend).toBe('function');
  });
});

// ============================================================
// scrubPII
// ============================================================
describe('scrubPII', () => {
  it('replaces Ethereum addresses with [REDACTED_ETH_ADDRESS]', () => {
    const input = 'User wallet: 0x742d35Cc6634C0532925a3b844Bc9e7595f2bD4E';
    expect(scrubPII(input)).toBe('User wallet: [REDACTED_ETH_ADDRESS]');
  });

  it('handles lowercase Ethereum addresses', () => {
    const input = 'addr: 0xabcdef1234567890abcdef1234567890abcdef12';
    expect(scrubPII(input)).toBe('addr: [REDACTED_ETH_ADDRESS]');
  });

  it('handles uppercase Ethereum addresses', () => {
    const input = '0xABCDEF1234567890ABCDEF1234567890ABCDEF12';
    expect(scrubPII(input)).toBe('[REDACTED_ETH_ADDRESS]');
  });

  it('does NOT replace strings that are too short for Ethereum addresses', () => {
    const input = '0x1234abcd';
    expect(scrubPII(input)).toBe('0x1234abcd');
  });

  it('replaces JWT tokens with [REDACTED_JWT]', () => {
    const input = 'token: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U';
    expect(scrubPII(input)).toBe('token: [REDACTED_JWT]');
  });

  it('does NOT replace strings that look like JWT prefix but are not', () => {
    const input = 'eyJ is a prefix';
    expect(scrubPII(input)).toBe('eyJ is a prefix');
  });

  it('replaces Ory session tokens with [REDACTED_SESSION]', () => {
    const input = 'session: ory_st_abc123_def456-xyz';
    expect(scrubPII(input)).toBe('session: [REDACTED_SESSION]');
  });

  it('does NOT replace strings that start with ory_ but not ory_st_', () => {
    const input = 'ory_at_something';
    expect(scrubPII(input)).toBe('ory_at_something');
  });

  it('replaces Bearer tokens with Bearer [REDACTED]', () => {
    const input = 'Authorization: Bearer eyJhbGciOiJSUzI1NiJ9.payload.signature';
    // JWT also gets scrubbed; Bearer wrapping also matches
    const result = scrubPII(input);
    expect(result).not.toContain('eyJ');
    expect(result).toContain('[REDACTED');
  });

  it('replaces "Bearer <simple-token>" with Bearer [REDACTED]', () => {
    const input = 'Bearer abc123.def456.ghi789';
    const result = scrubPII(input);
    expect(result).toBe('Bearer [REDACTED]');
  });

  it('returns unchanged string when no sensitive data', () => {
    const input = 'Hello world, this is a normal string.';
    expect(scrubPII(input)).toBe('Hello world, this is a normal string.');
  });

  it('handles multiple sensitive values in one string', () => {
    const input = 'wallet 0x742d35Cc6634C0532925a3b844Bc9e7595f2bD4E session ory_st_token123';
    const result = scrubPII(input);
    expect(result).toContain('[REDACTED_ETH_ADDRESS]');
    expect(result).toContain('[REDACTED_SESSION]');
    expect(result).not.toContain('0x742d35');
    expect(result).not.toContain('ory_st_token123');
  });

  it('preserves surrounding text structure', () => {
    const input = 'Error for user 0x742d35Cc6634C0532925a3b844Bc9e7595f2bD4E on chain 1';
    const result = scrubPII(input);
    expect(result).toBe('Error for user [REDACTED_ETH_ADDRESS] on chain 1');
  });
});

// ============================================================
// isNoiseEvent (noise filtering)
// ============================================================
describe('isNoiseEvent', () => {
  it('returns true for ResizeObserver loop error', () => {
    const event = makeEvent({
      exception: {
        values: [{ type: 'Error', value: 'ResizeObserver loop limit exceeded' }],
      },
    });
    expect(isNoiseEvent(event)).toBe(true);
  });

  it('returns true for ResizeObserver loop completed notification (Chrome)', () => {
    const event = makeEvent({
      exception: {
        values: [{ type: 'Error', value: 'ResizeObserver loop completed with undelivered notifications' }],
      },
    });
    expect(isNoiseEvent(event)).toBe(true);
  });

  it('returns true for "cancelled" fetch', () => {
    const event = makeEvent({
      exception: {
        values: [{ type: 'Error', value: 'cancelled' }],
      },
    });
    expect(isNoiseEvent(event)).toBe(true);
  });

  it('returns true for AbortError', () => {
    const event = makeEvent({
      exception: {
        values: [{ type: 'AbortError', value: 'AbortError' }],
      },
    });
    expect(isNoiseEvent(event)).toBe(true);
  });

  it('returns true for Safari "Load failed"', () => {
    const event = makeEvent({
      exception: {
        values: [{ type: 'TypeError', value: 'Load failed' }],
      },
    });
    expect(isNoiseEvent(event)).toBe(true);
  });

  it('returns true for "Failed to fetch" TypeError', () => {
    const event = makeEvent({
      exception: {
        values: [{ type: 'TypeError', value: 'Failed to fetch' }],
      },
    });
    expect(isNoiseEvent(event)).toBe(true);
  });

  it('returns true for "Non-Error exception captured"', () => {
    const event = makeEvent({
      exception: {
        values: [{ type: 'Error', value: 'Non-Error exception captured with keys: ...' }],
      },
    });
    expect(isNoiseEvent(event)).toBe(true);
  });

  it('returns true for chrome-extension errors', () => {
    const event = makeEvent({
      exception: {
        values: [{
          type: 'Error',
          value: 'some error',
          stacktrace: {
            frames: [{ filename: 'chrome-extension://abcdef/content.js' }],
          },
        }],
      },
    });
    expect(isNoiseEvent(event)).toBe(true);
  });

  it('returns true for moz-extension errors', () => {
    const event = makeEvent({
      exception: {
        values: [{
          type: 'Error',
          value: 'some error',
          stacktrace: {
            frames: [{ filename: 'moz-extension://abcdef/content.js' }],
          },
        }],
      },
    });
    expect(isNoiseEvent(event)).toBe(true);
  });

  it('returns true for safari-extension errors', () => {
    const event = makeEvent({
      exception: {
        values: [{
          type: 'Error',
          value: 'some error',
          stacktrace: {
            frames: [{ filename: 'safari-extension://abcdef/content.js' }],
          },
        }],
      },
    });
    expect(isNoiseEvent(event)).toBe(true);
  });

  it('returns true for extension errors in non-first frames', () => {
    const event = makeEvent({
      exception: {
        values: [{
          type: 'Error',
          value: 'some error',
          stacktrace: {
            frames: [
              { filename: 'https://app.lemonade.social/main.js' },
              { filename: 'chrome-extension://abcdef/injected.js' },
            ],
          },
        }],
      },
    });
    expect(isNoiseEvent(event)).toBe(true);
  });

  it('returns false for legitimate errors', () => {
    const event = makeEvent({
      exception: {
        values: [{
          type: 'TypeError',
          value: 'Cannot read properties of undefined (reading "foo")',
        }],
      },
    });
    expect(isNoiseEvent(event)).toBe(false);
  });

  it('returns false for GraphQL errors', () => {
    const event = makeEvent({
      exception: {
        values: [{ type: 'Error', value: 'GraphQL request failed: 500' }],
      },
    });
    expect(isNoiseEvent(event)).toBe(false);
  });
});

// ============================================================
// beforeSend — integration tests
// ============================================================
describe('beforeSend', () => {
  it('returns null for noise events', () => {
    const event = makeEvent({
      exception: {
        values: [{ type: 'Error', value: 'ResizeObserver loop limit exceeded' }],
      },
    });
    expect(beforeSend(event, makeHint())).toBeNull();
  });

  it('returns the event for legitimate errors (passthrough)', () => {
    const event = makeEvent({
      exception: {
        values: [{ type: 'Error', value: 'Something went wrong' }],
      },
    });
    const result = beforeSend(event, makeHint());
    expect(result).not.toBeNull();
    expect(result?.exception?.values?.[0]?.value).toBe('Something went wrong');
  });

  it('scrubs Ethereum addresses from exception values', () => {
    const event = makeEvent({
      exception: {
        values: [{
          type: 'Error',
          value: 'Transfer failed for 0x742d35Cc6634C0532925a3b844Bc9e7595f2bD4E',
        }],
      },
    });
    const result = beforeSend(event, makeHint());
    expect(result?.exception?.values?.[0]?.value).toContain('[REDACTED_ETH_ADDRESS]');
    expect(result?.exception?.values?.[0]?.value).not.toContain('0x742d35');
  });

  it('scrubs JWT tokens from extra context', () => {
    const event = makeEvent({
      extra: {
        token: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U',
        normalData: 'hello world',
      },
    });
    const result = beforeSend(event, makeHint());
    expect(result?.extra?.token).toBe('[REDACTED_JWT]');
    expect(result?.extra?.normalData).toBe('hello world');
  });

  it('scrubs Ory session tokens from breadcrumb data', () => {
    const event = makeEvent({
      breadcrumbs: [{
        category: 'http',
        data: {
          cookie: 'session=ory_st_abc123def456; other=value',
        },
      }],
    });
    const result = beforeSend(event, makeHint());
    const breadcrumbData = result?.breadcrumbs?.[0]?.data as Record<string, string>;
    expect(breadcrumbData?.cookie).toContain('[REDACTED_SESSION]');
    expect(breadcrumbData?.cookie).not.toContain('ory_st_abc123def456');
  });

  it('scrubs Authorization header from request', () => {
    const event = makeEvent({
      request: {
        headers: {
          Authorization: 'Bearer my-secret-token.with.parts',
        },
        url: 'https://example.com/api',
      },
    });
    const result = beforeSend(event, makeHint());
    const headers = result?.request?.headers as Record<string, string>;
    expect(headers?.Authorization).toBe('Bearer [REDACTED]');
  });

  it('handles events with no exception values gracefully', () => {
    const event = makeEvent({ exception: undefined });
    const result = beforeSend(event, makeHint());
    expect(result).not.toBeNull();
  });

  it('handles events with no extra context gracefully', () => {
    const event = makeEvent({
      exception: {
        values: [{ type: 'Error', value: 'test' }],
      },
      extra: undefined,
    });
    const result = beforeSend(event, makeHint());
    expect(result).not.toBeNull();
  });

  it('handles events with no breadcrumbs gracefully', () => {
    const event = makeEvent({
      exception: {
        values: [{ type: 'Error', value: 'test' }],
      },
      breadcrumbs: undefined,
    });
    const result = beforeSend(event, makeHint());
    expect(result).not.toBeNull();
  });

  it('does NOT scrub non-sensitive data', () => {
    const event = makeEvent({
      exception: {
        values: [{ type: 'Error', value: 'Normal error message' }],
      },
      extra: {
        userId: '12345',
        action: 'clicked button',
        count: 42,
      },
    });
    const result = beforeSend(event, makeHint());
    expect(result?.extra?.userId).toBe('12345');
    expect(result?.extra?.action).toBe('clicked button');
    expect(result?.extra?.count).toBe(42);
  });

  it('scrubs stack frame vars containing sensitive data', () => {
    const event = makeEvent({
      exception: {
        values: [{
          type: 'Error',
          value: 'test',
          stacktrace: {
            frames: [{
              filename: 'app.js',
              vars: {
                wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD4E',
                name: 'Alice',
              },
            }],
          },
        }],
      },
    });
    const result = beforeSend(event, makeHint());
    const vars = result?.exception?.values?.[0]?.stacktrace?.frames?.[0]?.vars as Record<string, string>;
    expect(vars?.wallet).toBe('[REDACTED_ETH_ADDRESS]');
    expect(vars?.name).toBe('Alice');
  });
});
