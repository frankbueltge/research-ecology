/**
 * Narrative beat types + structural validation (work order phase-3d §2: "die Beats sind ein
 * redaktionelles Datenobjekt (`narratives/enc-2026-001.json`), schema-frei aber validiert im
 * Code"). Deliberately universal (no `node:fs`, no server-only import) so it can be imported
 * both by the server-only loader (`$lib/server/narrative.ts`) AND by the `/` route's Svelte
 * component, which is a universal (server+client) module — SvelteKit forbids importing
 * `$lib/server/*` from client-reachable code, so the pure types/helpers live here instead.
 *
 * This module does NOT check the beats' quotes against the fixture payloads (that is a
 * separate, explicit test concern — `tests/unit/narrative.test.ts` — not a structural-shape
 * concern); it only guarantees every field the UI needs is present and non-empty.
 */

export interface NarrativeAkteLink {
  eventId: string;
  eventType: string;
}

export interface NarrativeQuoteBeat {
  id: string;
  heading: string;
  quote: string;
  attribution: string;
  akte: NarrativeAkteLink;
}

export interface NarrativeDivergenceMiniature {
  leftLabel: string;
  leftQuote: string;
  rightLabel: string;
  rightQuote: string;
  closing: string;
}

export interface NarrativeDivergenceBeat {
  id: string;
  heading: string;
  divergence: NarrativeDivergenceMiniature;
}

export type NarrativeBeat = NarrativeQuoteBeat | NarrativeDivergenceBeat;

export interface Narrative {
  encounter_id: string;
  /** The editorial one-sentence entrance headline — single source for app AND site export;
   * the app dictionary's poster.headline is only the fallback. English-only (2026-07-15: the
   * ecology stack dropped German — see i18n/dictionary.ts). */
  headline?: string;
  authored_by: string;
  approval: "pending" | "approved";
  beats: NarrativeBeat[];
}

export function isDivergenceBeat(beat: NarrativeBeat): beat is NarrativeDivergenceBeat {
  return "divergence" in beat;
}

const EXPECTED_BEAT_COUNT = 6;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function requireNonEmptyString(value: unknown, path: string, errors: string[]): void {
  if (!isNonEmptyString(value)) errors.push(`${path}: expected a non-empty string`);
}

/**
 * Structural validation only (shape, non-emptiness) — throws a single descriptive `Error`
 * listing every problem found, rather than failing on the first one, so a malformed authored
 * data object is easy to fix in one pass.
 */
export function validateNarrative(data: unknown, sourceLabel: string): Narrative {
  const errors: string[] = [];

  if (!data || typeof data !== "object") {
    throw new Error(`${sourceLabel}: expected a JSON object at the top level`);
  }
  const record = data as Record<string, unknown>;

  if (!isNonEmptyString(record.encounter_id)) errors.push("encounter_id: expected a non-empty string");
  if (!isNonEmptyString(record.authored_by)) errors.push("authored_by: expected a non-empty string");
  if (record.approval !== "pending" && record.approval !== "approved") {
    errors.push(`approval: expected "pending" or "approved", got ${JSON.stringify(record.approval)}`);
  }

  const beats = record.beats;
  if (!Array.isArray(beats)) {
    errors.push("beats: expected an array");
  } else if (beats.length !== EXPECTED_BEAT_COUNT) {
    errors.push(`beats: expected exactly ${EXPECTED_BEAT_COUNT} beats, got ${beats.length}`);
  } else {
    beats.forEach((beat, i) => {
      const path = `beats[${i}]`;
      if (!beat || typeof beat !== "object") {
        errors.push(`${path}: expected an object`);
        return;
      }
      const b = beat as Record<string, unknown>;
      if (!isNonEmptyString(b.id)) errors.push(`${path}.id: expected a non-empty string`);
      requireNonEmptyString(b.heading, `${path}.heading`, errors);

      const isLastBeat = i === beats.length - 1;
      if (isLastBeat) {
        if (!b.divergence || typeof b.divergence !== "object") {
          errors.push(`${path}.divergence: expected an object (final beat is the divergence miniature)`);
        } else {
          const d = b.divergence as Record<string, unknown>;
          requireNonEmptyString(d.leftLabel, `${path}.divergence.leftLabel`, errors);
          requireNonEmptyString(d.rightLabel, `${path}.divergence.rightLabel`, errors);
          requireNonEmptyString(d.closing, `${path}.divergence.closing`, errors);
          if (!isNonEmptyString(d.leftQuote)) errors.push(`${path}.divergence.leftQuote: expected a non-empty string`);
          if (!isNonEmptyString(d.rightQuote)) errors.push(`${path}.divergence.rightQuote: expected a non-empty string`);
        }
      } else {
        if (!isNonEmptyString(b.quote)) errors.push(`${path}.quote: expected a non-empty string`);
        requireNonEmptyString(b.attribution, `${path}.attribution`, errors);
        if (!b.akte || typeof b.akte !== "object") {
          errors.push(`${path}.akte: expected an object`);
        } else {
          const a = b.akte as Record<string, unknown>;
          if (!isNonEmptyString(a.eventId)) errors.push(`${path}.akte.eventId: expected a non-empty string`);
          if (!isNonEmptyString(a.eventType)) errors.push(`${path}.akte.eventType: expected a non-empty string`);
        }
      }
    });
  }

  if (errors.length > 0) {
    throw new Error(`${sourceLabel}: invalid narrative data object —\n  ${errors.join("\n  ")}`);
  }

  return data as unknown as Narrative;
}
