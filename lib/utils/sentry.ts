import type { ErrorEvent, EventHint } from '@sentry/nextjs';

/** Replace sensitive patterns in a string with redaction placeholders.
 * Regex patterns are Edge Runtime safe (no lookbehind). Created inline to
 * avoid global-flag lastIndex statefulness across calls. */
export function scrubPII(value: string): string {
  return value
    .replace(/0x[a-fA-F0-9]{40}/g, '[REDACTED_ETH_ADDRESS]')
    .replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, '[REDACTED_JWT]')
    .replace(/ory_st_[A-Za-z0-9_-]+/g, '[REDACTED_SESSION]')
    .replace(/Bearer\s+[A-Za-z0-9._-]+/g, 'Bearer [REDACTED]');
}

/** Returns true if the event is non-actionable noise that should be dropped. */
export function isNoiseEvent(event: ErrorEvent): boolean {
  const message =
    event.exception?.values?.[0]?.value || event.message || '';

  // ResizeObserver loop errors (Chrome, all browsers)
  if (/ResizeObserver loop/i.test(message)) return true;

  // Cancelled fetch / AbortError
  if (message === 'cancelled' || message === 'AbortError') return true;

  // Safari network failure
  if (message === 'Load failed') return true;

  // Generic network failure (TypeError: Failed to fetch)
  if (message === 'Failed to fetch') return true;

  // Sentry non-error noise
  if (message.includes('Non-Error exception captured')) return true;

  // Browser extension errors — check all stack frames, not just the first
  const frames = event.exception?.values?.[0]?.stacktrace?.frames;
  if (
    frames?.some((frame) => {
      const f = frame.filename || '';
      return (
        f.includes('chrome-extension://') ||
        f.includes('moz-extension://') ||
        f.includes('safari-extension://')
      );
    })
  ) {
    return true;
  }

  return false;
}

/** Scrub string values in a record (shallow). */
function scrubRecord(obj: Record<string, unknown> | undefined): void {
  if (!obj) return;
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'string') {
      obj[key] = scrubPII(obj[key] as string);
    }
  }
}

/**
 * beforeSend hook: filters noise events and scrubs PII from error payloads.
 * Designed to be Edge Runtime compatible (no lookbehind, no fs, no eval).
 */
export function beforeSend(event: ErrorEvent, _hint: EventHint): ErrorEvent | null {
  // 1. Noise filtering — drop non-actionable events
  if (isNoiseEvent(event)) return null;

  // 2. PII scrubbing — walk specific fields

  // Scrub exception stack frame vars
  if (event.exception?.values) {
    for (const exValue of event.exception.values) {
      // Scrub exception value message
      if (exValue.value && typeof exValue.value === 'string') {
        exValue.value = scrubPII(exValue.value);
      }

      if (exValue.stacktrace?.frames) {
        for (const frame of exValue.stacktrace.frames) {
          scrubRecord(frame.vars as Record<string, unknown> | undefined);
        }
      }
    }
  }

  // Scrub extra context
  scrubRecord(event.extra as Record<string, unknown> | undefined);

  // Scrub breadcrumb data
  if (event.breadcrumbs) {
    for (const breadcrumb of event.breadcrumbs) {
      scrubRecord(breadcrumb.data as Record<string, unknown> | undefined);
    }
  }

  // Scrub request headers (Authorization, Cookie)
  if (event.request?.headers) {
    const headers = event.request.headers as Record<string, string>;
    if (headers['Authorization']) {
      headers['Authorization'] = scrubPII(headers['Authorization']);
    }
    if (headers['Cookie']) {
      headers['Cookie'] = scrubPII(headers['Cookie']);
    }
    if (headers['authorization']) {
      headers['authorization'] = scrubPII(headers['authorization']);
    }
    if (headers['cookie']) {
      headers['cookie'] = scrubPII(headers['cookie']);
    }
  }

  return event;
}

/**
 * Returns common Sentry configuration shared across all three config files
 * (sentry.server.config.ts, sentry.edge.config.ts, instrumentation-client.ts).
 */
export function getCommonSentryConfig() {
  return {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
    environment:
      process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ||
      (process.env.NODE_ENV === 'production' ? 'production' : 'development'),
    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || undefined,
    beforeSend,
  };
}
