// Types for tools/verify-relay.mjs (contract middle-relay/1, see relay/README.md).

export type Practice = "field" | "atelier" | "studio";
export type Repo = "field-research" | "ulysses" | "studio";
export type RelationKind = "built_on" | "answered" | "noted";
export type HandoffStatus = "open" | "taken" | "declined" | "lapsed";

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

export interface RelayDoc {
  $contract: "middle-relay/1";
  generated_at: string;
  cycle: number;
  question: string;
  period: { from: string; to: string };
  relations: Relation[];
  handoffs: Handoff[];
  counts: { built_on: number; answered: number; noted: number; open_handoffs: number };
}

export interface CollectedRef extends Ref {
  key: string;
  where: string[];
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

export function isDate(s: unknown): boolean;
export function daysBetween(a: string, b: string): number;
export function validateRelay(doc: unknown): { errors: string[]; warnings: string[] };
export function compareWithBase(doc: unknown, base: unknown): string[];
export function collectRefs(doc: unknown): CollectedRef[];
export function sampleEvenly<T>(items: T[], n: number): T[];
export function rawUrl(ref: Ref): string;
export function checkRefsOnline(
  refs: CollectedRef[],
  options?: { fetchImpl?: typeof fetch; concurrency?: number; timeoutMs?: number }
): Promise<{ errors: string[]; warnings: string[]; verified: number }>;
