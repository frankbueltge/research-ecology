/**
 * Studio adapter (studio / Ensemble) — work order §0, §1, §2, spec 06 §5.3.
 *
 * Imports: protocol docs, chronicle.json, journal/*.md, works/** (premiered only — the repo's
 * own gate is the works/ location itself, so every works/ entry qualifies mechanically).
 * Excludes: projects/, memory/, WORKBOARD.md, .github/.
 *
 * `projects/` may, per the work order note, be referenced by object refs when some other
 * imported record structurally cites it (e.g. the killed "diminishing-returns" project) —
 * but chronicle.json's own `works` arrays (the only structured citation surface this adapter
 * reads) never name it; the kill is only narrated in chronicle prose (session 5's summary
 * text) and in the excluded memory/ dossiers. No reference_only stub is fabricated from
 * unstructured prose — that would be exactly the kind of inference the adapter must not make.
 * Recorded as an import_record below instead of silently doing nothing.
 */

import { contentHash as protocolContentHash, externalEventId } from "../../protocol/src/index.js";
import {
  blobUrl,
  compareCodeUnits,
  commitAuthorDateIso,
  lsTreeRecursive,
  resolveRepo,
  showText,
  topLevelEntries
} from "./generic-git.js";
import { buildDocObjectRef, buildJournalObjectRef, buildManifest, buildWorksObjectRefs, extractReadmeDescription } from "./common.js";
import { IMPORTER_VERSION } from "./types.js";
import type { AdapterEvent, AdapterBundleParts, CoverageRow, Exclusion, ImportRecord, LocalObjectRef } from "./types.js";

const COLLECTIVE_ID = "ensemble";

interface ChronicleEntry {
  collective_session: number;
  date: string;
  move: string;
  summary: string;
  works: string[];
  verdict: string | null;
  [key: string]: unknown;
}

function buildChronicleEvents(repoCommit: string, chronicleUri: string, entries: ChronicleEntry[]): AdapterEvent[] {
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

export function buildStudioBundle(repoPath: string, commitRef: string, generatedAt: string): AdapterBundleParts {
  const repo = resolveRepo(repoPath, commitRef);
  const allPaths = lsTreeRecursive(repo);
  const topLevel = topLevelEntries(allPaths);

  const objects: LocalObjectRef[] = [];
  const events: AdapterEvent[] = [];
  const exclusions: Exclusion[] = [];
  const importRecords: ImportRecord[] = [];
  const coverage: CoverageRow[] = [];

  // --- doc files -----------------------------------------------------------------------------
  const docSpecs: Array<{ path: string; localObjectId: string; localObjectType: string }> = [
    { path: "PROTOCOL.md", localObjectId: "protocol", localObjectType: "protocol-document" },
    { path: "README.md", localObjectId: "readme", localObjectType: "readme-document" },
    { path: "REQUESTS.md", localObjectId: "requests", localObjectType: "inbox-channel" },
    { path: "SITE-API.md", localObjectId: "site-api", localObjectType: "site-api-document" },
    { path: "LICENSE.md", localObjectId: "license", localObjectType: "license-document" }
  ];
  for (const spec of docSpecs) {
    objects.push(buildDocObjectRef(repo, COLLECTIVE_ID, spec, IMPORTER_VERSION));
    coverage.push({ path: spec.path, status: "imported", produced: [`${COLLECTIVE_ID}:${spec.localObjectId}@${repo.shortSha}`] });
  }

  // --- chronicle.json → events -----------------------------------------------------------------
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

  // --- works/** (premiered only — location is the gate) ---------------------------------------
  const { refs: workRefs, importRecords: workImportRecords } = buildWorksObjectRefs(
    repo,
    COLLECTIVE_ID,
    allPaths,
    IMPORTER_VERSION
  );
  objects.push(...workRefs);
  importRecords.push(...workImportRecords);
  coverage.push({ path: "works", status: "imported", produced: workRefs.map((r) => r.id) });

  // --- excluded top-level paths -----------------------------------------------------------------
  const wholeExclusions: Array<[string, string, string]> = [
    ["projects", "local practice boundary", "in-production work, pre-premiere; not yet through the collective's own gate"],
    ["memory", "local practice boundary", "curated memory (decisions, discarded projects, dossiers), not published record"],
    ["WORKBOARD.md", "local practice boundary", "internal phase-tracking board, not published record"],
    [".github", "editorial scope", "CI/automation workflow files, not research content"]
  ];
  for (const [path, kind, reason] of wholeExclusions) {
    if (topLevel.includes(path)) {
      exclusions.push({ collective_id: COLLECTIVE_ID, path, kind, reason, source_commit: repo.commit });
      coverage.push({ path, status: "excluded", detail: reason });
    }
  }

  if (topLevel.includes("projects")) {
    const chronicleCitesProjects = chronicleEntries.some((e) => e.works.some((w) => w.includes("diminishing-returns")));
    if (!chronicleCitesProjects) {
      importRecords.push({
        collective_id: COLLECTIVE_ID,
        kind: "unsupported",
        path: "projects/diminishing-returns",
        reason:
          "the killed 'Diminishing Returns' project is named only in chronicle.json's free-text summary (session 5), never in any entry's structured works[] array",
        detail:
          "No reference_only object ref was created for it: the work order allows projects/ content to be referenced 'when other imported records cite them', but that requires a structured citation, and none was found mechanically. Fabricating a stub from prose would be exactly the inference adapters must not make.",
        source_commit: repo.commit
      });
    }
  }

  // --- manifest --------------------------------------------------------------------------------
  const readmeText = showText(repo, "README.md");
  const manifest = buildManifest({
    repo,
    collectiveId: COLLECTIVE_ID,
    name: "Ensemble",
    surfaceName: "studio",
    description: extractReadmeDescription(readmeText),
    protocolPath: "PROTOCOL.md",
    requestsPath: "REQUESTS.md",
    effectiveFrom: commitAuthorDateIso(repo)
  });
  importRecords.push({
    collective_id: COLLECTIVE_ID,
    kind: "unsupported",
    path: "README.md",
    reason:
      "README.md's only site-surface statement is conditional/future-tense (\"Site surface `/studio`: provisioned when the first increment approaches\"), not a present-tense self-statement like atelier's \"Public: <https://frankbueltge.de/atelier>.\"",
    detail: "manifest.public_url omitted rather than inferred, even though the repo has since premiered a work — that confirmation lives in the frankbueltge.de site repo, not in studio's own words.",
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
