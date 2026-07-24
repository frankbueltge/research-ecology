> **status: HISTORICAL** (dated record, banner added 2026-07-24) — kept as audit trail;
> for what is current, see README.md, `docs/shifts.md` and the dated `docs/design/` decisions.

# Delta Audit — v2.1 Amendment gegen die implementierte v2
## Phase A des v2.1-Handoffs (docs/spec-v2.1/), Antwort auf die 10 Prüfpunkte

**Datum:** 2026-07-15 · **Autor:** Lab-Session (stärkstes Modell), unmittelbar nach
Abschluss der v2-Implementierung — dieses Audit ist aus dem lebenden Wissen der
Implementierungs-Session geschrieben, nicht rekonstruiert.
**Verdikt vorab:** Das v2.1-Delta ist **vollständig additiv umsetzbar**. Keine Tabelle,
kein Vertrag, keine Route der v2 muss brechen. Ein Punkt braucht Franks
Architektur-Freigabe (Atelier als eigene App, §8), zwei brauchen seine inhaltliche
Steuerung (Protokoll-Amendments in den Engine-Repos; Ort der Atelier-Oberfläche).

---

## 1. Was v2 tatsächlich implementiert hat

- **packages/protocol:** JSON-Schemas (offene Event-/Prädikat-Vokabulare), kanonisches
  Hashing, deterministische External-IDs, Validator-Regeln (machine_suggestion ≠
  Assertion). **packages/adapters:** read-only, deterministische Bundles, Exclusions +
  import_records statt Inferenz. **packages/domain:** EncounterStore (Memory = Dev/Test,
  Postgres = Deploy, ungetestet live). **packages/projections:** pure, deterministische
  Engine; 3 Lenses; unveränderliche, gehashte map_versions mit accessible_summary.
- **apps/middle-web:** Tableau-Eingang (1 Screen, 6 Stationen, CSS-only), Akte
  (`/encounters/[id]`), Divergenz-Ansicht, `/apparatus`, `/ledger`, `/archive`, `/about`,
  Objekt-/Assertion-/Lens-Seiten. Englisch-only. SSR/No-JS-vollständig, striktes CSP,
  keine Analytics. **apps/loader, apps/project, apps/export-site** CLIs.
- **Site-Branch `ecology-restructure`:** Startseite = Eingang, /begegnungen, /praktiken,
  /bestaende (Experimente als Labor-Bestände umgewidmet), Skelett ohne Design.
- **Daten:** 1 realer Encounter (enc-2026-001, Meridian↔Ensemble, commit-verifiziert),
  Bundles aller drei Engines, editorial Narrative (pending approval).
- ~300 Tests (Contract/Epistemik, Unit, Playwright). Nichts deployt, kein GitHub-Repo.

## 2. Aktuelle Behandlung von Ulysses, Cockpit, lokalen Karten, Profilen

- **Ulysses in der Föderation:** Manifest v1 (aus eigenen Repo-Worten), Bundle mit 82
  Objekt-Refs (Werke, Dokumente, Atlas als 1 Ref), 22 Ulysses-authored Assertions
  (Rhizom-Kanten mit exakten lokalen Kinds inkl. 3 undokumentierten; Closure-Werte als
  CONJECTURE-Selbsteinschätzungen). In enc-2026-001 dokumentiert **nicht** beteiligt
  (gestaltete Non-Relation).
- **Cockpit (ADR 0008):** bleibt das lebende lokale Instrument auf frankbueltge.de;
  The Middle archiviert datierte Snapshots und verlinkt hinaus; Ablösung „nur wenn das
  Atelier selbst es ablöst". **v2.1 ist genau dieser Ablösungspfad** — ADR 0008 braucht
  ein Amendment, keinen Widerruf (§6).
- **Lokale Karten:** existieren als Lenses in The Middle (ensemble-transformation,
  meridian-position). **Ulysses hat keine** — konsistent mit v2 (keine Default-Ulysses-
  Lens), jetzt durch die Atelier-Oberfläche zu füllen, als *lokales* Produkt.
- **Praxisprofile:** heute nur `collective_versions` (Manifest mit commitments JSONB).
  Keine primären Verpflichtungen, keine Accountability-Fragen — echte Lücke.

## 3. Exakte Lücken gegen v2.1

| v2.1-Element | Status in v2 | Einordnung |
|---|---|---|
| EpistemicPracticeProfile (§3) | fehlt | additiv: neue Tabelle `practice_profile_versions` + Rendering |
| Atelier-Oberfläche (§4) | fehlt (bewusst) | neue App; Kernel wiederverwendbar |
| Atelier-Lenses (Problem/Material/Operation/Provenienz/Apparat/Counter) | fehlen | neue Lens-Configs + 2–3 neue Renderer-Formen; Engine unverändert |
| Forschungskonstellationen (§5) | fehlen | additiv: `constellations` + Join-Tabelle; Encounters unverändert |
| Transduktion (§6) | implizit vorhanden | enc-2026-001s translation.loss_declared + derivative-Payload tragen preserved/transformed/imagined bereits; formalisieren als **Assertion-Typkonvention** (Payload-Schema + Validator), KEINE neue Tabelle (§9.2 des Deltas: Extension vor Schema-Churn) |
| Positionen ohne Rollen-Essentialismus im Encounter (§7.1) | fehlt | Encounter-Seite rendert aktives Profil je Teilnehmer |
| Regime-Übergänge „claim→problem" etc. (§7.2) | fehlt | authored Assertions mit Prädikat-Konvention; Rendering |
| Konstellations-Navigation (§7.3) | fehlt | Route + optionale Homepage-Regel (Auswahlregel sichtbar) |
| Verfassungs-/Protokoll-Amendments (§8) | fehlt | s. Punkt 10 — Grenze beachten |

## 4. Wiederverwendbare Komponenten und stabile Verträge

Direkt wiederverwendbar für das Atelier: protocol (Hashing/Schemas), domain (Store),
projections (Engine + map_versions + Manifest-Disziplin), UI-Primitive (RecordFrame,
LensManifestPanel, AuthoredStroke, Rupture-Blocks, DoorwayLink, StatusChip,
CorrectionOverlay), Test-Muster (Epistemik-Guards, No-JS, a11y), atelier-Adapter
(erweitern, nicht neu). **Paketgrenzen:** Die v2.1-Namen (research-core/cartography-core/…)
werden NICHT durch Umbenennung erzwungen — Mapping: protocol+domain ≙ research-core,
projections ≙ cartography-core; neu kommen nur `packages/profiles` und `apps/atelier`;
ui-Primitive werden beim Atelier-Start aus middle-web extrahiert (erst dann, real genutzt).

## 5. Vorgeschlagene Schema-/Typ-Erweiterungen (alle additiv, Migration 0002)

1. `practice_profile_versions` (praxis-FK, version, orientation, primary_commitment,
   accountability_questions JSONB, typical_operations, admissible_outputs,
   characteristic_risks, non_exclusive=true, protocol_ref, authored_by, status,
   effective_from/to) — **authored lokal**, The Middle rendert nur (Sentinel-Muster aus
   3a wiederverwenden: Loader wirft bei Middle-Autorschaft).
2. `constellations` + `constellation_encounters` (n:m; Felder aus Delta §5.2; die vier
   interpretativen Felder Pflicht-attributiert, nie berechnet — Contract-Test).
3. Transduktions-Konvention: Assertion mit `predicate: "transduces"` und typisiertem
   Payload (preserved/transformed/lostOrRefused/newlyProduced + Status) — Schema additiv
   in packages/protocol, Validator, Renderer-Form `transduction-ledger`.
4. Atelier-Problematiken: **keine neue Kerntabelle.** Problematiken sind lokale Objekte
   der Praxis (object_refs mit local_object_type aus Ulysses' eigenen Worten — Threads im
   Rhizom, Positionspapiere, INDEX-Tracks). Historische Ableitung wird als redaktionelle
   Lesart attribuiert; künftige Sessions können Problematiken selbst deklarieren, wenn
   Franks Protokoll-Amendment (§8.2) in irrtum-als-methode landet.

## 6. ADR-Änderungen

- **ADR 0010 (neu): Zwei Produkte, ein Kernel.** apps/atelier als eigene SvelteKit-App
  neben middle-web; geteilte packages; ausdrücklich KEINE geteilte visuelle Grammatik
  (Delta §9.4); Atelier ist nicht The Middle und nicht das Cockpit.
- **ADR 0008 (Amendment):** Der definierte Ablösungspfad tritt ein — das Atelier ersetzt
  das Cockpit als primäre Ulysses-Oberfläche, sobald Slice C abgenommen ist; das Cockpit
  bleibt datiertes Artefakt unter /atelier/archive/cockpit (URL bleibt).
- **ADR 0011 (neu): Profile sind lokal autorisiert.** Enforcement im Loader + Domain
  (wie Editorial-Sentinel), Test „The Middle kann kein Profil publizieren".

## 7. Migrationsplan (Daten + URLs erhalten)

Alles additiv: Migration 0002 (drei Tabellen + Kommentare), keine bestehende Spalte
ändert sich. Bestehende Site-URLs bleiben (frankbueltge.de/atelier/* inkl.
/atelier/cockpit und aller Werk-Routen). **Offene Standortfrage (Frank + Design-Session):**
Die Atelier-App wird unter frankbueltge.de/atelier ausgeliefert (Pfad-Routing zur App)
oder als Subdomain — Entscheid gehört zum Deployment-Paket; bis dahin läuft sie lokal.
Bundles/Fixtures/Narratives unverändert gültig.

## 8. Kleinster vollständiger Atelier-Slice (Phase C, real)

**Problematik-Kandidat (real, aus Ulysses' eigenem Material):** der
„epistemic-thing subtraction"-Thread — S26-Swerve aus dem Artistic-Research-Feld
(Rheinberger/Frayling/Schwab), re-liest zwei eigene Werke (Generative Unknowing, Named
the Glitch), Bridge-Kante „they are one fact" (rhizome.json, wörtlich), dazu
Positionspapiere 2026-07-01/07-14 und Fehlerkataster-Einträge als Selbstkritik-Material.
**Slice-Journey** wie Delta §10 Phase C, mit: Problem-Lens + Operation-Lens (neu),
Provenienz-/Apparat-Lens (Kernel-Wiederverwendung), Exclusions sichtbar, Ausgang in einen
**realen** externen Encounter — Kandidat: **Fable→Atlas-Seeding** (Inventar-Kandidat 3;
betrifft Ulysses wirklich; als zweiter Encounter in The Middle zu assemblieren, Evidenz
liegt commit-fest vor) — und zurück ins souveräne Archiv (github.com/frankbueltge/
irrtum-als-methode). ⚠️ enc-2026-001 taugt NICHT als Ausgangs-Encounter (Ulysses
unbeteiligt); die Non-Relation bleibt dokumentiert statt künstlich verbunden.
**Konstellations-Kandidat (Phase D, real):** „The Calibration Gap" — gruppiert
enc-2026-001 + (nach Assemblierung) die Diminishing-Returns→Spielraum-Kette; zwei
Praktiken + dokumentierte Transformationen, nichts erfunden.

## 9. Rezentralisierungs-Risiken

1. **Atelier wird wieder heimliche Hauptbühne** → Eingang der Site bleibt der
   Encounter/Konstellations-Einstieg; Atelier ist eine Praxis-Oberfläche unter
   /praktiken; Test: keine Atelier-Inhalte auf der Middle-Homepage.
2. **Profile ossifizieren zu Ressorts** → versioniert, lokal autorisiert, non_exclusive
   erzwungen; Rendering immer „Position in DIESEM Encounter", nie Kategorienlabel.
3. **Konstellation wird Dach-Programm** → endlich, autorisiert, Auswahlregel sichtbar,
   keine Scores (Contract-Test gegen berechnete Werte in den vier Deutungsfeldern).
4. **Ein Kartografie-Kernel erzwingt eine Ästhetik** → ADR 0010 verbietet geteilte
   visuelle Grammatik; Design-Session entwirft Atelier eigenständig.
5. **Wir legen Ulysses Problematiken in den Mund** → historische Ableitungen tragen
   redaktionelle Autorschaft + Quellenzitat; echte Deklaration erst nach lokalem
   Protokoll-Amendment.

## 10. Was ausdrücklich NICHT geschieht

- Kein Neubau, keine Paket-Umbenennungen, kein Schema-Rewrite, keine Route-Brüche.
- Keine Closure-Wiederbelebung als Metrik; kein Ordnung/Chaos/Zufall-Mapping oder -Score.
- Atelier wird NICHT als Routenraum in middle-web gebaut (eigene App).
- **Die Protokoll-Amendments §8.2–8.4 werden NICHT von uns in den Engine-Repos
  committet.** Das sind lokale Verfassungsänderungen der Praktiken — Frank steuert sie
  über deren eigene Kanäle (Steer/REQUESTS.md); wir liefern höchstens Textvorschläge zu.
  Die Verfassungs-Texte §8.1 landen als `docs/constitution-amendments.md`
  (adopted-pending-Frank) in diesem Repo.
- Kein erfundenes Material für Konstellationen/Transduktionen (Delta-Regel 12).

## Phasen-Vorschlag (nach Franks Architektur-Freigabe)

B: Migration 0002 + Profile (Entwürfe aus den Protokoll-Worten der Repos, als „draft"
bis lokale Bestätigung) + Encounter-Positionsanzeige → 1 Sonnet-Paket.
C: Atelier-Slice (Design: stärkstes Modell + Design-Session-Ergebnis; Implementierung:
Sonnet-Pakete) — **nach** der Design-Session, damit die Atelier-Ästhetik nicht zum
dritten „billig"-Fall wird.
D: Fable→Atlas-Encounter assemblieren + Konstellation „The Calibration Gap" +
Transduktions-Formalisierung von enc-2026-001.
E: öffentliche Selbstbeschreibungen — erst nach Franks lokalen Protokoll-Amendments.
