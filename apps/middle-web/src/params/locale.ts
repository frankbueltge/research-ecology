import type { ParamMatcher } from "@sveltejs/kit";

/** The ecology stack is EN-only (Frank, 2026-07-15: recurring per-nightly-run translation duty
 * is not sustainable — see `$lib/i18n`). This matcher never matches, so the former `/de/...`
 * URL space 404s instead of resolving; the `[[locale=locale]]` optional-param route-tree shape
 * stays as-is on disk — renaming every route file under it (~20 files) was judged more churn
 * than keeping one always-empty optional param whose only job now is to reject "de". */
export const match: ParamMatcher = () => false;
