// Types for tools/verify-relay.mjs (contract middle-relay/1, see relay/README.md).

export type Practice = "field" | "atelier" | "studio";
export type Repo = "field-research" | "ulysses" | "studio";
export type RelationKind = "built_on" | "answered" | "noted";
export type HandoffStatus = "open" | "taken" | "declined" | "lapsed";
/** Where a programme entry's question came from: cycle.json's `source`, plus "convening". */
export type ProgrammeSource = "defaults" | "seed" | "continuing" | "convening";

export interface Ref {
  repo: Repo;
  path: string;
  commit: string;
}

export interface Relation {
  id: string;
  date: string;
  giver: Practice;
  taker: Practice;
  kind: RelationKind;
  what: string;
  thread: string | null;
  giver_ref: Ref;
  taker_ref: Ref;
  /** Optional, additive: id of an earlier relation this one corrects. */
  corrects?: string | null;
}

export interface Pointer {
  practice: Practice;
  date: string;
  relation: string;
}

export interface Handoff {
  id: string;
  offered_on: string;
  giver: Practice;
  to: Practice[];
  offer: string;
  ref: Ref;
  status: HandoffStatus;
  taken_by: Pointer | null;
  /** Optional, additive: required when status is "declined". */
  declined_by?: Pointer | null;
}

/** A practice's bulletin line "Proposed question: …" with its "Docks onto: …" line, verbatim. */
export interface Proposal {
  practice: Practice;
  /** at most 200 characters */
  question: string;
  /** at most 300 characters */
  docks_onto: string;
  date: string;
  /** the practice's BULLETIN.md at the commit that first holds the lines */
  ref: Ref;
}

/** A practice's bulletin line "Ranking: Studio > Field > Atelier": all three practices, best first. */
export interface Ranking {
  practice: Practice;
  /** the three practices, each once, best first */
  order: Practice[];
  date: string;
  ref: Ref;
}

/** The Borda tally, set once. */
export interface ConveningResult {
  question: string;
  proposed_by: Practice;
  scores: Record<Practice, number>;
  tallied_on: string;
  rule: "borda";
}

export interface Convening {
  /** the cycle whose three presentations closed before this convening */
  after_cycle: number;
  /** the day of the first proposal recorded for it */
  opened: string;
  proposals: Proposal[];
  rankings: Ranking[];
  result: ConveningResult | null;
}

/** A practice's "For the programme: …" line from its presentation summary, verbatim. */
export interface Finding {
  practice: Practice;
  /** at most 240 characters */
  line: string;
  /** presentations/cycle-NNN/SUMMARY.md in the practice's repository */
  ref: Ref;
}

export interface ProgrammeEntry {
  cycle: number;
  /** the cycle's question; null only while source is "defaults" (the practices' own themes) */
  question: string | null;
  source: ProgrammeSource;
  opened: string;
  /** the day the next cycle opened; set once */
  closed: string | null;
  findings: Finding[];
}

export interface RelayDoc {
  $contract: "middle-relay/1";
  generated_at: string;
  cycle: number;
  question: string;
  period: { from: string; to: string };
  relations: Relation[];
  handoffs: Handoff[];
  counts: { built_on: number; answered: number; noted: number; open_handoffs: number };
  /** Optional, additive (since 2026-10-07): the practices' negotiation of the next question. */
  convening?: Convening | null;
  /** Optional, additive (since 2026-10-07): one entry per research cycle, oldest first, append-only. */
  programme?: ProgrammeEntry[];
}

export interface CollectedRef extends Ref {
  key: string;
  where: string[];
}

export interface Tally {
  scores: Record<Practice, number>;
  /** how many rankings put each practice first */
  firstPlaces: Record<Practice, number>;
  /** the winning practice after the tie rule; null while there is no ranking */
  winner: Practice | null;
  /** the practices tied on the top Borda score before the tie rule decided (empty when there is no tie) */
  tied: Practice[];
}

export const CONTRACT: "middle-relay/1";
export const PRACTICES: Practice[];
export const REPO_OF: Record<Practice, Repo>;
export const REPOS: Repo[];
export const KINDS: RelationKind[];
export const UPTAKE_KINDS: RelationKind[];
export const STATUSES: HandoffStatus[];
export const LAPSE_DAYS: number;
export const WHAT_MAX: number;
export const OFFER_MAX: number;
export const SOURCES: ProgrammeSource[];
export const PROPOSAL_QUESTION_MAX: number;
export const DOCKS_MAX: number;
export const FINDING_MAX: number;
export const CYCLE_QUESTION_MAX: number;
export const BORDA_POINTS: number[];
export const RESULT_AFTER_DAYS: number;
export const BULLETIN_PATH: "BULLETIN.md";
export function summaryPath(cycle: number): string;

export function isDate(s: unknown): boolean;
export function daysBetween(a: string, b: string): number;
export function validateRelay(doc: unknown): { errors: string[]; warnings: string[] };
export function compareWithBase(doc: unknown, base: unknown): string[];
export function tallyConvening(convening: unknown): Tally;
export function resultIsDue(convening: unknown, on: string): boolean;
export function collectRefs(doc: unknown): CollectedRef[];
export function sampleEvenly<T>(items: T[], n: number): T[];
export function rawUrl(ref: Ref): string;
export function checkRefsOnline(
  refs: CollectedRef[],
  options?: { fetchImpl?: typeof fetch; concurrency?: number; timeoutMs?: number }
): Promise<{ errors: string[]; warnings: string[]; verified: number }>;
