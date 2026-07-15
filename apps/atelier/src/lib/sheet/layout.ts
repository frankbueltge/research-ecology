/**
 * Pure layout: `SheetData` → `SheetLayout` (an SVG-structure description, not markup — the
 * Svelte route templates it). Deterministic: same `SheetData` in ⇒ byte-identical `SheetLayout`
 * out (work order §6 test 1), no randomness, no clock, no DOM. Positions come from
 * `positions.ts` (taken over from atelier_viz.py, work order §4); curve/truncation shapes are
 * generalised from atelier_viz.py's hardcoded-per-node version so the module draws whichever
 * edges the store actually returns rather than only the specific 19 this sheet happens to have
 * today.
 *
 * Truncation thresholds (76/40/34/31 chars) are themselves constants taken over from
 * atelier_viz.py's `build_svg()` — the full, untruncated string always travels alongside as
 * `title` (SVG tooltip) and, uncompressed, in the edge register table the route renders below
 * the figure, so nothing is lost, only abbreviated on-canvas.
 */

import { derivePositions, positionKeyFor, type DerivedPositions, type Point } from "./positions.js";
import type { SheetData, SheetEdge, SheetNode } from "./types.js";

function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`;
}

function pos(node: SheetNode, derived: DerivedPositions): Point | undefined {
  const key = positionKeyFor(node.id, node.work?.localObjectId);
  return derived.nodePositions[key];
}

/** A soft cubic-bezier between two points, control points offset horizontally by a fraction of
 * the span — the same general shape every connector in atelier_viz.py uses (thread curves,
 * ties, bridges, complements), generalised to any two endpoints instead of one hardcoded pair
 * per edge. */
function bendPath(a: Point, b: Point, bend = 0.35): string {
  const dx = (b.x - a.x) * bend;
  return `M${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`;
}

export interface ThreadDrawing {
  id: string;
  label: string;
  fullLabel: string;
  path: string;
  labelPos: Point;
}

export interface ContinuesDrawing {
  fromId: string;
  toId: string;
  path: string;
  labelPos: Point;
  caption: string;
}

export interface SourceDrawing {
  id: string;
  label: string;
  fullLabel: string;
  textPos: Point;
  /** A plain swerve (into a thread's session elbow) — absent for a source whose only edge is a
   * "grounds" edge (drawn instead via `groundsStub` on the connectors list). */
  stubPath?: string;
  swervePath?: string;
  sessionDot?: Point;
  sessionLabel?: string;
}

export interface WorkDrawing {
  id: string;
  label: string;
  fullLabel: string;
  date?: string;
  ghost: boolean;
  rect: { x: number; y: number; width: number; height: number };
  labelPos: Point;
  anchor: "start" | "middle";
  /** External link to the existing site's work page (work order §4: "Klick auf Tafeln →
   * bestehende Site-Werk-URLs ... als externe Links, TODO-Marker" — verified live pattern
   * `frankbueltge.de/atelier/werke/<slug>` for older works; the newest works may 404 until the
   * site's next nightly rebuild syncs from the engine repo, an honest, expected gap, not a bug
   * here). Undefined for a work that never resolved to an object ref (no slug to link). */
  href?: string;
}

export interface ConnectorDrawing {
  kind: string;
  path: string;
  caption?: string;
  captionPos?: Point;
}

export interface DoorDrawing {
  path: string;
  ticks: string;
  labelPos: Point;
  text: string;
}

export interface SessionMarker {
  session: number;
  point: Point;
  label: string;
}

export interface SheetLayout {
  viewBox: string;
  threads: ThreadDrawing[];
  continuesEdges: ContinuesDrawing[];
  sources: SourceDrawing[];
  /** One dot + "SN" label per distinct session that has at least one swerve — deduped so four
   * sources swerving into the same session elbow (S26 has four) draw one dot, not four. */
  sessionMarkers: SessionMarker[];
  works: WorkDrawing[];
  connectors: ConnectorDrawing[];
  door: DoorDrawing;
  /** Node ids the position table has no entry for — never silently skipped (lab ethic: honest
   * gaps). Empty at the time of writing (every node in the current S26-S28 dataset is laid
   * out). */
  unlaid: string[];
}

const DOOR_TEXT = "doorway reserved — for an external encounter, once it exists";

function sessionCaption(kind: string, session: number | undefined): string {
  // Byte-exact from the edge's own `kind` + `session` fields — no narrative quote (work order
  // §0 "nichts erfinden"): see the STOP note in the phase-C1 final report re: the mockup's
  // "„they are one fact"" bridge caption, which has no store field to source it from.
  return session === undefined ? kind : `${kind} · S${session}`;
}

export function layoutSheet(data: SheetData): SheetLayout {
  // Fixed S26–S28 base extended by the deterministic growth rules (positions.ts) — the
  // engines advance nightly; unlaid should stay empty unless a node kind is truly unknown.
  const derived = derivePositions(data);
  const unlaid: string[] = [];
  const positioned = (node: SheetNode): Point | undefined => {
    const p = pos(node, derived);
    if (!p && !unlaid.includes(node.id)) unlaid.push(node.id);
    return p;
  };

  // -- works: ghost (shelf) iff no incoming "elaborates" edge touches it -------------------
  const elaboratedWorkIds = new Set(data.edges.filter((e) => e.kind === "elaborates").map((e) => e.toId));

  const threads: ThreadDrawing[] = [];
  const sources: SourceDrawing[] = [];
  const works: WorkDrawing[] = [];
  const continuesEdges: ContinuesDrawing[] = [];
  const connectors: ConnectorDrawing[] = [];

  for (const node of data.nodes.values()) {
    const p = positioned(node);
    if (!p) continue;

    if (node.kind === "thread") {
      const end = derived.threadEnds[node.id];
      if (!end) {
        unlaid.push(node.id);
        continue;
      }
      threads.push({
        id: node.id,
        label: truncate(node.label, 76),
        fullLabel: node.label,
        path: bendPath(p, end, 0.4),
        labelPos: { x: p.x + 34, y: p.y - 48 }
      });
    } else if (node.kind === "source") {
      sources.push({
        id: node.id,
        label: truncate(node.label, 40),
        fullLabel: node.label,
        textPos: { x: p.x - 10, y: p.y + 4 }
      });
    } else {
      const ghost = !elaboratedWorkIds.has(node.id);
      const width = 12;
      const height = 44;
      works.push({
        id: node.id,
        label: truncate(node.label, ghost ? 31 : 34),
        fullLabel: node.label,
        date: node.date,
        ghost,
        rect: { x: p.x - width / 2, y: p.y - height / 2, width, height },
        labelPos: ghost ? { x: p.x, y: p.y + height / 2 + 18 } : { x: p.x + 20, y: p.y - height / 2 + 2 },
        anchor: ghost ? "middle" : "start",
        href: node.work ? `https://frankbueltge.de/atelier/werke/${node.work.localObjectId}` : undefined
      });
    }
  }

  const sourceById = new Map(sources.map((s) => [s.id, s]));
  const sessionMarkersBySession = new Map<number, SessionMarker>();

  // -- edges, by kind -----------------------------------------------------------------------
  const seenCaptionGroups = new Set<string>();
  for (const edge of data.edges) {
    const fromNode = data.nodes.get(edge.fromId);
    const toNode = data.nodes.get(edge.toId);
    if (!fromNode || !toNode) continue;
    const fromP = pos(fromNode, derived);
    const toP = pos(toNode, derived);
    if (!fromP || !toP) continue;

    if (edge.kind === "swerve") {
      const elbow = edge.session !== undefined ? derived.sessionElbows[edge.session] : undefined;
      const source = sourceById.get(edge.fromId);
      if (source && elbow) {
        source.stubPath = `M${fromP.x} ${fromP.y} H${elbow.x - 22}`;
        source.swervePath = `M${elbow.x - 22} ${fromP.y} Q ${elbow.x - 4} ${fromP.y}, ${elbow.x} ${elbow.y}`;
        source.sessionDot = elbow;
        source.sessionLabel = `S${edge.session}`;
        if (edge.session !== undefined && !sessionMarkersBySession.has(edge.session)) {
          sessionMarkersBySession.set(edge.session, { session: edge.session, point: elbow, label: `S${edge.session}` });
        }
      }
    } else if (edge.kind === "elaborates") {
      const end = derived.threadEnds[edge.fromId] ?? fromP;
      connectors.push({ kind: edge.kind, path: bendPath(end, toP, 0.4) });
    } else if (edge.kind === "continues") {
      continuesEdges.push({
        fromId: edge.fromId,
        toId: edge.toId,
        path: bendPath({ x: fromP.x + 10, y: fromP.y + 20 }, { x: toP.x - 20, y: toP.y - 20 }, -0.55),
        labelPos: { x: fromP.x - 90, y: fromP.y + 118 },
        caption: sessionCaption("continues", edge.session)
      });
    } else if (edge.kind === "bridge" || edge.kind === "complement") {
      const path = bendPath(fromP, toP, 0.45);
      // Same-kind-and-session edges (e.g. the three S27 complements into the shelf) share
      // near-identical midpoints — one caption speaks for the group; the edge register
      // below still lists every edge individually.
      const captionGroup = `${edge.kind}·${edge.session ?? ""}`;
      const first = !seenCaptionGroups.has(captionGroup);
      seenCaptionGroups.add(captionGroup);
      connectors.push({
        kind: edge.kind,
        path,
        caption: first ? sessionCaption(edge.kind, edge.session) : undefined,
        captionPos: first ? { x: (fromP.x + toP.x) / 2, y: (fromP.y + toP.y) / 2 } : undefined
      });
    } else if (edge.kind === "grounds") {
      const groundY = toP.y + 22;
      connectors.push({ kind: "ground", path: `M${toP.x - 30} ${groundY} H${toP.x + 30}` });
      connectors.push({
        kind: "grounds",
        path: bendPath(fromP, { x: toP.x - 32, y: groundY }, 0.5),
        caption: sessionCaption("grounds", edge.session),
        captionPos: { x: toP.x - 34, y: groundY + 16 }
      });
      const source = sourceById.get(edge.fromId);
      if (source) {
        // Grounds edges are drawn as their own stub above, not the plain swerve shape.
        source.stubPath = undefined;
        source.swervePath = undefined;
      }
    } else {
      // An edge kind not in the current sheet's vocabulary (swerve/elaborates/continues/
      // bridge/complement/grounds) — drawn as a plain bend so nothing is silently dropped.
      connectors.push({ kind: edge.kind, path: bendPath(fromP, toP, 0.4), caption: sessionCaption(edge.kind, edge.session) });
    }
  }

  const door: DoorDrawing = {
    path: "M1408 300 V560",
    ticks: "M1396 300 H1408 M1396 560 H1408",
    labelPos: { x: 1424, y: 430 },
    text: DOOR_TEXT
  };

  const sessionMarkers = [...sessionMarkersBySession.values()].sort((a, b) => a.session - b.session);

  return {
    viewBox: derived.viewBox,
    threads: threads.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)),
    continuesEdges,
    sources: sources.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)),
    sessionMarkers,
    works: works.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)),
    connectors,
    door,
    unlaid
  };
}

export function edgeSortKey(edge: SheetEdge): number {
  return edge.index;
}
