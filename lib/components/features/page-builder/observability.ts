/**
 * Page Builder observability helpers.
 *
 * Provides:
 * - Error taxonomy classification (retryable / user_fixable / fatal)
 * - Structured console events for production triage
 *
 * No sensitive data is ever logged (no tokens, no page content).
 */

// ─── Error Taxonomy ─────────────────────────────────────────────────────────

export type PBErrorClass = 'retryable' | 'user_fixable' | 'fatal';

export interface PBErrorInfo {
  op: string;
  errorClass: PBErrorClass;
  message: string;
  configId?: string | null;
  detail?: string;
}

/**
 * Classify a GraphQL/network error into an actionable category.
 *
 * - 402 (feature_gated) → user_fixable (upgrade)
 * - 403 → user_fixable (permission)
 * - 422 → user_fixable (validation)
 * - 423 → user_fixable (lock conflict)
 * - 5xx / network → retryable
 * - unknown → fatal
 */
export function classifyError(error: unknown): PBErrorClass {
  if (!error) return 'fatal';

  // GraphQL errors often carry extensions.code or status in message
  const msg = error instanceof Error ? error.message : String(error);

  // Check for HTTP status patterns in GraphQL error messages
  if (/42[23]|402|403/.test(msg)) return 'user_fixable';
  if (/423/.test(msg)) return 'user_fixable';
  if (/5\d{2}|ECONNREFUSED|ETIMEDOUT|fetch failed|network/i.test(msg)) return 'retryable';

  // GraphQL extension codes
  const gqlError = error as { extensions?: { code?: string }; graphQLErrors?: Array<{ extensions?: { code?: string } }> };
  const code = gqlError?.extensions?.code ?? gqlError?.graphQLErrors?.[0]?.extensions?.code;
  if (code === 'INTERNAL_SERVER_ERROR') return 'retryable';
  if (code === 'FORBIDDEN' || code === 'UNAUTHENTICATED') return 'user_fixable';
  if (code === 'BAD_USER_INPUT') return 'user_fixable';

  return 'fatal';
}

// ─── Structured Events ──────────────────────────────────────────────────────

/**
 * Emit a structured observability event for triage.
 * Uses console.warn so it's visible in browser devtools and log aggregators
 * without flooding console.error (which triggers Sentry breadcrumbs).
 */
export function pbEvent(info: PBErrorInfo): void {
  // eslint-disable-next-line no-console
  console.warn('[PageBuilder]', JSON.stringify({
    op: info.op,
    errorClass: info.errorClass,
    message: info.message,
    configId: info.configId ?? undefined,
    detail: info.detail ?? undefined,
    ts: new Date().toISOString(),
  }));
}

/**
 * Log a successful operation (trace-level, only in development).
 */
export function pbTrace(op: string, meta?: Record<string, unknown>): void {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.debug('[PageBuilder]', op, meta ?? '');
  }
}

// ─── User-facing Messages ───────────────────────────────────────────────────

const RETRYABLE_SUFFIX = ' Please try again.';
const FATAL_SUFFIX = ' If this persists, contact support.';

/**
 * Build a user-facing toast message based on error class.
 */
export function toastMessageFor(baseMessage: string, errorClass: PBErrorClass): string {
  if (errorClass === 'retryable') return baseMessage + RETRYABLE_SUFFIX;
  if (errorClass === 'fatal') return baseMessage + FATAL_SUFFIX;
  return baseMessage; // user_fixable — message should already explain what to do
}
