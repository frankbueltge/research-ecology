/** Shared route inventory for the e2e suite — one place naming every v1 route (work order §1/§2). */
export const ENCOUNTER_ID = "enc-2026-001-calibration-gap-travels";

export const LENS_IDS = ["provenance-v1", "ensemble-transformation-v1", "meridian-position-v1"] as const;

/** The six narrative beat ids rendered on `/` (work order phase-3d §2), in order. */
export const BEAT_IDS = ["beat-1", "beat-2", "beat-3", "beat-4", "beat-5", "beat-6"] as const;

/** `/` (and `/de`) — the poster + narrative (work order phase-3d §0): no longer a redirect. */
export function rootRoutes(): string[] {
  return ["/", "/de"];
}

export function encounterRoutes(prefix = ""): string[] {
  return [
    `${prefix}/encounters/${ENCOUNTER_ID}`,
    `${prefix}/encounters/${ENCOUNTER_ID}/compare`,
    `${prefix}/encounters/${ENCOUNTER_ID}/maps/provenance-v1@1`,
    `${prefix}/encounters/${ENCOUNTER_ID}/maps/ensemble-transformation-v1@1`,
    `${prefix}/encounters/${ENCOUNTER_ID}/maps/meridian-position-v1@1`,
    `${prefix}/objects/meridian/instrument-001`,
    `${prefix}/objects/ensemble/native-speaker`,
    `${prefix}/assertions/assert-enc2026001-meridian-live-framing`,
    `${prefix}/lenses/provenance-v1`,
    `${prefix}/lenses/ensemble-transformation-v1`,
    `${prefix}/lenses/meridian-position-v1`,
    `${prefix}/apparatus`,
    `${prefix}/archive`,
    `${prefix}/about`,
    `${prefix}/ledger`
  ];
}

export const ALL_ROUTES = [...rootRoutes(), ...encounterRoutes(""), ...encounterRoutes("/de")];
