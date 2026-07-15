/**
 * Pure extraction: store data (assertions + object refs, both already scoped to the ulysses
 * collective by `src/lib/server/store.ts`) → `SheetData`. No file reads, no randomness, no
 * clock — a straight, auditable transformation, same spirit as packages/adapters (work order §0
 * "adapters never infer relations"; here: the sheet never infers a relation either, only reads
 * what packages/adapters already resolved).
 *
 * A rhizome-edge assertion is identified by its evidence pointing at
 * `pulse/rhizome.json:edges[N]` (packages/adapters/src/atelier.ts) — decoupled from the
 * `assertion_id` string convention (`ulysses:rhizome-edge-N-<kind>@<sha>`), which is an adapter
 * implementation detail, not a contract the sheet should depend on.
 */

import type { StoredAssertion, StoredObjectRef } from "@research-ecology/domain";
import type { SheetData, SheetEdge, SheetNode, SheetNodeKind } from "./types.js";

const RHIZOME_EDGE_FIELD_PATH = /^pulse\/rhizome\.json:edges\[(\d+)\]$/;

interface RawRhizomeNode {
  id: string;
  kind: string;
  label: string;
  date?: string;
}

function isRawRhizomeNode(value: unknown): value is RawRhizomeNode {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).id === "string" &&
    typeof (value as Record<string, unknown>).kind === "string" &&
    typeof (value as Record<string, unknown>).label === "string"
  );
}

function isLocalObjectRefPointer(value: unknown): value is { local_object_ref_id: string } {
  return typeof value === "object" && value !== null && typeof (value as Record<string, unknown>).local_object_ref_id === "string";
}

function mapKind(rhizomeKind: string): SheetNodeKind {
  if (rhizomeKind === "thread" || rhizomeKind === "source" || rhizomeKind === "work") return rhizomeKind;
  // Never observed at the time of writing (only "thread" | "source" | "work" appear in
  // pulse/rhizome.json) — an honest fallback rather than a thrown error, so a future rhizome
  // kind renders as a source-like stub instead of crashing the whole sheet.
  return "source";
}

function edgeIndex(assertion: StoredAssertion): number | undefined {
  for (const item of assertion.evidence ?? []) {
    const fieldPath = (item as { field_path?: unknown }).field_path;
    if (typeof fieldPath === "string") {
      const match = RHIZOME_EDGE_FIELD_PATH.exec(fieldPath);
      if (match) return Number.parseInt(match[1]!, 10);
    }
  }
  return undefined;
}

/** Resolves one edge endpoint (subject or object) to a `SheetNode`, registering it in `nodes`
 * (idempotent — later mentions of the same node id are no-ops, first-seen data wins, and the
 * data is identical on every mention by construction). Returns the node's id. */
function resolveEndpoint(
  endpoint: unknown,
  nodes: Map<string, SheetNode>,
  objectsById: Map<string, StoredObjectRef>
): string | undefined {
  if (isLocalObjectRefPointer(endpoint)) {
    const objectId = endpoint.local_object_ref_id;
    if (nodes.has(objectId)) return objectId;
    const objectRef = objectsById.get(objectId);
    if (!objectRef) return undefined; // genuinely absent from the store — caller drops the edge
    const dateFromMeta = (objectRef.source_metadata as { date?: unknown } | undefined)?.date;
    nodes.set(objectId, {
      id: objectId,
      kind: "work",
      label: objectRef.title_cache ?? objectRef.local_object_id,
      date: typeof dateFromMeta === "string" ? dateFromMeta : undefined,
      work: {
        objectId,
        localObjectId: objectRef.local_object_id,
        canonicalUri: objectRef.canonical_uri
      }
    });
    return objectId;
  }
  if (isRawRhizomeNode(endpoint)) {
    if (nodes.has(endpoint.id)) return endpoint.id;
    nodes.set(endpoint.id, {
      id: endpoint.id,
      kind: mapKind(endpoint.kind),
      label: endpoint.label,
      date: endpoint.date
    });
    return endpoint.id;
  }
  return undefined;
}

/** Builds the sheet's node/edge graph from every rhizome-edge assertion the store returns for
 * the collective. Edges whose endpoint cannot be resolved to any node (should not happen at the
 * current commit — every endpoint is either a raw node record or a resolvable object ref
 * pointer) are dropped rather than drawn with a missing end; nothing is fabricated to fill the
 * gap. */
export function extractSheetData(assertions: StoredAssertion[], objects: StoredObjectRef[]): SheetData {
  const objectsById = new Map(objects.map((o) => [o.id, o]));
  const nodes = new Map<string, SheetNode>();
  const edges: SheetEdge[] = [];

  const rhizomeAssertions = assertions
    .map((a) => ({ assertion: a, index: edgeIndex(a) }))
    .filter((entry): entry is { assertion: StoredAssertion; index: number } => entry.index !== undefined)
    .sort((a, b) => a.index - b.index);

  for (const { assertion, index } of rhizomeAssertions) {
    const fromId = resolveEndpoint(assertion.subject, nodes, objectsById);
    const toId = resolveEndpoint(assertion.object, nodes, objectsById);
    if (fromId === undefined || toId === undefined) continue;
    const session = (assertion as { session?: unknown }).session;
    edges.push({
      index,
      fromId,
      kind: assertion.predicate,
      toId,
      session: typeof session === "number" ? session : undefined
    });
  }

  return { nodes, edges };
}
