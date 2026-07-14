/**
 * Bundle record shapes produced by the adapters (work order §2 package layout).
 *
 * `manifest`, `events` and `assertions` reuse the Phase-1 kernel's hand-written interfaces
 * (`CollectiveManifest`, `EncounterEvent`, `AssertionRecord` from packages/protocol) and are
 * validated against the matching JSON Schemas there. `packages/protocol/schemas` has no
 * schema yet for a standalone local-object-reference record, nor for exclusions,
 * import-records or coverage — those four are Phase-2 bundle-format additions defined here
 * and checked structurally by this package's own contract tests rather than by Ajv.
 *
 * Adapters never emit `encounter_id` on events or assertions (locked, work order §0/§3.7):
 * the two event/assertion interfaces below are the Phase-1 types with that field omitted.
 */

import type { AssertionRecord, CollectiveManifest, EncounterEvent } from "../../protocol/src/index.js";

/**
 * An `events.json` / `assertions.json` record as an adapter may emit it: never
 * encounter-scoped. `encounter_id` is already optional on the Phase-1 types
 * (`EncounterEvent`/`AssertionRecord` both declare it as `encounter_id?: string`), so these
 * are plain aliases rather than an `Omit<..., "encounter_id">` — Omit collapses to
 * `unknown`-typed members on these interfaces because every Phase-1 protocol type also
 * carries a `[key: string]: unknown` index signature, which makes `keyof T` widen to `string`
 * and erases the named properties' literal types. Adapters simply never populate
 * `encounter_id`; test 3.7 (tests/contract/adapters.test.ts) checks that at the data level.
 */
export type AdapterEvent = EncounterEvent;
export type AdapterAssertion = AssertionRecord;

export type { CollectiveManifest };

/**
 * A reference to one local object (a work, a doc, a journal entry, ...) as it existed at the
 * pinned commit. Id format `<collective_id>:<local_object_id>@<shortSha>` (mirrors the
 * Phase-1 fixture, fixtures/enc-2026-001-calibration-gap-travels/objects.json).
 */
export interface LocalObjectRef {
  id: string;
  collective_id: string;
  local_object_id: string;
  object_version: string;
  canonical_uri: string;
  /** Duplicate of canonical_uri under the generic provenance field name (work order §3 test 2). */
  source_uri: string;
  media_type?: string;
  local_object_type: string;
  interoperability_class?: string;
  title_cache?: string;
  lifecycle_status: string;
  local_epistemic_status?: string;
  content_hash: string;
  source_commit: string;
  source_metadata: Record<string, unknown>;
  importer_version: string;
  [key: string]: unknown;
}

/** A deliberately skipped path — never silently absent (ADR 0003, work order §3 test 4/8). */
export interface Exclusion {
  collective_id: string;
  path: string;
  kind: string;
  reason: string;
  source_commit: string;
}

/** An ambiguity or an unsupported-for-mechanical-parsing case — never a guess. */
export interface ImportRecord {
  collective_id: string;
  kind: "ambiguous" | "unsupported";
  path: string;
  reason: string;
  detail?: string;
  source_commit: string;
}

export interface CoverageRow {
  path: string;
  status: "imported" | "excluded" | "unsupported";
  detail?: string;
  /** Ids (or counts) of records this path produced, for a human auditing the bundle. */
  produced?: string[];
}

export interface Coverage {
  collective_id: string;
  source_commit: string;
  source_commit_short: string;
  repository_url: string;
  importer_version: string;
  /** Run metadata only — excluded from the byte-identical determinism comparison (work order §0). */
  generated_at: string;
  rows: CoverageRow[];
}

/** Everything one adapter run produces, before stable-sort assembly (bundle.ts). */
export interface AdapterBundleParts {
  manifest: CollectiveManifest;
  objects: LocalObjectRef[];
  events: AdapterEvent[];
  assertions: AdapterAssertion[];
  exclusions: Exclusion[];
  importRecords: ImportRecord[];
  coverage: Coverage;
}

export const IMPORTER_VERSION = "@research-ecology/adapters@0.1.0";
