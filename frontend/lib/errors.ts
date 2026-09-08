/**
 * Pulls a human-readable message out of a caught value.
 *
 * `fetch`/API errors are thrown as real `Error` instances (see
 * `handleResponse` in `lib/api.ts`), but `catch` blocks can technically
 * receive anything, so this falls back to a generic message instead of
 * assuming `.message` exists.
 */
export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  return error instanceof Error ? error.message : fallback;
}
