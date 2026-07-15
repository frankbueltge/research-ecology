/**
 * Export-Site core logic (work order phase-3e-plumbing.md §1 "Export-Job"). Deliberately split
 * from `cli.ts` (argv wrapper) so the determinism test can call `runExport` directly, twice, into
 * two separate temp directories — the same test/lib split the rest of this repo uses (e.g.
 * `packages/domain/src/hydrate.ts` holds the loader's logic; `apps/loader/src/cli.ts` is a thin
 * wrapper around it).
 *
 * Data flow mirrors `apps/project/src/cli.ts` exactly (the "map export precedent" the work order
 * points at): hydrate a fresh in-process `MemoryStore` from this repo's own `import/bundles/**`,
 * the fixture and `lenses/*.json` via `packages/domain`'s `hydrateMemoryStoreFromRepo` — reused
 * verbatim, nothing duplicated — then run the same pure `project()` engine for the same three
 * lenses. The per-record field adapters below (`toProjectionEvent` etc.) are intentionally
 * duplicated in miniature from `apps/project/src/cli.ts`: they are not domain logic (that lives
 * in `packages/domain`/`packages/projections`, which this module does reuse), only a private
 * app-level shape adaptation, and `apps/project` exports nothing a sibling app could import.
 *
 * Determinism (work order critical rule "kein Zeitstempel außer datengetragenen"): no
 * `Date.now()`/`new Date()` (system clock) anywhere in this module. The only "when" in the
 * output is the `event_watermark` — the latest recorded event's own `occurred_at` — and the
 * research-ecology git commit sha named in the provenance README, which is a content identifier
 * of this repo's state, not a wall-clock timestamp. Re-running against the same repo state and
 * the same three fixture/bundle/lens inputs produces byte-identical output every time.
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  hydrateMemoryStoreFromRepo,
  type StoredAssertion,
  type StoredEvent,
  type StoredObjectRef,
  type StoredObligation,
  type StoredParticipant
} from "@research-ecology/domain";
import { project, PROJECTIONS_ENGINE_VERSION, type ProjectionInput, type ProjectionLens } from "@research-ecology/projections";
import { validateMapManifest, validateSiteEntrance, type MapManifest, type SiteEntrance } from "../../../packages/protocol/src/index.js";

export const DEFAULT_ENCOUNTER_ID = "enc-2026-001-calibration-gap-travels";
const LENS_IDS = ["provenance-v1", "ensemble-transformation-v1", "meridian-position-v1"] as const;

export interface ExportOptions {
  /** research-ecology repo root — where import/bundles/, fixtures/, lenses/, narratives/ and
   * packages/protocol/src live. */
  researchEcologyRoot: string;
  /** Absolute path to the target site checkout (its src/data/begegnungen/ is written into). */
  siteDir: string;
  encounterId?: string;
}

export interface ExportResult {
  encounterId: string;
  watermark: string;
  researchEcologyCommit: string;
  /** Every file written, relative to siteDir, sorted — the CLI's stdout summary and what the
   * determinism test diffs. */
  files: string[];
}

// ------------------------------------------------------------------------------------------
// Narrative shape (structural duck-type of apps/middle-web/src/lib/narrative.ts's `Narrative`,
// NOT an import of it — that module lives inside a different app (a SvelteKit app, not a
// package), same reasoning as packages/projections/src/types.ts's own comment on why it
// duck-types packages/protocol's LensDefinition instead of importing it. The narrative JSON
// itself is copied through verbatim (raw bytes) further down; this type only describes the
// fields this module reads to build entrance.json's `stations`.
// ------------------------------------------------------------------------------------------

interface LocalizedText {
  de: string;
  en: string;
  [key: string]: unknown;
}

interface RawNarrativeBeatBase {
  id: string;
  heading: LocalizedText;
}

interface RawQuoteBeat extends RawNarrativeBeatBase {
  quote: string;
  attribution: LocalizedText;
  akte: { eventId: string; eventType: string };
}

interface RawDivergenceBeat extends RawNarrativeBeatBase {
  divergence: {
    leftLabel: LocalizedText;
    leftQuote: string;
    rightLabel: LocalizedText;
    rightQuote: string;
    closing: LocalizedText;
  };
}

type RawNarrativeBeat = RawQuoteBeat | RawDivergenceBeat;

interface RawNarrative {
  encounter_id: string;
  authored_by: string;
  approval: "pending" | "approved";
  beats: RawNarrativeBeat[];
}

function isDivergenceBeat(beat: RawNarrativeBeat): beat is RawDivergenceBeat {
  return "divergence" in beat;
}

// ------------------------------------------------------------------------------------------
// ProjectionInput adapters — duplicated in miniature from apps/project/src/cli.ts (see module
// doc comment above for why these five are not imported).
// ------------------------------------------------------------------------------------------

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

// ------------------------------------------------------------------------------------------
// entrance.json assembly
// ------------------------------------------------------------------------------------------

/** The only currently-live encounter has `shared_resolution: null` (fixture encounter.json) —
 * this branch is exercised; the non-null branch is defensive for a future encounter and simply
 * carries the raw resolution string through both locales until that encounter's narrative
 * authors a real localized status line (documented gap, not a silent guess). */
function computeStatusLine(sharedResolution: string | null): LocalizedText {
  if (sharedResolution === null) {
    return {
      de: "unaufgelöst — beide Lesarten gelten",
      en: "unresolved — both readings stand"
    };
  }
  return { de: sharedResolution, en: sharedResolution };
}

function toStation(beat: RawNarrativeBeat): Record<string, unknown> {
  if (isDivergenceBeat(beat)) {
    return { id: beat.id, heading: beat.heading, divergence: beat.divergence };
  }
  return {
    id: beat.id,
    heading: beat.heading,
    quote: beat.quote,
    attribution: beat.attribution,
    akte_event_id: beat.akte.eventId,
    akte_event_type: beat.akte.eventType
  };
}

/** `encounter_id` collapsed to its short form ("enc-2026-001-calibration-gap-travels" ->
 * "enc-2026-001": the first three dash-separated segments), matching `narratives/enc-2026-001.
 * json`'s own filename — the site subfolder work order §1 names literally. Derived from data,
 * not hardcoded, so a future second encounter gets its own correctly-named folder for free. */
export function shortEncounterSlug(encounterId: string): string {
  return encounterId.split("-").slice(0, 3).join("-");
}

function resolveResearchEcologyCommit(researchEcologyRoot: string): string {
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], { cwd: researchEcologyRoot, encoding: "utf8" }).trim();
  } catch {
    return "unknown (kein Git-Repository erkannt)";
  }
}

function writeJsonFile(filePath: string, data: unknown): void {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export async function runExport(opts: ExportOptions): Promise<ExportResult> {
  const encounterId = opts.encounterId ?? DEFAULT_ENCOUNTER_ID;
  const bundlesRootDir = path.join(opts.researchEcologyRoot, "import/bundles");
  const fixtureDir = path.join(opts.researchEcologyRoot, "fixtures/enc-2026-001-calibration-gap-travels");
  const lensesDir = path.join(opts.researchEcologyRoot, "lenses");
  const narrativePath = path.join(opts.researchEcologyRoot, "narratives", "enc-2026-001.json");

  const { store } = await hydrateMemoryStoreFromRepo({ bundlesRootDir, fixtureDir, lensesDir });

  const encounter = await store.getEncounter(encounterId);
  if (!encounter) throw new Error(`unknown encounter: ${encounterId}`);

  const [participants, events, objects, assertions, obligations] = await Promise.all([
    store.listParticipants(encounterId),
    store.listEventsForEncounter(encounterId),
    store.listObjectsForEncounter(encounterId),
    store.listAssertionsForEncounter(encounterId),
    store.listObligationsForEncounter(encounterId)
  ]);

  const watermark = events.reduce(
    (max, e) => (e.occurred_at > max ? e.occurred_at : max),
    events[0]?.occurred_at ?? "1970-01-01T00:00:00Z"
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

  const slug = shortEncounterSlug(encounter.encounter_id);
  const begegnungenDir = path.join(opts.siteDir, "src", "data", "begegnungen");
  const encounterDir = path.join(begegnungenDir, slug);
  const mapsDir = path.join(encounterDir, "maps");

  const filesWritten: string[] = [];

  // -- the three map version exports -------------------------------------------------------
  for (const lensId of LENS_IDS) {
    const lensVersions = await store.listLensVersions(lensId);
    const lensDef = lensVersions[lensVersions.length - 1];
    if (!lensDef) throw new Error(`unknown lens (not loaded): ${lensId}`);

    const content = project(records, lensDef as unknown as ProjectionLens, watermark, PROJECTIONS_ENGINE_VERSION);
    const mapId = `map-${encounter.encounter_id}-${lensDef.lens_id}`;
    const version = await store.nextMapVersion(mapId);
    const manifest: MapManifest = { map_id: mapId, version, ...content };

    const validation = validateMapManifest(manifest);
    if (!validation.valid) {
      throw new Error(`generated map manifest for "${lensId}" failed map-manifest.schema.json: ${JSON.stringify(validation.errors)}`);
    }
    await store.insertMapVersion(manifest as unknown as never);

    const mapFile = path.join(mapsDir, `${lensId}@${version}.json`);
    writeJsonFile(mapFile, manifest);
    filesWritten.push(path.relative(opts.siteDir, mapFile));
  }

  // -- the narrative object, copied verbatim (raw bytes, not re-serialized) -----------------
  const narrativeRaw = readFileSync(narrativePath, "utf8");
  const narrative = JSON.parse(narrativeRaw) as RawNarrative;
  const narrativeFile = path.join(encounterDir, "narrative.json");
  mkdirSync(path.dirname(narrativeFile), { recursive: true });
  writeFileSync(narrativeFile, narrativeRaw, "utf8");
  filesWritten.push(path.relative(opts.siteDir, narrativeFile));

  // -- entrance.json --------------------------------------------------------------------------
  const firstBeat = narrative.beats[0];
  if (!firstBeat) throw new Error(`${narrativePath}: no beats — cannot derive headline`);

  const entrance: SiteEntrance = {
    encounter_id: encounter.encounter_id,
    title: encounter.title ?? encounter.encounter_id,
    // Work order §1: "headline (DE/EN aus dem Narrative)" — derived from the narrative's own
    // first beat heading (the narrative object's only headline-shaped field; no top-level
    // `headline` exists in narratives/enc-2026-001.json). Documented in the runbook and the
    // final report as an interpretive decision, not a literal field reuse.
    headline: firstBeat.heading,
    status: {
      as_of: watermark.slice(0, 10),
      statusLine: computeStatusLine(encounter.shared_resolution)
    },
    participants: participants.map((p) => ({
      actor_id: p.actor_id,
      collective_id: p.collective_id,
      role: p.role,
      local_status: p.local_status ?? null
    })),
    stations: narrative.beats.map(toStation) as SiteEntrance["stations"],
    links: {
      akte: `/akte/encounters/${encounter.encounter_id}`,
      divergenz: `/akte/encounters/${encounter.encounter_id}/compare`
    },
    authored_by: narrative.authored_by,
    approval: narrative.approval
  };

  const entranceValidation = validateSiteEntrance(entrance);
  if (!entranceValidation.valid) {
    throw new Error(`generated entrance.json failed site-entrance.schema.json: ${JSON.stringify(entranceValidation.errors)}`);
  }
  const entranceFile = path.join(begegnungenDir, "entrance.json");
  writeJsonFile(entranceFile, entrance);
  filesWritten.push(path.relative(opts.siteDir, entranceFile));

  // -- provenance README ----------------------------------------------------------------------
  const commit = resolveResearchEcologyCommit(opts.researchEcologyRoot);
  const readme =
    `# Provenienz\n\n` +
    `Erzeugt aus \`research-ecology\` Commit \`${commit}\` durch \`apps/export-site\`\n` +
    `(\`@research-ecology/export-site@0.1.0\`, Projektions-Engine \`${PROJECTIONS_ENGINE_VERSION}\`).\n\n` +
    `Datenstand: ${watermark} (jüngstes aufgezeichnetes Ereignis der Begegnung\n` +
    `\`${encounter.encounter_id}\`) — kein Erzeugungs-Zeitstempel, nur datengetragene Daten.\n\n` +
    `Diese Dateien sind ein Export, keine Originalquelle — die Quelle bleibt \`research-ecology\`\n` +
    `(\`narratives/\`, \`fixtures/\`, \`lenses/\`, \`packages/domain\`, \`packages/projections\`).\n` +
    `Reproduzierbar via:\n\n` +
    `\`\`\`\n` +
    `npx tsx apps/export-site/src/cli.ts --site <pfad-zum-site-checkout>\n` +
    `\`\`\`\n\n` +
    `Deterministisch: derselbe research-ecology-Stand erzeugt byte-identische Dateien\n` +
    `(\`tests/contract/export-site.test.ts\`). Der manuelle/nächtliche Ablauf steht in\n` +
    `\`docs/runbooks/site-export.md\`.\n`;
  const readmeFile = path.join(begegnungenDir, "README.md");
  mkdirSync(path.dirname(readmeFile), { recursive: true });
  writeFileSync(readmeFile, readme, "utf8");
  filesWritten.push(path.relative(opts.siteDir, readmeFile));

  return {
    encounterId: encounter.encounter_id,
    watermark,
    researchEcologyCommit: commit,
    files: filesWritten.map((f) => f.split(path.sep).join("/")).sort()
  };
}
