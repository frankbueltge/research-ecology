import { COLLECTIVE_SEED } from "@research-ecology/domain";
import { listObjectsForCollective } from "$lib/server/data.js";
import type { PageServerLoad } from "./$types.js";

/** ADR 0008: "The Middle imports dated snapshots of its data ... as Ulysses-authored
 * assertions and self-assessments". This phase's read scope covers whole-file object
 * references at pinned commits (no direct file read here — every commit below is a real
 * `source_commit` already present on a `listObjectsForCollective` row from the hydrated
 * store, work order §0 "no direct file reads in routes"). Per-entry `pulse/vital-signs.json`
 * closure values and `rhizome.json` edges are not yet imported at this granularity — disclosed,
 * not silently implied (review-notes-for-3c.md item 8: "deferred: per-entry atlas import").
 */
export const load: PageServerLoad = async () => {
  const snapshots = await Promise.all(
    COLLECTIVE_SEED.map(async (collective) => {
      const objects = await listObjectsForCollective(collective.id);
      const commits = [...new Set(objects.map((o) => o.source_commit).filter((c): c is string => Boolean(c)))];
      return {
        collectiveId: collective.id,
        name: collective.current_name,
        repositoryUrl: collective.repository_url,
        publicUrl: collective.public_url,
        objectCount: objects.length,
        commits
      };
    })
  );

  return { snapshots };
};
