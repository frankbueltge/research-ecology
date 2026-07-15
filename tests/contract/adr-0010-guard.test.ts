/**
 * ADR 0010 guard (work order phase-c1-atelier-app.md §6 test 4): "apps/atelier importiert
 * nichts aus apps/middle-web" — a static grep over the source, not a build-time check, so it
 * catches a regression even before anything compiles. ADR 0010 §4: "no cross-app stylesheet or
 * theme package is created" — the Atelier's visual grammar is deliberately its own.
 */
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(here, "../..");
const ATELIER_SRC_DIRS = ["apps/atelier/src", "apps/atelier/tests"];

function listFilesRecursive(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listFilesRecursive(full));
    else if (/\.(ts|svelte|js)$/.test(entry.name)) files.push(full);
  }
  return files;
}

describe("ADR 0010 guard — apps/atelier never imports from apps/middle-web", () => {
  it("no source or test file under apps/atelier references middle-web in an import/require specifier", () => {
    const offenders: string[] = [];
    for (const dir of ATELIER_SRC_DIRS) {
      const absDir = path.join(REPO_ROOT, dir);
      let files: string[];
      try {
        files = listFilesRecursive(absDir);
      } catch {
        continue; // directory does not exist yet — nothing to check
      }
      for (const file of files) {
        const text = readFileSync(file, "utf8");
        // Matches `from "..."`, `import("...")`, `require("...")` specifiers containing
        // "middle-web" — not just any mention of the string (a code comment explaining the ADR,
        // like this file's own header, must not trip the guard).
        const importLines = text
          .split("\n")
          .filter((line) => /\b(from|require|import)\s*\(?\s*["'][^"']*middle-web[^"']*["']/.test(line));
        if (importLines.length > 0) {
          offenders.push(`${path.relative(REPO_ROOT, file)}: ${importLines.join(" | ")}`);
        }
      }
    }
    expect(offenders, `apps/atelier imports from apps/middle-web:\n${offenders.join("\n")}`).toEqual([]);
  });

  it("apps/atelier has no dependency on @research-ecology/middle-web in package.json", () => {
    const pkgPath = path.join(REPO_ROOT, "apps/atelier/package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    expect(Object.keys(allDeps)).not.toContain("@research-ecology/middle-web");
  });
});
