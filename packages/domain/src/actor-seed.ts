/**
 * Locked actor + collective seed (work order §0, "Actor seed (locked list, from
 * docs/REPOSITORY-AUDIT.md §4)"). Names and kinds are exactly as listed in the work order;
 * only `display_name` may be prettier than the id. Seeded once by the loader before any
 * event/assertion/participant row that references an actor_id/collective_id.
 */

import type { ActorKind, StoredActor, StoredCollective, StoredPracticeProfileVersion } from "./types.js";

export interface ActorSeedEntry {
  id: string;
  display_name: string;
  actor_kind: ActorKind;
  collective_id: string | null;
}

export const ACTOR_SEED: ActorSeedEntry[] = [
  { id: "frank-bueltge", display_name: "Frank Bültge", actor_kind: "human", collective_id: null },
  { id: "ulysses", display_name: "Ulysses", actor_kind: "persona", collective_id: "ulysses" },
  { id: "meridian", display_name: "Meridian", actor_kind: "collective", collective_id: "meridian" },
  { id: "ensemble", display_name: "Ensemble", actor_kind: "collective", collective_id: "ensemble" },
  { id: "fable", display_name: "Fable", actor_kind: "model_runtime", collective_id: null },
  { id: "probe", display_name: "Probe", actor_kind: "automation", collective_id: "meridian" },
  {
    id: "protokollfuehrung-layer2",
    display_name: "Protokollführung (layer-2 runner)",
    actor_kind: "automation",
    collective_id: "meridian"
  },
  { id: "atelier-ci", display_name: "Atelier CI", actor_kind: "automation", collective_id: "ulysses" },
  { id: "field-ci", display_name: "Field CI", actor_kind: "automation", collective_id: "meridian" },
  { id: "studio-ci", display_name: "Studio CI", actor_kind: "automation", collective_id: "ensemble" },
  {
    id: "studio-integrate",
    display_name: "Studio Integrate (site apparatus)",
    actor_kind: "automation",
    collective_id: null
  },
  {
    id: "field-integrate",
    display_name: "Field Integrate (site apparatus)",
    actor_kind: "automation",
    collective_id: null
  },
  {
    id: "atelier-integrate",
    display_name: "Atelier Integrate (site apparatus)",
    actor_kind: "automation",
    collective_id: null
  },
  {
    id: "the-middle-editor",
    display_name: "The Middle — editor (human role held by Frank Bültge)",
    actor_kind: "human",
    collective_id: null
  },
  {
    id: "the-middle-importer",
    display_name: "The Middle — importer (automation)",
    actor_kind: "automation",
    collective_id: null
  }
];

/** The three sovereign collectives. Never includes The Middle itself — it is shared
 * infrastructure, not a fourth sovereign practice (design §6, work order critical rule
 * "The Middle never speaks as a collective"). */
export const COLLECTIVE_SEED: StoredCollective[] = [
  {
    id: "ulysses",
    current_name: "Ulysses",
    status: "active",
    repository_url: "https://github.com/frankbueltge/irrtum-als-methode",
    public_url: "https://frankbueltge.de/atelier"
  },
  {
    id: "meridian",
    current_name: "Meridian",
    status: "active",
    repository_url: "https://github.com/frankbueltge/field-research",
    public_url: "https://frankbueltge.de/field"
  },
  {
    id: "ensemble",
    current_name: "Ensemble",
    status: "active",
    repository_url: "https://github.com/frankbueltge/studio",
    public_url: "https://frankbueltge.de/studio"
  }
];

/** Every editorial actor id — used by the loader's issuer check ("The Middle never speaks
 * as a collective"): any event issued by one of these must never carry a real collective_id
 * (spec: the sentinel `the-middle-editorial` marks editorial apparatus authorship instead). */
export const EDITORIAL_ACTOR_IDS: ReadonlySet<string> = new Set([
  "the-middle-editor",
  "the-middle-importer"
]);

/** The sentinel `issuer.collective_id` value editorial events use. Deliberately never
 * registered as a `StoredCollective` — it names the shared apparatus, not a sovereign
 * practice, and encounter-event.schema.json only requires `collective_id` to be a string. */
export const THE_MIDDLE_EDITORIAL_SENTINEL = "the-middle-editorial";

/**
 * Profile-author sentinel (ADR 0011 §1, work order phase-b-profiles.md §3): "The Middle cannot
 * publish a profile." Mirrors `assertIssuerNeverImpersonatesCollective` in hydrate.ts (same
 * `EDITORIAL_ACTOR_IDS` set), but lives here rather than in hydrate.ts so both the loader
 * (hydrate.ts's `loadProfilesFromDir`) AND the two store implementations' own
 * `putPracticeProfileVersion` can call it without a circular import — hydrate.ts already
 * imports `MemoryStore`, so a check defined there could not be imported back into
 * memory-store.ts/postgres-store.ts.
 */
export class EditorialProfileAuthorViolation extends Error {
  constructor(collectiveId: string, version: number, authoredBy: string) {
    super(
      `practice_profile_versions ${collectiveId}@${version}: authored_by ("${authoredBy}") is ` +
        `an editorial/Middle actor — practice profiles are always authored by the practice ` +
        `itself, never by The Middle (ADR 0011 §1). Use an actor of the practice's own ` +
        `collective instead.`
    );
    this.name = "EditorialProfileAuthorViolation";
  }
}

export function assertProfileAuthorIsNotEditorial(
  profile: Pick<StoredPracticeProfileVersion, "collective_id" | "version" | "authored_by">
): void {
  if (EDITORIAL_ACTOR_IDS.has(profile.authored_by)) {
    throw new EditorialProfileAuthorViolation(profile.collective_id, profile.version, profile.authored_by);
  }
}

export function actorSeedById(): Map<string, StoredActor> {
  const map = new Map<string, StoredActor>();
  for (const entry of ACTOR_SEED) {
    map.set(entry.id, {
      id: entry.id,
      display_name: entry.display_name,
      actor_kind: entry.actor_kind,
      collective_id: entry.collective_id
    });
  }
  return map;
}
