# frankbueltge.de — Neustrukturierung um die Ökologie
## Konzept (Frank-Mandat 2026-07-15: „komplett neu strukturieren"; Eingang spektakulär)

**Status:** Konzept beschlossen, Umsetzung auf Branch; nichts geht ohne Franks Blick live.

---

## 1. Leitidee

frankbueltge.de hört auf, ein Katalog von Experimenten zu sein, und wird der **Ort der
Ökologie**: Die Startseite ist der Eingang in die aktuelle Begegnung (Ebene 1 „das
Blatt"), die Site erzählt (Ebene 2), die Akte belegt (Ebene 3, eigene App). Identität
tritt hinter Praxis zurück — auf der ganzen Site.

## 2. Neue Informationsarchitektur

```
/                    das Blatt (aktuelle Begegnung, spektakulär, fast leer) → scrollt in die Erzählung
/begegnungen/…       Erzählungen (Ebene 2) vergangener/weiterer Encounters, materialerst
/praktiken           leiser Index der Praktiken (KEIN Eingang): Atelier, Field, Studio, das Labor
/atelier /field /studio   bleiben als souveräne Praxis-Archive (unverändert; nicht mehr im Hauptmenü zuerst)
/bestaende           die Bestände des Labors: Protokoll, Parallaxe, Police, Consensus, … —
                     umgewidmet von „Experimente" zu „Material, der Ökologie angeboten";
                     jede Route bleibt erreichbar (keine toten Links), Pipelines laufen weiter
/akte → App          Ebene 3 (The-Middle-App), Belegschicht; Subdomain/Pfad nach Deploy-Entscheid
/about /work /contact /impressum /datenschutz   bleiben (persönliche Site-Funktion), sekundär
```

- **Das Labor als vierte Praxis:** Franks eigene Pipelines-Praxis bekommt ein Manifest wie
  die Kollektive (Bestände = stehende Angebote mit Bedingungen — z. B. „Archiv-JSONs sind
  unantastbar; Zitate nur versioniert"). Damit ist „Futter für The Middle" nicht Abriss,
  sondern dieselbe Vertragsgeste wie Meridians downstream-commitments.
- **Nichts wird gelöscht.** Demotion statt Deletion: /lab leitet auf /praktiken +
  /bestaende um; alte Experiment-URLs bleiben gültig (Archiv-Ehrlichkeit, eingehende
  Links). Ob einzelne Nightlies später enden, entscheidet Frank pro Pipeline.
- **Einsprachig Englisch** (Frank, 2026-07-15): keine Übersetzungspflicht pro nächtlichem
  Lauf; die deutschen Alt-Seiten außerhalb der Ökologie bleiben bis zum Merge unberührt.

## 3. Der spektakuläre Eingang (Präzisierung)

Spektakulär = Maßstab + Typografie + die Dramatik des echten Materials. Konkret:
Vollbild-Blatt, Display-Typo (clamp bis ~9vw), ein Satz („Ein Werk fand den Fehler im
Instrument, aus dem es gebaut war."), darunter der sich einmalig selbst zeichnende Glyph
(Transfer-Linie, Korrektur-Pfeil zurück, terrakotta), eine Einladung. Keine Navigation
über dem Falz außer dem Abstieg und einem stillen Menü. Verbote bleiben: kein Neon, keine
Ambient-Loops, kein Dashboard. (Kubrick-Titelkarte, nicht Las Vegas.)

## 4. Umsetzungsweg

1. **3d (läuft):** Blatt + Erzählung + Divergenz-Ansicht in der The-Middle-App — dort
   liegen Daten und Testnetz; Frank begutachtet die Form am lebenden Objekt.
2. **3e:** Astro-Seite auf Branch `ecology-restructure`: neue IA, Blatt/Erzählung als
   statische Seiten (Datenexport aus der App per committetem JSON — „Git ist das Archiv"),
   /bestaende-Umwidmung, Redirects, DE/EN. Review per Screenshots + lokalem Build;
   **Merge auf main (= Live-Deploy) nur nach Franks ausdrücklichem Go.**
3. Danach: Deploy der Akte-App (wartet auf Stack-/Domain-Freigaben), Labor-Manifest,
   weitere Begegnungen (Kandidaten 2–4 aus dem Inventar).
