#!/usr/bin/env node
/**
 * Smoke test for the static build (work order C3 §1: "ein Smoke-Skript prüft, dass Kernrouten im
 * Output existieren"). Runs against `build/` — the output of `npm run build` with
 * `@sveltejs/adapter-static` — and fails loudly if any expected route file is missing, empty, or
 * looks like a rendered error page. Not a replacement for the Playwright suite (which checks
 * actual content correctness); this only checks the build produced what it claims to.
 *
 * Route inventory: this app has five fixed routes, no dynamic segments (unlike apps/middle-web —
 * see the work order C3 report for why that app was not converted). Every one of them must be
 * prerendered into a static .html file, so all five are "core" here.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const BUILD_DIR = path.join(here, "..", "build");

const ROUTES = [
  { file: "index.html", label: "/ (the sheet / Blatt)" },
  { file: "apparatus.html", label: "/apparatus" },
  { file: "journal.html", label: "/journal (stub)" },
  { file: "material.html", label: "/material (stub)" },
  { file: "sheets.html", label: "/sheets (stub)" }
];

const ERROR_MARKERS = ["Internal Error", "Cannot read prop", "500 Internal", "prerendering enabled", "%sveltekit."];

let failures = 0;

if (!existsSync(BUILD_DIR)) {
  console.error(`smoke: build directory not found at ${BUILD_DIR} — run \`npm run build\` first.`);
  process.exit(1);
}

for (const { file, label } of ROUTES) {
  const fullPath = path.join(BUILD_DIR, file);
  if (!existsSync(fullPath)) {
    console.error(`smoke: FAIL — ${label}: expected output file "${file}" does not exist.`);
    failures++;
    continue;
  }

  const html = readFileSync(fullPath, "utf-8");

  if (html.trim().length === 0) {
    console.error(`smoke: FAIL — ${label}: "${file}" is empty.`);
    failures++;
    continue;
  }
  if (!html.includes("<html")) {
    console.error(`smoke: FAIL — ${label}: "${file}" does not look like an HTML document.`);
    failures++;
    continue;
  }
  if (!/<h1[^>]*>/.test(html)) {
    console.error(`smoke: FAIL — ${label}: "${file}" has no <h1> — page looks incomplete.`);
    failures++;
    continue;
  }
  const marker = ERROR_MARKERS.find((m) => html.includes(m));
  if (marker) {
    console.error(`smoke: FAIL — ${label}: "${file}" contains an error marker ("${marker}").`);
    failures++;
    continue;
  }
  if (!html.includes('meta http-equiv="content-security-policy"')) {
    console.error(`smoke: FAIL — ${label}: "${file}" has no CSP meta tag (csp.mode: "hash" not applied?).`);
    failures++;
    continue;
  }

  console.log(`smoke: OK — ${label} → ${file} (${(html.length / 1024).toFixed(1)} KB)`);
}

if (failures > 0) {
  console.error(`\nsmoke: ${failures} of ${ROUTES.length} core routes failed.`);
  process.exit(1);
}

console.log(`\nsmoke: all ${ROUTES.length} core routes present and non-empty in build/.`);
