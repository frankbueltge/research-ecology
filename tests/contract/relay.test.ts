/**
 * The relay desk's contract guard (tools/verify-relay.mjs, contract middle-relay/1, relay/README.md).
 * A small valid fixture must pass, each kind of contract break must be caught, the append-only
 * comparison must refuse edits and deletions, and the seeded relay/relay.json must stay valid.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  checkRefsOnline,
  collectRefs,
  compareWithBase,
  validateRelay,
  type RelayDoc
} from "../../tools/verify-relay.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(here, "../..");
const load = (p: string): RelayDoc => JSON.parse(readFileSync(p, "utf8")) as RelayDoc;
const valid = (): RelayDoc => load(path.join(here, "relay-fixtures/valid.json"));
const errorsOf = (doc: unknown): string[] => validateRelay(doc).errors;
const expectError = (doc: unknown, fragment: string): void => {
  const errors = errorsOf(doc);
  expect(errors.some((e) => e.includes(fragment)), `expected an error containing "${fragment}", got:\n${errors.join("\n")}`).toBe(true);
};

describe("verify-relay: a valid document", () => {
  it("the fixture passes without errors", () => {
    expect(errorsOf(valid())).toEqual([]);
  });

  it("the seeded relay/relay.json passes without errors", () => {
    expect(errorsOf(load(path.join(REPO_ROOT, "relay/relay.json")))).toEqual([]);
  });
});

describe("verify-relay: contract breaks are caught", () => {
  it("a relation whose giver is its taker", () => {
    const doc = valid();
    doc.relations[0]!.giver = "atelier";
    expectError(doc, "giver and taker are both");
  });

  it("a kind outside the enum", () => {
    const doc = valid() as unknown as { relations: Array<Record<string, unknown>> };
    doc.relations[1]!.kind = "acknowledged";
    expectError(doc, "is not one of built_on, answered, noted");
  });

  it("an id whose date or practice disagrees with the record", () => {
    const doc = valid();
    doc.relations[0]!.id = "rel-2026-09-24-atelier-1";
    expectError(doc, "differs from date");
    doc.relations[0]!.id = "rel-2026-09-25-field-1";
    expectError(doc, "differs from taker");
  });

  it("a handoff addressed to its own giver", () => {
    const doc = valid();
    doc.handoffs[1]!.to = ["studio", "atelier"];
    expectError(doc, "contains the giver");
  });

  it("counts that do not match the file", () => {
    const doc = valid();
    doc.counts.noted = 2;
    expectError(doc, "counts.noted");
  });

  it("a taken handoff whose relation is missing, or is only a note", () => {
    const doc = valid();
    doc.handoffs[2]!.taken_by!.relation = "rel-2026-10-04-studio-9";
    expectError(doc, "is not a relation in this file");
    const doc2 = valid();
    doc2.relations[3]!.giver = "atelier";
    doc2.handoffs[2]!.taken_by!.relation = "rel-2026-10-04-studio-2";
    expectError(doc2, "uptake needs built_on or answered");
  });

  it("an open handoff past 21 days, and a lapse before 21 days", () => {
    const doc = valid();
    doc.handoffs[0]!.status = "open";
    doc.counts.open_handoffs = 2;
    expectError(doc, "a handoff lapses after 21 days");
    const doc2 = valid();
    doc2.handoffs[1]!.status = "lapsed";
    doc2.counts.open_handoffs = 0;
    expectError(doc2, "lapsed after only");
  });

  it("a what longer than 140 characters", () => {
    const doc = valid();
    doc.relations[0]!.what = "x".repeat(141);
    expectError(doc, "at most 140");
  });

  it("a ref outside the practice's repo, or pointing at a directory", () => {
    const doc = valid();
    doc.relations[0]!.giver_ref.repo = "studio";
    expectError(doc, "does not belong to this practice");
    const doc2 = valid();
    doc2.relations[0]!.taker_ref.path = "window/cycle-003-session-15/";
    expectError(doc2, "must be a repo-relative path to a file");
  });

  it("corrects must point back to an earlier relation", () => {
    const doc = valid();
    doc.relations[0]!.corrects = "rel-2026-10-02-atelier-1";
    expectError(doc, "comes later in the file");
    const ok = valid();
    ok.relations[1]!.corrects = "rel-2026-09-25-atelier-1";
    expect(errorsOf(ok)).toEqual([]);
  });
});

describe("verify-relay: append-only against a base", () => {
  it("accepts a night that only adds a relation and takes a handoff", () => {
    const base = valid();
    const next = valid();
    next.relations.push({
      id: "rel-2026-10-04-studio-3",
      date: "2026-10-04",
      giver: "atelier",
      taker: "studio",
      kind: "built_on",
      what: "Drew the Atelier's counter-finding into its own work.",
      thread: "berkeley-catalogue",
      giver_ref: { repo: "ulysses", path: "BULLETIN.md", commit: "f4a3be0" },
      taker_ref: { repo: "studio", path: "BULLETIN.md", commit: "b52775e" }
    });
    next.handoffs[1]!.status = "taken";
    next.handoffs[1]!.taken_by = { practice: "studio", date: "2026-10-04", relation: "rel-2026-10-04-studio-3" };
    next.counts = { built_on: 2, answered: 2, noted: 1, open_handoffs: 0 };
    expect(errorsOf(next)).toEqual([]);
    expect(compareWithBase(next, base)).toEqual([]);
  });

  it("refuses an edited or deleted relation and a reopened handoff", () => {
    const base = valid();
    const edited = valid();
    edited.relations[0]!.what = "Rewritten after the fact.";
    expect(compareWithBase(edited, base).join("\n")).toContain("rel-2026-09-25-atelier-1 was edited");
    const deleted = valid();
    deleted.relations.splice(1, 1);
    expect(compareWithBase(deleted, base).join("\n")).toContain("rel-2026-10-02-atelier-1 was deleted");
    const reopened = valid();
    reopened.handoffs[0]!.status = "open";
    expect(compareWithBase(reopened, base).join("\n")).toContain("lapsed → open");
  });
});

describe("verify-relay: online ref check", () => {
  it("counts 200 as found, 404 as an error and a rate limit as unverified", async () => {
    const refs = collectRefs(valid()).slice(0, 3);
    const statuses = [200, 404, 429];
    const answers = new Map(refs.map((r, i) => [r.key, statuses[i]!]));
    const fakeFetch = (async (url: string) => {
      const hit = refs.find((r) => url.includes(r.commit) && url.endsWith(r.path.split("/").pop()!));
      return new Response(null, { status: hit ? answers.get(hit.key)! : 500 });
    }) as unknown as typeof fetch;
    const result = await checkRefsOnline(refs, { fetchImpl: fakeFetch, concurrency: 1 });
    expect(result.verified).toBe(1);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toContain("404");
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0]).toContain("429");
  });
});
