#!/usr/bin/env node
// tools/verify-relay.mjs — the contract guard of The Middle's relay desk.
//
// relay/relay.json (contract "middle-relay/1", documented in relay/README.md) is written each
// night by the Middle Relay routine and read by the site, which shows the practices their open
// handoffs at session open. Nobody approves a night by hand, so this script is the signature:
// a file that fails it is not committed by the routine and not landed by auto-land.
//
// Since 2026-10-07 the contract carries two further, optional sections: `programme` (one entry
// per research cycle, with the practices' findings) and `convening` (the three practices'
// negotiation of the next question between cycles: proposals, rankings and a Borda result).
// Both are checked here, including the tally itself (Borda, with the tie rule of relay/README.md).
//
// Usage:
//   node tools/verify-relay.mjs [--file relay/relay.json] [--base old-relay.json]
//                               [--online] [--sample N] [--all-refs] [--quiet]
//
//   --file      the relay file to check (default: relay/relay.json next to this tool)
//   --base      an earlier version of the file (e.g. main's): enforces append-only — no past
//               relation edited or deleted, no handoff deleted or reopened, period.to and
//               cycle never moving backwards; no proposal or ranking of a convening edited or
//               removed, its result never changed; no programme entry removed, reordered or
//               edited (closed is set once, findings are only appended)
//   --online    also check that every evidence ref exists: HEAD (then GET) on
//               https://raw.githubusercontent.com/frankbueltge/<repo>/<commit>/<path>.
//               With --base, only refs that are new against the base are checked
//               (--all-refs checks every ref). A 404 is a contract error; a rate limit,
//               a 403/5xx or a network failure is reported as "unverified", never as an error.
//   --sample N  with --online: check at most N refs (an evenly spaced, deterministic sample)
//   --quiet     print errors only
//
// Exit codes: 0 = contract holds · 1 = contract errors (or a ref that 404s online) · 2 = usage/IO
// Node >= 22, no dependencies. The functions are exported for tests/contract/relay*.test.ts.

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const CONTRACT = "middle-relay/1";
export const PRACTICES = ["field", "atelier", "studio"];
export const REPO_OF = { field: "field-research", atelier: "ulysses", studio: "studio" };
export const REPOS = Object.values(REPO_OF);
export const KINDS = ["built_on", "answered", "noted"];
export const UPTAKE_KINDS = ["built_on", "answered"];
export const STATUSES = ["open", "taken", "declined", "lapsed"];
export const LAPSE_DAYS = 21;
export const WHAT_MAX = 140;
export const OFFER_MAX = 160;

// -- the convening and the programme (since 2026-10-07) ----------------------------------------
/** Where a programme entry's question came from; the values of cycle.json's `source`, plus "convening". */
export const SOURCES = ["defaults", "seed", "continuing", "convening"];
export const PROPOSAL_QUESTION_MAX = 200;
export const DOCKS_MAX = 300;
export const FINDING_MAX = 240;
/** A seed is at most 500 characters (the site's seed gate), and a cycle's question is a seed or shorter. */
export const CYCLE_QUESTION_MAX = 500;
/** Borda points by place: first 2, second 1, third 0. */
export const BORDA_POINTS = [2, 1, 0];
/** With at least two rankings, a convening is tallied once it has been open this many days. */
export const RESULT_AFTER_DAYS = 3;
/** The file a proposal or a ranking lives in, in the practice's own repository. */
export const BULLETIN_PATH = "BULLETIN.md";
/** The presentation summary of a cycle, which carries a practice's "For the programme:" line. */
export const summaryPath = (cycle) => `presentations/cycle-${String(cycle).padStart(3, "0")}/SUMMARY.md`;

const TOP_KEYS = ["$contract", "generated_at", "cycle", "question", "period", "relations", "handoffs", "counts"];
const TOP_OPTIONAL = ["convening", "programme"];
const RELATION_KEYS = ["id", "date", "giver", "taker", "kind", "what", "thread", "giver_ref", "taker_ref"];
const RELATION_OPTIONAL = ["corrects"];
const HANDOFF_KEYS = ["id", "offered_on", "giver", "to", "offer", "ref", "status", "taken_by"];
const HANDOFF_OPTIONAL = ["declined_by"];
const REF_KEYS = ["repo", "path", "commit"];
const COUNT_KEYS = ["built_on", "answered", "noted", "open_handoffs"];
const CONVENING_KEYS = ["after_cycle", "opened", "proposals", "rankings", "result"];
const PROPOSAL_KEYS = ["practice", "question", "docks_onto", "date", "ref"];
const RANKING_KEYS = ["practice", "order", "date", "ref"];
const RESULT_KEYS = ["question", "proposed_by", "scores", "tallied_on", "rule"];
const PROGRAMME_KEYS = ["cycle", "question", "source", "opened", "closed", "findings"];
const FINDING_KEYS = ["practice", "line", "ref"];

const REL_ID = /^rel-(\d{4}-\d{2}-\d{2})-(field|atelier|studio)-([1-9]\d*)$/;
const HO_ID = /^ho-(\d{4}-\d{2}-\d{2})-(field|atelier|studio)-([1-9]\d*)$/;
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SHA = /^[0-9a-f]{7,40}$/;
const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;

const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

/** A real calendar date written YYYY-MM-DD. */
export function isDate(s) {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

/** Whole days from a to b (both YYYY-MM-DD). */
export function daysBetween(a, b) {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);
}

function checkKeys(obj, required, optional, where, errors) {
  for (const k of required) if (!(k in obj)) errors.push(`${where}: missing field "${k}"`);
  for (const k of Object.keys(obj)) {
    if (!required.includes(k) && !optional.includes(k)) errors.push(`${where}: unknown field "${k}"`);
  }
}

function checkText(v, max, where, errors) {
  if (typeof v !== "string" || v.trim() === "") return errors.push(`${where}: must be a non-empty string`);
  if (v.length > max) errors.push(`${where}: ${v.length} characters, at most ${max}`);
  if (/[\r\n]/.test(v)) errors.push(`${where}: must be one line`);
}

function checkRef(ref, where, expectedRepo, errors) {
  if (!isObj(ref)) return errors.push(`${where}: must be an object {repo, path, commit}`);
  checkKeys(ref, REF_KEYS, [], where, errors);
  if (!REPOS.includes(ref.repo)) errors.push(`${where}.repo: "${ref.repo}" is not one of ${REPOS.join(", ")}`);
  else if (expectedRepo && ref.repo !== expectedRepo) {
    errors.push(`${where}.repo: "${ref.repo}" does not belong to this practice (expected "${expectedRepo}")`);
  }
  const p = ref.path;
  if (typeof p !== "string" || p === "" || p !== p.trim()) errors.push(`${where}.path: must be a non-empty repo-relative path`);
  else if (p.startsWith("/") || p.endsWith("/") || p.includes("\\") || p.split("/").some((s) => s === "" || s === "." || s === "..")) {
    errors.push(`${where}.path: "${p}" must be a repo-relative path to a file (no leading or trailing slash, no . or ..)`);
  }
  if (typeof ref.commit !== "string" || !SHA.test(ref.commit)) errors.push(`${where}.commit: must be a hex commit sha of 7 to 40 characters`);
}

function checkPointer(ptr, where, h, relById, errors, { uptake }) {
  if (!isObj(ptr)) return errors.push(`${where}: must be an object {practice, date, relation}`);
  checkKeys(ptr, ["practice", "date", "relation"], [], where, errors);
  if (!Array.isArray(h.to) || !h.to.includes(ptr.practice)) errors.push(`${where}.practice: "${ptr.practice}" is not an addressee of this handoff`);
  if (!isDate(ptr.date)) errors.push(`${where}.date: "${ptr.date}" is not a YYYY-MM-DD date`);
  else if (isDate(h.offered_on) && ptr.date < h.offered_on) errors.push(`${where}.date: ${ptr.date} is before offered_on ${h.offered_on}`);
  const rel = relById.get(ptr.relation);
  if (!rel) return errors.push(`${where}.relation: "${ptr.relation}" is not a relation in this file`);
  if (rel.taker !== ptr.practice) errors.push(`${where}.relation: ${ptr.relation} was not made by ${ptr.practice}`);
  if (rel.giver !== h.giver) errors.push(`${where}.relation: ${ptr.relation} does not name the giver ${h.giver}`);
  if (rel.date !== ptr.date) errors.push(`${where}.date: ${ptr.date} differs from the relation's date ${rel.date}`);
  if (uptake && !UPTAKE_KINDS.includes(rel.kind)) errors.push(`${where}.relation: ${ptr.relation} is "${rel.kind}"; uptake needs built_on or answered`);
}

// -- the convening: tally and validation ---------------------------------------------------------

const isPractice = (p) => PRACTICES.includes(p);
const repoOf = (p) => (isPractice(p) ? REPO_OF[p] : undefined);
const validRankings = (convening) => (Array.isArray(convening?.rankings) ? convening.rankings : []).filter((r) => isObj(r) && isPractice(r.practice));

/**
 * The tally of a convening: Borda over the rankings present (first place 2, second 1, third 0).
 * Ties go to the proposal ranked first by more practices, then to the earliest proposal (by date,
 * then by practice order field, atelier, studio). Pure and tolerant: malformed parts are skipped
 * (validateRelay reports them) and nothing throws. `winner` is null while there is no ranking.
 * @returns {{ scores: Record<string, number>, firstPlaces: Record<string, number>, winner: string | null, tied: string[] }}
 */
export function tallyConvening(convening) {
  const proposals = new Map(
    (Array.isArray(convening?.proposals) ? convening.proposals : []).filter((p) => isObj(p) && isPractice(p.practice)).map((p) => [p.practice, p])
  );
  const rankings = (Array.isArray(convening?.rankings) ? convening.rankings : []).filter((r) => isObj(r) && Array.isArray(r.order));
  const scores = Object.fromEntries(PRACTICES.map((p) => [p, 0]));
  const firstPlaces = Object.fromEntries(PRACTICES.map((p) => [p, 0]));
  for (const r of rankings) {
    r.order.slice(0, BORDA_POINTS.length).forEach((p, i) => {
      if (isPractice(p)) scores[p] += BORDA_POINTS[i];
    });
    if (isPractice(r.order[0])) firstPlaces[r.order[0]] += 1;
  }
  const candidates = PRACTICES.filter((p) => proposals.has(p));
  const best = Math.max(-1, ...candidates.map((p) => scores[p]));
  const tied = candidates.filter((p) => scores[p] === best);
  const dateOf = (p) => String(proposals.get(p)?.date ?? "");
  const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
  const ordered = [...tied].sort(
    (a, b) => firstPlaces[b] - firstPlaces[a] || cmp(dateOf(a), dateOf(b)) || PRACTICES.indexOf(a) - PRACTICES.indexOf(b)
  );
  return { scores, firstPlaces, winner: rankings.length > 0 ? (ordered[0] ?? null) : null, tied: tied.length > 1 ? tied : [] };
}

/**
 * Whether the tally of a convening is due on a day (YYYY-MM-DD): all three rankings stand, or at
 * least two stand and the convening has been open RESULT_AFTER_DAYS days or more.
 */
export function resultIsDue(convening, on) {
  const ranked = new Set(validRankings(convening).map((r) => r.practice));
  if (ranked.size >= PRACTICES.length) return true;
  return ranked.size >= 2 && isDate(convening?.opened) && isDate(on) && daysBetween(convening.opened, on) >= RESULT_AFTER_DAYS;
}

/** A date written YYYY-MM-DD that lies inside the period. Returns whether it is a date at all. */
function checkDateIn(d, from, to, where, errors) {
  if (!isDate(d)) {
    errors.push(`${where}: must be a YYYY-MM-DD date`);
    return false;
  }
  if ((from && d < from) || (to && d > to)) errors.push(`${where}: ${d} lies outside the period ${from} … ${to}`);
  return true;
}

/** A proposal's or ranking's ref names the practice's own BULLETIN.md at a commit. */
function checkBulletinRef(ref, where, practice, errors) {
  checkRef(ref, where, repoOf(practice), errors);
  if (isObj(ref) && typeof ref.path === "string" && ref.path !== BULLETIN_PATH) {
    errors.push(`${where}.path: "${ref.path}" must be ${BULLETIN_PATH}, the practice's bulletin`);
  }
}

function validateConvening(c, { from, to, cycle }, errors) {
  if (c === undefined || c === null) return;
  if (!isObj(c)) return errors.push(`convening: must be null or an object`);
  checkKeys(c, CONVENING_KEYS, [], "convening", errors);

  if (!Number.isInteger(c.after_cycle) || c.after_cycle < 1) errors.push(`convening.after_cycle: must be a positive integer`);
  else if (cycle !== null && c.after_cycle > cycle) {
    errors.push(`convening.after_cycle: ${c.after_cycle} is later than the file's cycle ${cycle}; a convening follows a cycle that has happened`);
  }
  const opened = checkDateIn(c.opened, from, to, "convening.opened", errors) ? c.opened : null;

  // -- proposals: at most one per practice, the first one stands -----------------------------
  if (!Array.isArray(c.proposals)) errors.push(`convening.proposals: must be an array`);
  const proposals = Array.isArray(c.proposals) ? c.proposals : [];
  const proposed = new Map();
  proposals.forEach((p, i) => {
    const where = `convening.proposals[${i}]${isObj(p) && typeof p.practice === "string" ? ` (${p.practice})` : ""}`;
    if (!isObj(p)) return errors.push(`${where}: must be an object`);
    checkKeys(p, PROPOSAL_KEYS, [], where, errors);
    if (!isPractice(p.practice)) errors.push(`${where}.practice: "${p.practice}" is not one of ${PRACTICES.join(", ")}`);
    else if (proposed.has(p.practice)) errors.push(`${where}.practice: ${p.practice} already has a proposal; the first one stands`);
    else proposed.set(p.practice, p);
    checkText(p.question, PROPOSAL_QUESTION_MAX, `${where}.question`, errors);
    checkText(p.docks_onto, DOCKS_MAX, `${where}.docks_onto`, errors);
    checkDateIn(p.date, from, to, `${where}.date`, errors);
    checkBulletinRef(p.ref, `${where}.ref`, p.practice, errors);
  });
  if (Array.isArray(c.proposals) && proposals.length === 0) {
    errors.push(`convening.proposals: a convening is opened by its first proposal; it cannot be empty`);
  }
  const proposalDates = [...proposed.values()].map((p) => p.date).filter(isDate).sort();
  if (opened && proposalDates.length > 0 && opened !== proposalDates[0]) {
    errors.push(`convening.opened: ${opened} is not the day of the first proposal (${proposalDates[0]})`);
  }
  const allProposed = PRACTICES.every((p) => proposed.has(p));
  const lastProposal = allProposed && proposalDates.length === PRACTICES.length ? proposalDates[proposalDates.length - 1] : null;

  // -- rankings: at most one per practice, valid only once all three proposals stand ------------
  if (!Array.isArray(c.rankings)) errors.push(`convening.rankings: must be an array`);
  const rankings = Array.isArray(c.rankings) ? c.rankings : [];
  const ranked = new Map();
  rankings.forEach((r, i) => {
    const where = `convening.rankings[${i}]${isObj(r) && typeof r.practice === "string" ? ` (${r.practice})` : ""}`;
    if (!isObj(r)) return errors.push(`${where}: must be an object`);
    checkKeys(r, RANKING_KEYS, [], where, errors);
    if (!isPractice(r.practice)) errors.push(`${where}.practice: "${r.practice}" is not one of ${PRACTICES.join(", ")}`);
    else if (ranked.has(r.practice)) errors.push(`${where}.practice: ${r.practice} already has a ranking; the first one stands`);
    else ranked.set(r.practice, r);
    const o = r.order;
    if (!Array.isArray(o) || o.length !== PRACTICES.length || new Set(o).size !== o.length || !o.every(isPractice)) {
      errors.push(`${where}.order: must list the three practices once each, best first (${PRACTICES.join(", ")})`);
    }
    if (checkDateIn(r.date, from, to, `${where}.date`, errors) && lastProposal && r.date < lastProposal) {
      errors.push(`${where}.date: ${r.date} is before the third proposal stood (${lastProposal})`);
    }
    checkBulletinRef(r.ref, `${where}.ref`, r.practice, errors);
  });
  if (rankings.length > 0 && !allProposed) {
    errors.push(`convening.rankings: a ranking is valid only once all three proposals stand (${proposed.size} of ${PRACTICES.length} do)`);
  }

  // -- result: set once, only when its condition holds, and exactly the Borda tally ---------------
  const res = c.result;
  if (res === null || res === undefined) {
    if (to && resultIsDue({ opened, rankings: [...ranked.values()] }, to)) {
      errors.push(
        `convening.result: the tally is due on ${to} (${ranked.size} of ${PRACTICES.length} rankings, opened ${opened ?? "?"}); the relay sets the result`
      );
    }
    return;
  }
  const where = "convening.result";
  if (!isObj(res)) return errors.push(`${where}: must be null or an object`);
  checkKeys(res, RESULT_KEYS, [], where, errors);
  if (res.rule !== "borda") errors.push(`${where}.rule: must be "borda"`);
  const tallied = checkDateIn(res.tallied_on, from, to, `${where}.tallied_on`, errors) ? res.tallied_on : null;
  if (tallied) {
    const aged = ranked.size >= 2 && opened !== null && daysBetween(opened, tallied) >= RESULT_AFTER_DAYS;
    if (ranked.size < PRACTICES.length && !aged) {
      errors.push(
        `${where}: tallied on ${tallied} with ${ranked.size} of ${PRACTICES.length} rankings` +
          (opened ? `, ${daysBetween(opened, tallied)} day(s) after the convening opened` : "") +
          `; a result needs all three rankings, or two and ${RESULT_AFTER_DAYS} days`
      );
    }
    for (const r of ranked.values()) {
      if (isDate(r.date) && r.date > tallied) errors.push(`${where}.tallied_on: ${tallied} is before the ranking of ${r.practice} (${r.date})`);
    }
  }
  checkText(res.question, PROPOSAL_QUESTION_MAX, `${where}.question`, errors);
  if (!isPractice(res.proposed_by)) errors.push(`${where}.proposed_by: "${res.proposed_by}" is not one of ${PRACTICES.join(", ")}`);
  const tally = tallyConvening({ proposals: [...proposed.values()], rankings: [...ranked.values()] });
  if (!isObj(res.scores)) errors.push(`${where}.scores: must be an object {${PRACTICES.join(", ")}}`);
  else {
    checkKeys(res.scores, PRACTICES, [], `${where}.scores`, errors);
    for (const p of PRACTICES) {
      if (!Number.isInteger(res.scores[p])) errors.push(`${where}.scores.${p}: must be an integer`);
      else if (res.scores[p] !== tally.scores[p]) errors.push(`${where}.scores.${p}: says ${res.scores[p]}, Borda over the rankings gives ${tally.scores[p]}`);
    }
  }
  if (tally.winner) {
    if (isPractice(res.proposed_by) && res.proposed_by !== tally.winner) {
      errors.push(`${where}.proposed_by: "${res.proposed_by}", but the tally (with the tie rule) gives "${tally.winner}"`);
    }
    const winning = proposed.get(tally.winner);
    if (winning && res.question !== winning.question) errors.push(`${where}.question: must be the winning proposal's question, verbatim`);
  }
}

// -- the programme: validation ---------------------------------------------------------------------

function validateProgramme(programme, { to, cycle }, errors, warnings) {
  if (programme === undefined) return;
  if (!Array.isArray(programme)) return errors.push(`programme: must be an array`);
  let prev = null;
  programme.forEach((e, i) => {
    const where = `programme[${i}]${isObj(e) && Number.isInteger(e.cycle) ? ` (cycle ${e.cycle})` : ""}`;
    if (!isObj(e)) return errors.push(`${where}: must be an object`);
    checkKeys(e, PROGRAMME_KEYS, [], where, errors);

    if (!Number.isInteger(e.cycle) || e.cycle < 1) errors.push(`${where}.cycle: must be a positive integer`);
    else if (prev && Number.isInteger(prev.cycle) && e.cycle <= prev.cycle) {
      errors.push(`${where}.cycle: ${e.cycle} does not come after cycle ${prev.cycle}; entries run oldest first, one per cycle`);
    }
    if (!SOURCES.includes(e.source)) errors.push(`${where}.source: "${e.source}" is not one of ${SOURCES.join(", ")}`);
    // cycle.json's own rule: only a cycle on the practices' default themes goes without a question
    if (e.question === null) {
      if (e.source !== "defaults") errors.push(`${where}.question: null only while source is "defaults"`);
    } else if (typeof e.question !== "string" || e.question.trim() === "") {
      errors.push(`${where}.question: must be a non-empty string${e.source === "defaults" ? " or null" : ""}`);
    } else if (e.question.length > CYCLE_QUESTION_MAX) {
      errors.push(`${where}.question: ${e.question.length} characters, at most ${CYCLE_QUESTION_MAX}`);
    }

    const opened = isDate(e.opened) ? e.opened : null;
    if (!opened) errors.push(`${where}.opened: must be a YYYY-MM-DD date`);
    else {
      if (to && opened > to) errors.push(`${where}.opened: ${opened} is after period.to ${to}`);
      if (isObj(prev) && isDate(prev.opened) && opened < prev.opened) errors.push(`${where}.opened: ${opened} is before the previous entry's ${prev.opened}`);
    }
    if (e.closed !== null) {
      if (!isDate(e.closed)) errors.push(`${where}.closed: must be null or a YYYY-MM-DD date`);
      else {
        if (opened && e.closed < opened) errors.push(`${where}.closed: ${e.closed} is before opened ${opened}`);
        if (to && e.closed > to) errors.push(`${where}.closed: ${e.closed} is after period.to ${to}`);
      }
    }

    if (!Array.isArray(e.findings)) errors.push(`${where}.findings: must be an array`);
    else {
      const seen = new Set();
      e.findings.forEach((f, j) => {
        const fw = `${where}.findings[${j}]${isObj(f) && typeof f.practice === "string" ? ` (${f.practice})` : ""}`;
        if (!isObj(f)) return errors.push(`${fw}: must be an object`);
        checkKeys(f, FINDING_KEYS, [], fw, errors);
        if (!isPractice(f.practice)) errors.push(`${fw}.practice: "${f.practice}" is not one of ${PRACTICES.join(", ")}`);
        else if (seen.has(f.practice)) errors.push(`${fw}.practice: ${f.practice} already has a finding in this cycle; the first one stands`);
        else seen.add(f.practice);
        checkText(f.line, FINDING_MAX, `${fw}.line`, errors);
        checkRef(f.ref, `${fw}.ref`, repoOf(f.practice), errors);
        if (isObj(f.ref) && typeof f.ref.path === "string" && Number.isInteger(e.cycle) && f.ref.path !== summaryPath(e.cycle)) {
          errors.push(`${fw}.ref.path: "${f.ref.path}" must be ${summaryPath(e.cycle)}, the cycle's presentation summary`);
        }
      });
    }
    prev = e;
  });

  // closed is the day the next cycle opened — checked once the next entry is known
  programme.forEach((e, i) => {
    const next = programme[i + 1];
    if (!isObj(e) || !isObj(next) || !Number.isInteger(e.cycle) || !Number.isInteger(next.cycle) || !isDate(next.opened)) return;
    const where = `programme[${i}] (cycle ${e.cycle}).closed`;
    if (next.cycle === e.cycle + 1) {
      if (e.closed !== next.opened) {
        errors.push(`${where}: is ${JSON.stringify(e.closed)}, but cycle ${next.cycle} opened on ${next.opened}; closed is the day the next cycle opened`);
      }
    } else if (isDate(e.closed) && e.closed > next.opened) {
      errors.push(`${where}: ${e.closed} is after the next entry (cycle ${next.cycle}) opened on ${next.opened}`);
    }
  });
  if (cycle !== null && !programme.some((e) => isObj(e) && e.cycle === cycle)) {
    warnings.push(`programme: no entry for the current cycle ${cycle}; the relay adds it when it next writes`);
  }
}

/**
 * Validates a parsed relay document against middle-relay/1.
 * @returns {{ errors: string[], warnings: string[] }}
 */
export function validateRelay(doc) {
  const errors = [];
  const warnings = [];
  if (!isObj(doc)) return { errors: ["the document must be a JSON object"], warnings };
  checkKeys(doc, TOP_KEYS, TOP_OPTIONAL, "relay", errors);

  if (doc.$contract !== CONTRACT) errors.push(`$contract: must be "${CONTRACT}"`);
  if (typeof doc.generated_at !== "string" || !ISO_UTC.test(doc.generated_at) || Number.isNaN(Date.parse(doc.generated_at))) {
    errors.push(`generated_at: must be an ISO timestamp in UTC (YYYY-MM-DDTHH:MM:SSZ)`);
  }
  if (!Number.isInteger(doc.cycle) || doc.cycle < 1) errors.push(`cycle: must be a positive integer`);
  if (typeof doc.question !== "string" || doc.question.trim() === "") errors.push(`question: must be a non-empty string`);

  let from = null;
  let to = null;
  if (!isObj(doc.period)) errors.push(`period: must be an object {from, to}`);
  else {
    checkKeys(doc.period, ["from", "to"], [], "period", errors);
    if (!isDate(doc.period.from)) errors.push(`period.from: must be a YYYY-MM-DD date`);
    else from = doc.period.from;
    if (!isDate(doc.period.to)) errors.push(`period.to: must be a YYYY-MM-DD date`);
    else to = doc.period.to;
    if (from && to && from > to) errors.push(`period: from ${from} is after to ${to}`);
  }

  // -- relations ---------------------------------------------------------------------------
  const relations = Array.isArray(doc.relations) ? doc.relations : [];
  if (!Array.isArray(doc.relations)) errors.push(`relations: must be an array`);
  const relById = new Map();
  relations.forEach((r, i) => {
    const where = `relations[${i}]${isObj(r) && typeof r.id === "string" ? ` (${r.id})` : ""}`;
    if (!isObj(r)) return errors.push(`${where}: must be an object`);
    checkKeys(r, RELATION_KEYS, RELATION_OPTIONAL, where, errors);
    const m = typeof r.id === "string" ? REL_ID.exec(r.id) : null;
    if (!m) errors.push(`${where}.id: must look like rel-YYYY-MM-DD-<taker>-<n>`);
    else {
      if (relById.has(r.id)) errors.push(`${where}.id: duplicate id`);
      if (m[1] !== r.date) errors.push(`${where}.id: its date ${m[1]} differs from date ${r.date}`);
      if (m[2] !== r.taker) errors.push(`${where}.id: its practice "${m[2]}" differs from taker "${r.taker}"`);
    }
    if (typeof r.id === "string" && !relById.has(r.id)) relById.set(r.id, r);
    if (!isDate(r.date)) errors.push(`${where}.date: must be a YYYY-MM-DD date`);
    else if ((from && r.date < from) || (to && r.date > to)) errors.push(`${where}.date: ${r.date} lies outside the period ${from} … ${to}`);
    if (!PRACTICES.includes(r.giver)) errors.push(`${where}.giver: "${r.giver}" is not one of ${PRACTICES.join(", ")}`);
    if (!PRACTICES.includes(r.taker)) errors.push(`${where}.taker: "${r.taker}" is not one of ${PRACTICES.join(", ")}`);
    if (PRACTICES.includes(r.giver) && r.giver === r.taker) errors.push(`${where}: giver and taker are both "${r.giver}"`);
    if (!KINDS.includes(r.kind)) errors.push(`${where}.kind: "${r.kind}" is not one of ${KINDS.join(", ")}`);
    checkText(r.what, WHAT_MAX, `${where}.what`, errors);
    if (r.thread !== null && (typeof r.thread !== "string" || !KEBAB.test(r.thread) || r.thread.length > 64)) {
      errors.push(`${where}.thread: must be null or a kebab-case id`);
    }
    checkRef(r.giver_ref, `${where}.giver_ref`, REPO_OF[r.giver], errors);
    checkRef(r.taker_ref, `${where}.taker_ref`, REPO_OF[r.taker], errors);
  });
  // corrects: only after every id is known, and only backwards in the file (append-only order)
  relations.forEach((r, i) => {
    if (!isObj(r) || r.corrects === undefined || r.corrects === null) return;
    const where = `relations[${i}] (${r.id}).corrects`;
    if (typeof r.corrects !== "string" || !REL_ID.test(r.corrects)) return errors.push(`${where}: must be a relation id`);
    if (r.corrects === r.id) return errors.push(`${where}: a relation cannot correct itself`);
    const j = relations.findIndex((x) => isObj(x) && x.id === r.corrects);
    if (j < 0) errors.push(`${where}: "${r.corrects}" is not a relation in this file`);
    else if (j > i) errors.push(`${where}: "${r.corrects}" comes later in the file; a correction is appended after what it corrects`);
  });

  // -- handoffs ----------------------------------------------------------------------------
  const handoffs = Array.isArray(doc.handoffs) ? doc.handoffs : [];
  if (!Array.isArray(doc.handoffs)) errors.push(`handoffs: must be an array`);
  const hoIds = new Set();
  handoffs.forEach((h, i) => {
    const where = `handoffs[${i}]${isObj(h) && typeof h.id === "string" ? ` (${h.id})` : ""}`;
    if (!isObj(h)) return errors.push(`${where}: must be an object`);
    checkKeys(h, HANDOFF_KEYS, HANDOFF_OPTIONAL, where, errors);
    const m = typeof h.id === "string" ? HO_ID.exec(h.id) : null;
    if (!m) errors.push(`${where}.id: must look like ho-YYYY-MM-DD-<giver>-<n>`);
    else {
      if (hoIds.has(h.id)) errors.push(`${where}.id: duplicate id`);
      hoIds.add(h.id);
      if (m[1] !== h.offered_on) errors.push(`${where}.id: its date ${m[1]} differs from offered_on ${h.offered_on}`);
      if (m[2] !== h.giver) errors.push(`${where}.id: its practice "${m[2]}" differs from giver "${h.giver}"`);
    }
    if (!isDate(h.offered_on)) errors.push(`${where}.offered_on: must be a YYYY-MM-DD date`);
    else if ((from && h.offered_on < from) || (to && h.offered_on > to)) {
      errors.push(`${where}.offered_on: ${h.offered_on} lies outside the period ${from} … ${to}`);
    }
    if (!PRACTICES.includes(h.giver)) errors.push(`${where}.giver: "${h.giver}" is not one of ${PRACTICES.join(", ")}`);
    if (!Array.isArray(h.to) || h.to.length === 0) errors.push(`${where}.to: must be a non-empty array of practices`);
    else {
      if (new Set(h.to).size !== h.to.length) errors.push(`${where}.to: lists a practice twice`);
      for (const p of h.to) if (!PRACTICES.includes(p)) errors.push(`${where}.to: "${p}" is not one of ${PRACTICES.join(", ")}`);
      if (h.to.includes(h.giver)) errors.push(`${where}.to: contains the giver "${h.giver}"`);
    }
    checkText(h.offer, OFFER_MAX, `${where}.offer`, errors);
    checkRef(h.ref, `${where}.ref`, REPO_OF[h.giver], errors);
    if (!STATUSES.includes(h.status)) errors.push(`${where}.status: "${h.status}" is not one of ${STATUSES.join(", ")}`);

    if (h.status === "taken") checkPointer(h.taken_by, `${where}.taken_by`, h, relById, errors, { uptake: true });
    else if (h.taken_by !== null && h.taken_by !== undefined) errors.push(`${where}.taken_by: must be null unless status is "taken"`);

    if (h.status === "declined") checkPointer(h.declined_by, `${where}.declined_by`, h, relById, errors, { uptake: false });
    else if (h.declined_by !== undefined && h.declined_by !== null) errors.push(`${where}.declined_by: only a declined handoff carries it`);

    if (to && isDate(h.offered_on)) {
      const age = daysBetween(h.offered_on, to);
      if (h.status === "open" && age >= LAPSE_DAYS) {
        errors.push(`${where}.status: open ${age} days at period.to ${to}; a handoff lapses after ${LAPSE_DAYS} days`);
      }
      if (h.status === "lapsed" && age < LAPSE_DAYS) {
        errors.push(`${where}.status: lapsed after only ${age} days (period.to ${to}); the rule is ${LAPSE_DAYS}`);
      }
    }
  });

  // -- counts ------------------------------------------------------------------------------
  const computed = {
    built_on: relations.filter((r) => isObj(r) && r.kind === "built_on").length,
    answered: relations.filter((r) => isObj(r) && r.kind === "answered").length,
    noted: relations.filter((r) => isObj(r) && r.kind === "noted").length,
    open_handoffs: handoffs.filter((h) => isObj(h) && h.status === "open").length,
  };
  if (!isObj(doc.counts)) errors.push(`counts: must be an object`);
  else {
    checkKeys(doc.counts, COUNT_KEYS, [], "counts", errors);
    for (const k of COUNT_KEYS) {
      if (doc.counts[k] !== computed[k]) errors.push(`counts.${k}: says ${JSON.stringify(doc.counts[k])}, the file holds ${computed[k]}`);
    }
  }
  if (relations.length === 0) warnings.push("relations: empty");

  // -- the convening and the programme: optional sections, absent in files written before 2026-10-07
  const ctx = { from, to, cycle: Number.isInteger(doc.cycle) ? doc.cycle : null };
  validateConvening(doc.convening, ctx, errors);
  validateProgramme(doc.programme, ctx, errors, warnings);
  return { errors, warnings };
}

const canon = (v) => JSON.stringify(v, (_k, x) => (isObj(x) ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, x[k]])) : x));

// Allowed status moves. Nothing returns to open; taken is final; a lapsed or declined handoff
// may still be taken up later (with evidence) and a lapsed one may still be declined.
const TRANSITIONS = { open: ["taken", "declined", "lapsed"], lapsed: ["taken", "declined"], declined: ["taken"], taken: [] };

/**
 * Append-only check of a new relay document against an earlier one.
 * @returns {string[]} errors
 */
export function compareWithBase(doc, base) {
  const errors = [];
  if (!isObj(doc) || !isObj(base)) return ["--base: both documents must be JSON objects"];
  const newRel = new Map((doc.relations ?? []).filter(isObj).map((r) => [r.id, r]));
  for (const old of (base.relations ?? []).filter(isObj)) {
    const now = newRel.get(old.id);
    if (!now) errors.push(`append-only: relation ${old.id} was deleted`);
    else if (canon(now) !== canon(old)) errors.push(`append-only: relation ${old.id} was edited (a correction is a new relation with "corrects")`);
  }
  const newHo = new Map((doc.handoffs ?? []).filter(isObj).map((h) => [h.id, h]));
  for (const old of (base.handoffs ?? []).filter(isObj)) {
    const now = newHo.get(old.id);
    if (!now) {
      errors.push(`append-only: handoff ${old.id} was deleted`);
      continue;
    }
    for (const k of ["offered_on", "giver", "to", "offer", "ref"]) {
      if (canon(now[k]) !== canon(old[k])) errors.push(`append-only: handoff ${old.id}.${k} was changed`);
    }
    if (now.status === old.status) {
      for (const k of ["taken_by", "declined_by"]) {
        if (canon(now[k] ?? null) !== canon(old[k] ?? null)) errors.push(`append-only: handoff ${old.id}.${k} changed without a status change`);
      }
    } else if (!(TRANSITIONS[old.status] ?? []).includes(now.status)) {
      errors.push(`append-only: handoff ${old.id} moved ${old.status} → ${now.status}, which the contract does not allow`);
    }
  }
  if (isObj(doc.period) && isObj(base.period)) {
    if (doc.period.from !== base.period.from) errors.push(`append-only: period.from changed ${base.period.from} → ${doc.period.from}`);
    if (typeof doc.period.to === "string" && typeof base.period.to === "string" && doc.period.to < base.period.to) {
      errors.push(`append-only: period.to moved backwards ${base.period.to} → ${doc.period.to}`);
    }
  }
  if (Number.isInteger(doc.cycle) && Number.isInteger(base.cycle) && doc.cycle < base.cycle) {
    errors.push(`append-only: cycle moved backwards ${base.cycle} → ${doc.cycle}`);
  }
  compareConvening(doc.convening, base.convening, errors);
  compareProgramme(doc.programme, base.programme, errors);
  return errors;
}

/**
 * A convening, once recorded, is only ever added to: its proposals and rankings are never edited or
 * removed, its result is set once and never changed, and nothing is added after the result. A
 * convening for a later cycle (a larger after_cycle) replaces the whole object; nothing clears it.
 */
function compareConvening(now, was, errors) {
  if (!isObj(was)) return; // nothing recorded yet: anything valid may appear
  if (!isObj(now)) return errors.push(`append-only: the convening after cycle ${was.after_cycle} was removed; only a convening for a later cycle replaces it`);
  if (Number.isInteger(now.after_cycle) && Number.isInteger(was.after_cycle)) {
    if (now.after_cycle < was.after_cycle) {
      return errors.push(`append-only: convening.after_cycle moved backwards ${was.after_cycle} → ${now.after_cycle}`);
    }
    if (now.after_cycle > was.after_cycle) return; // a new convening: the old one is replaced as a whole
  }
  if (now.opened !== was.opened) errors.push(`append-only: convening.opened changed ${was.opened} → ${now.opened}`);
  for (const [key, label] of [["proposals", "proposal"], ["rankings", "ranking"]]) {
    const have = new Map((Array.isArray(now[key]) ? now[key] : []).filter(isObj).map((x) => [x.practice, x]));
    for (const old of (Array.isArray(was[key]) ? was[key] : []).filter(isObj)) {
      const cur = have.get(old.practice);
      if (!cur) errors.push(`append-only: the ${label} of ${old.practice} was removed`);
      else if (canon(cur) !== canon(old)) errors.push(`append-only: the ${label} of ${old.practice} was edited`);
    }
  }
  if (was.result !== null && was.result !== undefined) {
    if (canon(now.result ?? null) !== canon(was.result)) errors.push(`append-only: the convening's result was changed; a result is set once`);
    for (const [key, label] of [["proposals", "proposal"], ["rankings", "ranking"]]) {
      const added = (Array.isArray(now[key]) ? now[key].length : 0) - (Array.isArray(was[key]) ? was[key].length : 0);
      if (added > 0) errors.push(`append-only: ${added} ${label}(s) added after the result was set`);
    }
  }
}

/**
 * The programme is never reordered or shortened: entry i of the base is entry i now, with its cycle,
 * question, source and opened unchanged; `closed` is set once (null → date, then fixed); findings are
 * only appended.
 */
function compareProgramme(now, was, errors) {
  if (!Array.isArray(was)) return; // the base predates the programme
  if (!Array.isArray(now)) return errors.push(`append-only: the programme was removed`);
  was.forEach((old, i) => {
    if (!isObj(old)) return;
    const cur = now[i];
    if (!isObj(cur)) return errors.push(`append-only: programme entry for cycle ${old.cycle} was removed`);
    if (cur.cycle !== old.cycle) {
      return errors.push(`append-only: programme[${i}] is cycle ${cur.cycle} but the base has cycle ${old.cycle} there; entries are never removed or reordered`);
    }
    for (const k of ["question", "source", "opened"]) {
      if (canon(cur[k] ?? null) !== canon(old[k] ?? null)) errors.push(`append-only: programme cycle ${old.cycle}.${k} was changed`);
    }
    if (old.closed !== null && old.closed !== undefined && canon(cur.closed ?? null) !== canon(old.closed)) {
      errors.push(`append-only: programme cycle ${old.cycle}.closed was changed after it was set`);
    }
    const oldFindings = Array.isArray(old.findings) ? old.findings : [];
    const curFindings = Array.isArray(cur.findings) ? cur.findings : [];
    oldFindings.forEach((f, j) => {
      if (curFindings[j] === undefined) errors.push(`append-only: programme cycle ${old.cycle} finding ${j} (${f?.practice}) was removed`);
      else if (canon(curFindings[j]) !== canon(f)) errors.push(`append-only: programme cycle ${old.cycle} finding ${j} (${f?.practice}) was edited`);
    });
  });
}

/** Every evidence ref in the document, one entry per distinct repo/commit/path. */
export function collectRefs(doc) {
  const seen = new Map();
  const add = (ref, where) => {
    if (!isObj(ref) || typeof ref.repo !== "string" || typeof ref.path !== "string" || typeof ref.commit !== "string") return;
    const key = `${ref.repo}@${ref.commit}:${ref.path}`;
    if (!seen.has(key)) seen.set(key, { key, repo: ref.repo, path: ref.path, commit: ref.commit, where: [] });
    seen.get(key).where.push(where);
  };
  for (const r of (doc?.relations ?? []).filter(isObj)) {
    add(r.giver_ref, `${r.id}.giver_ref`);
    add(r.taker_ref, `${r.id}.taker_ref`);
  }
  for (const h of (doc?.handoffs ?? []).filter(isObj)) add(h.ref, `${h.id}.ref`);
  if (isObj(doc?.convening)) {
    for (const p of (Array.isArray(doc.convening.proposals) ? doc.convening.proposals : []).filter(isObj)) add(p.ref, `convening.proposals[${p.practice}].ref`);
    for (const r of (Array.isArray(doc.convening.rankings) ? doc.convening.rankings : []).filter(isObj)) add(r.ref, `convening.rankings[${r.practice}].ref`);
  }
  for (const e of (Array.isArray(doc?.programme) ? doc.programme : []).filter(isObj)) {
    for (const f of (Array.isArray(e.findings) ? e.findings : []).filter(isObj)) add(f.ref, `programme[cycle ${e.cycle}].findings[${f.practice}].ref`);
  }
  return [...seen.values()].sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
}

/** An evenly spaced, deterministic sample of n items. */
export function sampleEvenly(items, n) {
  if (!Number.isInteger(n) || n <= 0 || n >= items.length) return items;
  return Array.from({ length: n }, (_, i) => items[Math.floor((i * items.length) / n)]);
}

export const rawUrl = (ref) =>
  `https://raw.githubusercontent.com/frankbueltge/${ref.repo}/${ref.commit}/${ref.path.split("/").map(encodeURIComponent).join("/")}`;

/**
 * Checks refs against raw.githubusercontent.com. 404 → error; anything else that is not 200
 * (rate limit, 403, 5xx, network) → warning, because it says nothing about the ref.
 */
export async function checkRefsOnline(refs, { fetchImpl = globalThis.fetch, concurrency = 6, timeoutMs = 15_000 } = {}) {
  const errors = [];
  const warnings = [];
  let verified = 0;
  const probe = async (ref) => {
    const url = rawUrl(ref);
    for (const method of ["HEAD", "GET"]) {
      try {
        const res = await fetchImpl(url, { method, redirect: "follow", signal: AbortSignal.timeout(timeoutMs) });
        if (res.body && method === "GET") await res.body.cancel?.();
        if (res.status === 200) return { ok: true };
        if (res.status === 404) return { ok: false, missing: true, status: 404 };
        if (method === "HEAD" && res.status === 405) continue;
        return { ok: false, status: res.status };
      } catch (err) {
        if (method === "GET") return { ok: false, status: String(err?.name ?? err) };
      }
    }
    return { ok: false, status: "no answer" };
  };
  const queue = [...refs];
  const worker = async () => {
    while (queue.length) {
      const ref = queue.shift();
      const r = await probe(ref);
      if (r.ok) verified += 1;
      else if (r.missing) errors.push(`ref not found (404): ${ref.key} — used by ${ref.where.join(", ")}`);
      else warnings.push(`ref unverified (${r.status}): ${ref.key}`);
    }
  };
  await Promise.all(Array.from({ length: Math.max(1, Math.min(concurrency, refs.length)) }, worker));
  return { errors, warnings, verified };
}

function parseArgs(argv) {
  const opts = { file: null, base: null, online: false, sample: null, allRefs: false, quiet: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const [flag, inline] = a.includes("=") ? [a.slice(0, a.indexOf("=")), a.slice(a.indexOf("=") + 1)] : [a, undefined];
    const value = () => inline ?? argv[++i];
    if (flag === "--file") opts.file = value();
    else if (flag === "--base") opts.base = value();
    else if (flag === "--online") opts.online = true;
    else if (flag === "--sample") opts.sample = Number(value());
    else if (flag === "--all-refs") opts.allRefs = true;
    else if (flag === "--quiet") opts.quiet = true;
    else if (flag === "--help" || flag === "-h") opts.help = true;
    else throw new Error(`unknown argument: ${a}`);
  }
  if (opts.sample !== null && (!Number.isInteger(opts.sample) || opts.sample < 1)) throw new Error("--sample needs a positive integer");
  return opts;
}

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

/** One clause for the summary line: what the programme and the convening hold. */
function sectionsSummary(doc) {
  const parts = [];
  if (Array.isArray(doc?.programme)) {
    const findings = doc.programme.reduce((n, e) => n + (Array.isArray(e?.findings) ? e.findings.length : 0), 0);
    parts.push(`programme ${doc.programme.length} cycles, ${findings} findings`);
  }
  const c = doc?.convening;
  if (isObj(c)) {
    const n = (k) => (Array.isArray(c[k]) ? c[k].length : 0);
    parts.push(`convening after cycle ${c.after_cycle}: ${n("proposals")} proposals, ${n("rankings")} rankings, ${isObj(c.result) ? `result ${c.result.proposed_by}` : "no result yet"}`);
  } else if (c === null) parts.push("no convening");
  return parts.length ? `, ${parts.join(", ")}` : "";
}

async function main() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(`verify-relay: ${err.message}`);
    return 2;
  }
  if (opts.help) {
    console.log("usage: node tools/verify-relay.mjs [--file F] [--base OLD] [--online] [--sample N] [--all-refs] [--quiet]");
    return 0;
  }
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const file = path.resolve(opts.file ?? path.join(repoRoot, "relay", "relay.json"));
  let doc;
  let base = null;
  try {
    doc = readJson(file);
    if (opts.base) base = readJson(path.resolve(opts.base));
  } catch (err) {
    console.error(`verify-relay: cannot read ${err.path ?? file}: ${err.message}`);
    return 2;
  }

  const { errors, warnings } = validateRelay(doc);
  if (base) errors.push(...compareWithBase(doc, base));

  let online = null;
  if (opts.online) {
    let refs = collectRefs(doc);
    if (base && !opts.allRefs) {
      const known = new Set(collectRefs(base).map((r) => r.key));
      refs = refs.filter((r) => !known.has(r.key));
    }
    const total = refs.length;
    refs = sampleEvenly(refs, opts.sample ?? 0);
    online = await checkRefsOnline(refs);
    online.checked = refs.length;
    online.total = total;
    errors.push(...online.errors);
    warnings.push(...online.warnings);
  }

  const rel = Array.isArray(doc?.relations) ? doc.relations : [];
  const ho = Array.isArray(doc?.handoffs) ? doc.handoffs : [];
  const by = (k) => rel.filter((r) => r?.kind === k).length;
  if (!opts.quiet) {
    for (const w of warnings) console.warn(`warning: ${w}`);
  }
  for (const e of errors) console.error(`error: ${e}`);
  if (!opts.quiet || errors.length) {
    const summary =
      `${path.relative(process.cwd(), file) || file}: ${rel.length} relations ` +
      `(built_on ${by("built_on")}, answered ${by("answered")}, noted ${by("noted")}), ` +
      `${ho.length} handoffs (${ho.filter((h) => h?.status === "open").length} open)` +
      sectionsSummary(doc) +
      (base ? ", append-only checked against the base" : "") +
      (online ? `, refs online: ${online.verified} of ${online.checked} checked found${online.checked < online.total ? ` (sample of ${online.total})` : ""}` : "");
    console.log(`${errors.length ? "FAIL" : "ok"} — ${summary}${errors.length ? ` — ${errors.length} error(s)` : ""}`);
  }
  return errors.length ? 1 : 0;
}

const invoked = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : "";
if (import.meta.url === invoked) {
  main().then((code) => process.exit(code), (err) => {
    console.error(`verify-relay: ${err?.stack ?? err}`);
    process.exit(2);
  });
}
