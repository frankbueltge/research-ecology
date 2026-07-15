/** The ecology stack is EN-only (Frank, 2026-07-15: recurring per-nightly-run translation
 * duty is not sustainable — see docs/spec and the engine repos, which now write English only).
 * `Locale` stays a named type (rather than being deleted outright) so call sites that thread a
 * locale through props/dictionary lookups need no further change. */
export type Locale = "en";

export { dictionary } from "./dictionary.js";
export type { Dictionary } from "./dictionary.js";

/** Identity path helper — kept as a named export (rather than inlining `path` at every call
 * site) so callers built for the former `/de` URL-prefix convention need no change beyond the
 * `Locale` type already collapsing to `"en"`. */
export function localizedPath(_locale: Locale, path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}
