#!/usr/bin/env node
// tools/verify-relay.mjs — the contract guard of The Middle's relay desk.
//
// relay/relay.json (contract "middle-relay/1", documented in relay/README.md) is written each
// night by the Middle Relay routine and read by the site, which shows the practices their open
// handoffs at session open. Nobody approves a night by hand, so this script is the signature:
// a file that fails it is not committed by the routine and not landed by auto-land.
//
// Usage:
//   node tools/verify-relay.mjs [--file relay/relay.json] [--base old-relay.json]
//                               [--online] [--sample N] [--all-refs] [--quiet]
//
//   --file      the relay file to check (default: relay/relay.json next to this tool)
//   --base      an earlier version of the file (e.g. main's): enforces append-only — no past
//               relation edited or deleted, no handoff deleted or reopened, period.to and
//               cycle never moving backwards
//   --online    also check that every evidence ref exists: HEAD (then GET) on
//               https://raw.githubusercontent.com/frankbueltge/<repo>/<commit>/<path>.
//               With --base, only refs that are new against the base are checked
//               (--all-refs checks every ref). A 404 is a contract error; a rate limit,
//               a 403/5xx or a network failure is reported as "unverified", never as an error.
//   --sample N  with --online: check at most N refs (an evenly spaced, deterministic sample)
//   --quiet     print errors only
//
// Exit codes: 0 = contract holds · 1 = contract errors (or a ref that 404s online) · 2 = usage/IO
// Node >= 22, no dependencies. The functions are exported for tests/contract/relay.test.ts.

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

const TOP_KEYS = ["$contract", "generated_at", "cycle", "question", "period", "relations", "handoffs", "counts"];
const RELATION_KEYS = ["id", "date", "giver", "taker", "kind", "what", "thread", "giver_ref", "taker_ref"];
const RELATION_OPTIONAL = ["corrects"];
const HANDOFF_KEYS = ["id", "offered_on", "giver", "to", "offer", "ref", "status", "taken_by"];
const HANDOFF_OPTIONAL = ["declined_by"];
const REF_KEYS = ["repo", "path", "commit"];
const COUNT_KEYS = ["built_on", "answered", "noted", "open_handoffs"];

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

/**
 * Validates a parsed relay document against middle-relay/1.
 * @returns {{ errors: string[], warnings: string[] }}
 */
export function validateRelay(doc) {
  const errors = [];
  const warnings = [];
  if (!isObj(doc)) return { errors: ["the document must be a JSON object"], warnings };
  checkKeys(doc, TOP_KEYS, [], "relay", errors);

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
  return errors;
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
