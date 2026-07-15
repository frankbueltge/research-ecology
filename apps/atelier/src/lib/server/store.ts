/**
 * Server-only singleton store (mirrors apps/middle-web's hydration pattern in spirit — work
 * order §2 forbids importing middle-web's code, so this is written fresh, not shared: ADR 0010
 * draws the line at "no cross-app stylesheet or theme package", and a repo-root-relative path
 * finder plus a domain-store hydration call is infrastructure, not visual grammar, but it still
 * has to be this app's own file, not a re-export).
 *
 * Hydrated exactly once per server process from `@research-ecology/domain`'s
 * `hydrateMemoryStoreFromRepo`, which unconditionally loads bundles + the Phase-1 fixture
 * encounter + lenses (work order phase-3a's `runFullLoad`) — the fixture/lenses are irrelevant
 * to the Atelier (it renders no encounter), but the loader has no "bundles only" mode, so they
 * are pointed at the same on-disk directories middle-web already uses and simply left unread by
 * every route in this app.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  hydrateMemoryStoreFromRepo,
  type MemoryStore,
  type StoredAssertion,
  type StoredCollective,
  type StoredImportRecord,
  type StoredObjectRef
} from "@research-ecology/domain";
import type { CollectiveManifest } from "@research-ecology/protocol";

/** The one collective the Atelier renders: Ulysses (irrtum-als-methode). */
export const ATELIER_COLLECTIVE_ID = "ulysses";

function findRepoRoot(startDir: string): string {
  let dir = startDir;
  for (;;) {
    if (existsSync(path.join(dir, "lenses")) && existsSync(path.join(dir, "fixtures")) && existsSync(path.join(dir, "import", "bundles"))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error(
        `research-ecology atelier server store: could not locate the monorepo root by walking up from "${startDir}" (looked for lenses/, fixtures/, import/bundles/).`
      );
    }
    dir = parent;
  }
}

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = findRepoRoot(here);

const HYDRATION_PATHS = {
  bundlesRootDir: path.join(REPO_ROOT, "import/bundles"),
  fixtureDir: path.join(REPO_ROOT, "fixtures/enc-2026-001-calibration-gap-travels"),
  lensesDir: path.join(REPO_ROOT, "lenses")
};

export interface AtelierData {
  collective: StoredCollective | undefined;
  objects: StoredObjectRef[];
  assertions: StoredAssertion[];
  importRecords: StoredImportRecord[];
  /** The full bundle manifest (work order §4 "Manifest-/Protokoll-Stand aus dem Store,
   * Kernel-Wiederverwendung"). `EncounterStore.getCollective()` only carries the smaller,
   * hand-seeded `StoredCollective` record (current_name/status/repository_url/public_url —
   * packages/domain/src/actor-seed.ts) — the richer manifest fields the apparatus room needs
   * (description, responsible_publisher, protocol_url, inbox, effective_from, version) live
   * only in the bundle's own manifest.json, so this reads that file directly, reusing the
   * Phase-2 bundle format/schema (packages/protocol's `CollectiveManifest`) rather than
   * widening the domain Store's read API for one room. */
  manifest: CollectiveManifest | undefined;
}

function findLatestUlyssesBundleDir(bundlesRootDir: string): string | undefined {
  const entries = readdirSync(bundlesRootDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name.startsWith(`${ATELIER_COLLECTIVE_ID}@`))
    .map((e) => e.name)
    .sort();
  const latest = entries[entries.length - 1];
  return latest ? path.join(bundlesRootDir, latest) : undefined;
}

function readUlyssesManifest(bundlesRootDir: string): CollectiveManifest | undefined {
  const dir = findLatestUlyssesBundleDir(bundlesRootDir);
  if (!dir) return undefined;
  return JSON.parse(readFileSync(path.join(dir, "manifest.json"), "utf8")) as CollectiveManifest;
}

let cached: Promise<AtelierData> | undefined;

async function buildAtelierData(): Promise<AtelierData> {
  const { store } = await hydrateMemoryStoreFromRepo(HYDRATION_PATHS);
  const [collective, objects, assertions, importRecords] = await Promise.all([
    store.getCollective(ATELIER_COLLECTIVE_ID),
    store.listObjectsForCollective(ATELIER_COLLECTIVE_ID),
    store.listAssertionsForAuthor(ATELIER_COLLECTIVE_ID),
    store.listImportRecords(ATELIER_COLLECTIVE_ID)
  ]);
  const manifest = readUlyssesManifest(HYDRATION_PATHS.bundlesRootDir);
  return { collective, objects, assertions, importRecords, manifest };
}

/** Cached across the process (mirrors middle-web's "hydrated at server start", not per-request). */
export function getAtelierData(): Promise<AtelierData> {
  if (!cached) cached = buildAtelierData();
  return cached;
}

/** Re-exported so other server-only modules can resolve repo-root-relative paths without
 * re-implementing findRepoRoot (e.g. a future apparatus-page reader of PROTOCOL.md, if ever
 * needed beyond the manifest fields already in `collective`). */
export { REPO_ROOT };

export type { MemoryStore };
