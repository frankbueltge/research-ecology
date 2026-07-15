/**
 * Helpers shared by the three collective adapters (atelier.ts / field.ts / studio.ts).
 *
 * Kept deliberately small and mechanical: every function here is a straight, auditable
 * transformation of git-pinned bytes into a bundle record. Nothing infers a relation or
 * guesses a missing value (work order §0 "adapters never infer relations"; ADR 0003 /
 * spec 06 §5 "must not... silently skip unsupported files").
 */

import { contentHash as protocolContentHash } from "../../protocol/src/index.js";
import type { CollectiveManifest } from "../../protocol/src/index.js";
import {
  type RepoHandle,
  blobUrl,
  compareCodeUnits,
  fileContentHash,
  immediateChildren,
  sha256Hex,
  showBytes,
  showText
} from "./generic-git.js";
import type { ImportRecord, LocalObjectRef } from "./types.js";

/** Recognised patterns for a journal entry's own declared session number (in priority order). */
const SESSION_PATTERNS: RegExp[] = [
  // "(Session 27)" / "(collective session 24 — ...)" — atelier's later style and field/studio.
  /\((?:collective\s+)?session\s+0*(\d+)/i,
  // "# Session 01 — 2026-07-01" — field's very first journal file.
  /^#\s*session\s+0*(\d+)\s*[—-]/im,
  // "*Session 8. Mode: ...*" — atelier's earliest style, session number only in the caption.
  /^\*session\s+0*(\d+)\./im
];

/**
 * Extracts the journal entry's own declared session number from its heading block (the text
 * before the first `---` rule, which every observed journal entry across all three repos uses
 * to separate its heading/caption from the body). Deliberately scoped to that block: scanning
 * the whole file risks matching a later cross-reference to a *different* session mentioned in
 * the body (observed in field-research journal/2026-07-11.md, whose body contains an
 * annotation citing "collective session 25" while the entry's own heading is session 24).
 * Returns null — never a guess — when no pattern matches.
 */
export function parseHeadingSessionNumber(text: string): number | null {
  const headingBlock = text.split(/\r?\n---/)[0] ?? text;
  for (const pattern of SESSION_PATTERNS) {
    const match = pattern.exec(headingBlock);
    if (match) {
      return Number.parseInt(match[1]!, 10);
    }
  }
  return null;
}

/**
 * The repo's own description, verbatim from its README.md: the first non-heading paragraph.
 * Internal line-wraps are joined with a single space (markdown soft-wrap only — not a
 * paraphrase of the words themselves); the text and word order are otherwise untouched.
 */
export function extractReadmeDescription(readmeText: string): string {
  const paragraphs = readmeText
    .split(/\r?\n\r?\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  const descriptive = paragraphs.find((p) => !p.startsWith("#"));
  if (!descriptive) {
    throw new Error("extractReadmeDescription: no non-heading paragraph found in README.md");
  }
  return descriptive.replace(/\s*\r?\n\s*/g, " ").trim();
}

export function mediaTypeForPath(path: string): string | undefined {
  if (path.endsWith(".md")) return "text/markdown";
  if (path.endsWith(".json")) return "application/json";
  if (path.endsWith(".html")) return "text/html";
  if (path.endsWith(".astro")) return "text/plain";
  return undefined;
}

export interface DocRefSpec {
  path: string;
  localObjectId: string;
  localObjectType: string;
}

/** One whole-file `local_object_ref` (work order §1, row 1: "content_hash over raw bytes"). */
export function buildDocObjectRef(
  repo: RepoHandle,
  collectiveId: string,
  spec: DocRefSpec,
  importerVersion: string
): LocalObjectRef {
  const uri = blobUrl(repo, spec.path);
  return {
    id: `${collectiveId}:${spec.localObjectId}@${repo.shortSha}`,
    collective_id: collectiveId,
    local_object_id: spec.localObjectId,
    object_version: repo.commit,
    canonical_uri: uri,
    source_uri: uri,
    media_type: mediaTypeForPath(spec.path),
    local_object_type: spec.localObjectType,
    lifecycle_status: "active",
    content_hash: fileContentHash(repo, spec.path),
    source_commit: repo.commit,
    source_metadata: { pinned_file: spec.path },
    importer_version: importerVersion
  };
}

export interface JournalRefResult {
  ref: LocalObjectRef;
  importRecord?: ImportRecord;
}

/**
 * One `local_object_ref` per journal file (work order §1, row 3). Session numbers parsed from
 * the heading go to `source_metadata.sessions[]`; a parse failure produces an import_record
 * (kind "ambiguous") and leaves `sessions` empty rather than guessing.
 */
export function buildJournalObjectRef(
  repo: RepoHandle,
  collectiveId: string,
  path: string,
  importerVersion: string
): JournalRefResult {
  const text = showText(repo, path);
  const session = parseHeadingSessionNumber(text);
  const localObjectId = path.split("/").pop()!.replace(/\.md$/, "");
  const uri = blobUrl(repo, path);
  const ref: LocalObjectRef = {
    id: `${collectiveId}:${localObjectId}@${repo.shortSha}`,
    collective_id: collectiveId,
    local_object_id: localObjectId,
    object_version: repo.commit,
    canonical_uri: uri,
    source_uri: uri,
    media_type: "text/markdown",
    local_object_type: "session-journal",
    lifecycle_status: "active",
    content_hash: `sha256:${sha256Hex(Buffer.from(text, "utf8"))}`,
    source_commit: repo.commit,
    source_metadata: {
      pinned_file: path,
      sessions: session === null ? [] : [session]
    },
    importer_version: importerVersion
  };
  if (session === null) {
    return {
      ref,
      importRecord: {
        collective_id: collectiveId,
        kind: "ambiguous",
        path,
        reason: "no session number found in the journal entry's heading block",
        detail:
          "Scanned the text before the first '---' rule for the known heading patterns " +
          "((Session N), (collective session N), '# Session N —', '*Session N.'); none matched. " +
          "Never guessed from the filename.",
        source_commit: repo.commit
      }
    };
  }
  return { ref };
}

export interface FileInventoryEntry {
  path: string;
  sha256: string;
}

/** Sorted {path, sha256} inventory for a multi-file work directory, hashed via the Phase-1 kernel. */
export function buildFileInventory(repo: RepoHandle, dirPrefix: string, relativePaths: string[]): FileInventoryEntry[] {
  return relativePaths
    .map((relPath) => ({
      path: relPath,
      sha256: sha256Hex(showBytes(repo, `${dirPrefix}/${relPath}`))
    }))
    .sort((a, b) => compareCodeUnits(a.path, b.path));
}

/**
 * content_hash for a multi-file work: not a hash of one file's raw bytes (that convention is
 * for single-file doc refs, work order §1 row 1) but a deterministic hash over the sorted
 * per-file inventory, reusing the Phase-1 canonical-JSON contentHash so it stays reproducible
 * and independently verifiable from the `files` array carried alongside it in source_metadata.
 */
export function inventoryContentHash(inventory: FileInventoryEntry[]): string {
  return protocolContentHash({ files: inventory });
}

export interface WorksCollectionResult {
  refs: LocalObjectRef[];
  importRecords: ImportRecord[];
}

/**
 * `works/**` → one `local_object_ref` per top-level `works/` entry (work order §1, row 2).
 *
 * Two shapes are observed across the three repos:
 *  - a work directory (`works/<slug>/`, one or more files, usually including `meta.json`):
 *    `local_object_type` is that directory's own `meta.json` `medium` field, verbatim;
 *    content_hash is a deterministic hash over the sorted per-file inventory (not one file's
 *    raw bytes — there is no single canonical file across every observed work directory —
 *    the inventory itself, with each file's own sha256, is carried in source_metadata so a
 *    human can re-derive and check it directly, same as the raw-bytes convention elsewhere).
 *  - a bare file directly under `works/` (e.g. `works/genealogie.md` — no directory, no
 *    `meta.json` possible at all; observed only in irrtum-als-methode/atelier). This is not
 *    the same as a work directory missing its metadata — it is a structurally different,
 *    simpler artifact (a standing note/register), so it is labelled with its own honest type
 *    string rather than routed through the "medium field missing" fallback+import_record.
 *
 * A work *directory* with no `meta.json`, or with `meta.json` but no `medium` field, is a
 * genuine gap against the expected shape: falls back to `local_object_type: "work"` and an
 * import_record notes exactly what was missing (work order §1 row 2's own fallback clause).
 */
export function buildWorksObjectRefs(
  repo: RepoHandle,
  collectiveId: string,
  allPaths: string[],
  importerVersion: string
): WorksCollectionResult {
  const refs: LocalObjectRef[] = [];
  const importRecords: ImportRecord[] = [];
  const groups = immediateChildren(allPaths, "works").filter((g) => !g.endsWith("/.gitkeep"));

  for (const group of groups) {
    const isDirectory = allPaths.some((p) => p.startsWith(`${group}/`));
    if (!isDirectory) {
      // Bare file directly under works/ (atelier: fehlerkataster-NNN.md, genealogie.md, ...).
      const localObjectId = group.split("/").pop()!.replace(/\.[a-z0-9]+$/i, "");
      const uri = blobUrl(repo, group);
      refs.push({
        id: `${collectiveId}:${localObjectId}@${repo.shortSha}`,
        collective_id: collectiveId,
        local_object_id: localObjectId,
        object_version: repo.commit,
        canonical_uri: uri,
        source_uri: uri,
        media_type: mediaTypeForPath(group),
        local_object_type: "work-note",
        lifecycle_status: "published (works/)",
        content_hash: fileContentHash(repo, group),
        source_commit: repo.commit,
        source_metadata: {
          pinned_file: group,
          type_derivation:
            "adapter-assigned: bare file directly under works/, no meta.json — a distinct shape from the dated work directories; the source declares no type for these files"
        },
        importer_version: importerVersion
      });
      continue;
    }

    const dirPrefix = group;
    const slug = dirPrefix.split("/").pop()!;
    const relPaths = allPaths
      .filter((p) => p.startsWith(`${dirPrefix}/`))
      .map((p) => p.slice(dirPrefix.length + 1));
    const inventory = buildFileInventory(repo, dirPrefix, relPaths);
    const metaJsonRel = relPaths.find((p) => p === "meta.json");

    let localObjectType = "work";
    let mediumDerivation: string;
    // `title` (work order phase-c1 §1 finding, 2026-07-15): meta.json's own `title` field,
    // read from the same parse as `medium` below — no new file read, no inference. Populates
    // `title_cache` so a consumer (e.g. apps/atelier's sheet) can render the work's verbatim
    // display name without re-deriving it from `local_object_id` (a slug, not a title) or from
    // a rhizome node's `label` (only present for nodes that fail to resolve to a work ref —
    // see resolveRhizomeEndpoint in atelier.ts). Left `undefined` (not fabricated, not an
    // import_record) on the rare/hypothetical meta.json that omits it — every meta.json
    // observed across all three engine repos at the time of this change carries a non-empty
    // `title`, so this is a graceful edge, not an expected path.
    let titleCache: string | undefined;
    // `date` (same finding): meta.json's own `date` field (ISO `YYYY-MM-DD`), carried into
    // `source_metadata.date` — the design's ink slabs show a work's date; the only other place
    // it appears verbatim is inside `local_object_id` itself (which is a slug, e.g.
    // "2026-07-14-differential-reproduction" — parsing a date out of a slug client-side would
    // be a derivation, not a store field, so it is captured explicitly here instead).
    let workDate: string | undefined;
    if (!metaJsonRel) {
      importRecords.push({
        collective_id: collectiveId,
        kind: "unsupported",
        path: dirPrefix,
        reason: "no meta.json in this work directory",
        detail: "local_object_type falls back to 'work' (work order §1, row 2's fallback clause).",
        source_commit: repo.commit
      });
      mediumDerivation = "no meta.json present in this work directory";
    } else {
      const metaText = showText(repo, `${dirPrefix}/meta.json`);
      let meta: Record<string, unknown> | undefined;
      let medium: unknown;
      try {
        meta = JSON.parse(metaText) as Record<string, unknown>;
        medium = meta.medium;
      } catch (error) {
        importRecords.push({
          collective_id: collectiveId,
          kind: "unsupported",
          path: `${dirPrefix}/meta.json`,
          reason: "meta.json did not parse as JSON",
          detail: String((error as Error).message),
          source_commit: repo.commit
        });
        medium = undefined;
      }
      if (typeof medium === "string" && medium.length > 0) {
        localObjectType = medium;
        mediumDerivation = `meta.json 'medium' field at this commit: "${medium}"`;
      } else {
        importRecords.push({
          collective_id: collectiveId,
          kind: "unsupported",
          path: `${dirPrefix}/meta.json`,
          reason: "meta.json has no non-empty 'medium' field",
          detail: "local_object_type falls back to 'work' (work order §1, row 2's fallback clause).",
          source_commit: repo.commit
        });
        mediumDerivation = "meta.json exists but has no non-empty 'medium' field";
      }
      const title = meta?.title;
      if (typeof title === "string" && title.length > 0) {
        titleCache = title;
      }
      const date = meta?.date;
      if (typeof date === "string" && date.length > 0) {
        workDate = date;
      }
    }

    refs.push({
      id: `${collectiveId}:${slug}@${repo.shortSha}`,
      collective_id: collectiveId,
      local_object_id: slug,
      object_version: repo.commit,
      canonical_uri: blobUrl(repo, dirPrefix),
      source_uri: blobUrl(repo, dirPrefix),
      local_object_type: localObjectType,
      ...(titleCache ? { title_cache: titleCache } : {}),
      lifecycle_status: "published (works/)",
      content_hash: inventoryContentHash(inventory),
      source_commit: repo.commit,
      source_metadata: {
        pinned_dir: dirPrefix,
        local_object_type_derivation: mediumDerivation,
        title_cache_derivation: titleCache
          ? `meta.json 'title' field at this commit: "${titleCache}"`
          : "meta.json missing or has no non-empty 'title' field; title_cache omitted",
        ...(workDate ? { date: workDate } : {}),
        content_hash_basis:
          "sha256 over canonicalJson({ files }) of the sorted per-file inventory below (path -> sha256 of raw bytes at this commit) — reused from the Phase-1 kernel's contentHash, not a hash of one file's raw bytes.",
        files: inventory
      },
      importer_version: importerVersion
    });
  }

  return { refs, importRecords };
}

export function buildManifest(params: {
  repo: RepoHandle;
  collectiveId: string;
  name: string;
  surfaceName: string;
  description: string;
  protocolPath: string;
  requestsPath: string;
  publicUrl?: string;
  effectiveFrom: string;
}): CollectiveManifest {
  const { repo, collectiveId, name, surfaceName, description, protocolPath, requestsPath, publicUrl, effectiveFrom } =
    params;
  // Deliberately untyped (inferred) intermediate — see the note on AdapterEvent/AdapterAssertion
  // in types.ts: annotating this as `Omit<CollectiveManifest, "content_hash">` would collapse
  // every field to `unknown` because CollectiveManifest carries a `[key: string]: unknown`
  // index signature. Letting TS infer the literal type here, then checking the merged object
  // below against the real `CollectiveManifest` return type, keeps the required fields enforced.
  const manifestWithoutHash = {
    schema_version: "1.0" as const,
    collective_id: collectiveId,
    name,
    surface_name: surfaceName,
    description,
    protocol_url: blobUrl(repo, protocolPath),
    repository_url: `https://github.com/${repo.repoSlug}`,
    ...(publicUrl ? { public_url: publicUrl } : {}),
    responsible_publisher: "Frank Bültge",
    status: "active" as const,
    inbox: { mode: "repository_file", url: blobUrl(repo, requestsPath) },
    effective_from: effectiveFrom,
    version: 1
  };
  const manifest: CollectiveManifest = { ...manifestWithoutHash, content_hash: protocolContentHash(manifestWithoutHash) };
  return manifest;
}
