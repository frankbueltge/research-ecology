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

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
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
  TransferOfferPayload,
  TransferResponsePayload
} from "./types.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const schemasDir = path.resolve(currentDir, "../schemas");

function loadSchema(filename: string): Record<string, unknown> {
  const raw = readFileSync(path.join(schemasDir, filename), "utf8");
  return JSON.parse(raw) as Record<string, unknown>;
}

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

const assertionSchema = loadSchema("assertion.schema.json");
const collectiveManifestSchema = loadSchema("collective-manifest.schema.json");
const encounterEventSchema = loadSchema("encounter-event.schema.json");
const interventionSchema = loadSchema("intervention.schema.json");
const lensSchema = loadSchema("lens.schema.json");
const mapManifestSchema = loadSchema("map-manifest.schema.json");
const transferOfferSchema = loadSchema("transfer-offer.schema.json");
const transferResponseSchema = loadSchema("transfer-response.schema.json");

const compiledAssertion: ValidateFunction = ajv.compile(assertionSchema);
const compiledCollectiveManifest: ValidateFunction = ajv.compile(collectiveManifestSchema);
const compiledEncounterEvent: ValidateFunction = ajv.compile(encounterEventSchema);
const compiledIntervention: ValidateFunction = ajv.compile(interventionSchema);
const compiledLens: ValidateFunction = ajv.compile(lensSchema);
const compiledMapManifest: ValidateFunction = ajv.compile(mapManifestSchema);
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
  TransferOfferPayload,
  TransferResponsePayload
};
