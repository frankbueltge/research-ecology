/**
 * Builds the map version's `accessible_summary`: a genuine, standalone textual account of the
 * map (design §4: "also the map version's accessible_summary" / work order critical rule —
 * "not a template stub"). Composed entirely from the selected records passed in; nothing here
 * reads the clock or any external state, so it stays deterministic (work order critical rule).
 *
 * Deliberately avoids `toLocaleDateString`/`Intl` (locale/timezone-dependent, therefore not
 * guaranteed deterministic across environments) — dates are sliced straight off the ISO
 * `occurred_at` string.
 */

import type {
  ProjectionAssertion,
  ProjectionEncounter,
  ProjectionEvent,
  ProjectionLens,
  ProjectionObligation,
  ProjectionParticipant
} from "./types.js";

function isoDate(iso: string): string {
  return iso.slice(0, 10);
}

function participantClause(p: ProjectionParticipant): string {
  const who = p.collective_id ?? p.actor_id;
  const status = p.local_status ? ` — "${p.local_status}"` : "";
  return `${who} (${p.role})${status}`;
}

function eventClause(e: ProjectionEvent): string {
  const day = isoDate(e.occurred_at);
  return `${day}: ${e.issuer.collective_id} issued ${e.event_type}`;
}

function assertionClause(a: ProjectionAssertion): string {
  const who = a.author.collective_id ?? a.author.actor_id;
  return `${who} asserts "${a.predicate}"${a.local_epistemic_status ? ` (${a.local_epistemic_status})` : ""}`;
}

function obligationClause(o: ProjectionObligation): string {
  return `"${o.clause_text}" — ${o.status}${o.prominence === "load_bearing" ? ", load-bearing" : ""}`;
}

export function buildAccessibleSummary(params: {
  lens: ProjectionLens;
  encounter: ProjectionEncounter;
  participants: ProjectionParticipant[];
  watermark: string;
  selectedEvents: ProjectionEvent[];
  selectedAssertions: ProjectionAssertion[];
  selectedObligations: ProjectionObligation[];
  exclusions: Record<string, unknown>[];
  renderFailures: Record<string, unknown>[];
}): string {
  const { lens, encounter, participants, watermark, selectedEvents, selectedAssertions, selectedObligations, exclusions, renderFailures } =
    params;

  const sentences: string[] = [];

  // Who.
  const who = participants.length > 0 ? participants.map(participantClause).join("; ") : "no registered participants";
  sentences.push(
    `${lens.name} (${lens.lens_id}@${lens.version}), rendered by ${lens.renderer}, is one lens on "${encounter.title ?? encounter.encounter_id}": ${who}.`
  );

  // What moved.
  if (selectedEvents.length > 0) {
    const first = selectedEvents[0]!;
    const last = selectedEvents[selectedEvents.length - 1]!;
    sentences.push(
      `${selectedEvents.length} event${selectedEvents.length === 1 ? "" : "s"} are in view, from ${isoDate(first.occurred_at)} ` +
        `(${first.event_type}) to ${isoDate(last.occurred_at)} (${last.event_type}): ${selectedEvents.map(eventClause).join("; ")}.`
    );
  } else {
    sentences.push("No events are selected by this lens.");
  }

  // What changed (assertions + obligations).
  if (selectedAssertions.length > 0) {
    sentences.push(`Authored positions in view: ${selectedAssertions.map(assertionClause).join("; ")}.`);
  }
  if (selectedObligations.length > 0) {
    sentences.push(`Standing obligations in view: ${selectedObligations.map(obligationClause).join("; ")}.`);
  }

  // What is unresolved.
  if (encounter.shared_resolution === null) {
    sentences.push(
      encounter.resolution_note
        ? `No shared resolution exists across this encounter: ${encounter.resolution_note}`
        : "No shared resolution exists across this encounter; participant-specific statuses stay distinct rather than being flattened into one."
    );
  }

  // What this lens excludes.
  if (exclusions.length > 0) {
    const exclusionText = exclusions
      .map((e) => (typeof e.reason === "string" ? e.reason : JSON.stringify(e)))
      .join(" ");
    sentences.push(`What this lens excludes: ${exclusionText}`);
  }

  // Render failures (rupture blocks), never silently absorbed into the prose above.
  if (renderFailures.length > 0) {
    sentences.push(
      `${renderFailures.length} record${renderFailures.length === 1 ? "" : "s"} could not be given a specific rendered ` +
        `form and appear as rupture entries instead of being dropped: ${renderFailures
          .map((r) => (typeof r.reason === "string" ? r.reason : JSON.stringify(r)))
          .join(" ")}`
    );
  }

  sentences.push(`Generated against event watermark ${watermark}.`);

  return sentences.join(" ");
}
