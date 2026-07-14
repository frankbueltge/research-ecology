/**
 * Acceptance tests for fixtures/enc-2026-001-calibration-gap-travels (work order §5).
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  validateEncounterEvent,
  validateAssertion,
  contentHash,
  isCoreEventType
} from "../../packages/protocol/src/index.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.resolve(currentDir, "../../fixtures/enc-2026-001-calibration-gap-travels");
const specSchemasDir = path.resolve(currentDir, "../../docs/spec/schemas");

function loadJson(filename: string): unknown {
  return JSON.parse(readFileSync(path.join(fixtureDir, filename), "utf8"));
}

let encounter: any;
let objects: any[];
let events: any[];
let obligations: any[];
let assertions: any[];

beforeAll(() => {
  encounter = loadJson("encounter.json");
  objects = loadJson("objects.json") as any[];
  events = loadJson("events.json") as any[];
  obligations = loadJson("obligations.json") as any[];
  assertions = loadJson("assertions.json") as any[];
});

describe("fixture: docs/spec/schemas is the untouched source of truth", () => {
  it("packages/protocol/schemas is byte-identical to docs/spec/schemas", () => {
    const packageSchemasDir = path.resolve(currentDir, "../../packages/protocol/schemas");
    for (const name of [
      "assertion.schema.json",
      "collective-manifest.schema.json",
      "encounter-event.schema.json",
      "intervention.schema.json",
      "lens.schema.json",
      "map-manifest.schema.json",
      "transfer-offer.schema.json",
      "transfer-response.schema.json"
    ]) {
      const fromSpec = readFileSync(path.join(specSchemasDir, name), "utf8");
      const fromPackage = readFileSync(path.join(packageSchemasDir, name), "utf8");
      expect(fromPackage).toBe(fromSpec);
    }
  });

  it("docs/spec/fixtures/example-encounter.json is left untouched (still carries its own fixture_notice)", () => {
    const exampleDir = path.resolve(currentDir, "../../docs/spec/fixtures");
    const example = JSON.parse(readFileSync(path.join(exampleDir, "example-encounter.json"), "utf8"));
    expect(example.fixture_notice).toMatch(/Illustrative schema fixture only/);
  });
});

describe("fixture: every events.json record validates against encounter-event.schema.json", () => {
  it("all seven events are schema-valid", () => {
    expect(events.length).toBe(7);
    for (const event of events) {
      const result = validateEncounterEvent(event);
      expect(result.valid, JSON.stringify(result.errors)).toBe(true);
    }
  });
});

describe("fixture: every assertions.json record validates against assertion.schema.json", () => {
  it("all three assertions are schema-valid and none is machine_suggestion", () => {
    expect(assertions.length).toBe(3);
    for (const assertion of assertions) {
      const result = validateAssertion(assertion);
      expect(result.valid, JSON.stringify(result.errors)).toBe(true);
      expect(assertion.epistemic_status).not.toBe("machine_suggestion");
    }
  });
});

describe("acceptance §5.2 — contract.published (unknown type) validates and round-trips", () => {
  it("the standing-contract event uses the deliberately open type contract.published", () => {
    const event = events.find((e) => e.event_id === "evt-enc2026001-01-contract-published");
    expect(event).toBeDefined();
    expect(event.event_type).toBe("contract.published");
    expect(isCoreEventType(event.event_type)).toBe(false);
  });

  it("validates despite being an unknown event type", () => {
    const event = events.find((e) => e.event_type === "contract.published");
    expect(validateEncounterEvent(event).valid).toBe(true);
  });

  it("survives serialise → parse → canonicalise → hash unchanged", () => {
    const original = events.find((e) => e.event_type === "contract.published");
    const roundTripped = JSON.parse(JSON.stringify(original));
    expect(roundTripped).toEqual(original);
    expect(validateEncounterEvent(roundTripped).valid).toBe(true);
    expect(contentHash(roundTripped)).toBe(original.content_hash);
  });
});

describe("acceptance §5.3 — source-local type strings survive round-trip byte-identically", () => {
  it("DISCLOSED RECONSTRUCTION survives in the transformation-claim assertion", () => {
    const assertion = assertions.find(
      (a) => a.assertion_id === "assert-enc2026001-ensemble-transformation-claim"
    );
    expect(assertion.local_epistemic_status).toBe("DISCLOSED RECONSTRUCTION");
    const roundTripped = JSON.parse(JSON.stringify(assertion));
    expect(roundTripped.local_epistemic_status).toBe("DISCLOSED RECONSTRUCTION");
  });

  it("DISCLOSED RECONSTRUCTION also survives on the Native Speaker object reference", () => {
    const nativeSpeaker = objects.find((o) => o.local_object_id === "native-speaker");
    expect(nativeSpeaker.local_epistemic_status).toMatch(/DISCLOSED RECONSTRUCTION/);
    const roundTripped = JSON.parse(JSON.stringify(nativeSpeaker));
    expect(roundTripped.local_epistemic_status).toBe(nativeSpeaker.local_epistemic_status);
  });

  it("BOUNDARY CASE — DELIBERATELY NOT CARRIED ON THE VERDICT CARD survives round-trip", () => {
    const event = events.find((e) => e.event_type === "translation.loss_declared");
    const label = event.payload.local_role_label;
    expect(label).toBe("BOUNDARY CASE — DELIBERATELY NOT CARRIED ON THE VERDICT CARD");
    const roundTripped = JSON.parse(JSON.stringify(event));
    expect(roundTripped.payload.local_role_label).toBe(label);
  });

  it("every event's content_hash is reproducible from canonicalJson/contentHash over the stored envelope", () => {
    for (const event of events) {
      const { content_hash, ...rest } = JSON.parse(JSON.stringify(event));
      expect(contentHash(rest)).toBe(content_hash);
    }
  });

  it("every assertion's content_hash is reproducible from canonicalJson/contentHash over the stored record", () => {
    for (const assertion of assertions) {
      const { content_hash, ...rest } = JSON.parse(JSON.stringify(assertion));
      expect(contentHash(rest)).toBe(content_hash);
    }
  });
});

describe("acceptance §5.5 — participant-specific statuses are distinct and preserved", () => {
  it("encounter.json carries distinct, non-flattened local statuses for meridian and ensemble", () => {
    const meridian = encounter.participants.find((p: any) => p.collective_id === "meridian");
    const ensemble = encounter.participants.find((p: any) => p.collective_id === "ensemble");
    expect(meridian.local_status).toBe("correction applied; register revised; obligations active");
    expect(ensemble.local_status).toBe("premiered; live-status obligation active");
    expect(meridian.local_status).not.toBe(ensemble.local_status);
  });

  it("Frank's apparatus participation is recorded distinctly as conductor, not as a third interpretive voice", () => {
    const conductor = encounter.participants.find((p: any) => p.actor_id === "frank-bueltge");
    expect(conductor.role).toBe("conductor");
    expect(conductor.collective_id).toBeNull();
  });
});

describe("acceptance §5.6 — fixture completeness", () => {
  it("has a source content hash for every local object reference", () => {
    expect(objects.length).toBeGreaterThan(0);
    for (const object of objects) {
      expect(object.content_hash).toMatch(/^sha256:[a-f0-9]{64}$/);
    }
  });

  it("carries at least one load-bearing caveat/obligation", () => {
    const loadBearing = obligations.filter((o) => o.prominence === "load_bearing");
    expect(loadBearing.length).toBeGreaterThanOrEqual(1);
  });

  it("carries two incompatible authored positions on the same underlying case", () => {
    const ensemblePosition = assertions.find(
      (a) => a.assertion_id === "assert-enc2026001-ensemble-boundary-case"
    );
    const meridianPosition = assertions.find(
      (a) => a.assertion_id === "assert-enc2026001-meridian-live-framing"
    );
    expect(ensemblePosition.author.collective_id).toBe("ensemble");
    expect(meridianPosition.author.collective_id).toBe("meridian");
    // Ensemble declines to carry the case as detector-attributed harm at all; Meridian
    // continues to carry it, reframed as a detector-in-the-accusation observation. Both
    // positions are live and neither supersedes the other (spec 03 §10).
    expect(ensemblePosition.predicate).toBe("declines-to-carry");
    expect(meridianPosition.predicate).toBe("frames-as");
    expect(ensemblePosition.predicate).not.toBe(meridianPosition.predicate);
  });

  it("has at least one active obligation", () => {
    const active = obligations.filter((o) => o.status === "active");
    expect(active.length).toBeGreaterThanOrEqual(1);
  });

  it("has no global/shared resolution", () => {
    expect(encounter.shared_resolution).toBeNull();
    expect(Object.prototype.hasOwnProperty.call(encounter, "resolution_note")).toBe(true);
  });
});
