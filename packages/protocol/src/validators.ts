/**
 * Ajv (draft 2020-12) validators compiled from the eight schemas in ./schemas, plus the
 * validator rules that live above the JSON Schema layer (work order §2.5):
 *
 * - an assertion with `epistemic_status: "machine_suggestion"` is REJECTED by
 *   `validateAssertion` (suggestions live in their own store — spec 05 §3.17);
 * - `event_type` is an open string (schema only enforces the namespace pattern);
 *   `isCoreEventType` (core-event-types.ts) is informational only;
 * - `resolveVisibility` defaults an encounter-event's visibility to "public" when absent.
 */

import { Ajv2020 } from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import type { ErrorObject, ValidateFunction } from "ajv";

import type {
  AssertionRecord,
  CollectiveManifest,
  EncounterEvent,
  Intervention,
  LensDefinition,
  MapManifest,
  SiteEntrance,
  TransferOfferPayload,
  TransferResponsePayload
} from "./types.js";

// Statically imported (not `readFileSync` against a `import.meta.url`-relative path): a bundler
// (Vite, for apps/middle-web's SSR build) inlines these at build time, so the schema's on-disk
// location relative to the *original* source file no longer has to survive being bundled into
// a chunk that lives somewhere else on disk. `tsx`/`vitest` resolve the same JSON imports
// directly, so this is not just a bundler workaround — it is strictly more portable than the
// path-based read it replaces, with byte-identical schema content either way.
import assertionSchema from "../schemas/assertion.schema.json" with { type: "json" };
import collectiveManifestSchema from "../schemas/collective-manifest.schema.json" with { type: "json" };
import encounterEventSchema from "../schemas/encounter-event.schema.json" with { type: "json" };
import interventionSchema from "../schemas/intervention.schema.json" with { type: "json" };
import lensSchema from "../schemas/lens.schema.json" with { type: "json" };
import mapManifestSchema from "../schemas/map-manifest.schema.json" with { type: "json" };
import siteEntranceSchema from "../schemas/site-entrance.schema.json" with { type: "json" };
import transferOfferSchema from "../schemas/transfer-offer.schema.json" with { type: "json" };
import transferResponseSchema from "../schemas/transfer-response.schema.json" with { type: "json" };

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

const compiledAssertion: ValidateFunction = ajv.compile(assertionSchema);
const compiledCollectiveManifest: ValidateFunction = ajv.compile(collectiveManifestSchema);
const compiledEncounterEvent: ValidateFunction = ajv.compile(encounterEventSchema);
const compiledIntervention: ValidateFunction = ajv.compile(interventionSchema);
const compiledLens: ValidateFunction = ajv.compile(lensSchema);
const compiledMapManifest: ValidateFunction = ajv.compile(mapManifestSchema);
const compiledSiteEntrance: ValidateFunction = ajv.compile(siteEntranceSchema);
const compiledTransferOffer: ValidateFunction = ajv.compile(transferOfferSchema);
const compiledTransferResponse: ValidateFunction = ajv.compile(transferResponseSchema);

export interface ValidationResult {
  valid: boolean;
  errors: ErrorObject[] | null;
}

function runValidate(validateFn: ValidateFunction, data: unknown): ValidationResult {
  const valid = validateFn(data) === true;
  return { valid, errors: valid ? null : (validateFn.errors ?? null) };
}

const MACHINE_SUGGESTION_ERROR: ErrorObject = {
  instancePath: "/epistemic_status",
  schemaPath: "#/x-business-rule/no-machine-suggestion",
  keyword: "businessRule",
  params: {},
  message:
    "assertions with epistemic_status \"machine_suggestion\" are rejected by the assertion " +
    "validator; unadmitted computational proposals belong in the machine_suggestions store " +
    "(spec 05 §3.17), never among collective assertions (work order §2.5)."
};

/**
 * Validates an assertion against assertion.schema.json AND the business rule that
 * `epistemic_status: "machine_suggestion"` is never a valid *assertion* — it must be
 * admitted through local process first (spec 05 §3.17 / §3, "collective assertion !=
 * raw model output").
 */
export function validateAssertion(data: unknown): ValidationResult {
  const schemaResult = runValidate(compiledAssertion, data);
  if (!schemaResult.valid) {
    return schemaResult;
  }
  const record = data as Partial<AssertionRecord>;
  if (record.epistemic_status === "machine_suggestion") {
    return { valid: false, errors: [MACHINE_SUGGESTION_ERROR] };
  }
  return schemaResult;
}

export function validateCollectiveManifest(data: unknown): ValidationResult {
  return runValidate(compiledCollectiveManifest, data);
}

/**
 * Validates an encounter event envelope. `event_type` is an open string — the schema's
 * `^[a-z0-9_.-]+$` pattern is the only constraint; unknown types (e.g. `contract.published`)
 * validate exactly like core types (work order §2.5, spec 05 §3.7 "unknown event types
 * remain valid if the envelope is valid").
 */
export function validateEncounterEvent(data: unknown): ValidationResult {
  return runValidate(compiledEncounterEvent, data);
}

export function validateIntervention(data: unknown): ValidationResult {
  return runValidate(compiledIntervention, data);
}

export function validateLens(data: unknown): ValidationResult {
  return runValidate(compiledLens, data);
}

export function validateMapManifest(data: unknown): ValidationResult {
  return runValidate(compiledMapManifest, data);
}

/** Validates the compact entrance dataset apps/export-site writes into a target site's
 * src/data/begegnungen/entrance.json (work order phase-3e-plumbing.md §1). */
export function validateSiteEntrance(data: unknown): ValidationResult {
  return runValidate(compiledSiteEntrance, data);
}

export function validateTransferOffer(data: unknown): ValidationResult {
  return runValidate(compiledTransferOffer, data);
}

export function validateTransferResponse(data: unknown): ValidationResult {
  return runValidate(compiledTransferResponse, data);
}

/** visibility defaults to "public" when absent (work order §2.5). */
export function resolveVisibility(record: { visibility?: string }): string {
  return record.visibility ?? "public";
}

export type {
  AssertionRecord,
  CollectiveManifest,
  EncounterEvent,
  Intervention,
  LensDefinition,
  MapManifest,
  SiteEntrance,
  TransferOfferPayload,
  TransferResponsePayload
};
