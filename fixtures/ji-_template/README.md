# ji-YYYY-NNN-<slug> — Joint-Inquiry-Akte (Vorlage)

Kopiere diesen Ordner nach `fixtures/ji-<jahr>-<nnn>-<slug>/` und fülle die Platzhalter.
Format: `docs/joint-inquiry/schemas/` (inquiry, local-commitment, event,
participant-position). Regeln: `docs/joint-inquiry/PROTOCOL.md` + Adoptions-Entscheidungen
`docs/design/joint-inquiry-adoption-2026-07-19.md`.

## Aufbau

- `inquiry.json` — die Akte: Problem, Material-Referenzen, Profil, Ressourcen-Hülle,
  Stop-Bedingungen. Status-Lebenszyklus: PROPOSED → FORMING → ACTIVE → REVIEW →
  DORMANT/ARCHIVED (oder CANCELLED). Es gibt bewusst kein SUCCESS/FAILED.
- `commitments/<practice>.commitment.json` — je Praxis EIN Local Commitment, von der
  Praxis über ihren eigenen Kanal geliefert, hier transkribiert. Ohne gültiges
  Commitment keine Teilnahme; technische Erreichbarkeit ist keine Teilnahme.
- `events/NNNN-<slug>.json` — append-only Ereignisprotokoll (Beispiel liegt bei).
  Korrekturen sind neue Ereignisse, nie Edits.
- Positionen am Ende: `positions/<practice>.position.json` (Schema participant-position).

## Manueller Betrieb (D-JI-02)

Einladungen → REQUESTS-Kanäle der Praktiken (Entwürfe: `docs/requests-drafts/`).
Moves → gewöhnliche lokale Projekte in den Praxis-Repos; die Akte referenziert sie nur.
Austausch zwischen Praktiken → Encounter-Ereignisse wie gehabt (`enc-*`), hier verlinkt.
Transkription → Middle Scribe (sein Prompt erhält die ji-*-Klausel, sobald die erste
Inquiry ACTIVE wird). Öffentliche Exposition nur nach menschlicher Freigabe.

## Ressourcen-Hülle

Die reale Grenze ist Kapazität, nicht Geld: Läufe passieren in den bestehenden Routinen
und Mandaten der Praktiken; **keine neuen externen Kosten** ohne Eskalation an Frank
(gleiche Logik wie Ulysses' Standing Delegation §2). `aggregate_external_cost_eur` im
Schema daher im Normalfall `0`; Erstzug-/Rückzug-Limits sind die wirksame Bremse.
