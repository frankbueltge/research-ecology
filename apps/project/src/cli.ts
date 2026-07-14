#!/usr/bin/env node
/**
 * Project CLI (work order §0 "Map artifacts"):
 *
 *   npx tsx apps/project/src/cli.ts [--database-url postgres://...] [--encounter <id>]
 *     [--lens provenance-v1,ensemble-transformation-v1,meridian-position-v1] [--watermark <iso>]
 *     [--export <dir>]
 *
 * Without --database-url, hydrates a fresh in-process MemoryStore from
 * import/bundles/**, the fixture and lenses/*.json (work order §0 "no-DB local dev mode") and
 * generates the requested lens x encounter map versions against it — nothing persists beyond
 * this process, which is exactly right for a dev/report run. With a connection string,
 * generates against (and stores into) PostgresStore, assuming apps/loader already populated it.
 *
 * `--export <dir>` additionally writes each generated map as a JSON artifact, validated
 * against map-manifest.schema.json before being written (never an invalid artifact on disk).
 */

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  hydrateMemoryStoreFromRepo,
  PostgresStore,
  type EncounterStore,
  type LoaderStore,
  type StoredAssertion,
  type StoredEvent,
  type StoredObjectRef,
  type StoredObligation,
  type StoredParticipant
} from "@research-ecology/domain";
import { project, PROJECTIONS_ENGINE_VERSION, type ProjectionInput, type ProjectionLens } from "@research-ecology/projections";
import { validateMapManifest, type MapManifest } from "../../../packages/protocol/src/index.js";

const DEFAULT_LENSES = ["provenance-v1", "ensemble-transformation-v1", "meridian-position-v1"];

interface Args {
  bundlesDir: string;
  fixtureDir: string;
  lensesDir: string;
  databaseUrl?: string;
  encounterId: string;
  lensIds: string[];
  watermark?: string;
  exportDir?: string;
}

function parseArgs(argv: string[]): Args {
  const map = new Map<string, string>();
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token?.startsWith("--")) {
      const key = token.slice(2);
      const value = argv[i + 1];
      if (value === undefined || value.startsWith("--")) {
        throw new Error(`missing value for --${key}`);
      }
      map.set(key, value);
      i += 1;
    }
  }
  return {
    bundlesDir: path.resolve(process.cwd(), map.get("bundles-dir") ?? "import/bundles"),
    fixtureDir: path.resolve(process.cwd(), map.get("fixture-dir") ?? "fixtures/enc-2026-001-calibration-gap-travels"),
    lensesDir: path.resolve(process.cwd(), map.get("lenses-dir") ?? "lenses"),
    databaseUrl: map.get("database-url") ?? process.env.DATABASE_URL,
    encounterId: map.get("encounter") ?? "enc-2026-001-calibration-gap-travels",
    lensIds: (map.get("lens") ?? DEFAULT_LENSES.join(",")).split(",").map((s) => s.trim()).filter(Boolean),
    watermark: map.get("watermark"),
    exportDir: map.get("export") ? path.resolve(process.cwd(), map.get("export")!) : undefined
  };
}

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
    valid_from: a.valid_from,
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

interface MapStat {
  lens_id: string;
  version: number;
  map_id: string;
  content_hash_prefix: string;
  included_events: number;
  included_objects: number;
  included_assertions: number;
  included_obligations: number;
  exclusions: number;
  render_failures: number;
  accessible_summary: string;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const usingPostgres = Boolean(args.databaseUrl);

  let store: EncounterStore & LoaderStore;
  if (usingPostgres) {
    store = new PostgresStore(args.databaseUrl!);
  } else {
    const { store: memoryStore } = await hydrateMemoryStoreFromRepo({
      bundlesRootDir: args.bundlesDir,
      fixtureDir: args.fixtureDir,
      lensesDir: args.lensesDir
    });
    store = memoryStore;
  }

  try {
    const encounter = await store.getEncounter(args.encounterId);
    if (!encounter) throw new Error(`unknown encounter: ${args.encounterId}`);

    const [participants, events, objects, assertions, obligations] = await Promise.all([
      store.listParticipants(args.encounterId),
      store.listEventsForEncounter(args.encounterId),
      store.listObjectsForEncounter(args.encounterId),
      store.listAssertionsForEncounter(args.encounterId),
      store.listObligationsForEncounter(args.encounterId)
    ]);

    const watermark =
      args.watermark ?? events.reduce((max, e) => (e.occurred_at > max ? e.occurred_at : max), events[0]?.occurred_at ?? new Date(0).toISOString());

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

    if (args.exportDir) mkdirSync(args.exportDir, { recursive: true });

    const stats: MapStat[] = [];

    for (const lensId of args.lensIds) {
      const lensVersions = await store.listLensVersions(lensId);
      const lensDef = lensVersions[lensVersions.length - 1];
      if (!lensDef) throw new Error(`unknown lens (not loaded): ${lensId}`);

      const content = project(records, lensDef as unknown as ProjectionLens, watermark, PROJECTIONS_ENGINE_VERSION);
      const mapId = `map-${encounter.encounter_id}-${lensDef.lens_id}`;
      const version = await store.nextMapVersion(mapId);
      const manifest: MapManifest = { map_id: mapId, version, ...content };

      const validation = validateMapManifest(manifest);
      if (!validation.valid) {
        throw new Error(`generated map manifest failed map-manifest.schema.json: ${JSON.stringify(validation.errors)}`);
      }

      await store.insertMapVersion(manifest as unknown as never);

      if (args.exportDir) {
        writeFileSync(path.join(args.exportDir, `${mapId}@${version}.json`), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
      }

      stats.push({
        lens_id: lensDef.lens_id,
        version,
        map_id: mapId,
        content_hash_prefix: manifest.content_hash.slice(0, 22),
        included_events: manifest.included.events.length,
        included_objects: manifest.included.objects.length,
        included_assertions: manifest.included.assertions.length,
        included_obligations: manifest.included.obligations.length,
        exclusions: manifest.exclusions.length,
        render_failures: manifest.render_failures.length,
        accessible_summary: manifest.accessible_summary
      });
    }

    process.stdout.write(`${JSON.stringify({ mode: usingPostgres ? "postgres" : "memory", watermark, maps: stats }, null, 2)}\n`);
  } finally {
    if (usingPostgres) await (store as PostgresStore).close();
  }
}

main().catch((error) => {
  process.stderr.write(`${(error as Error).stack ?? String(error)}\n`);
  process.exitCode = 1;
});
