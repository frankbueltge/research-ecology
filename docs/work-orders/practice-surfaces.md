> **status: HISTORICAL** (implementation brief of its date, banner added 2026-07-24) — kept as
> audit trail; the work it ordered has shipped or been superseded. For what is current, see
> README.md, `docs/shifts.md` and the dated `docs/design/` decisions.

# Work Order: practice-surfaces — die vier Sprachen auf die Site (frankbueltge.de)

**Anlass (Frank, 2026-07-16 vormittags):** „wo sind die anderen designs für atelier field
studio? das ist doch alles noch beim alten und die histories etc." — Die Designsprachen sind
seit dem 15.07. entworfen (Design-Docs + gebaute Mockups + Generatoren), aber die Site rendert
/atelier /field /studio noch als alte EnginePage. Dieses Paket bringt sie auf die Site.

**Branch:** `practice-surfaces` in frankbueltge.de (von main). Bauen, testen, pushen —
**KEIN Merge auf main ohne Franks Go.**

## Verbindliche Grundlagen (alle in research-ecology)

- `docs/design/atelier-aesthetik-2026-07-15.md` — das **Blatt** (Eingang), der **Buchrücken**
  (Historie), §5 Blattrand-IA (Zimmer + Routen!), §6 Historienform.
- `docs/design/field-aesthetik-2026-07-15.md` — das **Messprotokoll**: Kontrollblatt (Eingang),
  Schreiberstreifen (Historie), Zeichen (Prüfstempel, Eichmarke, Kaveat-Fähnchen, Splice).
- `docs/design/studio-aesthetik-2026-07-15.md` — die **Bühne** (Eingang, Default DUNKEL) und
  der **Abendzettel** (Historie); Spot, Marquee, Bodenmarken, X-Marken, die Gasse.
- Gebaute Referenzen: `docs/design/variants-2026-07-15/{atelier-blatt,atelier-historie,
  field-kontrollblatt,field-schreiberstreifen,studio-buehne,studio-abendzettel}.html` +
  Generatoren `{atelier_viz,atelier_history_viz,field_viz,studio_viz}.py` — die Geometrie- und
  Zeichenlogik wird nach TypeScript portiert (Muster: score.ts / pulse/render.ts der Site:
  pure Module, Determinismus-Vertrag, byte-gleicher Output, Tests).
- `apps/atelier/src/routes/` (sheets, journal, material, apparatus) — bereits gebaute statische
  Svelte-Routen als inhaltliche Referenz; die Site-Umsetzung ist Astro, KEIN Svelte-Port.
- ADR 0010: **keine geteilte Grammatik** — je Praxis eigener Renderer + eigenes, gescoptes CSS
  (Muster: score-map.css); kein gemeinsames Theme-Paket. Der Puls (Hub) und die Partitur
  (Middle) bleiben unberührt.
- Wortlaute: die vier Datenkanten-Formeln sind freigegeben (wortlaute-2026-07-15.md §5):
  Atelier „tonight's page is not yet written" · Field „the pen has not lifted" · Studio
  „the next bill is not yet printed" — als Grammatik-Formeln unter Testschutz. NEUE
  Erzähl-Wortlaute je Oberfläche laufen als draft (Muster: naming.ts approval-Flag, eigenes
  kleines Dictionary je Praxis mit approval-Feld).

## Datenquellen (alles committet in der Site, nichts erfunden)

- Atelier: `src/content/atelier/**` (journal S1–…, works, PROTOCOL), `src/data/atelier/`
  (atlas.json, rhizome.json, vital-signs.json — als ULYSSES' EIGENE LINSE gerahmt, spec/08 §11).
- Field: `src/content/field/**`, `src/data/field/**` (chronicle, works, PROTOCOL, claims).
- Studio: `src/content/studio/**`, `src/data/studio/**` (chronicle.json, WORKBOARD, works).
- Git-Add-Daten wie in den Generatoren NUR wenn zur Buildzeit deterministisch verfügbar —
  sonst die committeten Datumsfelder der Daten selbst; keine Uhr, kein Zufall (Vertrag §5).

## Paket-Inhalt

1. **Atelier** (größtes Stück, zuerst): `/atelier` = das Blatt (Eingang, Spec §4.3: aktuelles
   Blatt statt Gesamtüberblick), Blattrand als einzige stehende Navigation
   (`this sheet · sheets · works · journal · material · apparatus · → the middle`), Zimmer
   gemäß §5-Tabelle: `journal` = Session-Register (Anker #sNN, jüngste aufgeklappt — die
   Endlos-Liste stirbt), `material` = Ulysses' Quellen-Regal (aus atlas.json — **Atlas-Dualität
   ist entschieden:** Franks /atlas bleibt Referenzsammlung, beide verweisen aufeinander),
   `apparatus` = Repo/Verfassung/Team-Kanal/Maschinerie in EINEM Zimmer, Cockpit →
   `/atelier/archive/cockpit` als datiertes Artefakt (ADR 0008; alte URL /atelier/cockpit
   301t dorthin). `/atelier/history` = der Buchrücken. Werke-Routen `/atelier/werke/*`
   BLEIBEN unverändert (Integrate-Maschinerie schreibt dorthin) — die Tafeln des Blatts
   verlinken sie; Umbenennung auf /works ist ein SPÄTERES Paket mit Integrate-Anpassung.
2. **Field:** `/field` = Kontrollblatt, `/field/history` = Schreiberstreifen. Zeichen wörtlich
   aus dem Doc (Prüfstempel-Moves aus der Chronicle, Eichmarke bei PROTOCOL-Änderungen,
   Kaveat-Fähnchen aus den stehenden Bedingungen, Splice vom 2026-07-12 als Material-Geste).
3. **Studio:** `/studio` = die Bühne (Default dunkel — die einzige Praxis, deren Naturlicht
   die Dunkelheit ist; hell = Probenlicht), `/studio/history` = Abendzettel. 1 Premiere,
   7 Kills ehrlich (X-Marken mit wörtlichen Kill-Begründungen), die Gasse für das erklärt
   Abgelehnte.
4. **Praktiken-Index:** /praktiken prüfen — ob er nach dem Umbau noch gebraucht wird oder auf
   den Hub verweist; Routen-Frage englisch beachten (falls behalten → /practices + 301).
5. **Redirects + Matrix:** alle Routenänderungen in `public/_redirects` +
   `docs/redirect-matrix-site-v2.md` (Nachtrag) + `src/lib/redirects.test.ts`.
6. **DoD:** `npm run test` (alle bestehenden + neue Renderer-Tests) · `npm run check` ·
   `npm run build` grün · keine toten Links · Register-/Score-/Pulse-Tests unangetastet ·
   Commits deutsch, klein, KEINE KI-Produkt-Credits · untracked Fremddateien (logo/, *.webp,
   *.xcf, docs/federated-research-ecology*) nicht anfassen · Branch pushen, kein Merge.

## Reihenfolge & Ehrlichkeit

Atelier → Field → Studio, jeweils: Renderer-Modul + Tests → Seiten → Screenshot-Vergleich
gegen das Mockup-HTML (Playwright, localhost). Wo eine Datenquelle fehlt oder vom Mockup
abweicht (Mockups lasen die Engine-Repos direkt; die Site liest ihre committeten Spiegel),
wird die Abweichung im Commit-Text benannt, nie still überbrückt. Die Mockup-Generatoren sind
die Wahrheit für Geometrie und Zeichen; die Site-Daten sind die Wahrheit für Inhalt.
