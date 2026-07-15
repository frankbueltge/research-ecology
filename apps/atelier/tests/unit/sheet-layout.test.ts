import { describe, expect, it } from "vitest";
import { getAtelierData } from "../../src/lib/server/store.js";
import { buildEdgeRegister, extractSheetData, layoutSheet, selectEntranceThread } from "../../src/lib/sheet/index.js";

/**
 * Work order §6 test 1: "Sheet-Layout deterministisch — gleicher Store-Inhalt ⇒ byte-identische
 * SVG-Struktur (zweimal rendern, vergleichen)." Runs the whole pure pipeline (extract → select →
 * layout → register) twice against the same store snapshot and deep-equal-compares every output
 * — no randomness, no clock, no iteration-order dependence.
 */
describe("sheet layout determinism (work order §6 test 1)", () => {
  it("extracting, selecting and laying out the same store data twice yields identical structures", async () => {
    const { assertions, objects } = await getAtelierData();

    const sheetA = extractSheetData(assertions, objects);
    const sheetB = extractSheetData(assertions, objects);

    const layoutA = layoutSheet(sheetA);
    const layoutB = layoutSheet(sheetB);
    expect(layoutA).toEqual(layoutB);

    const entranceA = selectEntranceThread(sheetA);
    const entranceB = selectEntranceThread(sheetB);
    expect(entranceA).toEqual(entranceB);

    const registerA = buildEdgeRegister(sheetA);
    const registerB = buildEdgeRegister(sheetB);
    expect(registerA).toEqual(registerB);
  });

  it("laying out the same SheetData object twice (no re-extraction) is also byte-identical", async () => {
    const { assertions, objects } = await getAtelierData();
    const sheet = extractSheetData(assertions, objects);
    expect(layoutSheet(sheet)).toEqual(layoutSheet(sheet));
  });

  it("reports no unlaid nodes for the current S26-S28 dataset (every node has a position)", async () => {
    const { assertions, objects } = await getAtelierData();
    const sheet = extractSheetData(assertions, objects);
    const layout = layoutSheet(sheet);
    expect(layout.unlaid).toEqual([]);
  });

  it("the current sheet has exactly 19 edges, 3 threads, 8 sources, 8 works, 2 bridges (bundle @ c413eae)", async () => {
    const { assertions, objects } = await getAtelierData();
    const sheet = extractSheetData(assertions, objects);
    expect(sheet.edges).toHaveLength(19);
    const byKind = (kind: string) => [...sheet.nodes.values()].filter((n) => n.kind === kind).length;
    expect(byKind("thread")).toBe(3);
    expect(byKind("source")).toBe(8);
    expect(byKind("work")).toBe(8);
    expect(sheet.edges.filter((e) => e.kind === "bridge")).toHaveLength(2);
  });
});
