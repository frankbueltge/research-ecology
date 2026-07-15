/**
 * The edge register table (work order §4: "Edge-Register-Tabelle, unkomprimiert, aus dem
 * Store" — every edge, full labels, never truncated, unlike the on-canvas SVG text in
 * layout.ts). Sorted by the edge's own position in pulse/rhizome.json (its `index`), the same
 * deterministic order layout.ts and extract.ts already use.
 */

import type { SheetData } from "./types.js";

export interface EdgeRegisterRow {
  index: number;
  from: string;
  kind: string;
  to: string;
  session: string;
}

export function buildEdgeRegister(data: SheetData): EdgeRegisterRow[] {
  return [...data.edges]
    .sort((a, b) => a.index - b.index)
    .map((edge) => {
      const fromNode = data.nodes.get(edge.fromId);
      const toNode = data.nodes.get(edge.toId);
      return {
        index: edge.index,
        from: fromNode?.label ?? edge.fromId,
        kind: edge.kind,
        to: toNode?.label ?? edge.toId,
        session: edge.session === undefined ? "—" : `S${edge.session}`
      };
    });
}
