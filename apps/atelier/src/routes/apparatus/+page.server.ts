import { getAtelierData } from "$lib/server/store.js";
import type { PageServerLoad } from "./$types.js";

/**
 * The apparatus room (work order §4: "Manifest-/Protokoll-Stand aus dem Store
 * (Kernel-Wiederverwendung), Links Repo/Verfassung/REQUESTS (extern)"). Every field below is the
 * collective manifest packages/adapters' `buildManifest` already produced from the repo's own
 * words at the pinned commit (packages/adapters/src/common.ts) — nothing re-derived here.
 */
export const load: PageServerLoad = async () => {
  const { collective, manifest, importRecords } = await getAtelierData();
  return {
    collective,
    manifest,
    importRecordCount: importRecords.length
  };
};
