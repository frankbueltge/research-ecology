/**
 * Universal (server + client safe) constants. Kept separate from `$lib/server/store.ts`
 * (which pulls in `@research-ecology/domain` — node:fs, the `postgres` driver — server-only
 * modules that must never end up in a client bundle) so shared chrome components can build
 * links to the current encounter without importing anything server-only.
 */
export const CURRENT_ENCOUNTER_ID = "enc-2026-001-calibration-gap-travels";

export const LENS_IDS = ["provenance-v1", "ensemble-transformation-v1", "meridian-position-v1"] as const;
export type LensId = (typeof LENS_IDS)[number];
