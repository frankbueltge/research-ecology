export * from "./generic-git.js";
export * from "./types.js";
export * from "./common.js";
export * from "./bundle.js";
export { buildAtelierBundle } from "./atelier.js";
export { buildFieldBundle } from "./field.js";
export { buildStudioBundle } from "./studio.js";

import { buildAtelierBundle } from "./atelier.js";
import { buildFieldBundle } from "./field.js";
import { buildStudioBundle } from "./studio.js";
import type { AdapterBundleParts } from "./types.js";

export type CollectiveId = "ulysses" | "meridian" | "ensemble";

/** Dispatches to the matching collective adapter (used by the importer CLI and tests). */
export function buildBundle(
  collectiveId: CollectiveId,
  repoPath: string,
  commitRef: string,
  generatedAt: string
): AdapterBundleParts {
  switch (collectiveId) {
    case "ulysses":
      return buildAtelierBundle(repoPath, commitRef, generatedAt);
    case "meridian":
      return buildFieldBundle(repoPath, commitRef, generatedAt);
    case "ensemble":
      return buildStudioBundle(repoPath, commitRef, generatedAt);
    default: {
      const exhaustive: never = collectiveId;
      throw new Error(`unknown collective_id: ${exhaustive as string}`);
    }
  }
}
