/** Shared route inventory for the e2e suite — one place naming every v1 route (work order §1/§2). */
export const ENCOUNTER_ID = "enc-2026-001-calibration-gap-travels";

export const LENS_IDS = ["provenance-v1", "ensemble-transformation-v1", "meridian-position-v1"] as const;

/** The six tableau stations rendered on `/` (2026-07-15 entrance rebuild), in order: the
 * CSS-only radio id (`#st-N`) and the caption class it drives (`.cap-N`, inside
 * `.tableau__caption`). All six captions exist in the DOM at all times; only one is visible,
 * driven by `:has(#st-N:checked)`. */
export const STATION_RADIO_IDS = ["st-1", "st-2", "st-3", "st-4", "st-5", "st-6"] as const;
export const STATION_CAPTIONS = ["cap-1", "cap-2", "cap-3", "cap-4", "cap-5", "cap-6"] as const;

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
