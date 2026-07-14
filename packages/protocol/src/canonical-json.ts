/**
 * Canonical JSON serialisation (locked contract, work order §2.2 / ADR 0009 §4).
 *
 * - UTF-8 text output.
 * - Object keys sorted lexicographically in code-unit order (the default behaviour of
 *   Array.prototype.sort on strings — no locale-aware collation).
 * - No insignificant whitespace.
 * - Arrays keep their given order.
 * - Numbers are serialised via JSON.stringify's default number formatting.
 * - `undefined`, `NaN`, `Infinity`/`-Infinity` and functions are rejected with a thrown
 *   error anywhere they occur in the value tree (top level, array element or object
 *   property) — never silently dropped or coerced to `null`.
 *
 * Used as the single hashing basis for every content hash in the protocol so hashes stay
 * reproducible across adapters and jobs (ADR 0009 §4).
 */

export class CanonicalJsonError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CanonicalJsonError";
  }
}

export function canonicalJson(value: unknown): string {
  return serialize(value);
}

function serialize(value: unknown): string {
  if (value === undefined) {
    throw new CanonicalJsonError("canonicalJson: cannot serialise undefined");
  }
  if (typeof value === "function") {
    throw new CanonicalJsonError("canonicalJson: cannot serialise a function");
  }
  if (typeof value === "symbol") {
    throw new CanonicalJsonError("canonicalJson: cannot serialise a symbol");
  }
  if (value === null) {
    return "null";
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (typeof value === "number") {
    if (Number.isNaN(value)) {
      throw new CanonicalJsonError("canonicalJson: cannot serialise NaN");
    }
    if (!Number.isFinite(value)) {
      throw new CanonicalJsonError("canonicalJson: cannot serialise Infinity/-Infinity");
    }
    return JSON.stringify(value);
  }
  if (typeof value === "string") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    const items = value.map((item) => serialize(item));
    return `[${items.join(",")}]`;
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const keys = Object.keys(record).sort(compareCodeUnits);
    const parts = keys.map((key) => `${JSON.stringify(key)}:${serialize(record[key])}`);
    return `{${parts.join(",")}}`;
  }
  throw new CanonicalJsonError(`canonicalJson: cannot serialise value of type ${typeof value}`);
}

function compareCodeUnits(a: string, b: string): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}
