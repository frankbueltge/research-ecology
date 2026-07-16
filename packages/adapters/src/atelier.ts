/**
 * Atelier adapter (irrtum-als-methode / Ulysses) — work order §0, §1, §2, spec 06 §5.1.
 *
 * Imports: protocol docs, journal sessions, works/, the atlas (as one whole-file reference),
 * pulse/rhizome.json edges and pulse/vital-signs.json history as Ulysses-authored assertions.
 * Excludes: tools/, .github/ (editorial scope). `memory/` does not exist at any commit this
 * adapter has been run against (gitignored derived index) — nothing to exclude, so no
 * coverage row is fabricated for a path absent from the tree.
 */

import { contentHash as protocolContentHash } from "../../protocol/src/index.js";
import {
  blobUrl,
  compareCodeUnits,
  commitAuthorDateIso,
  lsTreeRecursive,
  resolveRepo,
  showText,
  topLevelEntries
} from "./generic-git.js";
import {
  buildDocObjectRef,
  buildJournalObjectRef,
  buildManifest,
  buildWorksObjectRefs,
  extractReadmeDescription
} from "./common.js";
import { IMPORTER_VERSION } from "./types.js";
import type {
  AdapterAssertion,
  AdapterBundleParts,
  CoverageRow,
  Exclusion,
  ImportRecord,
  LocalObjectRef
} from "./types.js";

const COLLECTIVE_ID = "ulysses";

/** For assertion ids only — the verbatim `predicate`/label fields are never touched. */
function slugForId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

interface RhizomeNode {
  id: string;
  kind: string;
  label?: string;
  date?: string;
  [key: string]: unknown;
}

interface RhizomeEdge {
  from: string;
  to: string;
  kind: string;
  session?: number;
  [key: string]: unknown;
}

function resolveRhizomeEndpoint(
  node: RhizomeNode | undefined,
  nodeId: string,
  workRefsBySlug: Map<string, LocalObjectRef>
): Record<string, unknown> {
  if (!node) {
    return { unresolved_node_id: nodeId };
  }
  if (node.kind === "work") {
    const slug = node.id.replace(/^w-/, "");
    const ref = workRefsBySlug.get(slug);
    if (ref) {
      return { local_object_ref_id: ref.id };
    }
    // Falls through deliberately: a "work"-kind node whose id does not match any works/ path
    // by direct prefix-stripping is a genuine ambiguity, recorded by the caller as an
    // import_record — never guessed at by fuzzy/title matching.
  }
  // thread-/atlas:-kind nodes (and unresolved work nodes) carry the raw node record verbatim.
  return { ...node };
}

export function buildAtelierBundle(repoPath: string, commitRef: string, generatedAt: string): AdapterBundleParts {
  const repo = resolveRepo(repoPath, commitRef);
  const allPaths = lsTreeRecursive(repo);
  const topLevel = topLevelEntries(allPaths);

  const objects: LocalObjectRef[] = [];
  const assertions: AdapterAssertion[] = [];
  const exclusions: Exclusion[] = [];
  const importRecords: ImportRecord[] = [];
  const coverage: CoverageRow[] = [];

  // --- doc files (work order §1 row 1) ---------------------------------------------------
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

  // --- atlas/atlas.json: ONE whole-file reference; per-entry import deferred (work order §1 row 6) ---
  const atlasPath = "atlas/atlas.json";
  const atlasRef = buildDocObjectRef(
    repo,
    COLLECTIVE_ID,
    { path: atlasPath, localObjectId: "atlas", localObjectType: "source-atlas" },
    IMPORTER_VERSION
  );
  objects.push(atlasRef);
  exclusions.push({
    collective_id: COLLECTIVE_ID,
    path: atlasPath,
    kind: "computational limit",
    reason: "per-entry atlas import deferred",
    source_commit: repo.commit
  });
  coverage.push({
    path: "atlas",
    status: "imported",
    detail: "imported as one whole-file source-atlas object ref; per-entry import deferred (see exclusions.json)",
    produced: [atlasRef.id]
  });

  // --- journal/*.md ------------------------------------------------------------------------
  const journalPaths = allPaths.filter((p) => p.startsWith("journal/") && p.endsWith(".md")).sort(compareCodeUnits);
  const journalIds: string[] = [];
  for (const path of journalPaths) {
    const { ref, importRecord } = buildJournalObjectRef(repo, COLLECTIVE_ID, path, IMPORTER_VERSION);
    objects.push(ref);
    journalIds.push(ref.id);
    if (importRecord) importRecords.push(importRecord);
  }
  coverage.push({ path: "journal", status: "imported", produced: journalIds });

  // --- works/** ------------------------------------------------------------------------------
  const { refs: workRefs, importRecords: workImportRecords } = buildWorksObjectRefs(
    repo,
    COLLECTIVE_ID,
    allPaths,
    IMPORTER_VERSION
  );
  objects.push(...workRefs);
  importRecords.push(...workImportRecords);
  coverage.push({ path: "works", status: "imported", produced: workRefs.map((r) => r.id) });

  const workRefsBySlug = new Map(workRefs.map((r) => [r.local_object_id, r]));

  // --- pulse/vital-signs.json history → closure assertions (work order §1 row 5) -----------
  const vitalSignsPath = "pulse/vital-signs.json";
  const vitalSignsText = showText(repo, vitalSignsPath);
  const vitalSigns = JSON.parse(vitalSignsText) as { history: Array<Record<string, unknown>> };
  const vitalSignsUri = blobUrl(repo, vitalSignsPath);
  for (const entry of vitalSigns.history) {
    const session = entry.session as number;
    const closureNote = String(entry.closure_note ?? "");
    const firstWord = closureNote.split(/\s+/)[0] ?? "";
    // Deliberately untyped (inferred) intermediate — see the note on AdapterAssertion in
    // types.ts (Omit collapses to `unknown` fields on protocol types with an index signature).
    const withoutHash = {
      assertion_id: `${COLLECTIVE_ID}:closure-session-${session}@${repo.shortSha}`,
      author: { actor_id: COLLECTIVE_ID, collective_id: COLLECTIVE_ID },
      subject: {
        source_uri: `${vitalSignsUri}#session-${session}`,
        field_path: `pulse/vital-signs.json:history[session=${session}]`,
        session
      },
      predicate: "self-assessment.closure",
      object: { ...entry },
      local_epistemic_status: firstWord,
      epistemic_status: "conjecture",
      rationale: closureNote,
      evidence: [
        {
          source_uri: `${vitalSignsUri}#session-${session}`,
          source_commit: repo.commit,
          field_path: `pulse/vital-signs.json:history[session=${session}]`
        }
      ],
      lifecycle_status: "active",
      visibility: "public"
    };
    const assertion: AdapterAssertion = { ...withoutHash, content_hash: protocolContentHash(withoutHash) };
    assertions.push(assertion);
  }

  // --- pulse/rhizome.json edges → interpretation assertions (work order §1 row 4) ----------
  const rhizomePath = "pulse/rhizome.json";
  const rhizomeText = showText(repo, rhizomePath);
  const rhizome = JSON.parse(rhizomeText) as { nodes: RhizomeNode[]; edges: RhizomeEdge[] };
  const rhizomeUri = blobUrl(repo, rhizomePath);
  const nodesById = new Map(rhizome.nodes.map((n) => [n.id, n]));
  rhizome.edges.forEach((edge, index) => {
    const fromNode = nodesById.get(edge.from);
    const toNode = nodesById.get(edge.to);
    if ((fromNode?.kind === "work" && !workRefsBySlug.has(fromNode.id.replace(/^w-/, ""))) ) {
      importRecords.push({
        collective_id: COLLECTIVE_ID,
        kind: "ambiguous",
        path: rhizomePath,
        reason: `rhizome edge #${index} references a "work"-kind node ("${edge.from}") that does not match any works/ path by direct id-stripping`,
        detail: "Embedded as the raw node record (object_literal) instead of a resolved object reference. No fuzzy/title match attempted.",
        source_commit: repo.commit
      });
    }
    if ((toNode?.kind === "work" && !workRefsBySlug.has(toNode.id.replace(/^w-/, "")))) {
      importRecords.push({
        collective_id: COLLECTIVE_ID,
        kind: "ambiguous",
        path: rhizomePath,
        reason: `rhizome edge #${index} references a "work"-kind node ("${edge.to}") that does not match any works/ path by direct id-stripping`,
        detail: "Embedded as the raw node record (object_literal) instead of a resolved object reference. No fuzzy/title match attempted.",
        source_commit: repo.commit
      });
    }
    const withoutHash = {
      assertion_id: `${COLLECTIVE_ID}:rhizome-edge-${index}-${slugForId(edge.kind)}@${repo.shortSha}`,
      author: { actor_id: COLLECTIVE_ID, collective_id: COLLECTIVE_ID },
      subject: resolveRhizomeEndpoint(fromNode, edge.from, workRefsBySlug),
      predicate: edge.kind,
      object: resolveRhizomeEndpoint(toNode, edge.to, workRefsBySlug),
      // `session` (work order phase-c1 §1 finding, 2026-07-15): the edge's own `session` field,
      // verbatim from pulse/rhizome.json, carried onto the assertion — schema-legal
      // (assertion.schema.json: additionalProperties true) and previously parsed into the
      // RhizomeEdge type but silently dropped before this fix. Some edges (all `elaborates`
      // edges) have no session in the source; `session` is omitted from the assertion in that
      // case rather than fabricated as e.g. null, so a consumer (e.g. apps/atelier's edge
      // register table) can render "—" only because the field is genuinely absent, the same
      // convention atelier_viz.py's table_html() uses ('S' + session if session else '—').
      ...(typeof edge.session === "number" ? { session: edge.session } : {}),
      epistemic_status: "interpretation",
      evidence: [
        {
          source_uri: rhizomeUri,
          source_commit: repo.commit,
          field_path: `pulse/rhizome.json:edges[${index}]`
        }
      ],
      lifecycle_status: "active",
      visibility: "public"
    };
    const assertion: AdapterAssertion = { ...withoutHash, content_hash: protocolContentHash(withoutHash) };
    assertions.push(assertion);
  });

  coverage.push({
    path: "pulse",
    status: "imported",
    detail: "pulse/vital-signs.json history and pulse/rhizome.json edges consumed directly into assertions.json; the rhizome file is not treated as the canonical network (spec 06 §5.1).",
    produced: assertions.map((a) => a.assertion_id)
  });

  // --- excluded paths --------------------------------------------------------------------
  for (const [path, kind, reason] of [
    [".github", "editorial scope", "CI/automation workflow files, not research content"],
    ["tools", "editorial scope", "operator tooling (memory indexer CLI), not research content"],
    [".gitignore", "editorial scope", "VCS configuration, not research content"],
    // protocol-v3 migration (2026-07-16): superseded constitution versions move to archive/
    // — historical record, deliberately not imported as live research content; the effective
    // PROTOCOL.md is imported above.
    ["archive", "superseded record", "archived constitution/README versions (protocol-v3 migration) — historical, not live content"]
  ] as const) {
    if (topLevel.includes(path)) {
      exclusions.push({ collective_id: COLLECTIVE_ID, path, kind, reason, source_commit: repo.commit });
      coverage.push({ path, status: "excluded", detail: reason });
    }
  }

  // --- manifest ----------------------------------------------------------------------------
  const readmeText = showText(repo, "README.md");
  const manifest = buildManifest({
    repo,
    collectiveId: COLLECTIVE_ID,
    name: "Ulysses",
    surfaceName: "atelier",
    description: extractReadmeDescription(readmeText),
    protocolPath: "PROTOCOL.md",
    requestsPath: "REQUESTS.md",
    publicUrl: "https://frankbueltge.de/atelier",
    effectiveFrom: commitAuthorDateIso(repo)
  });

  // --- unaccounted-for top-level paths (defensive; work order §3 test 8) -------------------
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
    events: [],
    assertions,
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
