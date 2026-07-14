import { describe, it, expect } from "vitest";
import {
  validateAssertion,
  validateCollectiveManifest,
  validateEncounterEvent,
  validateIntervention,
  validateLens,
  validateMapManifest,
  validateTransferOffer,
  validateTransferResponse,
  isCoreEventType,
  resolveVisibility
} from "../../packages/protocol/src/index.js";

const HASH = "sha256:" + "a".repeat(64);

describe("schema example: assertion.schema.json", () => {
  it("validates a minimal, schema-conformant assertion", () => {
    const result = validateAssertion({
      assertion_id: "assert-example-1",
      author: { actor_id: "ensemble" },
      subject: { local_object_id: "example" },
      predicate: "transforms",
      object: "example object",
      epistemic_status: "interpretation",
      content_hash: HASH
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toBeNull();
  });

  it("rejects an assertion missing a required field", () => {
    const result = validateAssertion({
      author: { actor_id: "ensemble" },
      subject: {},
      predicate: "transforms",
      object: "x",
      epistemic_status: "interpretation",
      content_hash: HASH
    });
    expect(result.valid).toBe(false);
    expect(result.errors?.length).toBeGreaterThan(0);
  });

  it("rejects epistemic_status: machine_suggestion even when otherwise schema-valid (work order §2.5)", () => {
    const result = validateAssertion({
      assertion_id: "assert-example-2",
      author: { actor_id: "some-model-runtime" },
      subject: { local_object_id: "example" },
      predicate: "possibly-relates-to",
      object: "example object",
      epistemic_status: "machine_suggestion",
      content_hash: HASH
    });
    expect(result.valid).toBe(false);
    expect(result.errors?.[0]?.message).toMatch(/machine_suggestion/);
  });
});

describe("schema example: collective-manifest.schema.json", () => {
  it("validates a minimal, schema-conformant manifest", () => {
    const result = validateCollectiveManifest({
      schema_version: "1.0",
      collective_id: "meridian",
      name: "Meridian",
      description: "A sovereign research practice.",
      protocol_url: "https://example.invalid/meridian/protocol.json",
      repository_url: "https://github.com/frankbueltge/field-research",
      responsible_publisher: "Frank Bültge",
      status: "active",
      effective_from: "2026-07-01T00:00:00Z",
      version: 1,
      content_hash: HASH
    });
    expect(result.valid).toBe(true);
  });

  it("rejects an invalid collective_id pattern", () => {
    const result = validateCollectiveManifest({
      schema_version: "1.0",
      collective_id: "M",
      name: "Meridian",
      description: "x",
      protocol_url: "https://example.invalid/p.json",
      repository_url: "https://example.invalid/repo",
      responsible_publisher: "Frank Bültge",
      status: "active",
      effective_from: "2026-07-01T00:00:00Z",
      version: 1,
      content_hash: HASH
    });
    expect(result.valid).toBe(false);
  });
});

describe("schema example: encounter-event.schema.json", () => {
  const baseEvent = {
    schema_version: "1.0" as const,
    event_id: "evt-example-1",
    event_type: "object.admitted",
    issuer: { collective_id: "ensemble", actor_id: "ensemble" },
    occurred_at: "2026-07-12T13:48:36Z",
    source_uri: "https://example.invalid/studio/x",
    payload: {},
    content_hash: HASH
  };

  it("validates a minimal, schema-conformant core-type event", () => {
    expect(validateEncounterEvent(baseEvent).valid).toBe(true);
  });

  it("accepts an unknown/open event_type when the envelope is otherwise valid (spec 05 §3.7)", () => {
    const result = validateEncounterEvent({ ...baseEvent, event_type: "contract.published" });
    expect(result.valid).toBe(true);
  });

  it("rejects an event_type outside the namespace pattern", () => {
    const result = validateEncounterEvent({ ...baseEvent, event_type: "Not A Valid Type!" });
    expect(result.valid).toBe(false);
  });

  it("rejects a content_hash without the sha256: prefix", () => {
    const result = validateEncounterEvent({ ...baseEvent, content_hash: "deadbeef" });
    expect(result.valid).toBe(false);
  });
});

describe("isCoreEventType", () => {
  it("recognises core vocabulary from spec 03 §3", () => {
    expect(isCoreEventType("offer.created")).toBe(true);
    expect(isCoreEventType("correction.issued")).toBe(true);
    expect(isCoreEventType("encounter.archived")).toBe(true);
  });

  it("is informational only — false for an unknown type does not imply invalidity", () => {
    expect(isCoreEventType("contract.published")).toBe(false);
  });
});

describe("resolveVisibility", () => {
  it("defaults to public when absent", () => {
    expect(resolveVisibility({})).toBe("public");
  });

  it("preserves an explicit value", () => {
    expect(resolveVisibility({ visibility: "embargoed" })).toBe("embargoed");
  });
});

describe("schema example: intervention.schema.json", () => {
  it("validates a minimal, schema-conformant intervention", () => {
    const result = validateIntervention({
      intervention_id: "int-example-1",
      identity_mode: "named",
      intervention_type: "missing_caveat",
      target: { local_object_id: "example" },
      rationale: "A caveat present upstream was dropped in the derivative.",
      publication_consent: true
    });
    expect(result.valid).toBe(true);
  });
});

describe("schema example: lens.schema.json", () => {
  it("validates a minimal, schema-conformant lens", () => {
    const result = validateLens({
      lens_id: "lens-example-1",
      version: 1,
      name: "Provenance chain",
      author: { actor_id: "the-middle-editor" },
      purpose: "Show the event chain of an encounter.",
      selection: { event_types: ["object.admitted", "correction.issued"] },
      renderer: "event-chain-v1",
      declared_exclusions: [{ kind: "private" }],
      implementation_hash: HASH
    });
    expect(result.valid).toBe(true);
  });
});

describe("schema example: map-manifest.schema.json", () => {
  it("validates a minimal, schema-conformant map manifest", () => {
    const result = validateMapManifest({
      map_id: "map-example-1",
      version: 1,
      encounter_id: "enc-example-001",
      lens: { lens_id: "lens-example-1", version: 1 },
      event_watermark: "2026-07-12T22:22:01Z",
      included: { events: ["evt-1"], objects: ["obj-1"], assertions: [], obligations: [] },
      exclusions: [],
      render_failures: [],
      accessible_summary: "One event chain, no assertions rendered yet.",
      content_hash: HASH
    });
    expect(result.valid).toBe(true);
  });
});

describe("schema example: transfer-offer.schema.json", () => {
  it("validates a minimal, schema-conformant transfer offer payload", () => {
    const result = validateTransferOffer({
      offer_id: "offer-example-1",
      source_collective_id: "meridian",
      target: { collective_id: "ensemble" },
      subject: {
        collective_id: "meridian",
        local_object_id: "instrument-example",
        canonical_uri: "https://example.invalid/field/instrument-example",
        local_object_type: "instrument",
        content_hash: HASH
      },
      proposition: "Use or contest the instrument under the attached conditions.",
      source_status: { lifecycle: "verified", epistemic: "sourced" },
      caveats: [{ id: "c1", text: "Applies only to the tested configuration." }],
      rights: {},
      requested_obligations: [{ id: "o1", clause: "Display the live status." }],
      correction_channel: "https://example.invalid/field/corrections"
    });
    expect(result.valid).toBe(true);
  });

  it("accepts an open-target offer (scope instead of a named collective)", () => {
    const result = validateTransferOffer({
      offer_id: "offer-example-2",
      source_collective_id: "meridian",
      target: { scope: "all_collectives" },
      subject: {
        collective_id: "meridian",
        local_object_id: "instrument-example",
        canonical_uri: "https://example.invalid/field/instrument-example",
        local_object_type: "instrument",
        content_hash: HASH
      },
      proposition: "Open offer to any collective.",
      source_status: { lifecycle: "verified", epistemic: "sourced" },
      caveats: [],
      rights: {},
      requested_obligations: [],
      correction_channel: "https://example.invalid/field/corrections"
    });
    expect(result.valid).toBe(true);
  });
});

describe("schema example: transfer-response.schema.json", () => {
  it("validates a minimal, schema-conformant transfer response payload", () => {
    const result = validateTransferResponse({
      response_id: "response-example-1",
      offer_id: "offer-example-1",
      responder_collective_id: "ensemble",
      decision: "accepted_with_conditions"
    });
    expect(result.valid).toBe(true);
  });

  it("rejects an unrecognised decision value", () => {
    const result = validateTransferResponse({
      response_id: "response-example-2",
      offer_id: "offer-example-1",
      responder_collective_id: "ensemble",
      decision: "maybe-later"
    });
    expect(result.valid).toBe(false);
  });
});
