#!/usr/bin/env python3
"""The Field — Millimeterpapier & Schreiberstreifen. Third language, own signs.

Meridian's practice logs by DAY (journal/ is day files) and counts collective
sessions inside them — so its native history form is a strip-chart recorder tape:
a continuous pen trace over graph paper, running on wall-clock time, with stamps
(chronicled moves), instrument marks, calibration ticks (PROTOCOL.md amendments),
one visible SPLICE (the 2026-07-12 history rewrite, ADR 0009) and one PATCH (the
S08 journal entry lost and restored verbatim, documented in journal/2026-07-01.md).
The data edge is the resting pen: the recorder has not lifted.

Every value from field-research @ 32e2db5 (read-only): git commit counts, works/
add-dates, chronicle.json verbatim, PROTOCOL.md git dates, journal anchors, and
the enc-2026-001 fixture for the two encounter marks. Nothing invented.
"""
import html
from assemble_variants import BASE_CSS, THEME_HEAD, TOGGLE_BTN, OUT, SHA

def esc(s): return html.escape(str(s), quote=True)

PROV = "field-research @ 32e2db5 · chronicle.json · journal/ day files · works/ git add-dates · PROTOCOL.md git dates · enc-2026-001 fixture · read-only"

DAYS = ["2026-07-%02d" % d for d in range(1, 15)]
ACT = {"2026-07-01":25,"2026-07-02":25,"2026-07-03":12,"2026-07-04":0,"2026-07-05":11,
 "2026-07-06":8,"2026-07-07":2,"2026-07-08":0,"2026-07-09":6,"2026-07-10":11,
 "2026-07-11":28,"2026-07-12":17,"2026-07-13":9,"2026-07-14":4}
INSTR = {"2026-07-01":8,"2026-07-02":2,"2026-07-05":1,"2026-07-06":1,"2026-07-09":1,"2026-07-11":1}
CHRONICLE = [(25,"2026-07-11","verify"),(26,"2026-07-11","other"),(27,"2026-07-11","consolidation"),
 (28,"2026-07-11","build"),(29,"2026-07-11","gauntlet"),(30,"2026-07-11","verify"),
 (31,"2026-07-12","consolidation"),(32,"2026-07-12","build"),(33,"2026-07-12","steer"),
 (34,"2026-07-13","advance (outward)"),(35,"2026-07-13","consolidation"),
 (36,"2026-07-13","advance (outward)"),(37,"2026-07-14","advance (outward)")]
PROTOCOL = ["2026-07-01","2026-07-02","2026-07-05","2026-07-07","2026-07-11"]
ANCHORS = {"2026-07-01":"S1","2026-07-11":"S24","2026-07-12":"S31","2026-07-14":"S37"}

X0, STEP, PEN_X = 300, 76, 1322
def dx(iso): return X0 + DAYS.index(iso) * STEP
BASE_Y = 460

FIELD_CSS = """
:root{--font-ui:Futura,"Century Gothic","Avenir Next",system-ui,sans-serif;
--font-display:var(--font-ui);--font-record:ui-monospace,"SF Mono",Menlo,monospace;
--h1-track:.05em;--h1-weight:500}
:root[data-theme="light"]{--page:#e8ecea;--surface:#f5f7f6;--ink:#1c211f;--ink-2:#5d6a64;
--hairline:#d3ddd7;--grid:#dbe4de;--grid-major:#c8d5cd;--c-stamp:#6a3fb5;--c-caveat:#9a6a08;
--badge-bg:#e9eeeb;--tip-bg:#ffffff;--tip-ink:#1c211f;--h1-ink:#141816}
:root[data-theme="dark"]{--page:#0c0f12;--surface:#12161a;--ink:#dde4e0;--ink-2:#8c9992;
--hairline:#28323a;--grid:#1d2530;--grid-major:#28323e;--c-stamp:#7e5fd3;--c-caveat:#b3861d;
--badge-bg:#1a2026;--tip-bg:#1a2026;--tip-ink:#dde4e0;--h1-ink:#eef2ef}
.wrap{border:1px solid var(--hairline);position:relative}
h1{color:var(--h1-ink);text-transform:uppercase}
.theme-toggle{position:absolute;top:26px;right:34px;width:34px;height:34px;display:flex;
align-items:center;justify-content:center;background:none;border:1px solid var(--hairline);
border-radius:6px;color:var(--ink-2);cursor:pointer}
.theme-toggle:hover{color:var(--ink)} .theme-toggle svg{display:none}
:root[data-theme-mode="auto"] .theme-toggle .i-auto{display:block}
:root[data-theme-mode="light"] .theme-toggle .i-sun{display:block}
:root[data-theme-mode="dark"] .theme-toggle .i-moon{display:block}
.blattrand{display:flex;gap:1.6em;align-items:baseline;margin:18px 0 4px;padding:7px 0;
border-top:1px solid var(--hairline);border-bottom:1px solid var(--hairline);
font:12px var(--font-record);letter-spacing:.08em}
.blattrand a{color:var(--ink-2);text-decoration:none;text-transform:uppercase}
.blattrand a:hover{color:var(--ink);text-decoration:underline}
.br-here{color:var(--ink);text-transform:uppercase;border-bottom:2px solid var(--c-stamp)}
.br-door{margin-left:auto;color:var(--ink-2);text-transform:uppercase}
/* Feld-Zeichen: Papier, Spur, Stempel, Fähnchen, Splice — nichts davon teilt Partitur oder Blatt */
.gridline{stroke:var(--grid);stroke-width:1}
.gridmajor{stroke:var(--grid-major);stroke-width:1}
.trace{stroke:var(--ink);stroke-width:1.8;fill:none;stroke-linejoin:round}
.instr{fill:var(--ink)}
.stamp{stroke:var(--c-stamp);fill:none;stroke-width:1.6}
.stamp-t{font:600 9.5px var(--font-record);fill:var(--c-stamp)}
.flag{fill:var(--c-caveat)}
.flag-pole{stroke:var(--c-caveat);stroke-width:1.4}
.eich{stroke:var(--ink-2);stroke-width:1.6}
.splice{stroke:var(--ink);stroke-width:1.4}
.tape{fill:var(--ink-2);opacity:.18}
.patch{stroke:var(--ink-2);stroke-width:1.2;fill:none;stroke-dasharray:2 2}
.pen{fill:var(--ink)}
.obl-f{stroke:var(--c-caveat);stroke-width:.9;opacity:.7;stroke-dasharray:1 4}
.t-plate{font:600 12px var(--font-record);letter-spacing:.1em;fill:var(--ink)}
.t-n{font:11.5px var(--font-record);fill:var(--ink-2)}
.t-anchor{font:600 11px var(--font-record);fill:var(--ink)}
.t-cav{font:11px var(--font-record);fill:var(--c-caveat)}
.evt2{cursor:help;outline:none}
"""

def grid(x0, x1, y0, y1):
    out = []
    x = x0
    i = 0
    while x <= x1:
        out.append(f'<path class="{"gridmajor" if i % 5 == 0 else "gridline"}" d="M{x} {y0} V{y1}"/>')
        x += 15.2; i += 1
    y = y0; i = 0
    while y <= y1:
        out.append(f'<path class="{"gridmajor" if i % 5 == 0 else "gridline"}" d="M{x0} {y} H{x1}"/>')
        y += 15.2; i += 1
    return "".join(out)

def rail(active):
    items = [("this instrument","/field — the instrument under verification"),("instruments","/field/werke — existing URLs stay"),
             ("register","/field/register — chronicle.json as the public register"),("journal","/field/journal — day files, grouped"),
             ("apparatus","/field/apparatus — repo, protocol, team channel, nightly runs")]
    out = ['<nav class="blattrand" aria-label="Plate rail — the only standing navigation">']
    for label, hint in items:
        if label == active:
            out.append(f'<span class="br-here">{label}</span>')
        else:
            out.append(f'<a href="#" title="{esc(hint)}">{label}</a>')
    out.append('<span class="br-door" title="/middle — enc-2026-001">→ the middle</span></nav>')
    return "".join(out)

# ---------------------------------------------------------------- page 2: der Schreiberstreifen
def strip_svg():
    s = ['<svg id="score" viewBox="0 190 1440 470" role="img" aria-label="Strip-chart tape 2026-07-01 to 2026-07-14: pen trace of commits per day, instrument marks, chronicled move stamps, one splice, one patch; the full register follows as a table.">']
    s.append(grid(250, 1352, 226, 560))
    # day axis
    for d in DAYS:
        x = dx(d)
        s.append(f'<text class="t-n" x="{x}" y="{580}" text-anchor="middle">{d[8:]}</text>')
        if d in ANCHORS:
            s.append(f'<text class="t-anchor" x="{x}" y="{216}" text-anchor="middle">{ANCHORS[d]}</text>')
    s.append(f'<text class="t-n" x="{250}" y="{580}" text-anchor="end">JUL·</text>')
    # calibration ticks (protocol amendments)
    for d in PROTOCOL:
        x = dx(d)
        s.append(f'<g class="evt2" tabindex="0"><path class="eich" d="M{x-5} 228 V238 M{x+5} 228 V238"/><title>{d} — PROTOCOL.md amended (git): calibration of the constitution</title></g>')
    s.append(f'<text class="t-n" x="{250-8}" y="{236}" text-anchor="end">‖ calibration · 5×</text>')
    # pen trace (continuous, includes zero days)
    pts = " ".join(f"{dx(d)},{BASE_Y - round(9.5 * (ACT[d] ** 0.5), 1)}" for d in DAYS)
    s.append(f'<polyline class="trace" points="250,{BASE_Y} {pts} {PEN_X-14},{BASE_Y - 8}"/>')
    for d in DAYS:  # hover per day
        x = dx(d)
        s.append(f'<g class="evt2" tabindex="0"><rect x="{x-10}" y="{BASE_Y-160}" width="20" height="176" fill="transparent"/><title>{d} · {ACT[d]} commits (git)</title></g>')
    s.append(f'<text class="t-n" x="{250-8}" y="{BASE_Y-40}" text-anchor="end">pen trace ·</text>')
    s.append(f'<text class="t-n" x="{250-8}" y="{BASE_Y-26}" text-anchor="end">commits/day √</text>')
    # move stamps above trace
    seen = {}
    for sess, d, move in CHRONICLE:
        x = dx(d); k = seen.get(d, 0); seen[d] = k + 1
        y = 268 + k * 22
        letter = move[0].upper()
        s.append(f'<g class="evt2" tabindex="0"><circle class="stamp" cx="{x}" cy="{y}" r="9"/>'
                 f'<text class="stamp-t" x="{x}" y="{y+3.4}" text-anchor="middle">{letter}</text>'
                 f'<title>S{sess} — {d} — move: {move} (chronicle.json, verbatim)</title></g>')
    s.append(f'<text class="t-n" x="{250-8}" y="{276}" text-anchor="end">move stamps ·</text>')
    s.append(f'<text class="t-n" x="{250-8}" y="{290}" text-anchor="end">chronicle S25–S37</text>')
    # instruments below baseline
    for d, n in INSTR.items():
        x = dx(d)
        for k in range(n):
            col, row = k % 4, k // 4
            xx, yy = x - 18 + col * 12, BASE_Y + 22 + row * 14
            s.append(f'<path class="instr" d="M{xx} {yy} l5 -9 l5 9 Z"><title>{d} — instrument added (works/, git): {n} this day</title></path>')
    s.append(f'<text class="t-n" x="{250-8}" y="{BASE_Y+34}" text-anchor="end">instruments · 14</text>')
    # caveat flag (contract published, enc-2026-001) + obligation to pen
    xf = dx("2026-07-11")
    s.append(f'<g class="evt2" tabindex="0"><path class="flag-pole" d="M{xf+22} {BASE_Y-96} V{BASE_Y-64}"/>'
             f'<path class="flag" d="M{xf+22} {BASE_Y-96} l16 5 l-16 5 Z"/>'
             f'<title>2026-07-11 — contract.published: the standing caveat commitment (session 22) travels · enc-2026-001</title></g>')
    s.append(f'<path class="obl-f" d="M{xf+22} {BASE_Y-64} L{PEN_X-16} {BASE_Y-64}"/>')
    s.append(f'<text class="t-cav" x="{PEN_X-20}" y="{BASE_Y-70}" text-anchor="end">caveat-preservation — active</text>')
    # splice (history rewrite 07-12) and patch (S08 restore, 07-01)
    xs = dx("2026-07-12") + 30
    s.append(f'<g class="evt2" tabindex="0"><path class="splice" d="M{xs-8} 226 L{xs+8} 560 M{xs+2} 226 L{xs+18} 560"/>'
             f'<rect class="tape" x="{xs-16}" y="360" width="42" height="64"/>'
             f'<title>2026-07-12 — git history rewritten (team decision): the tape is cut and respliced; commit pointers dangle, content hashes hold (ADR 0009; rewrite map in-repo)</title></g>')
    s.append(f'<text class="t-n" x="{xs+2}" y="{602}" text-anchor="middle">splice · 07-12</text>')
    xp = dx("2026-07-01") + 26
    s.append(f'<g class="evt2" tabindex="0"><rect class="patch" x="{xp-12}" y="{BASE_Y-140}" width="26" height="20"/>'
             f'<title>2026-07-01 — a Session-08 journal entry was lost to a parallel git recovery and restored VERBATIM in place (archival note in journal/2026-07-01.md)</title></g>')
    s.append(f'<text class="t-n" x="{xp}" y="{BASE_Y-148}" text-anchor="middle">patch</text>')
    # the resting pen (data edge)
    s.append(f'<path class="pen" d="M{PEN_X-14} {BASE_Y-8} l22 -7 l-4 12 Z"/>')
    s.append(f'<text class="t-n" x="{PEN_X+22}" y="{BASE_Y+24}" text-anchor="end">the pen has not lifted —</text>')
    s.append(f'<text class="t-n" x="{PEN_X+22}" y="{BASE_Y+38}" text-anchor="end">the tape runs on</text>')
    s.append('</svg>')
    return "\n".join(s)

def strip_table():
    rows = [f'<tr><td>S{s_}</td><td class="mono">{d}</td><td>move · {esc(m)}</td><td class="mono">chronicle.json</td></tr>' for s_, d, m in CHRONICLE]
    rows += [f'<tr><td>—</td><td class="mono">{d}</td><td>constitution calibrated (PROTOCOL.md)</td><td class="mono">git</td></tr>' for d in PROTOCOL]
    rows += [f'<tr><td>—</td><td class="mono">{d}</td><td>{n} instrument(s) added</td><td class="mono">works/ git add-dates</td></tr>' for d, n in INSTR.items()]
    rows += ['<tr><td>S22</td><td class="mono">2026-07-11</td><td>contract.published — standing caveat commitment travels</td><td class="mono">enc-2026-001 ledger</td></tr>',
             '<tr><td>S33</td><td class="mono">2026-07-12</td><td>correction.applied — register revised (steer)</td><td class="mono">enc-2026-001 ledger · chronicle</td></tr>',
             '<tr><td>—</td><td class="mono">2026-07-12</td><td>splice: git history rewritten, pointers dangle, hashes hold</td><td class="mono">ADR 0009 · in-repo rewrite map</td></tr>',
             '<tr><td>S08</td><td class="mono">2026-07-01</td><td>patch: journal entry lost, restored verbatim in place</td><td class="mono">journal/2026-07-01.md</td></tr>']
    return f'''<section class="record"><h2>Tape register — every mark on this strip, uncompressed</h2>
<div class="tbl-wrap"><table><thead><tr><th>session</th><th>date</th><th>mark</th><th>source</th></tr></thead><tbody>{"".join(rows)}</tbody></table></div></section>'''

# ---------------------------------------------------------------- page 1: das Kontrollblatt
def control_svg():
    s = ['<svg id="score" viewBox="0 210 1440 330" role="img" aria-label="Instrument record strip for the Calibration Gap: built, contract published, correction spliced in, applied; the event table follows.">']
    s.append(grid(250, 1352, 240, 500))
    y = 370
    s.append(f'<polyline class="trace" points="250,{y} {PEN_X-16},{y}"/>')
    marks = [
        ("2026-07-01", "built — instrument 001 enters service", "instr"),
        ("2026-07-11", "contract.published — the standing commitment (S22) travels downstream", "flag"),
        ("2026-07-12", "correction arrives from the work, via the conductor (enc-2026-001)", "splicein"),
        ("2026-07-12", "correction.applied — register revised (S33, move: steer)", "stamp"),
    ]
    xoff = {"2026-07-12": [-14, 30]}
    used = {}
    for d, label, kind in marks:
        k = used.get(d, 0); used[d] = k + 1
        x = dx(d) + (xoff.get(d, [0])[k] if d in xoff else 0)
        if kind == "instr":
            s.append(f'<g class="evt2" tabindex="0"><path class="instr" d="M{x-6} {y-4} l6 -11 l6 11 Z"/><title>{d} — {esc(label)}</title></g>')
        elif kind == "flag":
            s.append(f'<g class="evt2" tabindex="0"><path class="flag-pole" d="M{x} {y-52} V{y-4}"/><path class="flag" d="M{x} {y-52} l16 5 l-16 5 Z"/><title>{d} — {esc(label)}</title></g>')
        elif kind == "splicein":
            s.append(f'<g class="evt2" tabindex="0"><path class="splice" d="M{x} {y-70} C {x-10} {y-46}, {x-4} {y-22}, {x} {y-6}"/><path class="instr" d="M{x-5} {y-12} l5 9 l5 -9 Z"/><title>{d} — {esc(label)}</title></g>')
            s.append(f'<text class="t-n" x="{x-6}" y="{y-78}" text-anchor="end">from outside ↓</text>')
        else:
            s.append(f'<g class="evt2" tabindex="0"><circle class="stamp" cx="{x}" cy="{y-26}" r="9"/><text class="stamp-t" x="{x}" y="{y-22.6}" text-anchor="middle">S</text><title>{d} — {esc(label)}</title></g>')
        s.append(f'<text class="t-n" x="{x}" y="{y+26}" text-anchor="middle">{d[5:]}</text>')
    # verification sweeps note (S25/S30 cover all 13 published works)
    xv = dx("2026-07-11") - 24
    s.append(f'<g class="evt2" tabindex="0"><circle class="stamp" cx="{xv}" cy="{y-96}" r="9"/><text class="stamp-t" x="{xv}" y="{y-92.6}" text-anchor="middle">V</text>'
             f'<title>S25 &amp; S30 (2026-07-11) — verify sweeps: all 13 published works checked for on-screen contradictions (chronicle.json)</title></g>')
    s.append(f'<text class="t-n" x="{xv-14}" y="{y-92}" text-anchor="end">verify sweeps S25·S30</text>')
    # obligation + pen
    s.append(f'<path class="obl-f" d="M{dx("2026-07-11")} {y+44} H{PEN_X-16}"/>')
    s.append(f'<text class="t-cav" x="{PEN_X-20}" y="{y+38}" text-anchor="end">caveat-preservation — active</text>')
    s.append(f'<path class="pen" d="M{PEN_X-14} {y} l22 -7 l-4 12 Z"/>')
    s.append(f'<text class="t-n" x="{PEN_X+10}" y="{y-8}">in service</text>')
    s.append('</svg>')
    return "\n".join(s)

def control_table():
    rows = [
        ('2026-07-01','built — instrument 001 enters service','works/2026-07-01-calibration-gap (git add-date)'),
        ('2026-07-11','contract.published — “a caveat stated once here must not go unstated twice downstream” (standing self-binding commitment, session 22)','enc-2026-001 ledger, verbatim'),
        ('2026-07-11','verify sweeps S25/S30 — all 13 published works checked','chronicle.json, verbatim'),
        ('2026-07-12','correction arrives from the work, delivered by the conductor','enc-2026-001 ledger'),
        ('2026-07-12','correction.applied — register revised after a renewed verification pass (session 33; chronicle move: steer)','enc-2026-001 ledger · chronicle.json'),
        ('since 2026-07-11','obligation caveat-preservation — active','enc-2026-001 obligations'),
    ]
    body = "".join(f'<tr><td class="mono">{esc(d)}</td><td class="q">{esc(e)}</td><td class="mono">{esc(src)}</td></tr>' for d,e,src in rows)
    return f'''<section class="record"><h2>Instrument record — every mark, uncompressed</h2>
<div class="tbl-wrap"><table><thead><tr><th>date</th><th>event</th><th>source</th></tr></thead><tbody>{body}</tbody></table></div></section>'''

def page(title, kicker2, h1, status, rail_active, svg, table, footer_extra):
    return f"""<!doctype html>
<html lang="en" data-theme="light" data-theme-mode="auto"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)}</title>
{THEME_HEAD}<style>{FIELD_CSS}{BASE_CSS}</style></head>
<body>
<div class="wrap">
  {TOGGLE_BTN}
  <p class="kicker"><span>Field · {esc(kicker2)}</span><span>field-research</span>
  <span>2026-07-01 → 2026-07-14</span><span class="chip">design study — wording pending approval</span></p>
  {rail(rail_active)}
  <h1>{esc(h1)}</h1>
  <p class="status">{status}</p>
  <figure>{svg}</figure>
  {table}
  <footer>
    <span>compiled read-only from {esc(PROV)} · research-ecology @{SHA}</span>
    <span>{footer_extra}</span>
  </footer>
</div>
</body></html>"""

(OUT / "field-kontrollblatt.html").write_text(page(
    "Field — instrument record · Calibration Gap",
    "instrument record · works/2026-07-01-calibration-gap",
    "Instrument 001 — The Calibration Gap",
    "<b>in service since 2026-07-01 · correction applied · register revised · caveat obligation active</b> · the entry to /field is the instrument currently under verification, not a dashboard",
    "this instrument", control_svg(), control_table(),
    "the correction’s two readings live in The Middle → enc-2026-001; this plate keeps the local record"))
(OUT / "field-schreiberstreifen.html").write_text(page(
    "Field — the strip · 2026-07-01 → 2026-07-14",
    "the history as a recorder tape",
    "The pen has not lifted.",
    "<b>37 collective sessions · 14 instruments · 13 chronicled moves · 5 calibrations · 1 splice · 1 patch</b> · the recorder runs on wall-clock days; quiet days stay on the tape as a flat line",
    "register", strip_svg(), strip_table(),
    "scale rule (grammar §7, field flavour): the tape never compresses — it rolls; older stretches wind onto the spool (paged strips)"))
print("wrote", OUT / "field-kontrollblatt.html")
print("wrote", OUT / "field-schreiberstreifen.html")
