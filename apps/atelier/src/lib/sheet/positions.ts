/**
 * Layout constants taken over from `docs/design/variants-2026-07-15/atelier_viz.py` (work order
 * §4: "Konstanten aus atelier_viz.py übernehmen"). The Python generator keyed these by short
 * internal ids (`t1`, `src-rhein`, `w-dr`, ...); this module re-keys the same numbers by the
 * *stable* identifiers the store actually exposes, so the table survives a bundle refresh:
 *
 *  - thread / source / unresolved-work nodes → the rhizome node's own `id` (verbatim, e.g.
 *    "thread-epistemic-thing-subtraction", "atlas:rheinberger-experimental-systems-difference").
 *  - resolved-work nodes → the object ref's `local_object_id` (the works/ directory slug —
 *    stable across commits; the object id itself embeds a short sha that changes on refresh).
 *
 * A node not present here (this is the known S26-S28 sheet's layout, not a general graph-layout
 * algorithm) is reported by `layout.ts` as "unlaid" rather than silently dropped or guessed at.
 */

export interface Point {
  x: number;
  y: number;
}

export const VIEWBOX = "0 168 1440 600";

/** Position of every node's own anchor point (thread head / source label / work slab centre). */
export const NODE_POSITIONS: Record<string, Point> = {
  // sources (left margin)
  "atlas:rheinberger-experimental-systems-difference": { x: 336, y: 236 },
  "atlas:frayling-research-in-art-and-design": { x: 336, y: 268 },
  "atlas:schwab-experimental-systems": { x: 336, y: 300 },
  "atlas:haseman-manifesto-for-performative-research": { x: 336, y: 332 },
  "atlas:eigen-quasispecies-error-threshold": { x: 336, y: 476 },
  "atlas:gerstgrasser-is-model-collapse-inevitable": { x: 336, y: 600 },
  "atlas:mersch-aesthetic-difference-wisdom-of-the-arts": { x: 336, y: 656 },
  "atlas:maharaj-know-how-and-no-how": { x: 336, y: 688 },
  // threads (heads — where the thread curve begins)
  "thread-epistemic-thing-subtraction": { x: 430, y: 284 },
  "thread-differential-reproduction-birth": { x: 450, y: 484 },
  "thread-no-how-non-discursive": { x: 440, y: 668 },
  // works (slug-keyed; the one node that never resolves keeps its raw rhizome id as the key)
  "2026-07-14-position-epistemic-thing": { x: 950, y: 232 }, // unresolved: raw rhizome id "w-..." stripped of the leading "w-" below at lookup time
  "2026-07-13-generative-unknowing": { x: 1060, y: 300 },
  "2026-07-07-named-the-glitch": { x: 1210, y: 366 },
  "2026-07-14-differential-reproduction": { x: 980, y: 484 },
  "2026-07-03-generation-loss": { x: 1150, y: 584 },
  "2026-07-11-the-closing-loop": { x: 1262, y: 584 },
  "2026-07-12-low-background": { x: 1368, y: 584 },
  "2026-07-14-negative-knowledge": { x: 960, y: 668 }
};

/** Thread curve endpoints (the right-hand side, where ties to works branch off). */
export const THREAD_ENDS: Record<string, Point> = {
  "thread-epistemic-thing-subtraction": { x: 880, y: 262 },
  "thread-differential-reproduction-birth": { x: 880, y: 472 },
  "thread-no-how-non-discursive": { x: 880, y: 654 }
};

/** The session elbow a swerve kinks into, keyed by session number. */
export const SESSION_ELBOWS: Record<number, Point> = {
  26: { x: 404, y: 284 },
  27: { x: 424, y: 484 },
  28: { x: 414, y: 668 }
};

/** Looks up a node's own anchor position. Resolved works are keyed by `local_object_id`; every
 * other node (thread/source/unresolved-work) by its own rhizome id — an unresolved work's raw
 * id still carries the "w-" prefix `resolveRhizomeEndpoint` (packages/adapters) leaves in place
 * for a node it could not match, so it is stripped here purely for table lookup, exactly the
 * same stripping rule the adapter itself already applies when it tries (and in this one case,
 * fails) to match the node to a works/ path. */
export function positionKeyFor(rhizomeId: string, localObjectId: string | undefined): string {
  if (localObjectId) return localObjectId;
  return rhizomeId.startsWith("w-") ? rhizomeId.slice(2) : rhizomeId;
}

// --------------------------------------------------------------------------------------------
// Deterministic growth (2026-07-15 evening): the engines advance nightly, so the fixed
// S26–S28 tables above are a BASE, not a ceiling. Nodes the base does not know are placed by
// rule — new bands below, in data order — never by physics, randomness or the clock. The
// grammar's promise "same store ⇒ same sheet" holds across growth.
//
//  - a new THREAD opens a new band below the lowest laid thread (step 184; head x 440,
//    end {x 880, y head−14}), ordered by (earliest session on its edges, id).
//  - a new SESSION gets its elbow at {x 414, y of the thread head its swerves point into}.
//  - a new SOURCE stacks on the left margin (x 336) around its session's elbow, 32px apart,
//    ordered by id; sources without a session append below the lowest laid source.
//  - a new WORK hangs at its elaborating thread's head (x 980 + 130·k, ordered by key);
//    non-elaborated new works join a shelf row below the lowest band (x 1150 + 106·k).
//  - the viewBox grows downward to fit; width stays 1440 (grammar §7: the canvas never
//    widens — the sheet gains bands).

import type { SheetData } from "./types.js";

export interface DerivedPositions {
  nodePositions: Record<string, Point>;
  threadEnds: Record<string, Point>;
  sessionElbows: Record<number, Point>;
  viewBox: string;
}

export function derivePositions(data: SheetData): DerivedPositions {
  const nodePositions: Record<string, Point> = { ...NODE_POSITIONS };
  const threadEnds: Record<string, Point> = { ...THREAD_ENDS };
  const sessionElbows: Record<number, Point> = { ...SESSION_ELBOWS };

  const keyFor = (id: string): string => {
    const node = data.nodes.get(id);
    return node ? positionKeyFor(node.id, node.work?.localObjectId) : id;
  };
  const laid = (id: string): boolean => keyFor(id) in nodePositions;

  const minSession = (id: string): number => {
    const sessions = data.edges
      .filter((e) => (e.fromId === id || e.toId === id) && typeof e.session === "number")
      .map((e) => e.session as number);
    return sessions.length ? Math.min(...sessions) : 999;
  };

  // -- new threads: one band each, below the lowest laid thread --------------------------
  const BAND_STEP = 184;
  let lowestHeadY = Math.max(...Object.values(THREAD_ENDS).map((p) => p.y + 14), 668);
  const newThreads = [...data.nodes.values()]
    .filter((n) => n.kind === "thread" && !laid(n.id))
    .sort((a, b) => minSession(a.id) - minSession(b.id) || (a.id < b.id ? -1 : 1));
  for (const t of newThreads) {
    lowestHeadY += BAND_STEP;
    nodePositions[t.id] = { x: 440, y: lowestHeadY };
    threadEnds[t.id] = { x: 880, y: lowestHeadY - 14 };
  }

  // -- new sessions: elbow at the thread head their swerves point into -------------------
  const sessions = new Set(
    data.edges.filter((e) => typeof e.session === "number").map((e) => e.session as number)
  );
  for (const s of [...sessions].sort((a, b) => a - b)) {
    if (s in sessionElbows) continue;
    const swerve = data.edges.find((e) => e.session === s && e.kind === "swerve" && nodePositions[e.toId]);
    const anchor = swerve
      ? nodePositions[swerve.toId]
      : data.edges.filter((e) => e.session === s).map((e) => nodePositions[e.toId] ?? nodePositions[e.fromId]).find(Boolean);
    if (anchor) sessionElbows[s] = { x: 414, y: anchor.y };
  }

  // -- new sources: stacked around their session's elbow ---------------------------------
  const newSources = [...data.nodes.values()]
    .filter((n) => n.kind === "source" && !laid(n.id))
    .sort((a, b) => (a.id < b.id ? -1 : 1));
  const perSessionCount = new Map<number, number>();
  let orphanSourceY = Math.max(688, ...Object.values(nodePositions).filter((p) => p.x === 336).map((p) => p.y));
  for (const src of newSources) {
    const s = minSession(src.id);
    const elbow = sessionElbows[s];
    if (elbow && s !== 999) {
      const k = perSessionCount.get(s) ?? 0;
      perSessionCount.set(s, k + 1);
      nodePositions[src.id] = { x: 336, y: elbow.y + (k === 0 ? -16 : -16 + 32 * k) };
    } else {
      orphanSourceY += 32;
      nodePositions[src.id] = { x: 336, y: orphanSourceY };
    }
  }

  // -- new works: at their elaborating thread's head; else the overflow shelf ------------
  const newWorks = [...data.nodes.values()]
    .filter((n) => n.kind === "work" && !laid(n.id))
    .sort((a, b) => (keyFor(a.id) < keyFor(b.id) ? -1 : 1));
  const perThreadCount = new Map<string, number>();
  let shelfCount = 0;
  const shelfY = lowestHeadY + 110;
  for (const w of newWorks) {
    const elab = data.edges.find((e) => e.kind === "elaborates" && e.toId === w.id && nodePositions[e.fromId]);
    if (elab) {
      const k = perThreadCount.get(elab.fromId) ?? 0;
      perThreadCount.set(elab.fromId, k + 1);
      const head = nodePositions[elab.fromId];
      nodePositions[keyFor(w.id)] = { x: 980 + 130 * k, y: head.y };
    } else {
      nodePositions[keyFor(w.id)] = { x: 1150 + 106 * shelfCount, y: shelfY };
      shelfCount += 1;
    }
  }

  const maxY = Math.max(768, ...Object.values(nodePositions).map((p) => p.y + 100));
  return { nodePositions, threadEnds, sessionElbows, viewBox: `0 168 1440 ${maxY - 168}` };
}
