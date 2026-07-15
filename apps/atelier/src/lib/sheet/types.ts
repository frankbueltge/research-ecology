/**
 * The sheet's data model — one step removed from the raw store shapes (packages/adapters'
 * `LocalObjectRef` / packages/protocol's `AssertionRecord`), built by `extract.ts` and consumed
 * by `layout.ts`/`select-thread.ts`. Everything here is either verbatim from the store (label,
 * date, session, kind) or a structural fact already present in a store field (a node's own
 * `id`) — nothing here is invented.
 */

export type SheetNodeKind = "thread" | "source" | "work" | "unresolved";

export interface SheetNode {
  /** The rhizome node's own id, verbatim (e.g. "thread-epistemic-thing-subtraction",
   * "atlas:rheinberger-experimental-systems-difference", "w-2026-07-14-position-epistemic-thing"). */
  id: string;
  kind: SheetNodeKind;
  /** Verbatim label: from the embedded rhizome node record (thread/source, and any work that
   * failed to resolve to an object ref) or from the resolved work's own `title_cache`. */
  label: string;
  /** Verbatim ISO date, works only (from the resolved object's `source_metadata.date`, or the
   * embedded rhizome node's own `date` field for an unresolved work node). Undefined for
   * thread/source nodes (the rhizome carries no date on those). */
  date?: string;
  /** Present only for a work that resolved to a real object ref — carries what the sheet needs
   * to link out to the existing site URL (work order §4: "Klick auf Tafeln → bestehende
   * Site-Werk-URLs ... als externe Links, TODO-Marker") and to cite its canonical source. */
  work?: {
    objectId: string;
    localObjectId: string;
    canonicalUri: string;
  };
}

export interface SheetEdge {
  /** Position in the bundle's rhizome-edge assertions, in ascending assertion_id order — used
   * only for a stable, deterministic draw order; never shown. */
  index: number;
  fromId: string;
  kind: string;
  toId: string;
  /** Verbatim from the edge's own `session` field (packages/adapters/src/atelier.ts) — absent
   * (not null, not 0) exactly when the source rhizome edge carried none (all "elaborates" edges
   * at the time of writing). */
  session?: number;
}

export interface SheetData {
  nodes: Map<string, SheetNode>;
  edges: SheetEdge[];
}
