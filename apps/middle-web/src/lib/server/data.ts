/**
 * Route-facing data access (work order §0: "Data access exclusively through packages/domain's
 * EncounterStore ... No direct file reads in routes"). Every `+page.server.ts` calls functions
 * here, never `packages/domain`/`packages/projections` directly and never `node:fs` directly.
 */

import { error } from "@sveltejs/kit";
import type {
  StoredActor,
  StoredAssertion,
  StoredCollective,
  StoredEncounter,
  StoredEvent,
  StoredImportRecord,
  StoredLensVersion,
  StoredMapVersion,
  StoredNonParticipant,
  StoredObjectRef,
  StoredObligation,
  StoredParticipant,
  StoredPracticeProfileVersion
} from "@research-ecology/domain";
import { CURRENT_ENCOUNTER_ID, LENS_IDS, getApp, mapIdFor, type LensId } from "./store.js";

export interface ParticipantView extends StoredParticipant {
  actor: StoredActor | undefined;
  collective: StoredCollective | undefined;
}

export interface EncounterBundle {
  encounter: StoredEncounter;
  participants: ParticipantView[];
  nonParticipants: StoredNonParticipant[];
  events: StoredEvent[];
  objects: StoredObjectRef[];
  assertions: StoredAssertion[];
  obligations: StoredObligation[];
  lensSummaries: Array<{ lens: StoredLensVersion; latestVersion: number }>;
}

export async function getEncounterBundle(encounterId: string): Promise<EncounterBundle> {
  const { store } = await getApp();
  const encounter = await store.getEncounter(encounterId);
  if (!encounter) throw error(404, `No encounter recorded with id "${encounterId}".`);

  const [participantsRaw, nonParticipants, events, objects, assertions, obligations] = await Promise.all([
    store.listParticipants(encounterId),
    store.listNonParticipants(encounterId),
    store.listEventsForEncounter(encounterId),
    store.listObjectsForEncounter(encounterId),
    store.listAssertionsForEncounter(encounterId),
    store.listObligationsForEncounter(encounterId)
  ]);

  const participants: ParticipantView[] = await Promise.all(
    participantsRaw.map(async (p) => ({
      ...p,
      actor: await store.getActor(p.actor_id),
      collective: p.collective_id ? await store.getCollective(p.collective_id) : undefined
    }))
  );

  const lensSummaries = await Promise.all(
    LENS_IDS.map(async (lensId) => {
      const versions = await store.listLensVersions(lensId);
      const latest = versions[versions.length - 1];
      if (!latest) throw error(500, `Lens "${lensId}" is not loaded.`);
      return { lens: latest, latestVersion: latest.version };
    })
  );

  return { encounter, participants, nonParticipants, events, objects, assertions, obligations, lensSummaries };
}

export async function getMapVersion(lensId: string, version: number): Promise<StoredMapVersion> {
  const { store } = await getApp();
  const mapId = mapIdFor(CURRENT_ENCOUNTER_ID, lensId);
  const map = await store.getMapVersion(mapId, version);
  if (!map) throw error(404, `No map version ${version} for lens "${lensId}".`);
  return map;
}

export async function getLatestMapVersionNumber(lensId: string): Promise<number> {
  const { store } = await getApp();
  const mapId = mapIdFor(CURRENT_ENCOUNTER_ID, lensId);
  const versions = await store.listMapVersions(mapId);
  const latest = versions[versions.length - 1];
  if (!latest) throw error(404, `No map version generated for lens "${lensId}".`);
  return latest.version;
}

export async function getLensVersions(lensId: string): Promise<StoredLensVersion[]> {
  const { store } = await getApp();
  const versions = await store.listLensVersions(lensId);
  if (versions.length === 0) throw error(404, `No lens recorded with id "${lensId}".`);
  return versions;
}

export function isKnownLensId(lensId: string): lensId is LensId {
  return (LENS_IDS as readonly string[]).includes(lensId);
}

function formatLensAuthor(author: Record<string, unknown>): string {
  const collectiveId = typeof author.collective_id === "string" ? author.collective_id : undefined;
  const actorId = typeof author.actor_id === "string" ? author.actor_id : undefined;
  const role = typeof author.role === "string" ? author.role : undefined;
  const who = collectiveId ?? actorId ?? "unknown";
  return role ? `${who} — ${role}` : who;
}

export interface LensManifestView {
  lensId: string;
  name: string;
  version: number;
  authorLabel: string;
  basis: string;
  selectionSummary: string;
  exclusions: Array<{ reason: string; synthesized?: boolean }>;
  unknownTypesCount: number;
  engineVersion: string;
  mapId: string;
  contentHash: string;
  watermark: string;
}

/** Every field `LensManifestPanel.svelte` needs (design §6 / spec 04 §7.2), built once from a
 * lens definition + one of its generated map versions — the single source every route that
 * shows a lens manifest (`/encounters/[id]`, the map version page, `/compare`, `/lenses/[id]`)
 * reuses, instead of five slightly different ad hoc summaries. */
export async function buildLensManifestView(lensId: string, version: number): Promise<LensManifestView> {
  const map = await getMapVersion(lensId, version);
  const lensVersions = await getLensVersions(lensId);
  const lens = lensVersions.find((l) => l.version === map.lens.version) ?? lensVersions[lensVersions.length - 1]!;
  return {
    lensId: lens.lens_id,
    name: lens.name,
    version: map.version,
    authorLabel: formatLensAuthor(lens.author),
    basis: lens.purpose,
    selectionSummary: `${map.included.events.length} events · ${map.included.objects.length} objects · ${map.included.assertions.length} assertions · ${map.included.obligations.length} obligations`,
    exclusions: map.exclusions as Array<{ reason: string; synthesized?: boolean }>,
    unknownTypesCount: map.render_failures.length,
    engineVersion: map.renderer_version ?? "unknown",
    mapId: map.map_id,
    contentHash: map.content_hash,
    watermark: map.event_watermark
  };
}

export interface ObjectBundle {
  object: StoredObjectRef;
  collective: StoredCollective | undefined;
  assertionsAbout: StoredAssertion[];
}

export async function getObjectByCollectiveAndLocalId(collectiveId: string, localObjectId: string): Promise<ObjectBundle> {
  const { store } = await getApp();
  const objects = await store.listObjectsForCollective(collectiveId);
  const object = objects.find((o) => o.local_object_id === localObjectId);
  if (!object) throw error(404, `No object "${localObjectId}" recorded for collective "${collectiveId}".`);
  const collective = await store.getCollective(collectiveId);
  const assertionsAbout = await store.listAssertionsForObject(object.id);
  return { object, collective, assertionsAbout };
}

export interface AssertionBundle {
  assertion: StoredAssertion;
  authorCollective: StoredCollective | undefined;
  encounter: StoredEncounter | undefined;
}

export async function getAssertionById(assertionId: string): Promise<AssertionBundle> {
  const { store } = await getApp();
  // Scoped lookup only (no global assertion list, epistemic contract test 1): search by every
  // known author collective, which is exactly how a caller without a global index would have
  // to find it too.
  const collectiveIds = ["meridian", "ensemble", "ulysses"];
  for (const collectiveId of collectiveIds) {
    const assertions = await store.listAssertionsForAuthor(collectiveId);
    const found = assertions.find((a) => a.assertion_id === assertionId);
    if (found) {
      const authorCollective = await store.getCollective(collectiveId);
      const encounter = found.encounter_id ? await store.getEncounter(found.encounter_id) : undefined;
      return { assertion: found, authorCollective, encounter };
    }
  }
  throw error(404, `No assertion recorded with id "${assertionId}".`);
}

export async function listImportRecordsForCollective(collectiveId: string): Promise<StoredImportRecord[]> {
  const { store } = await getApp();
  return store.listImportRecords(collectiveId);
}

export async function listObjectsForCollective(collectiveId: string): Promise<StoredObjectRef[]> {
  const { store } = await getApp();
  return store.listObjectsForCollective(collectiveId);
}

export async function getCollective(collectiveId: string): Promise<StoredCollective | undefined> {
  const { store } = await getApp();
  return store.getCollective(collectiveId);
}

/** The participant's currently applicable profile version (spec-v2.1 §3, ADR 0011, work order
 * phase-b-profiles.md §5) — `undefined` when the collective has no profile loaded (e.g. a
 * future fourth collective before its own draft exists) or, deliberately, for any participant
 * that is not a sovereign practice at all (the apparatus/conductor row, `collective_id: null`
 * — see the call site's own filter, never this function's job to guess). */
export async function getApplicableProfileFor(collectiveId: string): Promise<StoredPracticeProfileVersion | undefined> {
  const { store } = await getApp();
  return store.getApplicableProfile(collectiveId);
}

export async function getActor(actorId: string): Promise<StoredActor | undefined> {
  const { store } = await getApp();
  return store.getActor(actorId);
}

const THE_MIDDLE_EDITORIAL_SENTINEL = "the-middle-editorial";

/** Resolves every actor_id/collective_id referenced anywhere in an encounter bundle's events
 * and participants to a display name — used by every renderer that shows an issuer or author
 * (work order §0: "The Middle never speaks as a collective" gets its own sentinel label here,
 * never a raw id or a guessed collective name). */
export async function buildActorNames(bundle: EncounterBundle): Promise<Record<string, string>> {
  const actorIds = new Set<string>();
  const collectiveIds = new Set<string>();
  for (const event of bundle.events) {
    actorIds.add(event.issuer.actor_id);
    collectiveIds.add(event.issuer.collective_id);
  }
  for (const participant of bundle.participants) {
    actorIds.add(participant.actor_id);
    if (participant.collective_id) collectiveIds.add(participant.collective_id);
  }

  const names: Record<string, string> = {};
  for (const id of actorIds) {
    const actor = await getActor(id);
    names[id] = actor?.display_name ?? id;
  }
  for (const id of collectiveIds) {
    if (id === THE_MIDDLE_EDITORIAL_SENTINEL) {
      names[id] = "The Middle (editorial apparatus)";
      continue;
    }
    const collective = await getCollective(id);
    names[id] = collective?.current_name ?? id;
  }
  return names;
}
