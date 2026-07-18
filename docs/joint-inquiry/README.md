# Joint Inquiry — Adoption (2026-07-19)

**Was eine Joint Inquiry ist:** eine temporäre, freiwillige, ressourcenbegrenzte
Kollaboration, in der zwei oder mehr souveräne Praktiken an EINEM konkreten Problem
arbeiten — bei vollem Erhalt eigener Methoden, Archive, Claims und des Rechts auf
Ablehnung und Rückzug. Verfassungsanker: v2.1 §8.1, Ergänzung 2 („temporary research
constellations"), von Frank angenommen am 2026-07-19 (`docs/constitution-amendments.md`).

**Was hier übernommen wurde** (aus dem Spec-Paket v0.1.0, archiviert in frankbueltge.de
`docs/research-ecology-joint-inquiry-spec-v0.1.0/`):

- [`PROTOCOL.md`](PROTOCOL.md) — die konstitutionellen Invarianten und der Lebenszyklus
  (Freiwilligkeit, lokale Souveränität, keine Rollenfixierung, keine geteilte epistemische
  Autorität, Encounters bleiben atomar, keine automatische Synthese, kein
  SUCCESS/FAILED-Status).
- [`schemas/`](schemas/) — die vier JSON-Schemas (inquiry, local-commitment, event,
  participant-position) als Format der Akte.
- [`../../fixtures/ji-_template/`](../../fixtures/ji-_template/) — die Akten-Vorlage.

**Wie eine Joint Inquiry LÄUFT (manueller Pfad, bis auf Weiteres):**

1. Proposal als Fixture-Ordner `fixtures/ji-<jahr>-<nnn>-<slug>/` (Vorlage kopieren).
2. Einladungen über die REQUESTS-Kanäle der Praktiken (Entwürfe: `docs/requests-drafts/`)
   — Angebote, keine Aufträge; Schweigen und Ablehnung sind legitime Antworten.
3. Lokale Commitments als Dateien in der Akte (von der Praxis formuliert, über ihren
   eigenen Kanal geliefert, hier transkribiert).
4. Moves sind gewöhnliche lokale Projekte in den Praxis-Repos (Ulysses: v4-Projekt mit
   Score; Meridian Classic: Session-Move; Ensemble: Projekt nach eigenem Protokoll).
5. Austausch zwischen Praktiken bleibt Encounter-Ereignis (atomar, wie gehabt).
6. Der Middle Scribe transkribiert append-only in die Akte (sein Prompt erhält die
   ji-*-Klausel, sobald die erste Inquiry aktiv wird — nicht vorher).
7. Öffentliche Exposition nur nach menschlicher Freigabe; lokale Publikation bleibt
   Sache jeder Praxis.

**Was bewusst NICHT gebaut wird** — Entscheidung und Begründung in
[`../design/joint-inquiry-adoption-2026-07-19.md`](../design/joint-inquiry-adoption-2026-07-19.md):
Koordinator, SQL-Persistenz, lokale Adapter, eigene Middle-UI (Task-Packets JI-03…JI-06
des Pakets). Transport-Schicht = künftig die Föderation der Meridian Research Runtime
(E5/E6: Task Bundles + Node Task Decisions), niemals ein Parallelbau.

**Pilot-Kandidat:** „The Correction That Arrives Too Late" (Paket, Dokument 10) —
Start erst, wenn die beteiligten Praktiken Kapazität haben; bei Ulysses konkurriert er
mit dem laufenden Projekt (Mandat: max. 2 aktive Projekte).
