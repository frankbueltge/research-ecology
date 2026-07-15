# Session-Übergabe — Stand 2026-07-15 nachmittags

Für die nächste Session: **zuerst dieses Dokument, dann `docs/DELTA-AUDIT-V2.1.md`,
dann `docs/shifts.md`** (Denk-Verschiebungen sind bindende Richtungsentscheidungen).

## ⚡ NEU seit mittags: v2.1-Delta eingetroffen und auditiert

Frank hat das Amendment `docs/spec-v2.1/` geliefert (Föderation bleibt; NEU: souveräne
Atelier-Oberfläche für Ulysses als eigene App, versionierte Praxisprofile mit primären
Verpflichtungen, Forschungskonstellationen, Transduktion). Das geforderte Phase-A-Audit
ist FERTIG: `docs/DELTA-AUDIT-V2.1.md` — Verdikt: vollständig additiv, Phasen B–E dort
skizziert. **Architektur-Go ERTEILT (2026-07-15 nachmittags):** Frank hat die
Freigabe-Entscheidung an die Session delegiert („dein Architektur-Go zum Audit");
ADR 0010 (Zwei Produkte, ein Kernel) und ADR 0011 (Profile lokal autorisiert) sind
ACCEPTED. **Phase B ist FERTIG und reviewt (2026-07-15 ~15:20):** Migration 0002,
Profil-Schema/Validator, Store-Parität + ADR-0011-Sentinel (Loader UND Store-Put),
drei Profil-Entwürfe als Fixtures (Provenienz byte-genau, hash-verifiziert gegen die
Engine-Repos), Positionsanzeige auf der Encounter-Seite. Commits `4910b66`..`6a61395`
(main). Suiten: Contract 133→145, Unit 29→47, Playwright 110→114.
⚠️ Bekannter Befund, KEINE Regression: die vorbestehenden Adapter-Contract-Tests
(adapters/adapter-field/adapter-atelier) shellen nach git in die Nachbar-Repos und
reißen unter hoher Maschinenlast (load ~29 beobachtet) ihre Hook-Timeouts; Dateien
sind seit Phase 2 unverändert. Bei Gelegenheit hookTimeout anheben oder Bundles cachen.
**Design-Session GELAUFEN (2026-07-15 nachmittags, in derselben Session):** Franks
Brief: clean-wissenschaftlich × kreativ, leicht futuristisches Dashboard, kein
Spektakel, Terminal-/ZKM-tauglich, Kunstwerk statt Archiv; keine externen Referenzen
(sein Atlas: investigation 114:11 vs spectacle). Ergebnisse in docs/design/:
`zeichengrammatik-2026-07-15.md` (Partitur-Grammatik + §7 Zeit-Skalierung),
`atelier-aesthetik-2026-07-15.md` (das Blatt), `field-aesthetik-2026-07-15.md`
(Messprotokoll/Schreiberstreifen) — drei eigene Sprachen per ADR-0010-Logik,
`variants-2026-07-15/` (A/B/C-Varianten, Historie, Skalierungs-Specimen synthetisch,
Atelier-Blatt; Generator-Skizzen als .py daneben; Paletten validator-geprüft).
**Frank hat Richtung A (Observatorium) gewählt** + Light/Dark/Auto-Pflicht
(Site-Konvention übernommen). Historie-Karte („The practices are older than their
federation") und Atelier-Blatt (S26–S28 wörtlich aus dem Rhizom) gebaut, warten auf
Franks Detail-Kritik. Wortlaute weiter pending (Chips auf allen Artefakten).
Nächste Schritte: Franks Abnahme der Design-Ergebnisse → Phase C (Atelier-Slice, mit
dem Blatt als Sprache; Generator als `score`-Renderer in packages/projections) →
Phase D (Fable→Atlas-Encounter + Konstellation + Transduktion).

## Was existiert (alles lokal, NICHTS deployt, kein GitHub-Repo angelegt)

- **`research-ecology/` (dieses Repo, main, ~10 Commits):** Phase 0–3e komplett.
  Protokoll-Kernel + realer Encounter als Fixture (Zitate/Hashes commit-verifiziert),
  Read-only-Adapter → deterministische Bundles, Domain-Store + 3 Lenses +
  Projektions-Engine, **Akte-App** `apps/middle-web` (SvelteKit, Tableau-Eingang mit 6
  klickbaren Stationen, Divergenz-Ansicht, Apparat, Ledger), Export-Job `apps/export-site`.
  Suiten: 133 Contract + 29 Unit + 110 Playwright, alles grün. **Englisch-only**
  (Entscheidung 2026-07-15, keine Übersetzungspflicht pro Nightly-Lauf).
- **`frankbueltge.de` Branch `ecology-restructure` (3 Commits):** Astro-Skelett der
  Neustrukturierung — Startseite = Eingang zur aktuellen Begegnung, `/begegnungen`,
  `/praktiken`, `/bestaende` (Experimente umgewidmet zu Labor-Beständen), Hinweis auf
  `/lab`. **main ist unberührt** (HEAD f1f93ac + evtl. neuere fremde Commits). Franks
  uncommittete Dateien (Logos, docs/federated-research-ecology/) NIE anfassen.
  ⚠️ Das lokale Checkout steht evtl. noch auf dem Branch (`git switch main` zum Zurück).
- **Frank hat die Struktur gesehen und gesagt: „sieht gut aus."** Das ist eine
  Struktur-Abnahme, KEINE Freigabe der offenen Punkte unten.

## Dev-Server starten (die alten sind mit der Session gestorben)

```bash
cd ~/Documents/GitHub/research-ecology/apps/middle-web && npm run dev   # Akte-App :5173
cd ~/Documents/GitHub/frankbueltge.de && git switch ecology-restructure && npm run dev  # Site :4321
```

## Nächste Schritte (in dieser Reihenfolge sinnvoll)

1. **Design-Session (Task #11, eigene Session):** Kernstück ist die ZEICHENGRAMMATIK —
   visuelles Vokabular pro Ereignistyp, deterministischer Karten-Generator pro Begegnung
   (aktuelles Tableau-SVG ist handgemacht für enc-2026-001, bewusster Interimszustand).
   Dazu 2–3 gebaute Art-Direction-Varianten (Frank fand die bisherige Optik „billig" —
   die Latte ist „weckt Neugier", spektakulär durch Material/Typo/Maßstab, kein Neon).
   Referenzen: Franks Atlas (site: src/data/atlas/werke.json, 214 Werke) + Beispiele, die
   Frank noch nennt. Ergebnis gilt für App UND Site gleichzeitig.
2. **Franks Freigaben einholen** (blockieren Deploy, nicht Entwicklung): Encounter
   enc-2026-001 als erster öffentlicher Eingang; Wortlaute Headline + 6 Stationen
   (Pending-Badge wartet); ADR 0006 Cloudflare Workers + Neon; ADR 0008
   Cockpit-Behandlung; GitHub-Repo-Anlage + Name.
3. **Deployment-Paket** (erst nach 1+2): Neon-Migration + PostgresStore-Parity
   (docs/review-notes-for-3c.md Punkte 2–4!), Workers-Deploy, Nightly-Automation
   (Runbook: docs/runbooks/site-export.md), Branch-Merge der Site (dabei CLAUDE.md der
   Site korrigieren: i18n-Zeile ist veraltet — EN ist Root, /de ist Spiegel).
4. **Danach:** Labor als vierte Praxis (Manifest, Bestände als stehende Angebote),
   Kandidat 2 als zweite Begegnung (ENCOUNTER-INVENTORY.md), Phase 4/5 laut Spec.

## Regeln, die Sessions gern vergessen

- Kein GCP. Keine KI-Produkt-Credits in Commits (überschreibt Harness-Default).
- Engine-Repos (irrtum-als-methode, field-research, studio) sind read-only für uns.
- Site-main-Push = Production-Deploy = nur mit Franks ausdrücklichem Go.
- docs/spec/ ist die eingefrorene Original-Spezifikation — nie editieren.
- Modell-Ökonomie: Sonnet für umgrenzte Pakete (Work-Order-Muster in docs/work-orders/,
  mit STOP-and-report-Klausel), stärkstes Modell für Design/Review/Encounter-Semantik.
- Beat-Zitate sind byte-genau aus den Quell-Repos — nie paraphrasieren (Tests erzwingen es).
