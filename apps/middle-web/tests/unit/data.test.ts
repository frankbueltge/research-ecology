import { describe, expect, it } from "vitest";
import {
  getEncounterBundle,
  getMapVersion,
  getLatestMapVersionNumber,
  getLensVersions,
  buildLensManifestView,
  buildActorNames,
  getObjectByCollectiveAndLocalId,
  getAssertionById,
  isKnownLensId
} from "../../src/lib/server/data.js";
import { CURRENT_ENCOUNTER_ID, LENS_IDS } from "../../src/lib/constants.js";

describe("getEncounterBundle", () => {
  it("hydrates the single fixture encounter with its real participants and non-participant", async () => {
    const bundle = await getEncounterBundle(CURRENT_ENCOUNTER_ID);
    expect(bundle.encounter.encounter_id).toBe(CURRENT_ENCOUNTER_ID);
    expect(bundle.participants.map((p) => p.role).sort()).toEqual(["conductor", "receiver", "source"]);
    expect(bundle.nonParticipants).toHaveLength(1);
    expect(bundle.nonParticipants[0]!.collective_id).toBe("ulysses");
    // 7 sourced events + the synthesized editorial.encounter_assembled event.
    expect(bundle.events).toHaveLength(8);
    expect(bundle.events.some((e) => e.event_type === "editorial.encounter_assembled")).toBe(true);
  });

  it("throws (404-shaped SvelteKit error) for an unknown encounter id", async () => {
    await expect(getEncounterBundle("enc-does-not-exist")).rejects.toMatchObject({ status: 404 });
  });
});

describe("map versions", () => {
  it("generates all three lenses' maps at server start, each retrievable and self-consistent", async () => {
    for (const lensId of LENS_IDS) {
      const version = await getLatestMapVersionNumber(lensId);
      const map = await getMapVersion(lensId, version);
      expect(map.lens.lens_id).toBe(lensId);
      expect(map.encounter_id).toBe(CURRENT_ENCOUNTER_ID);
      expect(map.content_hash).toMatch(/^sha256:[0-9a-f]{64}$/);
    }
  });

  it("is deterministic: fetching the same (lens, version) twice yields byte-identical content_hash", async () => {
    const version = await getLatestMapVersionNumber("provenance-v1");
    const a = await getMapVersion("provenance-v1", version);
    const b = await getMapVersion("provenance-v1", version);
    expect(a.content_hash).toBe(b.content_hash);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it("throws 404 for an out-of-range version", async () => {
    await expect(getMapVersion("provenance-v1", 999)).rejects.toMatchObject({ status: 404 });
  });

  it("at least two lenses produce structurally different maps (spec 04 §13 item 3)", async () => {
    const ensembleVersion = await getLatestMapVersionNumber("ensemble-transformation-v1");
    const meridianVersion = await getLatestMapVersionNumber("meridian-position-v1");
    const ensembleMap = await getMapVersion("ensemble-transformation-v1", ensembleVersion);
    const meridianMap = await getMapVersion("meridian-position-v1", meridianVersion);

    // Different renderer forms...
    expect(ensembleMap.lens.lens_id).not.toBe(meridianMap.lens.lens_id);
    const ensembleLens = (await getLensVersions("ensemble-transformation-v1")).at(-1)!;
    const meridianLens = (await getLensVersions("meridian-position-v1")).at(-1)!;
    expect(ensembleLens.renderer).not.toBe(meridianLens.renderer);

    // ...and different entity inclusion (spec 04 §7.3: a lens switch must change inclusion).
    expect(ensembleMap.included.events.sort()).not.toEqual(meridianMap.included.events.sort());
    expect(ensembleMap.included.assertions.sort()).not.toEqual(meridianMap.included.assertions.sort());
  });
});

describe("buildLensManifestView", () => {
  it("reports non-empty exclusions and a real engine version for every lens (spec 04 §13 item 9)", async () => {
    for (const lensId of LENS_IDS) {
      const version = await getLatestMapVersionNumber(lensId);
      const manifest = await buildLensManifestView(lensId, version);
      expect(manifest.exclusions.length).toBeGreaterThan(0);
      expect(manifest.engineVersion).toMatch(/^@research-ecology\/projections@/);
      expect(manifest.contentHash).toMatch(/^sha256:/);
    }
  });
});

describe("buildActorNames", () => {
  it("resolves the editorial sentinel to a human label, never the raw id or a collective name", async () => {
    const bundle = await getEncounterBundle(CURRENT_ENCOUNTER_ID);
    const names = await buildActorNames(bundle);
    expect(names["the-middle-editorial"]).toBe("The Middle (editorial apparatus)");
    expect(names["meridian"]).toBe("Meridian");
    expect(names["ensemble"]).toBe("Ensemble");
  });
});

describe("objects and assertions (scoped lookups, epistemic contract test 1)", () => {
  it("finds an object by (collective, localId) and its authored assertions", async () => {
    const { object, assertionsAbout } = await getObjectByCollectiveAndLocalId("ensemble", "native-speaker");
    expect(object.title_cache).toBe("Native Speaker");
    expect(assertionsAbout.length).toBeGreaterThan(0);
  });

  it("404s for an unknown object", async () => {
    await expect(getObjectByCollectiveAndLocalId("meridian", "does-not-exist")).rejects.toMatchObject({ status: 404 });
  });

  it("finds an assertion by id via the author-scoped lookup (no global assertion list)", async () => {
    const { assertion } = await getAssertionById("assert-enc2026001-meridian-live-framing");
    expect(assertion.predicate).toBe("frames-as");
  });

  it("404s for an unknown assertion", async () => {
    await expect(getAssertionById("assert-does-not-exist")).rejects.toMatchObject({ status: 404 });
  });
});

describe("isKnownLensId", () => {
  it("accepts exactly the three v1 lenses", () => {
    expect(isKnownLensId("provenance-v1")).toBe(true);
    expect(isKnownLensId("ensemble-transformation-v1")).toBe(true);
    expect(isKnownLensId("meridian-position-v1")).toBe(true);
    expect(isKnownLensId("bogus")).toBe(false);
  });
});
