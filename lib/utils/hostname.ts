// Shared hostname utilities. Kept tiny and pure so it can be imported from
// both client components and server code without dragging in heavy deps.

const LEMONADE_BUILTIN_SUFFIX = 'lemonade.social';

/**
 * A hostname is considered "custom" if it does NOT end with the built-in
 * Lemonade suffix. Tenant-facing settings UIs only surface custom hostnames —
 * the built-in `*.lemonade.social` domain is always verified by construction.
 */
export function isCustomHostname(h: string): boolean {
  return !h.endsWith(LEMONADE_BUILTIN_SUFFIX);
}

/**
 * Normalize a hostname before sending it to the backend. Matches the
 * normalization applied on the backend side of the verification flow
 * (lemonade-backend src/graphql/resolvers/space.ts:384 and :534), so that
 * lookups on both sides find the same entry regardless of casing/whitespace.
 */
export function normalizeHostname(h: string): string {
  return h.toLowerCase().trim();
}
