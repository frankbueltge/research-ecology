/**
 * Server-only singleton store (work order §0 Locked decision 1: "dev mode uses MemoryStore
 * hydrated at server start (bundles + fixture + lenses + generated map versions via
 * packages/projections)"). Hydrated exactly once per server process — every route's
 * `+page.server.ts` awaits the same cached promise instead of re-reading disk per request.
 *
 * No direct file reads happen in routes (work order §0): this module is the only place that
 * touches `import/bundles`, the fixture directory and `lenses/*.json`, via
 * `@research-ecology/domain`'s `hydrateMemoryStoreFromRepo`.
 */

import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { hydrateMemoryStoreFromRepo, type MemoryStore } from "@research-ecology/domain";
import {
  project,
  PROJECTIONS_ENGINE_VERSION,
  type ProjectionInput,
  type ProjectionLens
} from "@research-ecology/projections";
import type {
  StoredAssertion,
  StoredEvent,
  StoredObjectRef,
  StoredObligation,
  StoredParticipant
} from "@research-ecology/domain";
import { CURRENT_ENCOUNTER_ID, LENS_IDS } from "../constants.js";

/**
 * Locates the monorepo root by walking up from wherever this module physically runs, looking
 * for the sentinel directories every hydration path needs (`lenses/`, `fixtures/`,
 * `import/bundles/`). A fixed `../../../../..` depth would be correct in dev (this file runs
 * from its own source path, `apps/middle-web/src/lib/server/`) but wrong once Vite bundles it
 * for production (the same code then runs from `apps/middle-web/.svelte-kit/output/server/
 * chunks/`, a different depth) — walking up and checking is depth-independent, so both modes
 * resolve to the same real repo root.
 */
function findRepoRoot(startDir: string): string {
  let dir = startDir;
  for (;;) {
    if (existsSync(path.join(dir, "lenses")) && existsSync(path.join(dir, "fixtures")) && existsSync(path.join(dir, "import", "bundles"))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error(
        `research-ecology server store: could not locate the monorepo root by walking up from "${startDir}" (looked for lenses/, fixtures/, import/bundles/).`
      );
    }
    dir = parent;
  }
}

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = findRepoRoot(here);

const HYDRATION_PATHS = {
  bundlesRootDir: path.join(REPO_ROOT, "import/bundles"),
  fixtureDir: path.join(REPO_ROOT, "fixtures/enc-2026-001-calibration-gap-travels"),
  lensesDir: path.join(REPO_ROOT, "lenses")
};

/** Re-exported for existing callers (work order §0 "the honest single-encounter state") — the
 * canonical definitions live in `$lib/constants.ts` so client-safe code can use them too. */
export { CURRENT_ENCOUNTER_ID, LENS_IDS };
export type { LensId } from "../constants.js";

/** Re-exported so other server-only modules that need a repo-root-relative path (e.g.
 * `$lib/server/narrative.ts`'s `narratives/enc-2026-001.json`) reuse the same depth-independent
 * resolution instead of re-implementing `findRepoRoot`. */
export { REPO_ROOT };

function toProjectionEvent(e: StoredEvent) {
  return {
    event_id: e.event_id,
    event_type: e.event_type,
    issuer: e.issuer,
    occurred_at: e.occurred_at,
    source_uri: e.source_uri,
    source_commit: e.source_commit,
    payload: e.payload,
    content_hash: e.content_hash
  };
}

function toProjectionObject(o: StoredObjectRef) {
  return {
    id: o.id,
    collective_id: o.collective_id,
    local_object_id: o.local_object_id,
    canonical_uri: o.canonical_uri,
    local_object_type: o.local_object_type,
    interoperability_class: o.interoperability_class,
    title_cache: o.title_cache,
    summary_cache: (o as { summary_cache?: string }).summary_cache,
    lifecycle_status: o.lifecycle_status,
    local_epistemic_status: o.local_epistemic_status,
    content_hash: o.content_hash
  };
}

function toProjectionAssertion(a: StoredAssertion) {
  return {
    assertion_id: a.assertion_id,
    author: a.author,
    subject: a.subject,
    predicate: a.predicate,
    object: a.object,
    rationale: a.rationale,
    epistemic_status: a.epistemic_status,
    local_epistemic_status: a.local_epistemic_status,
    valid_from: a.valid_from as string | undefined,
    content_hash: a.content_hash
  };
}

function toProjectionObligation(o: StoredObligation) {
  return {
    id: o.id,
    source_event_id: o.source_event_id,
    proposer_collective_id: o.proposer_collective_id,
    obligated_collective_id: o.obligated_collective_id,
    clause_text: o.clause_text,
    status: o.status,
    prominence: o.prominence,
    active_from: o.active_from
  };
}

function toProjectionParticipant(p: StoredParticipant) {
  return {
    collective_id: p.collective_id,
    actor_id: p.actor_id,
    role: p.role,
    local_status: p.local_status,
    local_status_rationale: p.local_status_rationale
  };
}

/** `map_id` follows the exact convention `apps/project/src/cli.ts` uses, so a citation URL
 * minted here would resolve identically against a future Postgres-backed deployment. */
export function mapIdFor(encounterId: string, lensId: string): string {
  return `map-${encounterId}-${lensId}`;
}

export interface HydratedApp {
  store: MemoryStore;
  /** Deterministic watermark: the latest event's `occurred_at` across the whole encounter
   * (independent of which lens is being generated) — same input every time this process runs,
   * so "same URL always serves identical content" holds (work order §2 epistemic guard). */
  watermark: string;
}

let cached: Promise<HydratedApp> | undefined;

async function buildApp(): Promise<HydratedApp> {
  const { store } = await hydrateMemoryStoreFromRepo(HYDRATION_PATHS);

  const encounter = await store.getEncounter(CURRENT_ENCOUNTER_ID);
  if (!encounter) {
    throw new Error(`server store: fixture encounter ${CURRENT_ENCOUNTER_ID} did not hydrate`);
  }

  const [participants, events, objects, assertions, obligations] = await Promise.all([
    store.listParticipants(CURRENT_ENCOUNTER_ID),
    store.listEventsForEncounter(CURRENT_ENCOUNTER_ID),
    store.listObjectsForEncounter(CURRENT_ENCOUNTER_ID),
    store.listAssertionsForEncounter(CURRENT_ENCOUNTER_ID),
    store.listObligationsForEncounter(CURRENT_ENCOUNTER_ID)
  ]);

  const watermark = events.reduce(
    (max, e) => (e.occurred_at > max ? e.occurred_at : max),
    events[0]?.occurred_at ?? new Date(0).toISOString()
  );

  const records: ProjectionInput = {
    encounter: {
      encounter_id: encounter.encounter_id,
      title: encounter.title,
      editorial_proposition: encounter.editorial_proposition,
      visibility: encounter.visibility,
      shared_resolution: encounter.shared_resolution,
      resolution_note: encounter.resolution_note
    },
    participants: participants.map(toProjectionParticipant),
    events: events.map(toProjectionEvent),
    objects: objects.map(toProjectionObject),
    assertions: assertions.map(toProjectionAssertion),
    obligations: obligations.map(toProjectionObligation)
  };

  for (const lensId of LENS_IDS) {
    const lensVersions = await store.listLensVersions(lensId);
    const lensDef = lensVersions[lensVersions.length - 1];
    if (!lensDef) throw new Error(`server store: lens not loaded: ${lensId}`);

    const content = project(records, lensDef as unknown as ProjectionLens, watermark, PROJECTIONS_ENGINE_VERSION);
    const mapId = mapIdFor(CURRENT_ENCOUNTER_ID, lensDef.lens_id);
    const version = await store.nextMapVersion(mapId);
    await store.insertMapVersion({ map_id: mapId, version, ...content } as unknown as never);
  }

  return { store, watermark };
}

/** Cached across the process (work order: "hydrated at server start"), not per-request. */
export function getApp(): Promise<HydratedApp> {
  if (!cached) cached = buildApp();
  return cached;
}
