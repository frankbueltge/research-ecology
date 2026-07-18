# Joint Inquiry — Adoptions-Entscheidungen (2026-07-19)

Entschieden von Frank Bültge, 2026-07-19, nach Prüfung des Spec-Pakets v0.1.0 (archiviert
in frankbueltge.de `docs/research-ecology-joint-inquiry-spec-v0.1.0/`) und Abgleich mit
dem Stand der Meridian Research Runtime (Repo `meridian-runtime`, Stand: E1+E2 gemergt,
E3 in Arbeit, E5/E6 Föderation nur Spezifikation).

## D-JI-01 — Konzept und Akte werden übernommen

- **Status:** `ACCEPTED`
- **Entscheidung:** Das Joint-Inquiry-Protokoll (Invarianten, Lebenszyklus,
  Koordinations-Profile) und die vier JSON-Schemas werden als gemeinsame Doku und
  Akten-Format übernommen (`docs/joint-inquiry/`). Verfassungsanker ist v2.1 §8.1
  Ergänzung 2 (temporäre Forschungskonstellationen), gleichzeitig angenommen.
- **Grund:** Der Encounter erfasst einen atomaren Austausch; für mehrere zusammenhängende
  Encounters und lokale Projekte um EIN Problem fehlte der Koordinationsrahmen. Die
  Invarianten des Pakets respektieren die Verfassung (Souveränität, keine geteilte
  epistemische Autorität, keine automatische Synthese).

## D-JI-02 — Joint Inquiries laufen manuell

- **Status:** `ACCEPTED`
- **Entscheidung:** Eine Inquiry ist ein Fixture-Ordner (`fixtures/ji-*`) neben den
  `enc-*`-Akten. Einladungen laufen über die REQUESTS-Kanäle der Praktiken, Commitments
  und Moves sind gewöhnliche lokale Projekte, der Middle Scribe transkribiert. Kein
  neuer Runtime-Code.
- **Grund:** Null Joint Inquiries haben je stattgefunden; die Akten- und Angebots-
  Mechanik existiert und ist erprobt (2026-07-18/19: drei REQUESTS-Angebote, vier
  v4-Projekt-Ticks). Die v4-Lektion gilt eine Ebene höher: keine Maschinerie, deren
  einziger Grund ihre eigene Existenz ist.

## D-JI-03 — Die Maschinen-Schicht wird nicht gebaut (deferred auf MRR-Föderation)

- **Status:** `ACCEPTED`
- **Entscheidung:** Koordinator, SQL-Migration, lokale Adapter und eigene Middle-UI
  (Task-Packets JI-03…JI-06 des Pakets) werden NICHT als eigenes System gebaut. Wenn
  die Meridian Research Runtime ihre Föderationsschicht erreicht (E5: Practice/Node-
  Identität, Task-Inbox; E6: TransferContracts, Korrektur-Propagierung), ist der
  Inquiry-Dispatch ein Task-Bundle-Typ und die Teilnahme-Entscheidung eine Node Task
  Decision (`accept | modify | defer | reject | require_human_approval`) — strukturell
  identisch mit den JI-Invarianten §2.1/§2.2.
- **Grund:** ADR-0005 (read-only before writeable federation) — ein dispatchender
  Koordinator wäre beschreibende Föderation und ein eigener Verfassungsschritt. Und:
  dieselbe Maschine darf nicht zweimal entstehen; die MRR-Spec deckt den Transport
  bereits ab, nur ungebaut.
- **Konsequenz:** Wer die Maschinen-Schicht später will, entscheidet das als expliziten
  ADR-0005-Schritt gegen die dann existierende MRR-Föderation — nicht als
  JI-Implementierungsdetail.

## D-JI-04 — Pilot-Reihenfolge

- **Status:** `ACCEPTED`
- **Entscheidung:** Pilot-Kandidat bleibt „The Correction That Arrives Too Late"
  (parallel_return, drei Praktiken, ein Erstzug + max. ein Rückzug je Praxis, keine
  neuen externen Kosten — Kapazität statt EUR ist die reale Grenze). Start erst, wenn
  die Praktiken Kapazität haben; Einladungs-Entwürfe liegen in `docs/requests-drafts/`
  und werden von Frank über die Kanäle versendet, nicht automatisch.
- **Grund:** Bei Ulysses läuft `2026-07-19-falsche-anschluesse` (1 von 2 Mandats-Slots);
  ein erzwungener Parallelstart würde die Substanz-Regel verletzen, die das ganze
  Paket schützen soll.
