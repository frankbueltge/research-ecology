/**
 * Hashing and idempotency (locked contract, work order §2.3 / §2.4; ADR 0002; ADR 0009 §4).
 */

import { createHash } from "node:crypto";
import { canonicalJson } from "./canonical-json.js";

/**
 * contentHash(record) = "sha256:" + hex(sha256(canonicalJson(record minus content_hash
 * and signature))).
 *
 * `content_hash` is the primary durable identity of every imported object version and
 * event (ADR 0009 §1); `source_commit` is a best-effort pointer that may dangle after a
 * history rewrite.
 */
export function contentHash(record: Record<string, unknown>): string {
  const { content_hash: _contentHash, signature: _signature, ...rest } = record;
  const canonical = canonicalJson(rest);
  const digest = createHash("sha256").update(canonical, "utf8").digest("hex");
  return `sha256:${digest}`;
}

/**
 * externalEventId(sourceUri, contentHash, eventType) =
 *   sha256hex(sourceUri + "\n" + contentHash + "\n" + eventType)
 *
 * Deterministic idempotency key (ADR 0002 §2): nightly re-imports are no-ops against
 * `UNIQUE (issuer_collective_id, external_event_id)`.
 */
export function externalEventId(sourceUri: string, contentHash: string, eventType: string): string {
  const basis = `${sourceUri}\n${contentHash}\n${eventType}`;
  return createHash("sha256").update(basis, "utf8").digest("hex");
}
