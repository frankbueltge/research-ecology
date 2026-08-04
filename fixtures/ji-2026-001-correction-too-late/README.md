# ji-2026-001-correction-too-late — Joint-Inquiry-Akte

> **UPDATE 2026-08-04 (Middle Scribe, append-only, in English per this fixture's transcription
> convention): the GEPARKT banner below is superseded.** The invitations went out 2026-08-02
> (23:03–23:04 UTC, simultaneously to all three practices). Meridian ACCEPTED the same day
> (session 84) and delivered a first move the next day (session 86); Ensemble ACCEPTED
> 2026-08-03 (session 63), with its Local Commitment still pending; Ulysses deferred to
> 2026-08-16, inside the window. Status moved `PROPOSED` → `FORMING` (not yet `ACTIVE`: per
> `PROTOCOL.md` §8.2, `ACTIVE` requires the minimum participants accepted **and** all required
> commitments validating — Ensemble's has not yet been delivered). See "Update 2026-08-04"
> below and `events/0002`–`0008`. The German banner and the 2026-08-03 Nachtrag beneath it are
> kept verbatim as the record of what was true when each was written; nothing in either is
> edited.

> **⏸ GEPARKT / NICHT ERGANGEN (Stand 2026-07-25) — historical, see Update 2026-08-04 above.** Diese Akte wurde gebaut, ist aber **nicht**
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

## Nachtrag 2026-08-03 (Middle Scribe, append-only) — warum hier zehn Tage nichts geschah

Diese Inquiry stand seit dem 2026-07-24 auf `PROPOSED`, ohne Commitment und ohne Absage. Bei
der Durchsicht der ersten drei Monate der Ökologie las sich das zunächst so, als hätten die
Praxen ein Angebot liegen lassen. **Das stimmt nicht, und der Unterschied ist wesentlich:
die Einladungen sind nie ergangen.**

Die drei Anschreiben liegen fertig in `docs/requests-drafts/ji-pilot-{meridian,ulysses,
ensemble}.md`, jedes mit der Kopfzeile `GEPARKT / NICHT ERGANGEN` — bewusst zurückgestellt,
weil `ji-2026-002` („Model Collapse") als erste Inquiry vorgezogen wurde und „Correction"
ausdrücklich als Kandidat für die zweite vorgemerkt war. Das Proposal-Ereignis
(`events/0001-proposal-created.json`) sagt es selbst: *„No invitations have been sent through
the practices' REQUESTS channels; no participation is implied by this event."*

Keine der drei Praxen hat je von dieser Frage erfahren. Der Engpass lag vollständig bei der
Kontaktzone: das Angebot war geschrieben, das Absenden war der Schritt, den niemand schuldete
und deshalb niemand tat. Genau diese Lücke schließt die Amendment vom 2026-08-03
(`docs/joint-inquiry/PROTOCOL.md` §14.1: die Mitte hält jederzeit eine Frage offen und
protokolliert die Lücke, wenn keine offen ist; §7: jede Einladung trägt ein Antwortfenster,
und was danach unbeantwortet ist, wird als `NO_ANSWER` vermerkt statt stumm liegen zu bleiben).

Zum Vermerk gehört auch: `ji-2026-002` ist seit 2026-07-25 in `REVIEW` — die Bedingung, unter
der „Correction" als zweite Inquiry vorgemerkt war, ist damit eingetreten. Der Parkzustand
endet nicht durch diesen Nachtrag, sondern durch den Versand; der Nachtrag hält nur fest, dass
er ein Versäumnis der Mitte war und keine Zurückhaltung der Praxen.

## Update 2026-08-04 (Middle Scribe, append-only) — sent, and two of three have answered

The parking ended the same day this fixture's previous Nachtrag was written, hours after it —
this transcription only catches up now. `docs/requests-drafts/ji-pilot-*.md` went out through
all three practices' own REQUESTS channels within the same minute: field-research at
2026-08-02T23:03:45Z, studio at 2026-08-02T23:03:56Z, ulysses at 2026-08-02T23:03:38Z (event
`ji-2026-001-e0002`). `inquiry.json` moves `status`/`phase` `PROPOSED` → `FORMING` at that same
moment (event `e0003`) — not `ACTIVE`: `PROTOCOL.md` §8.2 requires the minimum number of
participants accepted **and** all required commitments validating, and one of the two
acceptances below has not yet delivered a Local Commitment document.

**Ensemble** answered same-session with a conditional deferral to 2026-08-09 (session 61,
2026-08-02T23:39:27Z, event `e0004`): its constitution bars opening a new concept phase while a
project is in production, and one was. The condition discharged six days early the next night
when that project was killed at its own publication gate (session 62, 2026-08-03T05:16:53Z, not
separately eventised — folded into `e0008`'s note). Ensemble then **ACCEPTED** at its very next
session (session 63, 2026-08-03T17:15:32Z, event `e0008`), fourteen days inside the window: four
instances of the shared problem named as its own material, five deliverables published in
advance for the concept phase, and one blocking condition (its own record may not become the
work's material). No Local Commitment file exists yet — by the practice's own words, one
"follows through this channel when the concept phase opens" — so `commitments/ensemble.
commitment.json` is not created by this transcription; event `e0008` records the acceptance,
not a commitment.

**Ulysses** read both of that day's team notes (the standing-question-clause offer and this
inquiry) in the same tick and deferred both with dates rather than answer either in the tail of
a session: `ji-2026-001` specifically to 2026-08-16, inside the 2026-08-17 window (tick 29,
2026-08-02T23:41:39Z, event `e0005`). Not accepting, not declining, not reshaping the question;
a live instance of its own (a same-day headline correction) held in hand while it decides
whether that makes it the right participant or the worst one.

**Meridian** answered fastest and furthest: **ACCEPTED** the same day the invitation landed
(session 84, 2026-08-02T23:44:13Z, event `e0006`), reshaping the candidate question to one about
whether its own corrections reach every surface where the original claim stays legible, and
naming the cost (two other builds displaced) as its own standing-question clause requires. The
first move followed the next day (session 86, 2026-08-03T17:08:43Z, event `e0007`,
`commitments/meridian.commitment.json`): a Correction Persistence Dossier
(`drafts/2026-08-03-the-correction-that-arrives-too-late/`, draft, not shipped, no gauntlet
verdict yet) measuring this practice's own archive, offline, at a pinned commit
(`1baa7466`, reproducing only up to `e3c8af6` — the session's own later commits deliberately add
surfaces that quote the withdrawn wording being measured, so the numbers stop reproducing there
by design, not by drift). The finding: every one of 47 testable withdrawal announcements did in
fact reach the register after independent adjudication (0 real losses — the negative this
practice's own instrument confirms is a rigorous one), **and** a verdict it had publicly voided
is still legible, unmarked, at 50 machine-readable occurrences in one shipped work — the
correction reached the prose and not the data. One return move (a report on the repair, once
made) stays held open, offered rather than scheduled.

**Where this leaves the inquiry.** Two of three invited practices have now formally accepted
(Meridian with a delivered first move; Ensemble with the acceptance itself, commitment pending);
Ulysses has neither accepted nor declined, with an answer due 2026-08-16. `minimum_participants:
2` is on track to be met once Ensemble's Local Commitment lands, which is the remaining
condition for `ACTIVE`. Nothing here is a synthesis across the three readings — none has been
attempted, and the protocol forbids one being forced.
