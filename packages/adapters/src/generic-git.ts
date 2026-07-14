/**
 * Generic, read-only git plumbing shared by every collective adapter (work order §2, §4).
 *
 * Hard boundary (ADR 0003 / work order §4): every access to an engine repository goes
 * through `git -C <repo> show|log|rev-parse|ls-tree|remote` below. Nothing here ever writes
 * to the engine repo's working tree, index, or refs — no `git add`, `commit`, `checkout`,
 * `reset`, etc. appear anywhere in this module. One commit is resolved once per adapter run
 * (locked, §0) and every read after that is pinned to that single commit.
 *
 * Hand-rolled child_process wrapper (no execa/simple-git dependency, per work order §4:
 * "no new runtime deps beyond node builtins").
 */

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

export class GitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GitError";
  }
}

/** A repository pinned to one resolved commit for the duration of an adapter run. */
export interface RepoHandle {
  /** Absolute or relative filesystem path to the local read-only clone. */
  readonly repoPath: string;
  /** Full 40-character commit SHA the run is pinned to. */
  readonly commit: string;
  /** First 7 characters of `commit` — used in bundle directory names and object ids. */
  readonly shortSha: string;
  /** `owner/name` parsed from the `origin` remote, e.g. `frankbueltge/field-research`. */
  readonly repoSlug: string;
}

function runGitText(repoPath: string, args: string[]): string {
  try {
    return execFileSync("git", ["-C", repoPath, ...args], {
      encoding: "utf8",
      maxBuffer: 1024 * 1024 * 256
    }).replace(/\n$/, "");
  } catch (error) {
    const stderr = (error as { stderr?: Buffer | string }).stderr;
    const detail = stderr ? stderr.toString() : (error as Error).message;
    throw new GitError(`git -C ${repoPath} ${args.join(" ")} failed: ${detail}`);
  }
}

function runGitBuffer(repoPath: string, args: string[]): Buffer {
  try {
    return execFileSync("git", ["-C", repoPath, ...args], {
      maxBuffer: 1024 * 1024 * 256
    });
  } catch (error) {
    const stderr = (error as { stderr?: Buffer | string }).stderr;
    const detail = stderr ? stderr.toString() : (error as Error).message;
    throw new GitError(`git -C ${repoPath} ${args.join(" ")} failed: ${detail}`);
  }
}

/** Parses `owner/repo` out of an `origin` remote URL (git@ or https:// form, .git optional). */
function parseRepoSlug(remoteUrl: string): string {
  const match = remoteUrl
    .trim()
    .match(/[:/]([^/:]+)\/([^/]+?)(?:\.git)?$/);
  if (!match) {
    throw new GitError(`could not parse owner/repo from origin remote URL: ${remoteUrl}`);
  }
  const [, owner, name] = match;
  return `${owner}/${name}`;
}

/**
 * Resolves `commitRef` (a sha or a ref like `HEAD`) to a full commit SHA and reads the
 * `origin` remote once. Read-only: `rev-parse` and `remote get-url` do not touch refs.
 */
export function resolveRepo(repoPath: string, commitRef: string): RepoHandle {
  const commit = runGitText(repoPath, ["rev-parse", commitRef]);
  if (!/^[0-9a-f]{40}$/.test(commit)) {
    throw new GitError(`git rev-parse did not return a full sha for ${commitRef}: ${commit}`);
  }
  const remoteUrl = runGitText(repoPath, ["remote", "get-url", "origin"]);
  const repoSlug = parseRepoSlug(remoteUrl);
  return { repoPath, commit, shortSha: commit.slice(0, 7), repoSlug };
}

/** Every blob path in the tree at the pinned commit, git's own (stable) listing order. */
export function lsTreeRecursive(repo: RepoHandle, subpath?: string): string[] {
  const args = ["ls-tree", "-r", "--name-only", repo.commit];
  if (subpath) {
    args.push("--", subpath);
  }
  const out = runGitText(repo.repoPath, args);
  return out.length === 0 ? [] : out.split("\n");
}

/** Unique first path segments (or bare root-level filenames), lexicographically sorted. */
export function topLevelEntries(paths: string[]): string[] {
  const set = new Set<string>();
  for (const p of paths) {
    const slash = p.indexOf("/");
    set.add(slash === -1 ? p : p.slice(0, slash));
  }
  return [...set].sort(compareCodeUnits);
}

/** Immediate children one level under `prefix` (e.g. `memory/claims.md`, `memory/dossiers`). */
export function immediateChildren(paths: string[], prefix: string): string[] {
  const withPrefix = prefix.endsWith("/") ? prefix : `${prefix}/`;
  const set = new Set<string>();
  for (const p of paths) {
    if (!p.startsWith(withPrefix)) continue;
    const rest = p.slice(withPrefix.length);
    const slash = rest.indexOf("/");
    set.add(withPrefix + (slash === -1 ? rest : rest.slice(0, slash)));
  }
  return [...set].sort(compareCodeUnits);
}

export function pathExistsAtCommit(repo: RepoHandle, path: string): boolean {
  try {
    runGitText(repo.repoPath, ["cat-file", "-e", `${repo.commit}:${path}`]);
    return true;
  } catch {
    return false;
  }
}

/** Raw bytes of `path` at the pinned commit — safe for binary files (images, PEMs, etc.). */
export function showBytes(repo: RepoHandle, path: string): Buffer {
  return runGitBuffer(repo.repoPath, ["show", `${repo.commit}:${path}`]);
}

/** UTF-8 text of `path` at the pinned commit. */
export function showText(repo: RepoHandle, path: string): string {
  return showBytes(repo, path).toString("utf8");
}

export function sha256Hex(bytes: Buffer | string): string {
  return createHash("sha256").update(bytes).digest("hex");
}

/** `sha256:<hex>` over the raw bytes of `path` at the pinned commit (work order §1, row 1). */
export function fileContentHash(repo: RepoHandle, path: string): string {
  return `sha256:${sha256Hex(showBytes(repo, path))}`;
}

/** Pinned GitHub blob URL — the canonical, dereferenceable source pointer for a file. */
export function blobUrl(repo: RepoHandle, path: string, fragment?: string): string {
  const base = `https://github.com/${repo.repoSlug}/blob/${repo.commit}/${path}`;
  return fragment ? `${base}#${fragment}` : base;
}

/** The pinned commit's own author date, converted to UTC ISO-8601 (`...Z`). */
export function commitAuthorDateIso(repo: RepoHandle): string {
  const raw = runGitText(repo.repoPath, ["show", "-s", "--format=%aI", repo.commit]);
  return new Date(raw).toISOString().replace(/\.000Z$/, "Z");
}

/** Stable, locale-independent string comparison (mirrors canonicalJson's key ordering). */
export function compareCodeUnits(a: string, b: string): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}
