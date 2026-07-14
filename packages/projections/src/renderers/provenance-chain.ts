/**
 * `provenance-chain` renderer (design §3.1/§4): a dated vertical ledger. Every event — known
 * or unknown type alike — renders generically (issuer, source link, payload excerpt), which is
 * exactly why an unknown type like `contract.published` renders as a normal entry here, never
 * a rupture (epistemic contract test 4's first half). Obligations anchor as boxed clauses at
 * the event that accepted them. The two `derivative.published` events' gap is surfaced
 * explicitly (design §3.1).
 */

import type { ProjectionEvent, ProjectionObject, ProjectionObligation } from "../types.js";

export interface LedgerEntry {
  event_id: string;
  event_type: string;
  occurred_at: string;
  issuer: { collective_id: string; actor_id: string };
  source_uri: string;
  source_commit?: string;
  payload_excerpt: Record<string, unknown>;
  obligations_accepted_here: LedgerObligation[];
}

export interface LedgerObligation {
  id: string;
  clause_text: string;
  status: string;
  prominence: string;
}

export interface ProvenanceChainPayload {
  ledger: LedgerEntry[];
  object_refs: Array<{ id: string; canonical_uri: string; local_object_type: string; local_epistemic_status?: string }>;
  derivative_publication_gap_seconds: number | null;
}

/** First few payload keys, verbatim — an "excerpt", not a re-write (design §3.1 "payload
 * excerpt"). Capped so the ledger stays a ledger, not a full payload dump. */
function excerptPayload(payload: Record<string, unknown>): Record<string, unknown> {
  const keys = Object.keys(payload).sort();
  const excerpt: Record<string, unknown> = {};
  for (const key of keys.slice(0, 4)) {
    excerpt[key] = payload[key];
  }
  return excerpt;
}

export function renderProvenanceChain(
  events: ProjectionEvent[],
  objects: ProjectionObject[],
  obligations: ProjectionObligation[]
): ProvenanceChainPayload {
  const ledger: LedgerEntry[] = events.map((event) => ({
    event_id: event.event_id,
    event_type: event.event_type,
    occurred_at: event.occurred_at,
    issuer: event.issuer,
    source_uri: event.source_uri,
    source_commit: event.source_commit,
    payload_excerpt: excerptPayload(event.payload),
    obligations_accepted_here: obligations
      .filter((o) => o.source_event_id === event.event_id)
      .map((o) => ({ id: o.id, clause_text: o.clause_text, status: o.status, prominence: o.prominence }))
  }));

  const derivativeEvents = events.filter((e) => e.event_type === "derivative.published");
  let gapSeconds: number | null = null;
  if (derivativeEvents.length === 2) {
    const [a, b] = derivativeEvents;
    gapSeconds = Math.abs(new Date(b!.occurred_at).getTime() - new Date(a!.occurred_at).getTime()) / 1000;
  }

  return {
    ledger,
    object_refs: objects.map((o) => ({
      id: o.id,
      canonical_uri: o.canonical_uri,
      local_object_type: o.local_object_type,
      local_epistemic_status: o.local_epistemic_status
    })),
    derivative_publication_gap_seconds: gapSeconds
  };
}
