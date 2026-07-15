import { describe, expect, it } from "vitest";
import { getAtelierData } from "../../src/lib/server/store.js";
import { buildEdgeRegister, extractSheetData, layoutSheet, selectEntranceThread } from "../../src/lib/sheet/index.js";

/**
 * Work order §6 test 2 (the "Verbatim-Guard"): every rendered label (thread/work/source names,
 * edge kinds) is byte-identical to a value already present in the bundle — nothing is typed in
 * by hand from the design mockup. Builds the set of every legitimate verbatim string straight
 * from the raw store records (assertion subject/object embedded labels + object title_cache),
 * independent of `extractSheetData`/`layoutSheet` themselves, so this test cannot pass merely
 * because the extraction and the guard share a bug.
 */
describe("verbatim guard (work order §6 test 2)", () => {
  it("every full (untruncated) label on the sheet and in the edge register is present in the bundle", async () => {
    const { assertions, objects } = await getAtelierData();

    const bundleLabels = new Set<string>();
    for (const object of objects) {
      if (object.title_cache) bundleLabels.add(object.title_cache);
    }
    for (const assertion of assertions) {
      for (const field of [assertion.subject, assertion.object]) {
        if (field && typeof field === "object" && typeof (field as { label?: unknown }).label === "string") {
          bundleLabels.add((field as { label: string }).label);
        }
      }
    }
    expect(bundleLabels.size).toBeGreaterThan(0);

    const sheet = extractSheetData(assertions, objects);
    const layout = layoutSheet(sheet);
    const entrance = selectEntranceThread(sheet);
    const register = buildEdgeRegister(sheet);

    const rendered: string[] = [
      ...layout.threads.map((t) => t.fullLabel),
      ...layout.sources.map((s) => s.fullLabel),
      ...layout.works.map((w) => w.fullLabel),
      ...(entrance ? [entrance.label] : []),
      ...register.map((r) => r.from),
      ...register.map((r) => r.to)
    ];

    expect(rendered.length).toBeGreaterThan(0);
    for (const label of rendered) {
      expect(bundleLabels.has(label), `rendered label not found verbatim in the bundle: "${label}"`).toBe(true);
    }
  });

  it("every truncated on-canvas label is a true prefix of its own full label (never a different string)", async () => {
    const { assertions, objects } = await getAtelierData();
    const sheet = extractSheetData(assertions, objects);
    const layout = layoutSheet(sheet);

    for (const item of [...layout.threads, ...layout.sources, ...layout.works]) {
      if (item.label === item.fullLabel) continue; // not truncated
      expect(item.label.endsWith("…")).toBe(true);
      const prefix = item.label.slice(0, -1);
      expect(item.fullLabel.startsWith(prefix)).toBe(true);
    }
  });

  it("every edge register row's kind is byte-equal to a predicate the bundle actually carries", async () => {
    const { assertions, objects } = await getAtelierData();
    const sheet = extractSheetData(assertions, objects);
    const register = buildEdgeRegister(sheet);
    const bundlePredicates = new Set(assertions.map((a) => a.predicate));
    for (const row of register) {
      expect(bundlePredicates.has(row.kind)).toBe(true);
    }
  });

  it("every non-'—' session in the edge register matches a session the bundle's assertion actually carries", async () => {
    const { assertions, objects } = await getAtelierData();
    const sheet = extractSheetData(assertions, objects);
    const register = buildEdgeRegister(sheet);
    const bundleSessions = new Set(
      assertions.map((a) => (a as { session?: unknown }).session).filter((s): s is number => typeof s === "number")
    );
    for (const row of register) {
      if (row.session === "—") continue;
      const n = Number.parseInt(row.session.slice(1), 10);
      expect(bundleSessions.has(n)).toBe(true);
    }
  });
});
