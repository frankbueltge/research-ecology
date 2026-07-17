# Work Order — Steuerzentrale (Franks Konsole) · 2026-07-17

Für eine frische Session mit vollem Kontextbudget. Frank: „ein ausgeklügeltes System mit
Web-UI, wo ich direkt antworten und interagieren kann oder Seeds reingebe."

## Was bereits existiert (die GitHub-Schicht — Sockel, nicht Ziel)

Alles im Repo `frankbueltge/frankbueltge.de`, `.github/workflows/`:

| Baustein | Workflow | Funktion |
|---|---|---|
| Posteingang | `requests-watchdog.yml` (2× täglich) | neue REQUESTS-Abschnitte der Praktiken → deduplizierte Issues „Request aus <repo>: …" |
| Tagesüberblick | `morning-digest.yml` (08:30) | EIN Issue: Sessions der Nacht, rote Läufe, offene Requests; schließt das Vortages-Digest; Telegram-Push sobald `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID` als Secrets existieren |
| Antwort-Rückkanal | Zeile in `docs/ROUTINE-PROMPTS.md` (alle 3 Blöcke) | Praktiken lesen Franks Issue-Kommentare im Orientierungspass selbst; kein Token nötig |
| Rückfallnetz | Standing rule in allen 4 REQUESTS.md | keine Antwort nach Frist/7 Tagen → Praxis entscheidet selbst, journalisiert |
| Wächter | `landing-watchdog.yml` | gestrandete Sessions → Issues; schließt Erledigtes selbst |

Grenzen der Schicht: nur GitHub-Notifications als Kanal; Antworten = Issue-Kommentare;
Seeds erfordern Datei-Edits in den Engine-REQUESTS.md; kein Live-Zustand, keine Interaktion.

## Was die Steuerzentrale werden soll

Eine Web-UI (Konduktor-Konsole) mit mindestens:

1. **Überblick live**: Nacht-Digest, Workflow-Gesundheit, offene Requests, Premiere-Gates,
   Encounter-Status — aggregiert aus den öffentlichen Repos/Feeds (read-only geht ohne Auth).
2. **Antworten**: Ein-Satz-Antworten auf Requests → landen als Kommentar auf dem
   gespiegelten Issue (GitHub-API mit Franks Token) — kompatibel mit dem bestehenden
   Rückkanal, keine neue Semantik nötig.
3. **Seeds reingeben**: Formular → committet einen Seed-Abschnitt in die REQUESTS.md der
   gewählten Praxis (Angebots-Grammatik vorformatiert, Franks Stimme).
4. **Encounter-Akten**: enc-Records lesen; `draft → approved` flippen; später:
   Middle-Scribe-Vorschläge annehmen/verwerfen.

## Wo sie architektonisch hingehört

**The Middle, schreibbare Phase** — exakt der geplante, bewusst noch nicht begonnene Teil
(README-Status; `docs/design/impulse-besucher-schreiben-sich-ein.md`, ADR 0002 Postgres-
Event-Modell, ADR 0005 read-only-first, ADR 0007 Auth/Write-Modell). Die Konsole ist der
erste Schreib-Anwendungsfall mit genau EINEM Nutzer (Frank) — der sanfteste Einstieg in die
writeable federation. Produktgrenze beachten (ADR 0010): Konsole ≠ Atelier ≠ Middle-Public;
ggf. eigene App auf dem geteilten Kernel. `apps/middle-web` ist noch adapter-auto und nicht
statisch exportierbar — die Konsole braucht ohnehin einen Server (Auth, GitHub-Token), das
passt zusammen. Cloudflare-Secrets für Deploys fehlen noch (bewusst roter deploy-apps).

## Vorgefundene Wiederverwendungs-Automation der Produkthäuser (in die Konsole einblenden)

- **datavism** (`docs/adr/003-field-pipeline.md`, umgesetzt 2026-07-11): `scripts/field-sync.mjs`
  + `.github/workflows/field-sync.yml` synct Meridian-Werke nach `src/content/field-works/`;
  Atlas-Snapshot (`update-atlas.mjs`); Werk→Operation-Übersetzung bewusst Handwerk (Phase 1).
- **data-snack** (`prototype-v2`): `.github/workflows/upstream-cook.yml` + Quick-Snacks in
  `src/content/quick/*.mdx` mit strukturierter `provenance:`-Frontmatter (supplier, work,
  gauntlet, inspected). **Befund:** supplier-String sagt noch „the lab's production wing" —
  Flügel-Sprache in der Cook-Vorlage, entwingen.
- Beide Flüsse sind seit den Aufnahmen (17.07.) encounter-förmige Standing-Relations —
  Kandidaten für Ledger-Records (Middle-Scribe), nicht neu zu erfinden.

## Nicht-Ziele / Leitplanken

- Kein zweites Archiv: Git bleibt der Record; die Konsole schreibt über die bestehenden
  Kanäle (Issues, REQUESTS-Commits, Fixtures), nie an ihnen vorbei.
- Kein Publikations-Bypass: approval-Flips sind Commits mit Franks Namen.
- §7.2: keine Leaderboards/Rankings der Praktiken in der Übersicht.
