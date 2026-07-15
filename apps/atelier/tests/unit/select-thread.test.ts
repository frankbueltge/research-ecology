import { describe, expect, it } from "vitest";
import { RULE_DESCRIPTION, selectEntranceThread } from "../../src/lib/sheet/select-thread.js";
import type { SheetData, SheetEdge, SheetNode } from "../../src/lib/sheet/types.js";

/**
 * Work order §6 test 3: "Auswahlregel des Eingangs-Threads ist pure Funktion der Daten (Test mit
 * Fixture-Variation)." Builds small synthetic `SheetData` fixtures (no store, no bundle) so the
 * rule's behaviour is tested in isolation from extraction — varying only the edge-degree
 * distribution between fixtures and checking the selection follows.
 */
function thread(id: string, label = id): SheetNode {
  return { id, kind: "thread", label };
}
function work(id: string, label = id): SheetNode {
  return { id, kind: "work", label };
}
function edge(fromId: string, kind: string, toId: string, index: number): SheetEdge {
  return { index, fromId, kind, toId };
}

function sheetOf(nodes: SheetNode[], edges: SheetEdge[]): SheetData {
  return { nodes: new Map(nodes.map((n) => [n.id, n])), edges };
}

describe("entrance thread selection rule (work order §6 test 3)", () => {
  it("picks the thread with the most incident edges", () => {
    const data = sheetOf(
      [thread("t-a"), thread("t-b"), work("w-1"), work("w-2"), work("w-3")],
      [
        edge("t-a", "elaborates", "w-1", 0),
        edge("t-a", "elaborates", "w-2", 1),
        edge("t-a", "elaborates", "w-3", 2),
        edge("t-b", "elaborates", "w-1", 3)
      ]
    );
    expect(selectEntranceThread(data)?.id).toBe("t-a");
  });

  it("flips the answer when the data flips (t-b now has more edges) — pure function of the data, not a hardcoded id", () => {
    const data = sheetOf(
      [thread("t-a"), thread("t-b"), work("w-1"), work("w-2"), work("w-3")],
      [
        edge("t-b", "elaborates", "w-1", 0),
        edge("t-b", "elaborates", "w-2", 1),
        edge("t-b", "elaborates", "w-3", 2),
        edge("t-a", "elaborates", "w-1", 3)
      ]
    );
    expect(selectEntranceThread(data)?.id).toBe("t-b");
  });

  it("ties break on id, ascending", () => {
    const data = sheetOf(
      [thread("t-zzz"), thread("t-aaa"), work("w-1")],
      [edge("t-zzz", "elaborates", "w-1", 0), edge("t-aaa", "elaborates", "w-1", 1)]
    );
    expect(selectEntranceThread(data)?.id).toBe("t-aaa");
  });

  it("ignores a thread node with zero edges entirely", () => {
    const data = sheetOf([thread("t-isolated"), thread("t-connected"), work("w-1")], [edge("t-connected", "elaborates", "w-1", 0)]);
    expect(selectEntranceThread(data)?.id).toBe("t-connected");
  });

  it("returns undefined when there are no thread nodes at all", () => {
    const data = sheetOf([work("w-1"), work("w-2")], [edge("w-1", "complement", "w-2", 0)]);
    expect(selectEntranceThread(data)).toBeUndefined();
  });

  it("calling twice on the same input yields the same result object shape (determinism)", () => {
    const data = sheetOf(
      [thread("t-a"), thread("t-b"), work("w-1")],
      [edge("t-a", "elaborates", "w-1", 0), edge("t-a", "elaborates", "w-1", 1)]
    );
    expect(selectEntranceThread(data)).toEqual(selectEntranceThread(data));
  });

  it("RULE_DESCRIPTION is a non-empty, human-readable sentence (rendered in the sheet's footer)", () => {
    expect(RULE_DESCRIPTION.length).toBeGreaterThan(10);
    expect(RULE_DESCRIPTION).toMatch(/edge/i);
  });
});
