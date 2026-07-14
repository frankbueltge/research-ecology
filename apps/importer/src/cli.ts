#!/usr/bin/env node
/**
 * Importer CLI (work order §2):
 *
 *   npx tsx apps/importer/src/cli.ts --repo ../field-research --collective meridian \
 *     --commit HEAD --out import/bundles [--generated-at 2026-07-14T00:00:00Z]
 *
 * Read-only toward the engine repo (packages/adapters/src/generic-git.ts is the only thing
 * that shells out to git, and only ever with show/log/rev-parse/ls-tree/remote). Writes
 * nothing but the bundle directory under --out.
 */

import { buildBundle, commitAuthorDateIso, resolveRepo, writeBundle, type CollectiveId } from "@research-ecology/adapters";

interface Args {
  repo: string;
  collective: CollectiveId;
  commit: string;
  out: string;
  generatedAt?: string;
}

function parseArgs(argv: string[]): Args {
  const map = new Map<string, string>();
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token?.startsWith("--")) {
      const key = token.slice(2);
      const value = argv[i + 1];
      if (value === undefined || value.startsWith("--")) {
        throw new Error(`missing value for --${key}`);
      }
      map.set(key, value);
      i += 1;
    }
  }
  const repo = map.get("repo");
  const collective = map.get("collective");
  if (!repo) throw new Error("missing required --repo <path>");
  if (!collective) throw new Error("missing required --collective <ulysses|meridian|ensemble>");
  if (!["ulysses", "meridian", "ensemble"].includes(collective)) {
    throw new Error(`--collective must be one of ulysses|meridian|ensemble, got: ${collective}`);
  }
  return {
    repo,
    collective: collective as CollectiveId,
    commit: map.get("commit") ?? "HEAD",
    out: map.get("out") ?? "import/bundles",
    generatedAt: map.get("generated-at")
  };
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  const repo = resolveRepo(args.repo, args.commit);
  // Default generated_at to the pinned commit's own author date rather than wall-clock time:
  // this keeps two separate invocations against the same commit byte-identical (work order §0)
  // even if the caller does not pass --generated-at explicitly.
  const generatedAt = args.generatedAt ?? commitAuthorDateIso(repo);
  const parts = buildBundle(args.collective, args.repo, repo.commit, generatedAt);
  const { dir } = writeBundle(args.out, args.collective, repo.shortSha, parts);
  process.stdout.write(`${dir}\n`);
}

main();
