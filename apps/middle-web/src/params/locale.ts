import type { ParamMatcher } from "@sveltejs/kit";

/** Matches the optional `/de` URL-prefix segment (work order §0 i18n: "URL-prefix routing
 * (/de/...)"). Every route lives once under `src/routes/[[locale=locale]]/...` — English at
 * the bare path, the German chrome mirror under `/de/...` — instead of being hand-duplicated
 * into two parallel route trees. */
export const match: ParamMatcher = (param) => param === "de";
