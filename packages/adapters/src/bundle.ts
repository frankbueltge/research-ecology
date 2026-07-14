/**
 * Bundle assembly: stable ordering + writing an import bundle to
 * `<outDir>/<collective>@<shortSha>/` (work order §2). No DB, no framework code — plain JSON
 * files, so a bundle is byte-diffable and re-runnable without side effects on the source repo.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { compareCodeUnits } from "./generic-git.js";
import type { AdapterBundleParts } from "./types.js";

/** Deterministic ordering by id/path — never dependent on source array order or locale. */
export function sortBundleParts(parts: AdapterBundleParts): AdapterBundleParts {
  return {
    manifest: parts.manifest,
    objects: [...parts.objects].sort((a, b) => compareCodeUnits(a.id, b.id)),
    events: [...parts.events].sort((a, b) => compareCodeUnits(a.event_id, b.event_id)),
    assertions: [...parts.assertions].sort((a, b) => compareCodeUnits(a.assertion_id, b.assertion_id)),
    exclusions: [...parts.exclusions].sort(
      (a, b) => compareCodeUnits(a.path, b.path) || compareCodeUnits(a.kind, b.kind)
    ),
    importRecords: [...parts.importRecords].sort(
      (a, b) => compareCodeUnits(a.path, b.path) || compareCodeUnits(a.kind, b.kind) || compareCodeUnits(a.reason, b.reason)
    ),
    coverage: {
      ...parts.coverage,
      rows: [...parts.coverage.rows].sort((a, b) => compareCodeUnits(a.path, b.path))
    }
  };
}

function writeJsonFile(filePath: string, data: unknown): void {
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export interface WriteBundleResult {
  dir: string;
}

/** Writes the seven bundle files. Pass the *same* generated_at across repeated runs of the
 * same commit to get byte-identical output (work order §0 determinism note). */
export function writeBundle(outDir: string, collectiveId: string, shortSha: string, rawParts: AdapterBundleParts): WriteBundleResult {
  const parts = sortBundleParts(rawParts);
  const dir = path.join(outDir, `${collectiveId}@${shortSha}`);
  mkdirSync(dir, { recursive: true });
  writeJsonFile(path.join(dir, "manifest.json"), parts.manifest);
  writeJsonFile(path.join(dir, "objects.json"), parts.objects);
  writeJsonFile(path.join(dir, "events.json"), parts.events);
  writeJsonFile(path.join(dir, "assertions.json"), parts.assertions);
  writeJsonFile(path.join(dir, "exclusions.json"), parts.exclusions);
  writeJsonFile(path.join(dir, "import-records.json"), parts.importRecords);
  writeJsonFile(path.join(dir, "coverage.json"), parts.coverage);
  return { dir };
}
