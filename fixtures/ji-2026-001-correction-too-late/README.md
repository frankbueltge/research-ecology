# ji-2026-001-correction-too-late — Joint-Inquiry-Akte (GEPARKT)

> **⏸ GEPARKT / NICHT ERGANGEN (Stand 2026-07-25).** Diese Akte wurde gebaut, ist aber **nicht**
> die erste Inquiry: als Auftakt lief **ji-2026-002 „Model Collapse"** (Einladungen 2026-07-25
> versendet, siehe dort). „The Correction That Arrives Too Late" bleibt **sichtbar und datiert
> geparkt** — ein plausibler Kandidat für die *zweite* Inquiry (thematisch nah an R1-T01, das am
> erhaltenen Hammond-Dissens ansetzt). Nichts versendet, nichts angenommen, **kein aktiver
> Vorgang** — nicht für aktiv halten.

**Status: `approval: draft`, `status: PROPOSED`, `phase: PROPOSAL` — aber GEPARKT (siehe oben).**
Nichts wurde über die REQUESTS-Kanäle der Praktiken gesendet; nichts wurde committet; keine
Praxis hat teilgenommen oder zugestimmt. Diese Akte war eine **Owner-Entscheidungsvorlage** —
sie würde erst real, wenn Frank die Einladungen (`docs/requests-drafts/ji-pilot-*.md`) versendet
(was nicht geschah) und eine Praxis ein Local Commitment zurückgibt.

Regeln: `docs/joint-inquiry/PROTOCOL.md` + Adoptions-Entscheidungen
`docs/design/joint-inquiry-adoption-2026-07-19.md`. Kontext & Ranking:
`docs/design/2026-07-24-joint-inquiry-candidates.md` (Kandidat A). Herkunft: Dokument 10 des
Spec-Pakets (`frankbueltge.de/docs/research-ecology-joint-inquiry-spec-v0.1.0/10-…`), hier gegen
den realen Repo-Stand rekonziliert (§3 des Dokuments verlangt genau diese Prüfung).

## Die Frage

> Was bleibt wirksam, nachdem ein öffentlicher Claim korrigiert wurde? Löscht die Korrektur die
> erste Behauptung, oder kommt sie nur als weitere Spur, die verändert, aber nicht tilgt?

Profil: `parallel_return` mit expliziten `cross_examination`-Rückzügen. Drei Erstzüge parallel
auf demselben versionierten Material, danach ein wechselseitiger Kreuzverhör-Rückzug, max. ein
Rückzug je Praxis.

## Shared Material (real, aus enc-2026-001 verifiziert)

Zwei versionierte, gehashte Objekte (`inquiry.json` → `shared_material_refs`), Provenienz aus
der verifizierten `QUOTE-MANIFEST`/Provenienz-Tabelle von `enc-2026-001-calibration-gap-travels`:

1. **Der Claim mit Korrektur-Historie** — Meridians Calibration-Certificate (instrument 001),
   `works/2026-07-01-calibration-gap/data.json` im session-33-korrigierten Zustand
   (commit `ae89e09e`, sha256 `af8557a6…`).
2. **Die Korrektur selbst** — der Korrektur-Bericht in `REQUESTS.md` (commit `5dcdb17b`,
   sha256 `2104873a…`, enc-2026-001 Event 03).

**Persistenz-Hinweis (thematisch load-bearing, ehrlich):** field-researchs `main` teilt seit der
Legal-Hygiene-Git-History-Purge (2026-07-21) keine Ancestry mehr mit diesen Commits; die Objekte
bleiben dennoch byte-exakt über Mirrors abrufbar (`raw.githubusercontent.com`, bestätigt in
enc-001 am 2026-07-22). Dass das geteilte Material selbst ein Objekt ist, das eine Korrektur/Purge
überlebt hat, ist kein Zufall — es IST der Gegenstand.

## Reconciliation gegenüber Dokument 10 (dokumentiert, wie §3 verlangt)

- **Empirischer Anker neu gesetzt.** Dokument 10 rahmt Meridians Erstzug als „bounded
  observation/experiment" über *search, cache, models* — die am schlechtesten reproduzierbare
  Zone (Capability-Roadmap MRR). **Hier verlegt auf die reproduzierbare In-Archiv/Mirror-Schicht**
  (N2 Citation-/Claim-Audit + N3 deskriptive Analyse, code-verankert). Live-Web-Oberflächen
  bleiben *optionale* Erweiterung; Dokument 10s eigene Kill-Bedingung deutet ohnehin dorthin.
- **Schärferer, späterer Seed benannt.** Der ursprüngliche Calibration-Gap-Seed bleibt der
  primäre, **rights-saubere** Anker. Ein *schärferer* Fall ist seit Dokument 10 entstanden: die
  2026-07-21-Purge, deren Redaktion die Spur nicht heben konnte (enc-001/003/004) — die
  buchstäbliche „Korrektur, die zu spät kommt". Er wird **nur unter Rights-Auflage** geführt
  (siehe unten), nicht als gesetzt.
- **`minimum_participants: 2` statt 3** (Design-Abweichung). Grund: eine einzelne Absage einer
  Praxis (Souveränitätsrecht §2.1/§11) soll die Inquiry nicht canceln; sie läuft dann als
  Zwei-Perspektiven-Studie mit der dritten als explizitem Abwesenheits-Zustand (§12.2). Das
  volle Drei-Perspektiven-Ziel will alle drei — der Floor schützt nur gegen Totalausfall. **Frank
  kann auf 3 zurücksetzen**, wenn „drei oder gar nicht" gewünscht ist.

## Beitrag je Praxis (Kandidaten-Fragen — die Praxis formt sie selbst oder lehnt ab)

- **Meridian (Wissenschaft):** ein versioniertes *Correction Persistence Dossier* — misst
  reproduzierbar, ob/wo die unkorrigierte Fassung relativ zur Korrektur weiter zirkuliert, in
  einer deklarierten Oberflächen-/Zeit-Grenze. Präzedenz: `calibration-gap` (Korrektur-Historie),
  die Half-Life-Proben (`notes/2026-07-16-…`, `notes/2026-07-19-…`, prä-registriert). N2+N3.
- **Ulysses (Philosophie):** eine Operation zur Asymmetrie „eine Korrektur nimmt nicht zurück,
  was sie sagt". Präzedenz: das aktive `falsche-anschluesse` mit der Verdikt-Taxonomie
  `verified at source / real but altered / second-hand / misattributed / not findable`.
- **Ensemble (Kunst):** eine erfahrbare Situation, in der eine erste Regel wirkt und eine
  Korrektur den vorigen Zustand nicht wiederherstellt. **Nicht** eine dritte Entrapment-Maschine
  (die eigene Recovery-Kritik warnt vor „one trick, two costumes") — ein neuer formaler Zug.

## Rights- und Betroffenen-Vorbehalt (menschliche Abwägung nötig, §2.8)

Der Purge-Seed berührt **redigierte reale Namen**. Die Inquiry darf das **Struktur-/
Metadaten-Phänomen** untersuchen (eine Redaktion, die über Mirrors persistiert), **niemals den
redigierten Inhalt re-exponieren**. Keine neue Datenerhebung zur Anreicherung (Dokument 10 §4);
keine öffentliche Teilnehmer-Forschung ohne separaten Consent-Plan; jeder Prototyp nutzt
synthetische Zustände oder informierte interne Teilnehmende. **Frank muss diesen Seed abwägen,
bevor er den rights-sauberen Primär-Seed überlagert.**

## Manueller Betrieb (D-JI-02)

Einladungen → REQUESTS-Kanäle der Praktiken (`docs/requests-drafts/ji-pilot-*.md`), von **Frank**
versendet. Moves → gewöhnliche lokale Projekte in den Praxis-Repos; diese Akte referenziert sie
nur. Austausch → Encounter-Ereignisse (`enc-*`), hier verlinkt. Transkription → Middle Scribe
(sein Prompt erhält die ji-*-Klausel erst, wenn diese Inquiry `ACTIVE` wird). Öffentliche
Exposition nur nach menschlicher Freigabe.

## Aufbau

- `inquiry.json` — die Akte (Problem, Material, Profil, Ressourcen-Hülle, Stop-Bedingungen,
  Rechte). `approval: draft`, `status: PROPOSED`.
- `events/0001-proposal-created.json` — das Proposal-Ereignis (Entwurf; `content_hash` und
  Hash-Kette sind Platzhalter, bis der Scribe die Inquiry aktiviert).
- `commitments/` — leer (Vorlage): je Praxis ein Local Commitment, wenn angenommen.
- `positions/` — leer (Vorlage): Positionen/Abwesenheiten am Ende.

## Hash-/Verifikations-Hinweis (ehrlich)

Die `content_hash`-Werte in `events/` sind **Platzhalter** (Entwurf, keine Hash-Kette gerechnet).
Die `shared_material_refs`-Hashes sind **real** (aus enc-2026-001 übernommen und dort verifiziert);
sie verifizieren gegen die gepinnten Commits via lokalem field-research-Clone bzw. Mirror. Ein
Joint-Inquiry-Eintrag im gemeinsamen Verifier (`tools/verify-encounter-fixtures.mjs` bzw. ein
ji-Pendant) existiert noch nicht — benannt hier, nicht in dieser Akte gebaut.
