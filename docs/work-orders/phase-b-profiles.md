# Work Order — Phase B: Praxisprofile (Migration 0002 + Profile + Positionsanzeige)

**Grundlage:** `docs/DELTA-AUDIT-V2.1.md` §5.1–5.2, §6; `docs/spec-v2.1/01-…-DELTA.md`
§3 + §7.1; **ADR 0010 und ADR 0011 sind ACCEPTED und bindend.** Bei Konflikt zwischen
diesem Order und Audit/ADRs: STOP und berichten, nicht improvisieren.

**Ein Repo:** `/Users/frankbultge/Documents/GitHub/research-ecology` — Commits auf main
erlaubt. Engine-Repos (`irrtum-als-methode`, `field-research`, `studio`) sind
**strikt read-only** (nur lesen für Zitate/Hashes). `docs/spec/` und `docs/spec-v2.1/`
nie editieren. Site-Repo in dieser Phase NICHT anfassen.

## 0. Harte Regeln

- Alles additiv: keine bestehende Tabelle/Spalte/Route/Vertragsdatei ändern; bestehende
  Tests bleiben unverändert grün (Test-Strings nie aufweichen).
- Zitate aus Engine-Repos byte-genau übernehmen, mit Quellpfad + Commit + content_hash
  (Hashing über `packages/protocol`-Kanonik, ADR 0009). NICHTS paraphrasieren, nichts
  erfinden. Wo kein wörtliches Repo-Material existiert, ist die Quelle
  `docs/spec-v2.1/01-…-DELTA.md` §3 (Frank-autorisierte Erstformulierungen) — als
  solche im Provenienz-Block benennen.
- Keine KI-Produkt-Credits in Commits. Commit-Messages im Repo-Stil (englisch, knapp,
  präfixlos wie bisher, Autor bleibt die konfigurierte Identität).
- Englisch-only in App-Strings und Datenfeldern.
- STOP-and-report: Bei jeder Unklarheit, jedem Konflikt mit bestehenden Verträgen oder
  wenn ein Test nur durch Aufweichen grün würde → anhalten, Zustand committen ist dann
  VERBOTEN, stattdessen Befund in den Abschlussbericht.

## 1. Migration 0002 (`db/migrations/0002_profiles_constellations.sql`)

Additiv, mit `COMMENT ON`-Erläuterungen wie in 0001:

1. **`practice_profile_versions`** — Spalten gemäß Delta §3 Interface:
   `collective_id` FK auf collectives, `version` int, `public_name`,
   `self_description`, `orientation`, `primary_commitment` text,
   `accountability_questions` JSONB (nicht-leeres Array), `typical_operations` JSONB,
   `admissible_outputs` JSONB, `characteristic_risks` JSONB,
   `non_exclusive` boolean NOT NULL DEFAULT true **CHECK (non_exclusive = true)**,
   `protocol_ref` text, `authored_by` FK auf actors, `status` text CHECK in
   ('draft','active','superseded'), `effective_from`/`effective_to`,
   `provenance` JSONB (Feld→Quelle: file, commit, content_hash | spec-Referenz),
   UNIQUE (collective_id, version). Kommentar: „versions are append-only; supersede,
   never edit" + „authored locally, never by The Middle (ADR 0011)".
2. **`constellations`** + **`constellation_encounters`** (n:m) — Felder aus Delta §5.2;
   die vier interpretativen Felder (Ordnung / Entzug / Kontingenz / vorläufige
   Stabilisierung) als JSONB mit Pflicht-Attribution (`authored_by` je Feld im JSONB
   dokumentiert; DB-Kommentar: „interpretive fields are always attributed, never
   computed — contract test enforces this at load time"). Diese Tabellen bleiben in
   Phase B **ungenutzt** (Kommentar: „populated in Phase D") — kein Store-/UI-Code
   dafür, nur die Migration selbst.

## 2. packages/protocol (additiv)

- `schemas/practice-profile.schema.json`: JSON-Schema für Profil-Versionen
  (`non_exclusive` als `const: true`; `status`-Enum; `accountability_questions`
  minItems 1; `additionalProperties: true` wie im site-entrance-Muster).
- Validator-Regeln analog zu bestehenden (machine_suggestion-Muster):
  Schema-Validierung + Regel „authored_by darf kein editorialer/Middle-Actor sein"
  (die Actor-Klassifikation liefert `packages/domain`; die Regel lebt dort, wo der
  bestehende Editorial-Issuer-Check lebt — NICHT doppelt implementieren, s. §3).

## 3. packages/domain

- Typ `StoredPracticeProfileVersion` in `types.ts` (offene String-Typen, kein Enum-
  Narrowing — Kommentar-Konvention Zeile 10 beachten).
- `MemoryStore` + `PostgresStore` **paritätisch**: `putPracticeProfileVersion`
  (idempotent nach bestehendem IdempotentResult-Muster), `getApplicableProfile(
  collectiveId, asOf?)` (jüngste Version mit `effective_from <= asOf`, Priorität
  active > draft; superseded nie), `listProfileVersions(collectiveId)`.
  PostgresStore bleibt live-ungetestet wie bisher — SQL spiegelgleich zur Memory-
  Semantik, Review-Hinweis in docs/review-notes-for-3c.md ergänzen (Punkt anhängen,
  bestehende Punkte nicht ändern).
- **Sentinel (ADR 0011):** im Loader (`hydrate.ts`, neben dem bestehenden
  Editorial-Issuer-Check Z. 49–60) und im Store-Put: wirft, wenn `authored_by` ein
  editorialer/Middle-Actor ist. Fehlertext benennt ADR 0011.

## 4. Profil-Entwürfe als Fixtures (Daten, keine Erfindung)

- Ablage nach bestehendem Fixture-Muster (dort, wo der Encounter-Fixture liegt),
  ein JSON je Praxis: **meridian/field, ulysses/atelier, ensemble/studio**, je
  `version: 1`, `status: "draft"`.
- `orientation`, `primary_commitment`, `accountability_questions`: wörtlich aus
  Delta §3 (Quelle im Provenienz-Block: spec-v2.1 §3).
- `typical_operations`, `admissible_outputs`, `characteristic_risks`,
  `self_description`, `protocol_ref`: aus den **eigenen Protokoll-/Manifest-Worten**
  der Engine-Repos (dieselben Quellen, aus denen die Manifeste v1 gebaut wurden;
  byte-genaue Zitate + file/commit/content_hash). Findet sich für ein Feld kein
  belegbares Material: Feld als leeres Array/`null` lassen und im Bericht vermerken —
  NICHT auffüllen.
- `authored_by`: der synthetische Actor der jeweiligen Praxis (bestehende
  actor-seed-Konvention); der Provenienz-Block macht transparent, dass der ENTWURF
  redaktionell aus zitierten Eigen-Worten kompiliert wurde und auf lokale Bestätigung
  wartet (ADR 0011 §2).
- Loader lädt die Profile in den MemoryStore (gleicher Weg wie Bundles/Fixture).

## 5. apps/middle-web — Positionsanzeige (Delta §7.1)

- Encounter-Seite (`routes/[[locale=locale]]/encounters/[id]`): je Teilnehmer ein
  Block nach dem Beispiel in Delta §7.1 — „Position in this encounter: …" +
  „Accountability: …" aus `getApplicableProfile`, gerendert mit bestehenden
  Primitiven (RecordFrame/StatusChip — nichts Neues erfinden, Skelett-Ästhetik,
  DESIGN-SESSION-Marker-Kommentar wie gehabt).
- Draft-Status sichtbar: StatusChip „draft — compiled from the practice's protocol,
  pending local confirmation" (Pending-Muster der Narrative wiederverwenden).
- **Kein** globales Praxis-Label außerhalb des Encounter-Kontexts; Nicht-Teilnehmer
  (Ulysses in enc-2026-001) bekommen KEINEN Positions-Block — die dokumentierte
  Non-Relation bleibt, wie sie ist.
- Falls eine Objekt-/Collective-Seite existiert, die sich anbietet: Profil-Historie
  dort NUR verlinken, wenn es ohne neue Route trivial ist; sonst weglassen (Phase C/D).

## 6. Tests (Contract + Unit + Playwright, bestehende Muster)

1. Contract: „The Middle cannot publish a profile" — Sentinel wirft (Loader UND Store).
2. Contract: `non_exclusive` ≠ true wird abgewiesen (Schema + Validator).
3. Contract: Profil-Versionen sind append-only (put existierender Version ⇒
   idempotent/abgewiesen nach Muster, nie überschrieben).
4. Unit: `getApplicableProfile` (asOf-Grenzen, active>draft, superseded nie).
5. Unit: Provenienz-Zitate der Fixtures hash-verifiziert gegen die Quell-Repos
  (gleiches Muster wie die Beat-Zitat-Verifikation).
6. Playwright: Encounter-Seite zeigt je Teilnehmer „Position in this encounter",
   Draft-Chip vorhanden; Negativtest: kein Positions-Block für Ulysses; Wortlaut
   enthält NIE ein festes Ressort-Label („the scientific practice" o. Ä. als
   Kategorien-Etikett) — Positionsformulierung ist encounter-situiert.
7. Alle bestehenden Suiten (133 Contract + 29 Unit + 110 Playwright) unverändert grün.

## 7. Abschluss

`npm test` (alle Workspaces) + Playwright grün ⇒ committen (main, thematisch getrennte
Commits: Migration/Protocol/Domain/Fixtures/App/Tests sinnvoll gebündelt).
Abschlussbericht: Dateiliste, Test-Zahlen vorher/nachher, je Fixture-Feld die Quelle
(oder „leer, kein Material"), offene Befunde/Diskrepanzen. Rohdaten, keine Prosa-Show.
