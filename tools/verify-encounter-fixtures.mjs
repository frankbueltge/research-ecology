#!/usr/bin/env node
// tools/verify-encounter-fixtures.mjs — der mechanische Wächter des Middle-Scribe.
// Frank (2026-07-17): der Scribe veröffentlicht OHNE menschliche Freigabe — deshalb ersetzt
// dieses Skript die Unterschrift: Es prüft jedes Zitat jedes Encounter-Fixtures byte-exakt
// (whitespace-normalisiert, Soft-Wrap-Konvention der practice-profiles) gegen die im
// QUOTE-MANIFEST.tsv gepinnte Quelle (raw.githubusercontent @ Commit) und validiert alle
// JSON-Dateien. Exit != 0 ⇒ nichts committen. Ehrlichkeit per Code, nicht per Vertrauen.
//
// Aufruf:  node tools/verify-encounter-fixtures.mjs [fixtures/enc-2026-00X-slug ...]
//          (ohne Argumente: alle fixtures/enc-*-Verzeichnisse)
// Manifest-Zeilen: ORT \t QUELLE \t ZITAT-ODER-PREFIX \t wrapped(yes/no)
//   QUELLE = "<repo-label>:<pfad>" ; der Commit steht in den JSON-provenances — das
//   Manifest darf ihn alternativ als viertem-Feld-Suffix "@<commit>" am Pfad tragen.
//   Volle Zitate sind Pflicht für NEUE Zeilen des Scribe; Alt-Zeilen mit 60-Zeichen-Prefix
//   bleiben gültig (Mindestmaß).

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

// Privat-Repo-Fallback (z. B. frankbueltge/data-snack.com): raw.githubusercontent liefert
// dort 404; mit Token (env GITHUB_TOKEN oder `gh auth token`) holt die Contents-API den
// Rohinhalt. Öffentliche Verifizierbarkeit ist dann eingeschränkt — das gehört als
// ehrlicher Vermerk in das betroffene Fixture-README, nicht verschwiegen.
let _token;
function ghToken() {
  if (_token !== undefined) return _token;
  _token = process.env.GITHUB_TOKEN ?? null;
  if (!_token) {
    try { _token = execFileSync("gh", ["auth", "token"], { encoding: "utf8" }).trim() || null; }
    catch { _token = null; }
  }
  return _token;
}

const REPO_MAP = {
  "field-research": "frankbueltge/field-research",
  "studio": "frankbueltge/studio",
  "irrtum-als-methode": "frankbueltge/irrtum-als-methode",
  "data-snack-plenum": "frankbueltge/data-snack-plenum",
  "research-ecology": "frankbueltge/research-ecology",
  "frankbueltge.de": "frankbueltge/frankbueltge.de",
  "datavism.org": "datavism/datavism.org",
  "data-snack.com-from-scratch": "frankbueltge/data-snack.com",
  "meridian-runtime": "frankbueltge/meridian-runtime",
};

// Lokaler Sibling-Clone-Fallback: manche Sessions (Sandboxes ohne generische GitHub-API,
// nur Git-Smart-HTTP über den Proxy) können private Repos nicht per raw.githubusercontent
// oder Contents-API lesen, obwohl ein lokaler Klon vorliegt (Konvention der Fixture-READMEs:
// "verified with git show <commit>:<path> in the local sibling clones"). Rein additiv: wird
// nur versucht, wenn beide Netz-Wege leer blieben; ohne lokale Klone ändert sich nichts.
const LOCAL_ROOTS = [process.env.MIDDLE_SCRIBE_LOCAL_REPOS, "/workspace", "..", "../.."].filter(Boolean);
function fetchLocal(slug, path, commit) {
  const repoDirName = slug.split("/")[1];
  for (const root of LOCAL_ROOTS) {
    const dir = join(root, repoDirName);
    if (!existsSync(join(dir, ".git"))) continue;
    try {
      const text = execFileSync("git", ["-C", dir, "show", `${commit}:${path}`], { encoding: "utf8" });
      return norm(text);
    } catch { /* Pfad/Commit nicht in diesem lokalen Klon — nächste Wurzel probieren */ }
  }
  return null;
}

// Normalisierung: Whitespace-Kollaps (Soft-Wrap-Konvention) + Markdown-Betonung (** und
// Backticks) auf beiden Seiten gestrippt — enc-001 zitiert Wortlaut ohne Auszeichnungs-
// zeichen (Befund 17.07.: 'headline**' vs 'headline'); Wort-Exaktheit bleibt Pflicht.
const norm = (s) =>
  s.replace(/\*+/g, "").replace(/`/g, "").replace(/(^|\s)>\s?/g, "$1").replace(/\s+/g, " ").trim();
// Zusatzregel NUR für die Zitatseite: ein abschließendes ./,/… des Zitats darf fehlen
// (enc-001 schloss abgebrochene Sätze mit '.', wo die Quelle weiterläuft).
const normQuote = (s) => norm(s).replace(/[.,…]+$/, "");
const cache = new Map();

async function fetchAt(repoLabel, path, commit) {
  const slug = REPO_MAP[repoLabel];
  if (!slug) throw new Error(`unbekanntes Repo-Label: ${repoLabel}`);
  const url = `https://raw.githubusercontent.com/${slug}/${commit}/${path}`;
  if (cache.has(url)) return cache.get(url);
  let body = null;
  const res = await fetch(url);
  if (res.ok) body = norm(await res.text());
  else {
    const token = ghToken();
    if (token) {
      const api = `https://api.github.com/repos/${slug}/contents/${path}?ref=${commit}`;
      const r2 = await fetch(api, { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.raw" } });
      if (r2.ok) body = norm(await r2.text());
    }
  }
  if (body === null) body = fetchLocal(slug, path, commit);
  cache.set(url, body);
  return body;
}

// Commits aus den JSON-Dateien einsammeln: source-file → Set<commit>. Zwei Formen:
// (a) provenance-Objekte {file, commit} (practice-profiles-Stil), (b) source_uri-Blob-URLs
// (enc-Events-Stil: github.com/<owner>/<repo>/blob/<commit>/<pfad>).
const SLUG_TO_LABEL = Object.fromEntries(Object.entries(REPO_MAP).map(([k, v]) => [v, k]));
function commitsFromJsons(dir) {
  const map = new Map();
  const add = (file, commit) => {
    if (!file || !commit) return;
    if (!map.has(file)) map.set(file, new Set());
    map.get(file).add(commit);
  };
  const walk = (v) => {
    if (Array.isArray(v)) return v.forEach(walk);
    if (v && typeof v === "object") {
      if (typeof v.file === "string" && typeof v.commit === "string") add(v.file, v.commit);
      if (typeof v.source_file === "string" && typeof v.commit === "string") add(v.source_file, v.commit);
      if (typeof v.repo === "string" && typeof v.path === "string" && typeof v.commit === "string")
        add(`${v.repo}:${v.path}`, v.commit);
      Object.values(v).forEach(walk);
    }
  };
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    const raw = readFileSync(join(dir, f), "utf8");
    walk(JSON.parse(raw)); // wirft bei invalidem JSON
    for (const m of raw.matchAll(/github\.com\/([\w.-]+\/[\w.-]+)\/blob\/([0-9a-f]{7,40})\/([^"\\]+)/g)) {
      const label = SLUG_TO_LABEL[m[1]];
      const path = m[3];
      add(path, m[2]);
      if (label) add(`${label}:${path}`, m[2]);
    }
  }
  return map;
}

async function verifyDir(dir) {
  let ok = 0, fail = 0;
  const commitIndex = commitsFromJsons(dir); // validiert nebenbei alle JSONs
  const manifest = join(dir, "QUOTE-MANIFEST.tsv");
  if (!existsSync(manifest)) {
    console.error(`FEHLT: ${manifest}`);
    return { ok, fail: fail + 1 };
  }
  for (const raw of readFileSync(manifest, "utf8").split("\n")) {
    const line = raw.trimEnd();
    if (!line || line.startsWith("#") || /^location\t/i.test(line)) continue;
    const [loc, src, quote] = line.split("\t");
    if (!loc || !src || !quote) { console.error(`MANIFEST-ZEILE UNLESBAR: ${line.slice(0, 80)}`); fail++; continue; }
    let [repoLabel, ...rest] = src.split(":");
    let path = rest.join(":");
    let commits = [];
    const at = path.match(/^(.*)@([0-9a-f]{7,40})$/);
    if (at) { path = at[1]; commits = [at[2]]; }
    else {
      const byBare = commitIndex.get(path) ?? commitIndex.get(`${repoLabel}:${path}`) ?? commitIndex.get(src);
      commits = byBare ? [...byBare] : [];
    }
    if (!commits.length) { console.error(`KEIN COMMIT AUFFINDBAR: ${loc} → ${src}`); fail++; continue; }
    let found = false;
    for (const c of commits) {
      const body = await fetchAt(repoLabel, path, c).catch((e) => (console.error(String(e)), null));
      if (!body) continue;
      if (body.includes(normQuote(quote))) { found = true; break; }
      // Erklärte Ellipse ("..."/"…"): jedes Segment muss einzeln in DERSELBEN Fassung stehen.
      const segs = normQuote(quote).split(/\s?(?:\.\.\.|\u2026)\s?/).filter((x) => x.length > 10);
      if (segs.length > 1 && segs.every((seg) => body.includes(seg))) { found = true; break; }
    }
    if (found) ok++;
    else { console.error(`NICHT-SUBSTRING: ${loc} → ${src} :: ${quote.slice(0, 60)}`); fail++; }
  }
  return { ok, fail };
}

const args = process.argv.slice(2);
const dirs = args.length
  ? args
  : readdirSync("fixtures").filter((d) => d.startsWith("enc-")).map((d) => join("fixtures", d));

let totalOk = 0, totalFail = 0;
for (const dir of dirs) {
  const { ok, fail } = await verifyDir(dir);
  console.log(`${dir}: ${ok} Zitate ok, ${fail} Fehler`);
  totalOk += ok; totalFail += fail;
}
console.log(`GESAMT: ${totalOk} ok, ${totalFail} Fehler`);
process.exit(totalFail === 0 ? 0 : 1);
