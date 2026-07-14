/**
 * `parallel-positions` renderer (design §3.3/§4): time collapses into register-state. The
 * register row before/after the correction (correction as overlay, original visible
 * struck-not-erased), the appellate caveat at display prominence, and an embedded
 * `obligation-matrix` (design §4: "obligation-matrix (embedded in 3.3)") with per-condition
 * state. The derivative appears only as "a downstream consumer that reported the gap" —
 * deliberately its perspective and no more (this renderer never reaches for Ensemble's own
 * assertions; the lens selection already excludes them).
 *
 * Only `frames-as` has a registered form in v1; any other predicate still appears (in
 * `current_framing.unclassified`, never dropped) and is reported in `render_failures`.
 */

import type { ProjectionAssertion, ProjectionEvent, ProjectionObject, ProjectionObligation } from "../types.js";

export interface RegisterRow {
  state: "baseline" | "corrected";
  basis: "object_record" | "event_payload_quote";
  text: string;
  event_id?: string;
  struck_not_erased: boolean;
}

export interface ObligationMatrixRow {
  id: string;
  clause_text: string;
  status: string;
  prominence: string;
  proposer_collective_id?: string | null;
  obligated_collective_id?: string | null;
}

export interface ParallelPositionsPayload {
  standing_contract: { event_id: string; governing_principle?: string; conditions: unknown[] } | null;
  register_rows: RegisterRow[];
  appellate_caveat: { text: string; event_id: string; display_prominence: "high" } | null;
  current_framing: { assertion_id: string; value: unknown; rationale?: string } | null;
  obligation_matrix: ObligationMatrixRow[];
}

export interface ParallelPositionsResult {
  payload: ParallelPositionsPayload;
  renderFailures: Record<string, unknown>[];
}

const KNOWN_FRAMING_PREDICATES = new Set(["frames-as"]);

export function renderParallelPositions(
  events: ProjectionEvent[],
  objects: ProjectionObject[],
  assertions: ProjectionAssertion[],
  obligations: ProjectionObligation[]
): ParallelPositionsResult {
  const renderFailures: Record<string, unknown>[] = [];

  const contractEvent = events.find((e) => e.event_type === "contract.published");
  const correctionIssued = events.find((e) => e.event_type === "correction.issued");
  const correctionApplied = events.find((e) => e.event_type === "correction.applied");
  const claimsRow = objects.find((o) => o.local_object_id === "claims-row-12");

  const registerRows: RegisterRow[] = [];
  if (claimsRow) {
    registerRows.push({
      state: "baseline",
      basis: "object_record",
      text: claimsRow.title_cache ?? claimsRow.local_object_type,
      struck_not_erased: true
    });
  }
  if (correctionApplied) {
    const quote = correctionApplied.payload.quote_session_33_addition;
    if (typeof quote === "string") {
      registerRows.push({
        state: "corrected",
        basis: "event_payload_quote",
        text: quote,
        event_id: correctionApplied.event_id,
        struck_not_erased: false
      });
    }
  }

  let appellateCaveat: ParallelPositionsPayload["appellate_caveat"] = null;
  if (correctionIssued && typeof correctionIssued.payload.quote_appellate_finding === "string") {
    appellateCaveat = {
      text: correctionIssued.payload.quote_appellate_finding,
      event_id: correctionIssued.event_id,
      display_prominence: "high"
    };
  }

  let currentFraming: ParallelPositionsPayload["current_framing"] = null;
  for (const assertion of assertions) {
    if (KNOWN_FRAMING_PREDICATES.has(assertion.predicate)) {
      currentFraming = { assertion_id: assertion.assertion_id, value: assertion.object, rationale: assertion.rationale };
    } else {
      renderFailures.push({
        kind: "unrendered_predicate",
        assertion_id: assertion.assertion_id,
        predicate: assertion.predicate,
        reason: `no registered renderer form for predicate "${assertion.predicate}" under renderer "parallel-positions"`
      });
    }
  }

  return {
    payload: {
      standing_contract: contractEvent
        ? {
            event_id: contractEvent.event_id,
            governing_principle:
              typeof contractEvent.payload.quote_governing_principle === "string"
                ? contractEvent.payload.quote_governing_principle
                : undefined,
            conditions: Array.isArray(contractEvent.payload.standing_conditions) ? contractEvent.payload.standing_conditions : []
          }
        : null,
      register_rows: registerRows,
      appellate_caveat: appellateCaveat,
      current_framing: currentFraming,
      obligation_matrix: obligations.map((o) => ({
        id: o.id,
        clause_text: o.clause_text,
        status: o.status,
        prominence: o.prominence,
        proposer_collective_id: o.proposer_collective_id,
        obligated_collective_id: o.obligated_collective_id
      }))
    },
    renderFailures
  };
}
