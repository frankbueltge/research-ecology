import { error, json } from "@sveltejs/kit";
import { getMapVersion, isKnownLensId } from "$lib/server/data.js";
import type { RequestHandler } from "./$types.js";

/**
 * Machine-readable export of an immutable map version (spec 04 §13 acceptance item 12: "the
 * complete encounter has a stable, versioned URL and export"; §3 "technical or data researcher
 * ... needs machine-readable exports"). Same content the HTML page renders, same content_hash —
 * never a second, drifting source of truth, since both read through `getMapVersion`.
 */
export const GET: RequestHandler = async ({ params }) => {
  const { lensId } = params;
  const version = Number(params.version);
  if (!isKnownLensId(lensId) || !Number.isInteger(version) || version < 1) {
    throw error(404, `No map version "${params.version}" for lens "${lensId}".`);
  }
  const map = await getMapVersion(lensId, version);
  return json(map, {
    headers: {
      // Immutable content-addressed artifact: safe to cache forever (work order §2 "map
      // version URLs are immutable: same URL always serves identical content").
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
};
