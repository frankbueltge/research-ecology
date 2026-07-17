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
import { mkdirSync, readFileSync, writeFileSync, readdirSync, readFileSync } from "node:fs";
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
import {
  validateMapManifest,
  validateScoreExport,
  validateSiteEntrance,
  type MapManifest,
  type ScoreExport,
  type ScoreExportEvent,
  type ScoreExportFlow,
  type ScoreExportObligation,
  type SiteEntrance
} from "../../../packages/protocol/src/index.js";

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
//
// EN-only (Frank, 2026-07-15: the ecology stack dropped German) — every field that used to be
// a `{ de, en }` localized object is now a plain string; the former `LocalizedText` type is
// deleted.
// ------------------------------------------------------------------------------------------

interface RawNarrativeBeatBase {
  id: string;
  heading: string;
}

interface RawQuoteBeat extends RawNarrativeBeatBase {
  quote: string;
  attribution: string;
  akte: { eventId: string; eventType: string };
}

interface RawDivergenceBeat extends RawNarrativeBeatBase {
  divergence: {
    leftLabel: string;
    leftQuote: string;
    rightLabel: string;
    rightQuote: string;
    closing: string;
  };
}

type RawNarrativeBeat = RawQuoteBeat | RawDivergenceBeat;

interface RawNarrative {
  encounter_id: string;
  headline?: string;
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
// score.json assembly (work order phase-c2-site-entrance-design.md §1: additive export,
// nothing hardcoded that the ledger already carries). The score renderer (frankbueltge.de's
// src/lib/begegnungen/score.ts, a TS port of docs/design/variants-2026-07-15/
// assemble_variants.py's build_svg()) needs three facts entrance.json's narrated-station
// subset doesn't carry: the FULL ledger (all 7 events here, not just the 5 the narrative
// singles out), which lane (source/conductor/receiver) each event and obligation belongs on,
// and which event-to-event transitions are worth drawing as a flow arc. None of these are new
// domain fields — every one below is a deterministic function of data already in the
// hydrated store (participants, issuer, ledger order, `responds_to_event_id`).
// ------------------------------------------------------------------------------------------

/** A participant's lane id: its own collective_id (meridian/ensemble), or — for the
 * collective-less conductor participant — its role. */
function participantLane(p: StoredParticipant): string {
  return p.collective_id ?? p.role;
}

/** Vertical drawing rank, top to bottom (source above conductor above receiver — The Middle
 * lies literally between the two practices, docs/design/zeichengrammatik-2026-07-15.md §1
 * "Bahnen"). Not participant array order: encounter.json declares source, receiver, conductor
 * in that order; the score draws source, conductor, receiver. Unknown/future roles rank last,
 * in the order they were declared — a documented fallback, never a crash. */
const ROLE_RANK: Record<string, number> = { source: 0, conductor: 1, receiver: 2 };

function participantRank(p: StoredParticipant, allParticipants: StoredParticipant[]): number {
  const known = ROLE_RANK[p.role];
  if (known !== undefined) return known;
  return Object.keys(ROLE_RANK).length + allParticipants.findIndex((other) => other === p);
}

/**
 * Which lane an event belongs on, and whether it was issued by an automation identity distinct
 * from the encounter's own declared participants.
 *
 * Rule (checked against all 7 fixture events, including the one whose issuer.collective_id and
 * drawn lane differ — evt-enc2026001-03-correction-issued, issued by Ensemble but DELIVERED by
 * the conductor persona; events.json's own apparatus_note: "issuer.collective_id = ensemble,
 * issuer.actor_id = frank-bueltge" because Ensemble explicitly delegated delivery):
 *   1. match issuer.actor_id against a participant's actor_id (the ACTING persona — this is how
 *      the ledger itself distinguishes "who is speaking" from "who is carrying"). If matched,
 *      infra = false.
 *   2. else match issuer.collective_id against a participant's collective_id (issuer.actor_id
 *      names an identity the encounter never declared as a participant — e.g. an automation
 *      persona such as "studio-integrate" acting on a collective's behalf). If matched,
 *      infra = true.
 *   3. else (issuer names neither a declared actor nor a declared collective): documented
 *      fallback lane "unknown", infra = true — never a guessed lane.
 */
function deriveLane(
  issuer: { collective_id: string | null; actor_id: string },
  participants: StoredParticipant[]
): { lane: string; infra: boolean } {
  const byActor = participants.find((p) => p.actor_id === issuer.actor_id);
  if (byActor) return { lane: participantLane(byActor), infra: false };
  const byCollective = issuer.collective_id
    ? participants.find((p) => p.collective_id === issuer.collective_id)
    : undefined;
  if (byCollective) return { lane: participantLane(byCollective), infra: true };
  return { lane: "unknown", infra: true };
}

/** Fixed priority list of payload field names that, across this ledger's event types, hold the
 * one sentence that matters (observed in fixtures/.../events.json, not per-event-id special
 * cased) — used only as a fallback for events the narrative doesn't quote directly. */
const QUOTE_PAYLOAD_KEYS = [
  "quote_governing_principle",
  "quote_contract",
  "quote_appellate_finding",
  "quote_rationale",
  "quote_detector_in_accusation",
  "quote_session_33_addition",
  "gate_note",
  "commit_message"
];

function deriveFallbackQuote(payload: Record<string, unknown> | undefined): string | null {
  if (!payload) return null;
  for (const key of QUOTE_PAYLOAD_KEYS) {
    const value = payload[key];
    if (typeof value === "string" && value.length > 0) return value;
  }
  return null;
}

function findNarrativeBeat(beats: RawNarrativeBeat[], eventId: string): RawQuoteBeat | undefined {
  return beats.find((b): b is RawQuoteBeat => !isDivergenceBeat(b) && b.akte.eventId === eventId);
}

function beatStationNumber(beatId: string): number | null {
  const match = /^beat-(\d+)$/.exec(beatId);
  return match ? Number(match[1]) : null;
}

/**
 * Quote + attribution for a score event. The 5 events the narrative singles out
 * (`beats[].akte.eventId`) get the narrative's own approved quote/attribution — the same text
 * entrance.json's stations show, so the score and the register agree word for word. The
 * remaining events (currently: the two `derivative.published` events the narrative doesn't
 * narrate) get a quote from the event's own payload (`deriveFallbackQuote`, never invented
 * prose) and an attribution built from the issuer: the issuing collective, or
 * "<actor> (infrastructure)" when `infra` is true.
 */
function deriveEventQuoteAndAttribution(
  event: StoredEvent,
  beat: RawQuoteBeat | undefined,
  lane: { lane: string; infra: boolean }
): { quote: string | null; attribution: string | null } {
  if (beat) return { quote: beat.quote, attribution: beat.attribution };
  const quote = deriveFallbackQuote(event.payload as Record<string, unknown> | undefined);
  const attribution = lane.infra
    ? `${event.issuer.actor_id} (infrastructure)`
    : (event.issuer.collective_id ?? event.issuer.actor_id);
  return { quote, attribution };
}

/**
 * Which event-to-event transitions are worth drawing as a flow arc, and in which direction
 * (docs/design/zeichengrammatik-2026-07-15.md §1 "Stromrichtung": downstream = source→receiver,
 * upstream = receiver→source, vertically by lane rank). Every event TYPE listed here has a
 * well-defined transport meaning in spec 03's own vocabulary, not this generator's invention:
 * `object.admitted` is the moment a receiver takes on a source's object (the downstream
 * transfer itself); `correction.issued` and `correction.applied` are, by definition, a
 * correction travelling back. Each such event gets a flow edge FROM the event that occasioned
 * it TO itself:
 *   - `correction.applied` names its own trigger explicitly via `payload.responds_to_event_id`
 *     (a real ledger field — no inference needed);
 *   - the other two use the immediately preceding ledger event (ledger order is itself data,
 *     not a guess: `object.admitted` always follows the contract it was admitted under;
 *     `correction.issued` always follows the admission whose obligation it is delivering on).
 * A transition is only drawn when the two events actually sit on different lanes (same-lane
 * transitions are not a flow — nothing crosses The Middle).
 */
const FLOW_EVENT_TYPES = new Set(["object.admitted", "correction.issued", "correction.applied"]);

function deriveFlows(
  events: StoredEvent[],
  eventLane: Map<string, string>,
  laneRank: Map<string, number>
): ScoreExportFlow[] {
  const flows: ScoreExportFlow[] = [];
  events.forEach((e, i) => {
    if (!FLOW_EVENT_TYPES.has(e.event_type)) return;
    const respondsTo = (e.payload as Record<string, unknown> | undefined)?.["responds_to_event_id"];
    const fromEventId = typeof respondsTo === "string" ? respondsTo : events[i - 1]?.event_id;
    if (!fromEventId) return;
    const fromLane = eventLane.get(fromEventId);
    const toLane = eventLane.get(e.event_id);
    if (fromLane === undefined || toLane === undefined || fromLane === toLane) return;
    const fromRank = laneRank.get(fromLane) ?? 0;
    const toRank = laneRank.get(toLane) ?? 0;
    flows.push({
      from_event_id: fromEventId,
      to_event_id: e.event_id,
      direction: toRank > fromRank ? "downstream" : "upstream"
    });
  });
  return flows;
}

/** Short slug label for an obligation, e.g. id "obl-enc2026001-caveat-preservation" ->
 * "caveat-preservation — active". Every obligation id in this domain follows
 * "obl-<encounter-slug>-<slug>" (obligations.json's own convention) — slicing off the first two
 * dash-segments is a general rule, not a per-obligation lookup table. */
function obligationLabel(id: string, status: string): string {
  const slug = id.split("-").slice(2).join("-");
  return `${slug} — ${status}`;
}

function buildScoreObligations(
  obligations: StoredObligation[],
  participants: StoredParticipant[]
): ScoreExportObligation[] {
  return obligations.map((o) => {
    const obligated = o.obligated_collective_id
      ? participants.find((p) => p.collective_id === o.obligated_collective_id)
      : undefined;
    const lane = obligated ? participantLane(obligated) : "unknown";
    return {
      id: o.id,
      label: obligationLabel(o.id, o.status),
      lane,
      source_event_id: o.source_event_id,
      status: o.status,
      clause_text: o.clause_text
    };
  });
}

function buildScoreExport(
  encounterId: string,
  headline: string,
  asOf: string,
  statusLine: string,
  authoredBy: string,
  approval: "pending" | "approved",
  akte: string,
  participants: StoredParticipant[],
  events: StoredEvent[],
  obligations: StoredObligation[],
  narrative: RawNarrative,
  nonParticipants: Array<{ collective_id: string; note: string }>
): ScoreExport {
  const scoreParticipants = participants.map((p) => ({
    actor_id: p.actor_id,
    collective_id: p.collective_id,
    role: p.role,
    local_status: p.local_status ?? null,
    lane: participantLane(p),
    rank: participantRank(p, participants)
  }));

  const eventLane = new Map<string, string>();
  const laneRank = new Map<string, number>();
  for (const p of participants) laneRank.set(participantLane(p), participantRank(p, participants));

  const scoreEvents: ScoreExportEvent[] = events.map((e) => {
    const lane = deriveLane(e.issuer, participants);
    eventLane.set(e.event_id, lane.lane);
    const beat = findNarrativeBeat(narrative.beats, e.event_id);
    const { quote, attribution } = deriveEventQuoteAndAttribution(e, beat, lane);
    return {
      event_id: e.event_id,
      event_type: e.event_type,
      date: e.occurred_at.slice(0, 10),
      issuer: { collective_id: e.issuer.collective_id, actor_id: e.issuer.actor_id },
      lane: lane.lane,
      infra: lane.infra,
      station: beat ? beatStationNumber(beat.id) : null,
      quote,
      attribution
    };
  });

  const divergenceBeat = narrative.beats.find(isDivergenceBeat);
  if (!divergenceBeat) throw new Error(`${narrative.encounter_id}: narrative has no divergence beat — cannot build score divergence`);
  const sourceParticipant = participants.find((p) => p.role === "source");
  const receiverParticipant = participants.find((p) => p.role === "receiver");

  return {
    schema_version: "1.0",
    encounter_id: encounterId,
    headline,
    status: { as_of: asOf, statusLine },
    authored_by: authoredBy,
    approval,
    akte,
    participants: scoreParticipants,
    non_participants: nonParticipants,
    events: scoreEvents,
    obligations: buildScoreObligations(obligations, participants),
    flows: deriveFlows(events, eventLane, laneRank),
    divergence: {
      ...divergenceBeat.divergence,
      leftLane: sourceParticipant ? participantLane(sourceParticipant) : undefined,
      rightLane: receiverParticipant ? participantLane(receiverParticipant) : undefined,
      station: beatStationNumber(divergenceBeat.id)
    }
  };
}

// ------------------------------------------------------------------------------------------
// entrance.json assembly
// ------------------------------------------------------------------------------------------

/** The only currently-live encounter has `shared_resolution: null` (fixture encounter.json) —
 * this branch is exercised; the non-null branch is defensive for a future encounter and simply
 * carries the raw resolution string through until that encounter's narrative authors a real
 * status line (documented gap, not a silent guess). EN-only (2026-07-15: the ecology stack
 * dropped German — this used to return a `{ de, en }` pair). */
function computeStatusLine(sharedResolution: string | null): string {
  if (sharedResolution === null) {
    return "unresolved — both readings stand";
  }
  return sharedResolution;
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

  const hydration = await hydrateMemoryStoreFromRepo({ bundlesRootDir, fixtureDir, lensesDir });
  const { store } = hydration;
  // Fail-LOUD statt still verwerfen (17.07.: ein schema-invalides Korrektur-Event verschwand
  // lautlos aus Partitur und Entrance — der Export blieb grün, die Site blieb alt). Verworfene
  // FIXTURE-Records sind ein Datenfehler des Registers, kein tolerierbares Rauschen: abbrechen,
  // damit Integrate rot wird und ein Issue entsteht, statt eine stumme Lücke zu publizieren.
  const rejectedLists: string[] = [];
  const collect = (v: unknown): void => {
    if (Array.isArray(v)) { v.forEach(collect); return; }
    if (v && typeof v === "object") {
      const rec = v as Record<string, unknown>;
      if (Array.isArray(rec.rejected) && rec.rejected.length > 0) {
        rejectedLists.push(...(rec.rejected as string[]).map(String));
      }
      Object.values(rec).forEach(collect);
    }
  };
  collect(hydration);
  if (rejectedLists.length > 0) {
    throw new Error(`hydration rejected ${rejectedLists.length} record(s) — refusing to export a silently thinned ledger:\n${rejectedLists.join("\n")}`);
  }

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
    // The narrative's own top-level editorial headline is the single source; the first
    // beat's heading remains only the fallback for narratives that don't declare one.
    headline: narrative.headline ?? firstBeat.heading,
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

  // -- score.json (work order phase-c2-site-entrance-design.md §1) ----------------------------
  // Exclude the synthesized `editorial.encounter_assembled` event (The Middle's own 2026-07-14
  // act of assembling this record, added by the loader — hydrate.ts's `assembly_event_id`,
  // never present in the raw fixture events.json) from the score's ledger: this mirrors
  // provenance-v1's own exclusion of the exact same event ("the ledger renders the encounter's
  // own operational history, not the apparatus that recorded it" — visible on /apparatus
  // instead), and keeps the score's event count at the 7 real ledger events the zeichengrammatik
  // and wortlaute documents both name. Filtered by id against the domain's own
  // `assembly_event_id` field, not by a hardcoded event id or a guessed type-name string.
  // Ledger order is itself data, not the hydrated store's incidental return order — sort
  // defensively so `deriveFlows`'s "immediately preceding event" rule is never at the mercy of
  // an unspecified store iteration order.
  const orderedEvents = events
    .filter((e) => e.event_id !== encounter.assembly_event_id)
    .sort((a, b) => a.occurred_at.localeCompare(b.occurred_at));
  const score: ScoreExport = buildScoreExport(
    encounter.encounter_id,
    entrance.headline,
    entrance.status.as_of,
    entrance.status.statusLine,
    narrative.authored_by,
    narrative.approval,
    entrance.links.akte,
    participants,
    orderedEvents,
    obligations,
    narrative,
    encounter.non_participants
  );
  const scoreValidation = validateScoreExport(score);
  if (!scoreValidation.valid) {
    throw new Error(`generated score.json failed score-export.schema.json: ${JSON.stringify(scoreValidation.errors)}`);
  }
  const scoreFile = path.join(encounterDir, "score.json");
  writeJsonFile(scoreFile, score);
  filesWritten.push(path.relative(opts.siteDir, scoreFile));

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

  // -- register.json (2026-07-17: the ledger holds multiple encounters now) -------------------
  // Listed straight from the fixtures' own encounter.json files — deterministic (sorted by
  // directory name), no timestamps beyond each record's own status.as_of. The entrance keeps
  // the one encounter with an authored score; the register names every recorded encounter so
  // the site never silently under-reports the ledger (Frank, 2026-07-17: "warum wurde die
  // encounter karte noch nicht aktualisiert??").
  const fixturesRoot = path.join(opts.researchEcologyRoot, "fixtures");
  const register = readdirSync(fixturesRoot)
    .filter((d) => d.startsWith("enc-"))
    .sort()
    .map((dir) => {
      const enc = JSON.parse(readFileSync(path.join(fixturesRoot, dir, "encounter.json"), "utf8")) as {
        encounter_id: string;
        title?: string;
        status?: { as_of?: string; statusLine?: string } | null;
        approval?: string | null;
        authored_by?: string | null;
        participants?: Array<{ collective_id?: string | null; actor_id?: string; role?: string }>;
      };
      return {
        encounter_id: enc.encounter_id,
        title: enc.title ?? null,
        status: enc.status ?? null,
        approval: enc.approval ?? null,
        authored_by: enc.authored_by ?? null,
        participants: (enc.participants ?? []).map((p) => ({
          id: p.collective_id ?? p.actor_id ?? "unknown",
          role: (p as { role?: string }).role ?? null
        })),
        record_url: `https://github.com/frankbueltge/research-ecology/tree/main/fixtures/${dir}`
      };
    });
  const registerFile = path.join(begegnungenDir, "register.json");
  writeJsonFile(registerFile, register);
  filesWritten.push(path.relative(opts.siteDir, registerFile));

  return {
    encounterId: encounter.encounter_id,
    watermark,
    researchEcologyCommit: commit,
    files: filesWritten.map((f) => f.split(path.sep).join("/")).sort()
  };
}
