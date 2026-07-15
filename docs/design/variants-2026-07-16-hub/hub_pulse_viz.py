#!/usr/bin/env python3
"""Hub-Mockup-Generator — site-v2 Design-Session 2026-07-16.

Baut hub-a.html: der Eingangs-Hub von frankbueltge.de (Variante A / Observatorium).
Der Hero-Puls ist eine Joy-Division-Ridgeline aus ECHTEN Daten: Commit-Zeitstempel
der fünf Ökologie-Repos (drei Engines, research-ecology, die Site), eine Zeile pro
ISO-Woche, x = Stunde der Woche (2h-Bins, UTC), Höhe = aufgezeichnete Commits.
Deterministisch bis auf die Datenquelle selbst (git log zum Laufzeitpunkt) — der
Datenstand wird als as-of-Vermerk in die Karte geschrieben, nie versteckt.

Die eingebettete Partitur ist der byte-gleiche Output des Site-Renderers
(src/lib/begegnungen/score.ts), extrahiert nach score-embed.svg; ihre Stilregeln
liegen unverändert in score-styles.css (aus BegegnungEntrance.astro).
"""

from __future__ import annotations

import subprocess
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).parent
GH = Path("/Users/frankbultge/Documents/GitHub")

# Die fünf Repos der Ökologie (Praxis → Checkout). Nur der Default-Branch (HEAD).
REPOS = {
    "field-research": GH / "field-research",
    "irrtum-als-methode": GH / "irrtum-als-methode",
    "studio": GH / "studio",
    "research-ecology": GH / "research-ecology",
    "frankbueltge.de": GH / "frankbueltge.de",
}

# Fenster: ISO-Wochen W17–W29/2026 (13 Zeilen). Früh-Wochen sind leer — Absicht:
# ruhige Ränder sind die wahre Vorgeschichte, keine Gauß-Hüllkurve.
WEEKS = [(2026, w) for w in range(17, 30)]
BIN_HOURS = 2
BINS = 7 * 24 // BIN_HOURS  # 84 Spalten Montag 00:00 → Sonntag 24:00 UTC

# Ridgeline-Geometrie; NOTE_W ist eine reine Text-Randspalte rechts neben den Bahnen.
W, ROW_GAP, PEAK_H, PAD_X, PAD_TOP, NOTE_W = 940, 27, 96, 46, 130, 190


def collect() -> tuple[dict[tuple[int, int], list[float]], dict[str, str], str]:
    """Commit-Instants → (Woche → 84 Bins), letzte Commit-Daten je Repo, as-of."""
    rows = {wk: [0.0] * BINS for wk in WEEKS}
    last: dict[str, str] = {}
    for name, path in REPOS.items():
        out = subprocess.run(
            ["git", "-C", str(path), "log", "--since=2026-04-20", "--format=%aI"],
            capture_output=True, text=True, check=True,
        ).stdout.split()
        for iso in out:
            t = datetime.fromisoformat(iso).astimezone(timezone.utc)
            wk = t.isocalendar()
            key = (wk.year, wk.week)
            if key in rows:
                rows[key][(wk.weekday - 1) * 24 // BIN_HOURS + t.hour // BIN_HOURS] += 1
        if out:
            last[name] = max(out)[:10]
    as_of = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    return rows, last, as_of


def smooth(v: list[float], passes: int = 2) -> list[float]:
    """Deklarierte Glättung: gleitendes Mittel, Fenster 3, zwei Durchgänge."""
    for _ in range(passes):
        v = [(v[max(i - 1, 0)] + v[i] + v[min(i + 1, len(v) - 1)]) / 3 for i in range(len(v))]
    return v


def pulse_svg(rows: dict[tuple[int, int], list[float]], now: datetime) -> str:
    """JD-Ridgeline: ältere Zeilen oben, jüngere unten; vordere verdecken hintere.

    Drei ehrliche Register: stumme Wochen zeichnen blasser (Stille, kein Raster);
    Notate wohnen in einer eigenen Randspalte statt auf den Bahnen; die laufende
    Woche ENDET an der as-of-Kante — hinter der Kante ist nichts (Grammatik §1).
    """
    series = [smooth(rows[wk]) for wk in WEEKS]
    peak = max(max(s) for s in series) or 1.0
    height = PAD_TOP + ROW_GAP * (len(WEEKS) - 1) + 40
    xs = [PAD_X + i * (W - 2 * PAD_X) / (BINS - 1) for i in range(BINS)]
    now_iso = now.isocalendar()
    parts: list[str] = []
    notes = {(2026, 17): "W17 · nothing recorded yet", (2026, 24): "W24 · the site begins",
             (2026, 29): "W29 · the as-of edge"}
    for r, wk in enumerate(WEEKS):  # oben → unten; spätere paths liegen davor
        base = PAD_TOP + r * ROW_GAP
        silent = max(series[r]) == 0
        is_current = wk == (now_iso.year, now_iso.week)
        # Angebrochene Woche: nur bis zum jüngsten vollen Bin zeichnen.
        n = ((now_iso.weekday - 1) * 24 + now.hour) // BIN_HOURS + 1 if is_current else BINS
        y = [base - series[r][i] / peak * PEAK_H for i in range(n)]
        pts = "".join(f"L{xs[i]:.1f} {y[i]:.1f}" for i in range(n))
        if is_current:
            # Fläche (Verdeckung) geschlossen zur Basislinie; Strich endet offen an der Kante.
            parts.append(f'<path d="M0 {base}H{PAD_X}{pts}L{xs[n - 1]:.1f} {base}Z" fill="var(--bg)"/>')
            parts.append(
                f'<path d="M0 {base}H{PAD_X}{pts}" fill="none" stroke="var(--pulse-ink)" '
                f'stroke-width="1.3" stroke-linejoin="round"/>'
            )
        else:
            quiet = ' opacity=".33"' if silent else ""
            parts.append(
                f'<path d="M0 {base}H{PAD_X}{pts}L{W - PAD_X} {base}H{W}" '
                f'fill="var(--bg)" stroke="var(--pulse-ink)" stroke-width="1.3" '
                f'stroke-linejoin="round"{quiet}/>'
            )
        if wk in notes:
            parts.append(
                f'<text x="{W + 10}" y="{base - 2}" class="pulse-note">{notes[wk]}</text>'
            )
    return (
        f'<svg viewBox="0 0 {W + NOTE_W} {height}" role="img" aria-label="The pulse: '
        f"thirteen weeks of recorded practice across the ecology's five repositories, "
        f'one ridgeline per ISO week.">{"".join(parts)}</svg>'
    )


def build() -> None:
    rows, last, as_of = collect()
    now = datetime.now(timezone.utc)
    total = int(sum(sum(v) for v in rows.values()))
    score_svg = (HERE / "score-embed.svg").read_text()
    score_css = (HERE / "score-styles.css").read_text()
    score_css = score_css.replace("<style is:global>", "").replace("</style>", "")

    doors = [
        ("ulysses", "The Atelier", "/atelier",
         "Philosophical and artistic research — problems, works, self-critique. "
         "Error as method.",
         f"resident: Ulysses · last recorded: {last['irrtum-als-methode']}"),
        ("meridian", "The Field", "/field",
         "Cartographic research — instruments and maps, offered under conditions.",
         f"resident: Meridian · last recorded: {last['field-research']}"),
        ("ensemble", "The Studio", "/studio",
         "A production practice — works are staged, and the bill is printed.",
         f"resident: Ensemble · last recorded: {last['studio']}"),
        ("conductor", "The Middle", "/begegnungen",
         "The contact zone. Records what happens when practices meet — nothing more.",
         f"no resident — kept by the conductor · last recorded: {last['research-ecology']}"),
    ]
    door_html = "".join(
        f'<a class="door door-{k}" href="{href}"><h3>{name}</h3><p>{line}</p>'
        f'<span class="mono">{meta}</span></a>'
        for k, name, href, line, meta in doors
    )

    html = f"""<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>MOCKUP hub-a — a federated research ecology</title>
<style>
:root {{
  --bg: #0c0e10; --panel: #101318; --fg: #e8edf2; --fg-muted: #98a2ad;
  --fg-faint: #5b6672; --line: #232a33; --pulse-ink: #dde4ea;
  --c-meridian: #3987e5; --c-ensemble: #d95926; --c-ulysses: #9085e9; --c-conductor: #77828d;
  --color-bg: var(--bg); --color-fg: var(--fg); --color-fg-muted: var(--fg-muted);
  --color-fg-faint: var(--fg-faint); --color-line: var(--line);
  --font-sans: ui-sans-serif, system-ui, "Helvetica Neue", Arial, sans-serif;
  --font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}}
* {{ box-sizing: border-box; margin: 0; }}
body {{ background: var(--bg); color: var(--fg); font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased; line-height: 1.55; }}
a {{ color: inherit; text-decoration: none; }}
.mono {{ font-family: var(--font-mono); font-size: 11px; letter-spacing: .04em;
  color: var(--fg-faint); }}
.wrap {{ max-width: 76rem; margin: 0 auto; padding: 0 24px; }}

.mockbar {{ background: #2a2110; color: #d9b96a; font-family: var(--font-mono);
  font-size: 11px; letter-spacing: .08em; text-align: center; padding: 5px 8px; }}

header.nav {{ position: sticky; top: 0; z-index: 10; display: flex; align-items: center;
  justify-content: space-between; height: 48px; padding: 0 20px;
  border-bottom: 1px solid var(--line); background: rgba(12,14,16,.85);
  backdrop-filter: blur(8px); }}
header.nav .brand {{ display: flex; gap: 10px; align-items: center; font-weight: 600;
  font-size: 14px; letter-spacing: -.01em; }}
header.nav .brand i {{ width: 7px; height: 7px; border-radius: 50%;
  background: var(--c-conductor); }}
header.nav nav {{ display: flex; gap: 22px; font-size: 13.5px; color: var(--fg-muted); }}
header.nav nav a:hover {{ color: var(--fg); }}

.hero {{ padding: 84px 0 40px; text-align: center; }}
.hero .eyebrow {{ font-family: var(--font-mono); font-size: 12px; letter-spacing: .22em;
  color: var(--fg-muted); }}
.hero h1 {{ font-size: clamp(38px, 6.4vw, 72px); font-weight: 650; letter-spacing: -.025em;
  line-height: 1.04; margin: 18px auto 20px; max-width: 18ch; }}
.hero .sub {{ max-width: 58ch; margin: 0 auto; color: var(--fg-muted); font-size: 17px; }}
.hero .conductor {{ margin-top: 14px; }}
.pulse {{ max-width: 62rem; margin: 34px auto 0; padding: 0 24px; }}
.pulse svg {{ width: 100%; height: auto; display: block; }}
.pulse-note {{ font-family: var(--font-mono); font-size: 10.5px; fill: var(--fg-faint); }}
.pulse-caption {{ text-align: center; margin: 14px auto 0; max-width: 74ch; }}

section {{ border-top: 1px solid var(--line); padding: 64px 0; }}
.kicker {{ font-family: var(--font-mono); font-size: 11.5px; letter-spacing: .22em;
  color: var(--fg-muted); margin-bottom: 26px; }}
.kicker b {{ color: var(--fg); font-weight: 600; }}

.enc-head h2 {{ font-size: clamp(24px, 3.2vw, 38px); font-weight: 650;
  letter-spacing: -.02em; max-width: 26ch; }}
.enc-status {{ margin: 12px 0 6px; color: var(--fg-muted); font-size: 15px; }}
.enc-status b {{ color: var(--fg); }}
.selection-rule {{ margin-top: 22px; display: block; }}
.enc-link {{ display: inline-block; margin-top: 10px; font-size: 14px;
  border: 1px solid var(--line); padding: 8px 14px; border-radius: 8px;
  color: var(--fg-muted); }}
.enc-link:hover {{ color: var(--fg); border-color: var(--fg-faint); }}

.doors {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 14px; }}
.door {{ border: 1px solid var(--line); border-radius: 10px; padding: 20px 18px 16px;
  background: var(--panel); position: relative; overflow: hidden;
  transition: border-color .15s; }}
.door::before {{ content: ""; position: absolute; inset: 0 auto auto 0; height: 3px;
  width: 100%; }}
.door-ulysses::before {{ background: var(--c-ulysses); }}
.door-meridian::before {{ background: var(--c-meridian); }}
.door-ensemble::before {{ background: var(--c-ensemble); }}
.door-conductor::before {{ background: var(--c-conductor); }}
.door:hover {{ border-color: var(--fg-faint); }}
.door h3 {{ font-size: 19px; letter-spacing: -.01em; margin-bottom: 8px; }}
.door p {{ font-size: 14px; color: var(--fg-muted); min-height: 4.2em; }}
.door .mono {{ display: block; margin-top: 12px; }}

.travel, .rest {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px; }}
.row-card {{ border: 1px solid var(--line); border-radius: 10px; padding: 18px;
  background: var(--panel); }}
.row-card h3 {{ font-size: 16px; margin-bottom: 6px; }}
.row-card p {{ font-size: 14px; color: var(--fg-muted); }}
.travel-note {{ margin-top: 18px; display: block; }}

footer {{ border-top: 1px solid var(--line); padding: 28px 0 40px; }}
footer .wrap {{ display: flex; flex-wrap: wrap; gap: 10px 28px;
  justify-content: space-between; }}

/* ---- Partitur: unveränderte Site-Stilregeln (BegegnungEntrance.astro) ---- */
{score_css}
</style>
</head>
<body>
<div class="mockbar">MOCKUP hub-a · site-v2 design session 2026-07-16 · wording is DRAFT — approval pending · nothing deployed</div>

<header class="nav">
  <a class="brand" href="#"><i></i>Frank Bültge</a>
  <nav>
    <a href="#enc">Encounters</a><a href="#doors">Atelier</a><a href="#doors">Field</a>
    <a href="#doors">Studio</a><a href="#rest">Holdings</a><a href="#rest">Atlas</a>
    <a href="#travel">Projects</a><a href="#rest">About</a>
  </nav>
</header>

<div class="hero">
  <div class="eyebrow">FRANK BÜLTGE · DATA &amp; AI ENGINEER</div>
  <h1>a federated research ecology</h1>
  <p class="sub">Three autonomous AI research practices and a contact zone.
  Everything recorded, everything verifiable — Git is the archive.</p>
  <span class="mono conductor">architect &amp; conductor: Frank Bültge · the machines write, the record shows who wrote what</span>
  <div class="pulse">{pulse_svg(rows, now)}</div>
  <span class="mono pulse-caption">the pulse — one line per ISO week (W17–W29 2026) ·
  Monday 00:00 → Sunday 24:00 UTC · height = commits recorded across the ecology's five
  repositories ({total} in this window) · 2-hour bins, moving average ×2 ·
  the recurring ridge before dawn is the nightly machinery · as of {as_of}</span>
</div>

<section id="enc">
  <div class="wrap">
    <p class="kicker"><b>NOW</b> · THE CURRENT ENCOUNTER · enc-2026-001-calibration-gap-travels · as of 2026-07-14</p>
    <div class="enc-head">
      <h2>A work found the flaw in the instrument it was built from.</h2>
      <p class="enc-status"><b>unresolved — both readings stand</b> · 7 ledger events · 3 lanes · wording approved</p>
    </div>
    <div class="score-map">{score_svg}</div>
    <span class="mono selection-rule">selection rule: the entrance is the current encounter —
    today, the only fully documented one. when others exist, the rule will be named here.</span>
    <br><a class="enc-link" href="#">read the full score — six stations, every quote addressable →</a>
  </div>
</section>

<section id="doors">
  <div class="wrap">
    <p class="kicker"><b>WHO LIVES HERE</b> · FOUR DOORS</p>
    <div class="doors">{door_html}</div>
  </div>
</section>

<section id="travel">
  <div class="wrap">
    <p class="kicker"><b>WHERE WORKS TRAVEL</b> · STANDING VENUES ELSEWHERE</p>
    <div class="travel">
      <a class="row-card" href="#"><h3>datavism.org</h3>
        <p>Cinematic data activism. Works and methods from the ecology surface there
        in an activist register.</p></a>
      <a class="row-card" href="#"><h3>data-snack.com</h3>
        <p>A character-driven data magazine. Takes up works made here and serves them
        in a different voice.</p></a>
    </div>
    <span class="mono travel-note">other houses, other rules — what travels there is presented, not governed, by this site</span>
  </div>
</section>

<section id="rest">
  <div class="wrap">
    <p class="kicker"><b>ALSO ON THIS SITE</b></p>
    <div class="rest">
      <a class="row-card" href="#"><h3>Holdings</h3><p>The lab's earlier experiments —
        The Protocol, Parallaxe, Police — offered as material, under conditions.</p></a>
      <a class="row-card" href="#"><h3>Atlas</h3><p>The reference collection: 214 works
        of data art the lab measures itself against.</p></a>
      <a class="row-card" href="#"><h3>Apparatus</h3><p>How the machinery runs — models,
        nightly routines, gates, and who answers for them.</p></a>
      <a class="row-card" href="#"><h3>About</h3><p>The person behind the site — work,
        method, contact.</p></a>
    </div>
  </div>
</section>

<footer>
  <div class="wrap">
    <span class="mono">a federated research ecology · frankbueltge.de</span>
    <span class="mono">code PolyForm NC 1.0.0 · works CC BY-NC-SA 4.0 · Git is the archive</span>
    <span class="mono">MOCKUP — generated {as_of} by hub_pulse_viz.py</span>
  </div>
</footer>
</body>
</html>
"""
    out = HERE / "hub-a.html"
    out.write_text(html)
    print(f"wrote {out} · pulse peak={max(max(smooth(rows[w])) for w in WEEKS):.1f} "
          f"commits/2h (smoothed) · {total} commits in window")


if __name__ == "__main__":
    build()
