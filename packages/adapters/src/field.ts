/**
 * Field adapter (field-research / Meridian) — work order §0, §1, §2, spec 06 §5.2.
 *
 * Imports: protocol/FIELD-map/README/REQUESTS/SITE-API/LICENSE, chronicle.json, journal/*.md,
 * works/**, and the two published memory/ files (claims.md, downstream-commitments.md).
 * Excludes: drafts/, the rest of memory/, notes/, tools/, WORKBOARD.md, .github/, .gitignore.
 */

import { contentHash as protocolContentHash, externalEventId } from "../../protocol/src/index.js";
import {
  blobUrl,
  compareCodeUnits,
  commitAuthorDateIso,
  immediateChildren,
  lsTreeRecursive,
  resolveRepo,
  showText,
  topLevelEntries
} from "./generic-git.js";
import { buildDocObjectRef, buildJournalObjectRef, buildManifest, buildWorksObjectRefs, extractReadmeDescription } from "./common.js";
import { IMPORTER_VERSION } from "./types.js";
import type { AdapterEvent, AdapterBundleParts, CoverageRow, Exclusion, ImportRecord, LocalObjectRef } from "./types.js";

const COLLECTIVE_ID = "meridian";

interface ChronicleEntry {
  collective_session: number;
  date: string;
  move: string;
  summary: string;
  works: string[];
  verdict: string | null;
  [key: string]: unknown;
}

function buildChronicleEvents(
  repoCommit: string,
  chronicleUri: string,
  entries: ChronicleEntry[]
): AdapterEvent[] {
  return entries.map((entry) => {
    const sourceUri = `${chronicleUri}#session-${entry.collective_session}`;
    const payload = { ...entry };
    const payloadHash = protocolContentHash(payload);
    const eventId = externalEventId(sourceUri, payloadHash, "chronicle.entry");
    // Deliberately untyped (inferred) intermediate — see the note on AdapterEvent in types.ts.
    const withoutHash = {
      schema_version: "1.0" as const,
      event_id: eventId,
      event_type: "chronicle.entry",
      issuer: { collective_id: COLLECTIVE_ID, actor_id: COLLECTIVE_ID },
      occurred_at: `${entry.date}T00:00:00Z`,
      source_uri: sourceUri,
      source_commit: repoCommit,
      visibility: "public" as const,
      payload
    };
    const event: AdapterEvent = { ...withoutHash, content_hash: protocolContentHash(withoutHash) };
    return event;
  });
}

export function buildFieldBundle(repoPath: string, commitRef: string, generatedAt: string): AdapterBundleParts {
  const repo = resolveRepo(repoPath, commitRef);
  const allPaths = lsTreeRecursive(repo);
  const topLevel = topLevelEntries(allPaths);

  const objects: LocalObjectRef[] = [];
  const events: AdapterEvent[] = [];
  const exclusions: Exclusion[] = [];
  const importRecords: ImportRecord[] = [];
  const coverage: CoverageRow[] = [];

  // --- doc files (work order §1 row 1, §0 field boundaries) --------------------------------
  const docSpecs: Array<{ path: string; localObjectId: string; localObjectType: string }> = [
    { path: "PROTOCOL.md", localObjectId: "protocol", localObjectType: "protocol-document" },
    { path: "FIELD.md", localObjectId: "field-map", localObjectType: "field-map" },
    { path: "README.md", localObjectId: "readme", localObjectType: "readme-document" },
    { path: "REQUESTS.md", localObjectId: "requests", localObjectType: "inbox-channel" },
    { path: "SITE-API.md", localObjectId: "site-api", localObjectType: "site-api-document" },
    { path: "LICENSE.md", localObjectId: "license", localObjectType: "license-document" }
  ];
  for (const spec of docSpecs) {
    objects.push(buildDocObjectRef(repo, COLLECTIVE_ID, spec, IMPORTER_VERSION));
    coverage.push({ path: spec.path, status: "imported", produced: [`${COLLECTIVE_ID}:${spec.localObjectId}@${repo.shortSha}`] });
  }

  // --- chronicle.json → events (work order §1 row 4) ---------------------------------------
  const chroniclePath = "chronicle.json";
  const chronicleUri = blobUrl(repo, chroniclePath);
  const chronicleEntries = JSON.parse(showText(repo, chroniclePath)) as ChronicleEntry[];
  events.push(...buildChronicleEvents(repo.commit, chronicleUri, chronicleEntries));
  importRecords.push({
    collective_id: COLLECTIVE_ID,
    kind: "ambiguous",
    path: chroniclePath,
    reason: "chronicle entries carry a date only, not a time of day",
    detail: `occurred_at for all ${chronicleEntries.length} chronicle.entry events is set to midnight UTC on the entry's own date; this is a precision loss, not an invented timestamp.`,
    source_commit: repo.commit
  });
  coverage.push({
    path: chroniclePath,
    status: "imported",
    detail: `${chronicleEntries.length} chronicle.entry events (date-only occurred_at, see import-records.json)`,
    produced: events.map((e) => e.event_id)
  });

  // --- journal/*.md --------------------------------------------------------------------------
  const journalPaths = allPaths.filter((p) => p.startsWith("journal/") && p.endsWith(".md")).sort(compareCodeUnits);
  const journalIds: string[] = [];
  for (const path of journalPaths) {
    const { ref, importRecord } = buildJournalObjectRef(repo, COLLECTIVE_ID, path, IMPORTER_VERSION);
    objects.push(ref);
    journalIds.push(ref.id);
    if (importRecord) importRecords.push(importRecord);
  }
  coverage.push({ path: "journal", status: "imported", produced: journalIds });

  // --- works/** --------------------------------------------------------------------------------
  const { refs: workRefs, importRecords: workImportRecords } = buildWorksObjectRefs(
    repo,
    COLLECTIVE_ID,
    allPaths,
    IMPORTER_VERSION
  );
  objects.push(...workRefs);
  importRecords.push(...workImportRecords);
  coverage.push({ path: "works", status: "imported", produced: workRefs.map((r) => r.id) });

  // --- memory/: two published files imported, the rest excluded (ADR 0003, work order §0) -----
  const publishedMemoryFiles: Record<string, { localObjectId: string; localObjectType: string }> = {
    "memory/claims.md": { localObjectId: "claims-ledger", localObjectType: "claims-ledger" },
    "memory/downstream-commitments.md": { localObjectId: "downstream-commitments-doc", localObjectType: "downstream-contract" }
  };
  const memoryChildren = immediateChildren(allPaths, "memory");
  const memoryImportedIds: string[] = [];
  for (const child of memoryChildren) {
    const published = publishedMemoryFiles[child];
    if (published) {
      const ref = buildDocObjectRef(repo, COLLECTIVE_ID, { path: child, ...published }, IMPORTER_VERSION);
      objects.push(ref);
      memoryImportedIds.push(ref.id);
      coverage.push({ path: child, status: "imported", produced: [ref.id] });
    } else {
      exclusions.push({
        collective_id: COLLECTIVE_ID,
        path: child,
        kind: "local practice boundary",
        reason: "collective's own curated/discarded memory, not a published contract (ADR 0003)",
        source_commit: repo.commit
      });
      coverage.push({ path: child, status: "excluded", detail: "local practice boundary" });
    }
  }
  coverage.push({
    path: "memory",
    status: "imported",
    detail: "mixed: memory/claims.md and memory/downstream-commitments.md imported as published record; everything else under memory/ excluded (see the memory/* rows above and exclusions.json)",
    produced: memoryImportedIds
  });

  // --- wholly excluded top-level paths --------------------------------------------------------
  const wholeExclusions: Array<[string, string, string]> = [
    ["drafts", "local practice boundary", "pre-publication work, not yet through the collective's own gauntlet"],
    ["notes", "local practice boundary", "working notes, not published record"],
    ["tools", "editorial scope", "operator tooling (memory indexer CLI), not research content"],
    ["WORKBOARD.md", "local practice boundary", "internal phase-tracking board, not published record"],
    [".github", "editorial scope", "CI/automation workflow files, not research content"],
    [".gitignore", "editorial scope", "VCS configuration, not research content"]
  ];
  for (const [path, kind, reason] of wholeExclusions) {
    if (topLevel.includes(path)) {
      exclusions.push({ collective_id: COLLECTIVE_ID, path, kind, reason, source_commit: repo.commit });
      coverage.push({ path, status: "excluded", detail: reason });
    }
  }

  // --- manifest --------------------------------------------------------------------------------
  const readmeText = showText(repo, "README.md");
  const manifest = buildManifest({
    repo,
    collectiveId: COLLECTIVE_ID,
    name: "Meridian",
    surfaceName: "field",
    description: extractReadmeDescription(readmeText),
    protocolPath: "PROTOCOL.md",
    requestsPath: "REQUESTS.md",
    effectiveFrom: commitAuthorDateIso(repo)
  });
  importRecords.push({
    collective_id: COLLECTIVE_ID,
    kind: "unsupported",
    path: "README.md",
    reason: "no explicit self-stated public site URL found in README.md (unlike atelier's 'Public: <https://frankbueltge.de/atelier>.')",
    detail: "manifest.public_url omitted rather than inferred from the sibling repos' naming convention.",
    source_commit: repo.commit
  });

  // --- unaccounted-for top-level paths (defensive; work order §3 test 8) ----------------------
  const accountedPaths = new Set(coverage.map((row) => row.path));
  for (const path of topLevel) {
    if (!accountedPaths.has(path)) {
      importRecords.push({
        collective_id: COLLECTIVE_ID,
        kind: "unsupported",
        path,
        reason: "top-level path present in the tree at this commit but not handled by any adapter rule",
        source_commit: repo.commit
      });
      coverage.push({ path, status: "unsupported", detail: "no adapter rule covers this path; see import-records.json" });
    }
  }

  return {
    manifest,
    objects,
    events,
    assertions: [],
    exclusions,
    importRecords,
    coverage: {
      collective_id: COLLECTIVE_ID,
      source_commit: repo.commit,
      source_commit_short: repo.shortSha,
      repository_url: `https://github.com/${repo.repoSlug}`,
      importer_version: IMPORTER_VERSION,
      generated_at: generatedAt,
      rows: coverage
    }
  };
}
