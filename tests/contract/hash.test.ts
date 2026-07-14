import { describe, it, expect } from "vitest";
import { contentHash, externalEventId } from "../../packages/protocol/src/index.js";

// Golden value: pinned once against a fixed sample record and committed here (work order §5.7).
// Recompute deliberately if — and only if — the locked contentHash/canonicalJson contract
// itself changes; a silent mismatch here means the hashing contract drifted.
const GOLDEN_SAMPLE = {
  event_id: "golden-1",
  event_type: "object.admitted",
  occurred_at: "2026-07-12T13:48:36Z",
  payload: { a: 1, b: "two", nested: { z: true, a: null } }
};
const GOLDEN_CONTENT_HASH =
  "sha256:a6e6729fe45cc1ffe82b96b1a140b1311bc242e104d18b7624444ed740755741";

describe("contentHash", () => {
  it("matches a pinned golden value for a fixed sample record", () => {
    expect(contentHash(GOLDEN_SAMPLE)).toBe(GOLDEN_CONTENT_HASH);
  });

  it("is stable across repeated calls with the same input", () => {
    expect(contentHash(GOLDEN_SAMPLE)).toBe(contentHash(GOLDEN_SAMPLE));
  });

  it("is independent of object key order", () => {
    const a = contentHash({ x: 1, y: 2, payload: { m: 1, n: 2 } });
    const b = contentHash({ payload: { n: 2, m: 1 }, y: 2, x: 1 });
    expect(a).toBe(b);
  });

  it("always carries the sha256: prefix", () => {
    expect(contentHash({ a: 1 })).toMatch(/^sha256:[a-f0-9]{64}$/);
  });

  it("excludes content_hash and signature fields from the hashed basis", () => {
    const withoutExtras = contentHash({ a: 1 });
    const withExtras = contentHash({ a: 1, content_hash: "sha256:whatever", signature: "sig" });
    expect(withExtras).toBe(withoutExtras);
  });

  it("changes when any other field changes", () => {
    expect(contentHash({ a: 1 })).not.toBe(contentHash({ a: 2 }));
  });
});

describe("externalEventId", () => {
  it("is deterministic for identical inputs", () => {
    const a = externalEventId("https://example.invalid/x", "sha256:abc", "object.admitted");
    const b = externalEventId("https://example.invalid/x", "sha256:abc", "object.admitted");
    expect(a).toBe(b);
  });

  it("matches a pinned golden value", () => {
    const id = externalEventId(
      "https://example.invalid/x",
      contentHash({
        event_id: "golden-1",
        event_type: "object.admitted",
        occurred_at: "2026-07-12T13:48:36Z",
        payload: { a: 1, b: "two", nested: { z: true, a: null } }
      }),
      "object.admitted"
    );
    expect(id).toBe("ec9560b8381dfebee220b35a1ac5e21a2996a018de4b0b255b646d7a9451c7bb");
  });

  it("changes when the source_uri changes", () => {
    const a = externalEventId("https://example.invalid/x", "sha256:abc", "object.admitted");
    const b = externalEventId("https://example.invalid/y", "sha256:abc", "object.admitted");
    expect(a).not.toBe(b);
  });

  it("changes when the content_hash changes", () => {
    const a = externalEventId("https://example.invalid/x", "sha256:abc", "object.admitted");
    const b = externalEventId("https://example.invalid/x", "sha256:def", "object.admitted");
    expect(a).not.toBe(b);
  });

  it("changes when the event_type changes", () => {
    const a = externalEventId("https://example.invalid/x", "sha256:abc", "object.admitted");
    const b = externalEventId("https://example.invalid/x", "sha256:abc", "correction.issued");
    expect(a).not.toBe(b);
  });

  it("produces a 64-character lowercase hex digest with no prefix", () => {
    const id = externalEventId("uri", "sha256:abc", "object.admitted");
    expect(id).toMatch(/^[a-f0-9]{64}$/);
  });
});
