// Error-shape helpers for the hostname verification flow.
//
// Kept in a dedicated file so that a future `yarn codegen` run can replace
// the `graphql.ts` typed-document overlay wholesale (see comment at the top
// of `./graphql.ts`) without touching these helpers. Consumers should import
// from `./errors` — NOT from `./graphql` — for all error classification.
//
// The shared GraphQL client (`lib/graphql/request/client.ts`) surfaces
// mutation errors in one of two shapes:
//
//   { message: string; code?: string | undefined }
//
// ...where `code` is populated from `extensions.code` on the first GraphQL
// error. Backend (lemonade-backend src/graphql/index.ts formatError) maps
// HTTP status → `extensions.code` as follows:
//
//   401 → 'UNAUTHENTICATED'
//   403 → 'FORBIDDEN'
//   409 → 'CONFLICT'
//   422 → 'BAD_USER_INPUT'
//   other → numeric-string of the status (e.g. 404 → '404')

type ErrorShape = { message?: unknown; code?: unknown };

function readMessage(error: unknown): string | null {
  if (!error || typeof error !== 'object') return null;
  const message = (error as ErrorShape).message;
  return typeof message === 'string' ? message : null;
}

function readCode(error: unknown): string | null {
  if (!error || typeof error !== 'object') return null;
  const code = (error as ErrorShape).code;
  return typeof code === 'string' ? code : null;
}

/**
 * Detects the concurrent-reroll race: a second `requestHostnameVerification`
 * landed between this client's request and its `verifyHostname`, so the
 * `challenge_token` on record has already rotated. The UI should refresh
 * its instructions and ask the user to retry.
 *
 * Detection order (defense-in-depth):
 *   1. `extensions.code === 'CONFLICT'` — canonical 409 mapping from the
 *      backend `formatError` switch.
 *   2. Message regex fallback — preserves behaviour on any legacy error
 *      shape that does not plumb `extensions.code` through to callers.
 */
export function isChallengeRerolledError(error: unknown): boolean {
  if (readCode(error) === 'CONFLICT') return true;
  const message = readMessage(error);
  if (!message) return false;
  return /hostname challenge changed concurrently/i.test(message);
}

/**
 * Maps a verification-request error (surfaced by
 * `requestHostnameVerification`) to a user-friendly toast string. Pattern-
 * matches common backend messages:
 *
 *   - 404 "hostname not found on space" → actionable: add it first.
 *   - 422 "hostname required" → recover by refreshing.
 *   - everything else → generic fallback.
 *
 * See lemonade-backend src/graphql/resolvers/space.ts:385,395 for the
 * canonical messages.
 */
export function getRequestVerificationErrorMessage(error: unknown): string {
  const message = readMessage(error) ?? '';
  if (/not found on space/i.test(message)) {
    return "This domain isn't saved to the space. Add it from the Custom Domain section first, then return to verify.";
  }
  if (/hostname required/i.test(message)) {
    return 'Hostname is missing. Refresh the page and try again.';
  }
  return message || 'Could not start verification. Please try again.';
}
