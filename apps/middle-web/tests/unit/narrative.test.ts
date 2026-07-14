import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { getNarrative } from "../../src/lib/server/narrative.js";
import { isDivergenceBeat, validateNarrative } from "../../src/lib/narrative.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(here, "../../../../");
const FIXTURE_DIR = path.join(REPO_ROOT, "fixtures/enc-2026-001-calibration-gap-travels");

interface FixtureEvent {
  event_id: string;
  event_type: string;
  payload: Record<string, unknown>;
}

interface FixtureAssertion {
  assertion_id: string;
  object: unknown;
}

const events: FixtureEvent[] = JSON.parse(readFileSync(path.join(FIXTURE_DIR, "events.json"), "utf-8"));
const assertions: FixtureAssertion[] = JSON.parse(readFileSync(path.join(FIXTURE_DIR, "assertions.json"), "utf-8"));

function eventById(id: string): FixtureEvent {
  const event = events.find((e) => e.event_id === id);
  if (!event) throw new Error(`fixture event not found: ${id}`);
  return event;
}

function assertionById(id: string): FixtureAssertion {
  const assertion = assertions.find((a) => a.assertion_id === id);
  if (!assertion) throw new Error(`fixture assertion not found: ${id}`);
  return assertion;
}

describe("getNarrative (structural shape)", () => {
  it("loads exactly 6 beats, pending approval, authored by the-middle-editorial", () => {
    const narrative = getNarrative();
    expect(narrative.encounter_id).toBe("enc-2026-001-calibration-gap-travels");
    expect(narrative.authored_by).toBe("the-middle-editorial");
    expect(narrative.approval).toBe("pending");
    expect(narrative.beats).toHaveLength(6);
  });

  it("the first five beats carry a quote+attribution+akte link; the sixth is the divergence miniature", () => {
    const narrative = getNarrative();
    const [b1, b2, b3, b4, b5, b6] = narrative.beats;
    for (const beat of [b1, b2, b3, b4, b5]) {
      expect(isDivergenceBeat(beat!)).toBe(false);
    }
    expect(isDivergenceBeat(b6!)).toBe(true);
  });

  it("validateNarrative rejects a beats array that is not exactly 6 long", () => {
    const narrative = getNarrative();
    const truncated = { ...narrative, beats: narrative.beats.slice(0, 3) };
    expect(() => validateNarrative(truncated, "test")).toThrow(/exactly 6 beats/);
  });

  it("validateNarrative rejects a missing quote on a non-final beat", () => {
    const narrative = getNarrative();
    const broken = {
      ...narrative,
      beats: narrative.beats.map((b, i) => (i === 0 ? { ...b, quote: "" } : b))
    };
    expect(() => validateNarrative(broken, "test")).toThrow(/beats\[0\]\.quote/);
  });
});

describe("narrative beat quotes are byte-exact against their fixture source (work order phase-3d §4)", () => {
  it("beat 1 ↔ evt-enc2026001-01-contract-published (contract.published)", () => {
    const narrative = getNarrative();
    const beat = narrative.beats[0]!;
    if (isDivergenceBeat(beat)) throw new Error("beat 1 should not be the divergence beat");
    const event = eventById(beat.akte.eventId);
    expect(event.event_type).toBe(beat.akte.eventType);
    expect(event.event_type).toBe("contract.published");
    expect(beat.quote).toBe(event.payload.quote_governing_principle);
  });

  it("beat 2 ↔ evt-enc2026001-02-object-admitted (object.admitted)", () => {
    const narrative = getNarrative();
    const beat = narrative.beats[1]!;
    if (isDivergenceBeat(beat)) throw new Error("beat 2 should not be the divergence beat");
    const event = eventById(beat.akte.eventId);
    expect(event.event_type).toBe(beat.akte.eventType);
    expect(event.event_type).toBe("object.admitted");
    expect(beat.quote).toBe(event.payload.quote_contract);
  });

  it("beat 3 ↔ evt-enc2026001-04-translation-loss-declared (translation.loss_declared)", () => {
    const narrative = getNarrative();
    const beat = narrative.beats[2]!;
    if (isDivergenceBeat(beat)) throw new Error("beat 3 should not be the divergence beat");
    const event = eventById(beat.akte.eventId);
    expect(event.event_type).toBe(beat.akte.eventType);
    expect(event.event_type).toBe("translation.loss_declared");
    expect(beat.quote).toBe(event.payload.quote_rationale);
  });

  it("beat 4 ↔ evt-enc2026001-03-correction-issued (correction.issued)", () => {
    const narrative = getNarrative();
    const beat = narrative.beats[3]!;
    if (isDivergenceBeat(beat)) throw new Error("beat 4 should not be the divergence beat");
    const event = eventById(beat.akte.eventId);
    expect(event.event_type).toBe(beat.akte.eventType);
    expect(event.event_type).toBe("correction.issued");
    expect(beat.quote).toBe(event.payload.quote_appellate_finding);
  });

  it("beat 5 ↔ evt-enc2026001-05-correction-applied (correction.applied) — verbatim substring of quote_session_33_addition", () => {
    const narrative = getNarrative();
    const beat = narrative.beats[4]!;
    if (isDivergenceBeat(beat)) throw new Error("beat 5 should not be the divergence beat");
    const event = eventById(beat.akte.eventId);
    expect(event.event_type).toBe(beat.akte.eventType);
    expect(event.event_type).toBe("correction.applied");
    const fullQuote = event.payload.quote_session_33_addition as string;
    expect(fullQuote).toContain(beat.quote);
  });

  it("beat 6 (divergence miniature) ↔ assert-enc2026001-meridian-live-framing + assert-enc2026001-ensemble-boundary-case", () => {
    const narrative = getNarrative();
    const beat = narrative.beats[5]!;
    if (!isDivergenceBeat(beat)) throw new Error("beat 6 should be the divergence beat");

    const meridianAssertion = assertionById("assert-enc2026001-meridian-live-framing");
    expect(beat.divergence.leftQuote).toBe(meridianAssertion.object);

    const ensembleAssertion = assertionById("assert-enc2026001-ensemble-boundary-case");
    expect(beat.divergence.rightQuote).toBe(ensembleAssertion.object);

    expect(beat.divergence.closing.en).toBe("no shared resolution");
    expect(beat.divergence.closing.de).toBe("keine gemeinsame Auflösung");
  });

  it("no beat quote or attribution names a collective before beat 6 (identity recession, work order §4)", () => {
    const narrative = getNarrative();
    for (const beat of narrative.beats.slice(0, 5)) {
      if (isDivergenceBeat(beat)) continue;
      for (const name of ["Meridian", "Ensemble", "Ulysses"]) {
        expect(beat.quote).not.toContain(name);
        expect(beat.attribution.de).not.toContain(name);
        expect(beat.attribution.en).not.toContain(name);
        expect(beat.heading.de).not.toContain(name);
        expect(beat.heading.en).not.toContain(name);
      }
    }
  });
});
