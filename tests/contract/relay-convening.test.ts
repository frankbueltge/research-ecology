/**
 * The relay's convening and programme (tools/verify-relay.mjs; relay/README.md, "The convening and
 * the programme"). Both sections are optional and valid in the fixtures; every rule is caught when
 * broken; the Borda tally and its tie rule are recomputed from the rankings; the append-only
 * comparison refuses the edits the contract forbids; and the seeded relay/relay.json carries the
 * programme derived from the site's cycle.json history.
 */
import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  collectRefs,
  compareWithBase,
  resultIsDue,
  summaryPath,
  tallyConvening,
  validateRelay,
  type Convening,
  type Practice,
  type ProgrammeEntry,
  type RelayDoc
} from "../../tools/verify-relay.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(here, "../..");
const TOOL = path.join(REPO_ROOT, "tools/verify-relay.mjs");
const load = (p: string): RelayDoc => JSON.parse(readFileSync(p, "utf8")) as RelayDoc;
/** the 2026-10-05 fixture: neither section */
const plain = (): RelayDoc => load(path.join(here, "relay-fixtures/valid.json"));
/** a finished convening after cycle 6 (Studio's proposal won 5 : 3 : 1) and a programme of cycles 4 to 6 */
const convened = (): RelayDoc => load(path.join(here, "relay-fixtures/valid-convening.json"));
const conv = (d: RelayDoc): Convening => d.convening as Convening;
const prog = (d: RelayDoc): ProgrammeEntry[] => d.programme as ProgrammeEntry[];
const loose = (v: unknown): Record<string, unknown> => v as Record<string, unknown>;

const errorsOf = (doc: unknown): string[] => validateRelay(doc).errors;
const warningsOf = (doc: unknown): string[] => validateRelay(doc).warnings;
const expectError = (doc: unknown, fragment: string): void => {
  const errors = errorsOf(doc);
  expect(errors.some((e) => e.includes(fragment)), `expected an error containing "${fragment}", got:\n${errors.join("\n") || "(none)"}`).toBe(true);
};
const expectNoError = (doc: unknown, fragment: string): void => {
  const errors = errorsOf(doc);
  expect(errors.filter((e) => e.includes(fragment)), `unexpected error containing "${fragment}"`).toEqual([]);
};
const appendErrors = (doc: RelayDoc, base: RelayDoc): string => compareWithBase(doc, base).join("\n");

/** The fixture's convening as it stood after `n` rankings, with no result yet, read on `to`. */
function midway(n: number, to = "2026-10-12"): RelayDoc {
  const doc = convened();
  conv(doc).rankings = conv(doc).rankings.slice(0, n);
  conv(doc).result = null;
  doc.period.to = to;
  return doc;
}

/** The fixture's convening with the result recomputed by hand for rankings of field and atelier only. */
function tallied(to: string, talliedOn: string): RelayDoc {
  const doc = midway(2, to);
  conv(doc).result = {
    question: conv(doc).proposals[2]!.question,
    proposed_by: "studio",
    scores: { field: 1, atelier: 2, studio: 3 },
    tallied_on: talliedOn,
    rule: "borda"
  };
  return doc;
}

describe("convening and programme: both sections are optional", () => {
  it("a document with neither section stays valid", () => {
    expect(errorsOf(plain())).toEqual([]);
    expect(warningsOf(plain())).toEqual([]);
  });

  it("the fixture with a finished convening and a three-cycle programme is valid, without warnings", () => {
    expect(errorsOf(convened())).toEqual([]);
    expect(warningsOf(convened())).toEqual([]);
  });

  it("convening: null and an empty programme are valid; the empty programme warns about the current cycle", () => {
    const doc = plain();
    doc.convening = null;
    doc.programme = [];
    expect(errorsOf(doc)).toEqual([]);
    expect(warningsOf(doc).join("\n")).toContain("no entry for the current cycle 4");
  });

  it("an unknown top-level field is still refused", () => {
    const doc = loose(convened());
    doc.agenda = [];
    expectError(doc, 'unknown field "agenda"');
  });
});

describe("programme: shapes and chain", () => {
  it("fields: missing and unknown", () => {
    const doc = convened();
    delete (loose(prog(doc)[0]) as Record<string, unknown>).findings;
    expectError(doc, 'missing field "findings"');
    const doc2 = convened();
    loose(prog(doc2)[0]).note = "x";
    expectError(doc2, 'unknown field "note"');
  });

  it("cycles run oldest first, one entry per cycle", () => {
    const doc = convened();
    prog(doc)[1]!.cycle = 4;
    expectError(doc, "does not come after cycle 4");
    const doc2 = convened();
    prog(doc2)[0]!.cycle = 0;
    expectError(doc2, "cycle: must be a positive integer");
  });

  it("source must be one of defaults, seed, continuing, convening", () => {
    const doc = convened();
    loose(prog(doc)[0]).source = "elsewhere";
    expectError(doc, "is not one of defaults, seed, continuing, convening");
    for (const source of ["defaults", "seed", "continuing", "convening"] as const) {
      const ok = convened();
      prog(ok)[2]!.source = source;
      if (source === "defaults") prog(ok)[2]!.question = null;
      expect(errorsOf(ok), source).toEqual([]);
    }
  });

  it("question is null only while source is defaults, and is bounded", () => {
    const doc = convened();
    prog(doc)[2]!.question = null;
    expectError(doc, 'null only while source is "defaults"');
    const doc2 = convened();
    prog(doc2)[2]!.question = "x".repeat(501);
    expectError(doc2, "at most 500");
    const doc3 = convened();
    prog(doc3)[2]!.question = "  ";
    expectError(doc3, "must be a non-empty string");
    const defaults = convened();
    prog(defaults)[0]!.source = "defaults";
    prog(defaults)[0]!.question = null;
    expect(errorsOf(defaults)).toEqual([]);
  });

  it("opened and closed are real dates in order, and closed is the day the next cycle opened", () => {
    const doc = convened();
    prog(doc)[0]!.closed = "2026-10-05";
    expectError(doc, "closed is the day the next cycle opened");
    const doc2 = convened();
    prog(doc2)[0]!.closed = null;
    expectError(doc2, "closed is the day the next cycle opened");
    const doc3 = convened();
    prog(doc3)[2]!.closed = "2026-10-06";
    expectError(doc3, "is before opened 2026-10-07");
    const doc4 = convened();
    prog(doc4)[2]!.closed = "2026-10-20";
    expectError(doc4, "is after period.to");
    const doc5 = convened();
    prog(doc5)[2]!.opened = "2026-10-02";
    expectError(doc5, "is before the previous entry's");
    const doc6 = convened();
    prog(doc6)[2]!.opened = "2026-02-31";
    expectError(doc6, "opened: must be a YYYY-MM-DD date");
  });

  it("a gap in the cycle numbers leaves closed open, but never past the next entry", () => {
    const doc = convened();
    doc.programme = [prog(doc)[0]!, prog(doc)[2]!];
    expect(errorsOf(doc)).toEqual([]);
    prog(doc)[0]!.closed = "2026-10-06";
    expect(errorsOf(doc)).toEqual([]);
    prog(doc)[0]!.closed = "2026-10-08";
    expectError(doc, "is after the next entry (cycle 6) opened on 2026-10-07");
  });

  it("the open cycle may stay open or carry a closed date, and the last entry has no successor to match", () => {
    const doc = convened();
    prog(doc)[2]!.closed = "2026-10-12";
    expect(errorsOf(doc)).toEqual([]);
  });

  it("a programme without an entry for the file's cycle only warns", () => {
    const doc = convened();
    doc.cycle = 7;
    expect(errorsOf(doc)).toEqual([]);
    expect(warningsOf(doc).join("\n")).toContain("no entry for the current cycle 7");
  });

  it("a programme that is not an array, and entries that are not objects", () => {
    const doc = loose(convened());
    doc.programme = { 6: {} };
    expectError(doc, "programme: must be an array");
    const doc2 = convened();
    (doc2.programme as unknown[])[1] = "cycle 5";
    expectError(doc2, "programme[1]: must be an object");
  });
});

describe("programme: findings", () => {
  const finding = (doc: RelayDoc) => prog(doc)[1]!.findings[0]!;

  it("a finding is a practice, a line of at most 240 characters, and a ref to the cycle's own summary", () => {
    const doc = convened();
    finding(doc).line = "x".repeat(241);
    expectError(doc, "at most 240");
    const doc2 = convened();
    finding(doc2).line = "two\nlines";
    expectError(doc2, "must be one line");
    const doc3 = convened();
    finding(doc3).line = "x".repeat(240);
    expect(errorsOf(doc3)).toEqual([]);
  });

  it("at most one finding per practice and cycle: the first one stands", () => {
    const doc = convened();
    prog(doc)[1]!.findings.push({ ...finding(doc), line: "A second line of the Field." });
    expectError(doc, "field already has a finding in this cycle");
  });

  it("the practice must be one of the three", () => {
    const doc = convened();
    loose(finding(doc)).practice = "middle";
    expectError(doc, '"middle" is not one of field, atelier, studio');
  });

  it("the ref belongs to the practice's repository and names that cycle's SUMMARY.md", () => {
    expect(summaryPath(5)).toBe("presentations/cycle-005/SUMMARY.md");
    expect(summaryPath(12)).toBe("presentations/cycle-012/SUMMARY.md");
    const doc = convened();
    finding(doc).ref.repo = "studio";
    expectError(doc, "does not belong to this practice");
    const doc2 = convened();
    finding(doc2).ref.path = "presentations/cycle-004/SUMMARY.md";
    expectError(doc2, "must be presentations/cycle-005/SUMMARY.md");
    const doc3 = convened();
    finding(doc3).ref.path = "BULLETIN.md";
    expectError(doc3, "must be presentations/cycle-005/SUMMARY.md");
    const doc4 = convened();
    finding(doc4).ref.commit = "main";
    expectError(doc4, "must be a hex commit sha");
  });

  it("findings is an array", () => {
    const doc = convened();
    loose(prog(doc)[1]).findings = "none";
    expectError(doc, "findings: must be an array");
  });
});

describe("convening: shape, proposals and rankings", () => {
  it("fields: missing and unknown", () => {
    const doc = convened();
    delete loose(conv(doc)).result;
    expectError(doc, 'missing field "result"');
    const doc2 = convened();
    loose(conv(doc2)).note = "x";
    expectError(doc2, 'unknown field "note"');
    const doc3 = loose(convened());
    doc3.convening = "after cycle 6";
    expectError(doc3, "convening: must be null or an object");
  });

  it("after_cycle is a positive integer and not later than the file's cycle", () => {
    const doc = convened();
    conv(doc).after_cycle = 7;
    expectError(doc, "is later than the file's cycle 6");
    const doc2 = convened();
    conv(doc2).after_cycle = 0;
    expectError(doc2, "after_cycle: must be a positive integer");
    const doc3 = convened();
    doc3.cycle = 8;
    expect(errorsOf(doc3)).toEqual([]);
  });

  it("opened is the day of the first proposal, not the day the site's phase began", () => {
    const doc = convened();
    conv(doc).opened = "2026-10-09";
    expectError(doc, "is not the day of the first proposal (2026-10-10)");
    const doc2 = convened();
    conv(doc2).opened = "2026-10-11";
    expectError(doc2, "is not the day of the first proposal (2026-10-10)");
  });

  it("a convening is opened by a proposal: proposals cannot be empty", () => {
    const doc = convened();
    conv(doc).proposals = [];
    conv(doc).rankings = [];
    conv(doc).result = null;
    expectError(doc, "cannot be empty");
  });

  it("at most one proposal per practice; text lengths and one-liners; bulletin refs", () => {
    const doc = convened();
    conv(doc).proposals.push({ ...conv(doc).proposals[0]!, question: "A second Field proposal?" });
    expectError(doc, "field already has a proposal; the first one stands");

    const q = convened();
    conv(q).proposals[0]!.question = "x".repeat(201);
    expectError(q, "at most 200");
    const q2 = convened();
    conv(q2).proposals[0]!.question = "x".repeat(200);
    expectNoError(q2, "proposals[0]");

    const d = convened();
    conv(d).proposals[0]!.docks_onto = "x".repeat(301);
    expectError(d, "at most 300");
    const d2 = convened();
    conv(d2).proposals[0]!.docks_onto = "x".repeat(300);
    expectNoError(d2, "proposals[0]");

    const nl = convened();
    conv(nl).proposals[1]!.docks_onto = "one\ntwo";
    expectError(nl, "must be one line");

    const wrongPath = convened();
    conv(wrongPath).proposals[0]!.ref.path = "artifacts/x/index.html";
    expectError(wrongPath, "must be BULLETIN.md, the practice's bulletin");
    const wrongRepo = convened();
    conv(wrongRepo).proposals[0]!.ref.repo = "ulysses";
    expectError(wrongRepo, "does not belong to this practice");
  });

  it("proposal and ranking dates are real days inside the period", () => {
    const doc = convened();
    conv(doc).proposals[2]!.date = "2026-10-15";
    expectError(doc, "lies outside the period");
    const doc2 = convened();
    conv(doc2).rankings[0]!.date = "2026-09-01";
    expectError(doc2, "lies outside the period");
    const doc3 = convened();
    conv(doc3).rankings[0]!.date = "12 October";
    expectError(doc3, "must be a YYYY-MM-DD date");
  });

  it("a ranking is valid only once all three proposals stand", () => {
    const doc = convened();
    conv(doc).proposals = conv(doc).proposals.slice(0, 2);
    conv(doc).result = null;
    expectError(doc, "a ranking is valid only once all three proposals stand (2 of 3 do)");
  });

  it("a ranking is not dated before the third proposal stood", () => {
    const doc = midway(2);
    conv(doc).rankings[0]!.date = "2026-10-10";
    expectError(doc, "is before the third proposal stood (2026-10-11)");
    const same = midway(2);
    conv(same).rankings[0]!.date = "2026-10-11";
    expect(errorsOf(same)).toEqual([]);
  });

  it("at most one ranking per practice", () => {
    const doc = midway(2);
    conv(doc).rankings.push({ ...conv(doc).rankings[0]! });
    expectError(doc, "field already has a ranking; the first one stands");
  });

  it("an order lists the three practices once each: two names, a repeat, a stranger, four names, a string", () => {
    const orders: unknown[] = [
      ["studio", "field"],
      ["studio", "studio", "field"],
      ["studio", "field", "middle"],
      ["studio", "field", "atelier", "studio"],
      "studio > field > atelier"
    ];
    for (const order of orders) {
      const doc = midway(2);
      loose(conv(doc).rankings[0]).order = order;
      expectError(doc, "must list the three practices once each, best first");
    }
  });

  it("ranking refs are the practice's bulletin too", () => {
    const doc = midway(2);
    conv(doc).rankings[0]!.ref.path = "journal/2026-10-12.md";
    expectError(doc, "must be BULLETIN.md");
  });
});

describe("convening: the result and the tally", () => {
  it("the fixture's result is the Borda tally: 5 : 3 : 1, the Studio's proposal", () => {
    expect(tallyConvening(conv(convened()))).toEqual({
      scores: { field: 1, atelier: 3, studio: 5 },
      firstPlaces: { field: 0, atelier: 1, studio: 2 },
      winner: "studio",
      tied: []
    });
  });

  it("a result with all three rankings may be set at once", () => {
    expect(errorsOf(convened())).toEqual([]);
  });

  it("with two rankings, a result needs three days since the convening opened", () => {
    expect(errorsOf(tallied("2026-10-14", "2026-10-13"))).toEqual([]);
    const early = tallied("2026-10-14", "2026-10-12");
    expectError(early, "tallied on 2026-10-12 with 2 of 3 rankings, 2 day(s) after the convening opened");
  });

  it("a result with fewer than two rankings is never valid", () => {
    const doc = midway(1, "2026-10-20");
    conv(doc).result = {
      question: conv(doc).proposals[2]!.question,
      proposed_by: "studio",
      scores: { field: 1, atelier: 0, studio: 2 },
      tallied_on: "2026-10-20",
      rule: "borda"
    };
    expectError(doc, "a result needs all three rankings, or two and 3 days");
  });

  it("a tally that is due must be set: three rankings, or two after three days", () => {
    const three = midway(3, "2026-10-13");
    expectError(three, "the tally is due on 2026-10-13 (3 of 3 rankings");
    const twoLate = midway(2, "2026-10-13");
    expectError(twoLate, "the tally is due on 2026-10-13 (2 of 3 rankings");
    expectNoError(midway(2, "2026-10-12"), "tally is due");
    expectNoError(midway(1, "2026-10-20"), "tally is due");
    expectNoError(midway(0, "2026-10-20"), "tally is due");
  });

  it("resultIsDue says the same thing without a file", () => {
    const c = conv(convened());
    expect(resultIsDue({ ...c, rankings: c.rankings.slice(0, 3) }, "2026-10-10")).toBe(true);
    expect(resultIsDue({ ...c, rankings: c.rankings.slice(0, 2) }, "2026-10-12")).toBe(false);
    expect(resultIsDue({ ...c, rankings: c.rankings.slice(0, 2) }, "2026-10-13")).toBe(true);
    expect(resultIsDue({ ...c, rankings: c.rankings.slice(0, 1) }, "2026-12-31")).toBe(false);
    expect(resultIsDue({ ...c, rankings: [] }, "2026-12-31")).toBe(false);
    expect(resultIsDue(null, "2026-12-31")).toBe(false);
  });

  it("the scores must be the Borda sums", () => {
    const doc = convened();
    conv(doc).result!.scores.field = 2;
    expectError(doc, "scores.field: says 2, Borda over the rankings gives 1");
    const doc2 = convened();
    loose(conv(doc2).result!.scores).field = "1";
    expectError(doc2, "scores.field: must be an integer");
    const doc3 = convened();
    loose(conv(doc3).result!.scores).middle = 0;
    expectError(doc3, 'unknown field "middle"');
  });

  it("the winner and its question must be what the tally gives, verbatim", () => {
    const doc = convened();
    conv(doc).result!.proposed_by = "atelier";
    expectError(doc, 'proposed_by: "atelier", but the tally (with the tie rule) gives "studio"');
    const doc2 = convened();
    conv(doc2).result!.question = "Fixture: what would the Studio propose as the next question";
    expectError(doc2, "must be the winning proposal's question, verbatim");
    const doc3 = convened();
    conv(doc3).result!.question = conv(doc3).proposals[0]!.question;
    expectError(doc3, "must be the winning proposal's question, verbatim");
    const doc4 = convened();
    loose(conv(doc4).result).proposed_by = "middle";
    expectError(doc4, '"middle" is not one of field, atelier, studio');
  });

  it("the rule is borda, and the tally day lies inside the period and after the rankings", () => {
    const doc = convened();
    loose(conv(doc).result).rule = "plurality";
    expectError(doc, 'rule: must be "borda"');
    const doc2 = convened();
    conv(doc2).result!.tallied_on = "2026-10-12";
    expectError(doc2, "is before the ranking of studio (2026-10-13)");
    const doc3 = convened();
    conv(doc3).result!.tallied_on = "2026-10-20";
    expectError(doc3, "lies outside the period");
    const doc4 = convened();
    delete loose(conv(doc4).result).tallied_on;
    expectError(doc4, 'missing field "tallied_on"');
  });

  it("a result that is not an object", () => {
    const doc = convened();
    loose(conv(doc)).result = "studio";
    expectError(doc, "result: must be null or an object");
  });
});

/** a convening of three proposals (dated as given) and the rankings given, with placeholder refs */
function ballot(
  orders: Partial<Record<Practice, Practice[]>>,
  dates: Record<Practice, string> = { field: "2026-10-10", atelier: "2026-10-10", studio: "2026-10-10" }
): Convening {
  const repo = { field: "field-research", atelier: "ulysses", studio: "studio" } as const;
  const practices: Practice[] = ["field", "atelier", "studio"];
  return {
    after_cycle: 6,
    opened: "2026-10-10",
    proposals: practices.map((p) => ({
      practice: p,
      question: `${p} question`,
      docks_onto: `${p} docks onto`,
      date: dates[p],
      ref: { repo: repo[p], path: "BULLETIN.md", commit: "abcdef0" }
    })),
    rankings: practices
      .filter((p) => orders[p])
      .map((p) => ({ practice: p, order: orders[p]!, date: "2026-10-12", ref: { repo: repo[p], path: "BULLETIN.md", commit: "abcdef1" } })),
    result: null
  };
}

describe("convening: the tie rule", () => {
  it("the highest Borda score wins, and there is no tie to report", () => {
    const t = tallyConvening(
      ballot({ field: ["field", "studio", "atelier"], atelier: ["field", "atelier", "studio"], studio: ["studio", "field", "atelier"] })
    );
    expect(t.scores).toEqual({ field: 5, atelier: 1, studio: 3 });
    expect(t.winner).toBe("field");
    expect(t.tied).toEqual([]);
  });

  it("a tie on points goes to the proposal ranked first by more practices, even when it is the latest", () => {
    // studio 2+2+0 = 4, field 1+1+2 = 4, atelier 0+0+1 = 1; studio is first twice, field once
    const t = tallyConvening(
      ballot(
        { field: ["studio", "field", "atelier"], atelier: ["studio", "field", "atelier"], studio: ["field", "atelier", "studio"] },
        { field: "2026-10-10", atelier: "2026-10-10", studio: "2026-10-11" }
      )
    );
    expect(t.scores).toEqual({ field: 4, atelier: 1, studio: 4 });
    expect(t.firstPlaces).toEqual({ field: 1, atelier: 0, studio: 2 });
    expect(t.tied).toEqual(["field", "studio"]);
    expect(t.winner).toBe("studio");
  });

  it("then to the earliest proposal, by date", () => {
    // three rankings in a circle: every proposal scores 3 and is first once
    const circle = {
      field: ["field", "atelier", "studio"] as Practice[],
      atelier: ["atelier", "studio", "field"] as Practice[],
      studio: ["studio", "field", "atelier"] as Practice[]
    };
    const atelierFirst = tallyConvening(ballot(circle, { field: "2026-10-11", atelier: "2026-10-10", studio: "2026-10-11" }));
    expect(atelierFirst.scores).toEqual({ field: 3, atelier: 3, studio: 3 });
    expect(atelierFirst.firstPlaces).toEqual({ field: 1, atelier: 1, studio: 1 });
    expect(atelierFirst.winner).toBe("atelier");
    const studioFirst = tallyConvening(ballot(circle, { field: "2026-10-11", atelier: "2026-10-11", studio: "2026-10-10" }));
    expect(studioFirst.winner).toBe("studio");
  });

  it("then to the practice order: field, atelier, studio", () => {
    const circle = {
      field: ["field", "atelier", "studio"] as Practice[],
      atelier: ["atelier", "studio", "field"] as Practice[],
      studio: ["studio", "field", "atelier"] as Practice[]
    };
    expect(tallyConvening(ballot(circle)).winner).toBe("field");
    expect(tallyConvening(ballot(circle, { field: "2026-10-11", atelier: "2026-10-10", studio: "2026-10-10" })).winner).toBe("atelier");
  });

  it("over two rankings, ties are broken the same way", () => {
    const t = tallyConvening(ballot({ field: ["field", "studio", "atelier"], studio: ["studio", "field", "atelier"] }));
    expect(t.scores).toEqual({ field: 3, atelier: 0, studio: 3 });
    expect(t.winner).toBe("field");
  });

  it("no ranking, no winner; malformed parts are skipped, never thrown on", () => {
    expect(tallyConvening(ballot({})).winner).toBeNull();
    expect(tallyConvening(null).winner).toBeNull();
    expect(tallyConvening({ proposals: "x", rankings: [null, 3, { order: "x" }, { order: ["field", "field", 7] }] }).scores).toEqual({
      field: 3,
      atelier: 0,
      studio: 0
    });
  });

  it("the validator holds a result to the tie rule: a circle with the Atelier first on date", () => {
    const doc = convened();
    conv(doc).proposals[0]!.date = "2026-10-11"; // field
    conv(doc).proposals[2]!.date = "2026-10-11"; // studio; the Atelier proposed first, on the 10th
    conv(doc).rankings[0]!.order = ["field", "atelier", "studio"];
    conv(doc).rankings[1]!.order = ["atelier", "studio", "field"];
    conv(doc).rankings[2]!.order = ["studio", "field", "atelier"];
    conv(doc).result = {
      question: conv(doc).proposals[1]!.question,
      proposed_by: "atelier",
      scores: { field: 3, atelier: 3, studio: 3 },
      tallied_on: "2026-10-13",
      rule: "borda"
    };
    expect(errorsOf(doc)).toEqual([]);
    conv(doc).result!.proposed_by = "field";
    conv(doc).result!.question = conv(doc).proposals[0]!.question;
    expectError(doc, 'but the tally (with the tie rule) gives "atelier"');
  });
});

describe("append-only: the convening", () => {
  it("a file that gains the sections is accepted against a base without them", () => {
    expect(compareWithBase(convened(), plain())).toEqual([]);
  });

  it("proposals and rankings may be added; the result may be set once", () => {
    expect(compareWithBase(midway(2), midway(1))).toEqual([]);
    expect(compareWithBase(convened(), midway(3, "2026-10-13"))).toEqual([]);
    const oneProposal = midway(0);
    conv(oneProposal).proposals = conv(oneProposal).proposals.slice(0, 1);
    expect(compareWithBase(midway(0), oneProposal)).toEqual([]);
  });

  it("a proposal or a ranking is never edited or removed", () => {
    const base = midway(2);
    const edited = midway(2);
    conv(edited).proposals[0]!.question = "Reworded after the fact?";
    expect(appendErrors(edited, base)).toContain("the proposal of field was edited");
    const removed = midway(2);
    conv(removed).proposals.splice(1, 1);
    expect(appendErrors(removed, base)).toContain("the proposal of atelier was removed");
    const reranked = midway(2);
    conv(reranked).rankings[0]!.order = ["field", "studio", "atelier"];
    expect(appendErrors(reranked, base)).toContain("the ranking of field was edited");
    const unranked = midway(2);
    conv(unranked).rankings.shift();
    expect(appendErrors(unranked, base)).toContain("the ranking of field was removed");
  });

  it("opened never changes within a convening", () => {
    const base = midway(2);
    const doc = midway(2);
    conv(doc).opened = "2026-10-11";
    expect(appendErrors(doc, base)).toContain("convening.opened changed 2026-10-10 → 2026-10-11");
  });

  it("a result is never changed or cleared, and nothing is added after it", () => {
    const base = convened();
    const changed = convened();
    conv(changed).result!.proposed_by = "atelier";
    expect(appendErrors(changed, base)).toContain("the convening's result was changed");
    const cleared = convened();
    conv(cleared).result = null;
    expect(appendErrors(cleared, base)).toContain("the convening's result was changed");
    const afterTwo = tallied("2026-10-14", "2026-10-13");
    const lateRanking = convened();
    expect(appendErrors(lateRanking, afterTwo)).toContain("1 ranking(s) added after the result was set");
    expect(appendErrors(lateRanking, afterTwo)).toContain("the convening's result was changed");
  });

  it("nothing clears the convening; only a later cycle's convening replaces it", () => {
    const base = convened();
    const cleared = convened();
    cleared.convening = null;
    expect(appendErrors(cleared, base)).toContain("the convening after cycle 6 was removed");
    const dropped = convened();
    delete dropped.convening;
    expect(appendErrors(dropped, base)).toContain("the convening after cycle 6 was removed");

    const replaced = convened();
    replaced.cycle = 7;
    prog(replaced).push({ cycle: 7, question: "Fixture question", source: "convening", opened: "2026-10-14", closed: null, findings: [] });
    prog(replaced)[2]!.closed = "2026-10-14";
    replaced.convening = {
      after_cycle: 7,
      opened: "2026-10-14",
      proposals: [{ ...conv(base).proposals[0]!, date: "2026-10-14" }],
      rankings: [],
      result: null
    };
    expect(compareWithBase(replaced, base)).toEqual([]);
    expect(errorsOf(replaced)).toEqual([]);

    const backwards = convened();
    conv(backwards).after_cycle = 5;
    expect(appendErrors(backwards, base)).toContain("after_cycle moved backwards 6 → 5");
  });
});

describe("append-only: the programme", () => {
  it("entries and findings may be appended, and closed may be set once", () => {
    const base = convened();
    const next = convened();
    next.cycle = 7;
    prog(next)[2]!.closed = "2026-10-14";
    prog(next).push({ cycle: 7, question: "Fixture question", source: "convening", opened: "2026-10-14", closed: null, findings: [] });
    prog(next)[1]!.findings.push({
      practice: "atelier",
      line: "A fixture finding of the Atelier, not a record.",
      ref: { repo: "ulysses", path: "presentations/cycle-005/SUMMARY.md", commit: "a7e1e05" }
    });
    expect(errorsOf(next)).toEqual([]);
    expect(compareWithBase(next, base)).toEqual([]);
  });

  it("a base without a programme accepts any valid one", () => {
    expect(compareWithBase(convened(), plain())).toEqual([]);
  });

  it("the programme is never removed, shortened or reordered", () => {
    const base = convened();
    const gone = convened();
    delete gone.programme;
    expect(appendErrors(gone, base)).toContain("the programme was removed");
    const shorter = convened();
    shorter.programme = prog(shorter).slice(0, 2);
    expect(appendErrors(shorter, base)).toContain("programme entry for cycle 6 was removed");
    const swapped = convened();
    swapped.programme = [prog(swapped)[1]!, prog(swapped)[0]!, prog(swapped)[2]!];
    expect(appendErrors(swapped, base)).toContain("programme[0] is cycle 5 but the base has cycle 4 there");
    const dropped = convened();
    prog(dropped).splice(0, 1);
    expect(appendErrors(dropped, base)).toContain("programme[0] is cycle 5 but the base has cycle 4 there");
  });

  it("question, source and opened never change", () => {
    const base = convened();
    for (const [key, value] of [
      ["question", "Another question"],
      ["source", "seed"],
      ["opened", "2026-10-02"]
    ] as const) {
      const doc = convened();
      loose(prog(doc)[1])[key] = value;
      expect(appendErrors(doc, base), key).toContain(`programme cycle 5.${key} was changed`);
    }
  });

  it("closed is set once: null may become a date, a date never changes", () => {
    const base = convened();
    const set = convened();
    prog(set)[2]!.closed = "2026-10-12";
    expect(compareWithBase(set, base)).toEqual([]);
    const reset = convened();
    prog(reset)[1]!.closed = "2026-10-08";
    expect(appendErrors(reset, base)).toContain("programme cycle 5.closed was changed after it was set");
    const reopened = convened();
    prog(reopened)[1]!.closed = null;
    expect(appendErrors(reopened, base)).toContain("programme cycle 5.closed was changed after it was set");
    expect(compareWithBase(set, set)).toEqual([]);
    const later = convened();
    prog(later)[2]!.closed = "2026-10-13";
    expect(appendErrors(later, set)).toContain("programme cycle 6.closed was changed after it was set");
  });

  it("findings are only appended: never edited, removed or reordered", () => {
    const base = convened();
    const edited = convened();
    prog(edited)[1]!.findings[0]!.line = "Reworded after the fact.";
    expect(appendErrors(edited, base)).toContain("programme cycle 5 finding 0 (field) was edited");
    const removed = convened();
    prog(removed)[1]!.findings.splice(0, 1);
    expect(appendErrors(removed, base)).toContain("programme cycle 5 finding 1 (studio) was removed");
    expect(appendErrors(removed, base)).toContain("programme cycle 5 finding 0 (field) was edited");
    const swapped = convened();
    prog(swapped)[1]!.findings.reverse();
    expect(appendErrors(swapped, base)).toContain("programme cycle 5 finding 0 (field) was edited");
  });
});

describe("refs: the new sections' evidence is checked like the old", () => {
  it("collectRefs gathers proposals, rankings and findings with their own labels", () => {
    const labels = collectRefs(convened()).flatMap((r) => r.where);
    for (const expected of [
      "convening.proposals[field].ref",
      "convening.proposals[atelier].ref",
      "convening.proposals[studio].ref",
      "convening.rankings[field].ref",
      "convening.rankings[atelier].ref",
      "convening.rankings[studio].ref",
      "programme[cycle 5].findings[field].ref",
      "programme[cycle 5].findings[studio].ref"
    ]) {
      expect(labels, expected).toContain(expected);
    }
    // the fixture shares the 2026-10-05 fixture's relations and handoffs, so exactly the eight new refs are added
    expect(collectRefs(convened()).length).toBe(collectRefs(plain()).length + 8);
  });

  it("a ref both sections share is checked once and carries both labels", () => {
    const doc = convened();
    conv(doc).rankings[0]!.ref = { ...conv(doc).proposals[0]!.ref };
    const shared = collectRefs(doc).find((r) => r.key === "field-research@f1e1d01:BULLETIN.md");
    expect(shared?.where).toEqual(["convening.proposals[field].ref", "convening.rankings[field].ref"]);
  });
});

describe("robustness: a malformed convening or programme is an error, never a crash", () => {
  it("survives 1000 seeded mutations of the two sections, alone and against a base", () => {
    let state = 20261007;
    const next = (): number => {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      return state / 2 ** 32;
    };
    const pick = <T>(items: T[]): T => items[Math.floor(next() * items.length)]!;
    const junk: unknown[] = [null, 0, -1, 1.5, "", " ", "x", "2026-02-30", "2026-10-12", "field", ["field"], [], {}, { practice: "field" }, true, [null], ["studio", "field", "atelier"], "constructor", "toString"];
    const pathsOf = (o: unknown, prefix: string[] = []): string[][] =>
      o !== null && typeof o === "object"
        ? Object.keys(o).flatMap((k) => [[...prefix, k], ...pathsOf((o as Record<string, unknown>)[k], [...prefix, k])])
        : [];
    const reference = convened();
    for (let i = 0; i < 1000; i++) {
      const doc = JSON.parse(JSON.stringify(reference)) as RelayDoc;
      for (let n = 1 + Math.floor(next() * 3); n > 0; n--) {
        const target = pick(pathsOf(doc).filter((p) => p[0] === "convening" || p[0] === "programme"));
        let holder: Record<string, unknown> = doc as unknown as Record<string, unknown>;
        for (const key of target.slice(0, -1)) holder = holder[key] as Record<string, unknown>;
        const last = target[target.length - 1]!;
        if (next() < 0.15) delete holder[last];
        else holder[last] = JSON.parse(JSON.stringify(pick(junk)));
      }
      const result = validateRelay(doc);
      expect(Array.isArray(result.errors)).toBe(true);
      expect(Array.isArray(compareWithBase(doc, reference))).toBe(true);
      expect(Array.isArray(compareWithBase(reference, doc))).toBe(true);
      collectRefs(doc);
      tallyConvening(doc.convening);
    }
  });
});

describe("the seeded relay/relay.json", () => {
  const seeded = load(path.join(REPO_ROOT, "relay/relay.json"));

  it("carries the programme of cycles 1 to 6 derived from the site's cycle.json history", () => {
    const entries = seeded.programme ?? [];
    expect(entries.slice(0, 6).map((e) => [e.cycle, e.question, e.source, e.opened])).toEqual([
      [1, null, "defaults", "2026-08-30"],
      [2, null, "defaults", "2026-09-03"],
      [3, "Missing Data Art", "seed", "2026-09-07"],
      [4, "Missing Data Art, read through human extinction", "continuing", "2026-10-03"],
      [5, "Missing Data Art", "continuing", "2026-10-06"],
      [6, "Missing Data Art, read through human extinction by AI", "continuing", "2026-10-07"]
    ]);
    // every cycle but the last closed on the day the next opened (the transition notes say the same)
    expect(entries.slice(0, 5).map((e) => e.closed)).toEqual(["2026-09-03", "2026-09-07", "2026-10-03", "2026-10-06", "2026-10-07"]);
  });

  it("holds no finding for a past cycle: no summary of cycles 1 to 5 carries a For-the-programme line", () => {
    expect((seeded.programme ?? []).slice(0, 5).flatMap((e) => e.findings)).toEqual([]);
  });

  it("holds the sections, and has recorded no convening yet", () => {
    expect("convening" in seeded).toBe(true);
    expect("programme" in seeded).toBe(true);
    expect(errorsOf(seeded)).toEqual([]);
  });
});

describe("the command line", () => {
  const run = (doc: unknown, extra: string[] = []) => {
    const dir = mkdtempSync(path.join(tmpdir(), "relay-test-"));
    const file = path.join(dir, "relay.json");
    writeFileSync(file, JSON.stringify(doc));
    return spawnSync(process.execPath, [TOOL, "--file", file, ...extra], { encoding: "utf8" });
  };

  it("exits 0 and summarises the programme and the convening for a valid file", () => {
    const r = run(convened());
    expect(r.status).toBe(0);
    expect(r.stdout).toContain("programme 3 cycles, 2 findings");
    expect(r.stdout).toContain("convening after cycle 6: 3 proposals, 3 rankings, result studio");
  });

  it("says so when no convening is recorded", () => {
    const doc = convened();
    doc.convening = null;
    const r = run(doc);
    expect(r.status).toBe(0);
    expect(r.stdout).toContain("no convening");
  });

  it("exits 1 and names the broken rule", () => {
    const doc = convened();
    conv(doc).result!.scores.studio = 4;
    const r = run(doc);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("error: convening.result.scores.studio: says 4, Borda over the rankings gives 5");
  });

  it("checks append-only against --base", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "relay-test-"));
    const baseFile = path.join(dir, "base.json");
    writeFileSync(baseFile, JSON.stringify(convened()));
    const doc = convened();
    prog(doc)[1]!.question = "Another question";
    const r = run(doc, ["--base", baseFile]);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("append-only: programme cycle 5.question was changed");
  });
});
