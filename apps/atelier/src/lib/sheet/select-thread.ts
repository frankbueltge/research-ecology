/**
 * The entrance selection rule (work order §4: "aktueller Problematik-Thread ... per
 * Auswahlregel: jüngster Thread-Knoten mit Kanten — Regel sichtbar im Fußtext").
 *
 * Rule: among every node of kind "thread" that has at least one edge, pick the one with the
 * most edges touching it (as either endpoint) — the most heavily worked, currently liveliest
 * thread of the sheet. Ties (none at the time of writing) break on the thread's own id,
 * ascending, so the rule stays a total order and never depends on array/iteration order.
 *
 * Pure function of `SheetData` only — no wall clock, no hardcoded id, no randomness (work order
 * §6 test 3: "Auswahlregel ... ist pure Funktion der Daten"). `RULE_DESCRIPTION` is the exact
 * sentence rendered in the sheet's footer (work order §4: "Regel sichtbar im Fußtext").
 */

import type { SheetData, SheetNode } from "./types.js";

export const RULE_DESCRIPTION =
  "current thread: the thread node with the most edges in this sheet's rhizome (ties broken by id, ascending)";

export function selectEntranceThread(data: SheetData): SheetNode | undefined {
  const degree = new Map<string, number>();
  for (const edge of data.edges) {
    degree.set(edge.fromId, (degree.get(edge.fromId) ?? 0) + 1);
    degree.set(edge.toId, (degree.get(edge.toId) ?? 0) + 1);
  }

  const threadCandidates = [...data.nodes.values()].filter((node) => node.kind === "thread" && (degree.get(node.id) ?? 0) > 0);

  if (threadCandidates.length === 0) return undefined;

  threadCandidates.sort((a, b) => {
    const byDegree = (degree.get(b.id) ?? 0) - (degree.get(a.id) ?? 0);
    if (byDegree !== 0) return byDegree;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });

  return threadCandidates[0];
}
