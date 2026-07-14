/**
 * Server-only loader for the editorial narrative data object (work order phase-3d §2:
 * "narratives/enc-2026-001.json"). Reads once, validates via `$lib/narrative.js`'s structural
 * checks, caches for the process lifetime — same idiom as `getApp()` in `./store.ts`. The file
 * lives at the monorepo root beside `fixtures/`, `lenses/` and `import/bundles/` (Git is the
 * archive for this app's data, same convention throughout), not under `src/`, because it is
 * authored editorial content, not application code.
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { REPO_ROOT } from "./store.js";
import { validateNarrative, type Narrative } from "../narrative.js";

const NARRATIVE_PATH = path.join(REPO_ROOT, "narratives", "enc-2026-001.json");

let cached: Narrative | undefined;

export function getNarrative(): Narrative {
  if (cached) return cached;
  const raw = readFileSync(NARRATIVE_PATH, "utf-8");
  const parsed: unknown = JSON.parse(raw);
  cached = validateNarrative(parsed, NARRATIVE_PATH);
  return cached;
}
