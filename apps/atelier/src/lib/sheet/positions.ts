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
