#!/usr/bin/env python3
"""Atelier-Historie — der Buchrücken (the spine of pages). Sheet grammar, NOT the score.

The practice counts in sessions, not calendar days: the spine shows all 28 journal
pages S1–S28 (filenames verbatim from journal/), works hang as slabs under the night
that made them (git first-add dates), the Fehlerkataster strikes in red pencil above,
threads are born as red kinks out of S26–S28 and stay open, constitution amendments
mark as graphite asterisks (git dates of PROTOCOL.md). The right edge is the Atelier's
own data edge: tonight's page, not yet written.

All values from irrtum-als-methode (read-only): journal/ filenames, git add-dates,
pulse/rhizome.json. No invention; dates ride as marginalia, sessions are the axis.
"""
import html
from assemble_variants import BASE_CSS, THEME_HEAD, TOGGLE_BTN, OUT, SHA
from atelier_viz import ATELIER_CSS

def esc(s): return html.escape(str(s), quote=True)

PROV = "journal/ filenames · git add-dates of works/ · pulse/rhizome.json @ c27857d · PROTOCOL.md git dates · read-only"

SESSIONS = [  # (n, date) — journal/ verbatim (S27/S28 switch 'sitzung'→'session' in filename)
 (1,"2026-06-28"),(2,"2026-06-28"),(3,"2026-06-29"),(4,"2026-06-29"),(5,"2026-06-29"),
 (6,"2026-06-29"),(7,"2026-06-30"),(8,"2026-06-30"),(9,"2026-06-30"),(10,"2026-06-30"),
 (11,"2026-06-30"),(12,"2026-07-01"),(13,"2026-07-02"),(14,"2026-07-03"),(15,"2026-07-03"),
 (16,"2026-07-04"),(17,"2026-07-05"),(18,"2026-07-06"),(19,"2026-07-07"),(20,"2026-07-09"),
 (21,"2026-07-10"),(22,"2026-07-11"),(23,"2026-07-12"),(24,"2026-07-13"),(25,"2026-07-13"),
 (26,"2026-07-14"),(27,"2026-07-14"),(28,"2026-07-14"),
]
WORKS = {"2026-06-28":1,"2026-06-29":5,"2026-06-30":6,"2026-07-01":2,"2026-07-02":1,
 "2026-07-03":2,"2026-07-04":1,"2026-07-05":1,"2026-07-06":1,"2026-07-07":1,"2026-07-09":1,
 "2026-07-10":1,"2026-07-11":1,"2026-07-12":1,"2026-07-13":1,"2026-07-14":3}
FEHLER = {"2026-06-28":1,"2026-06-29":3,"2026-06-30":5,"2026-07-01":1,"2026-07-02":1,
 "2026-07-03":2,"2026-07-04":1,"2026-07-05":1,"2026-07-06":1,"2026-07-07":1,"2026-07-09":1,
 "2026-07-10":1,"2026-07-12":1,"2026-07-13":1}
PROTOCOL = ["2026-06-28","2026-06-29","2026-06-30","2026-07-01","2026-07-05","2026-07-07","2026-07-14"]
THREADS = [  # (session, short label, full label from rhizome)
 (26,"epistemic-thing subtraction","Error subtracted to a special case of the epistemic thing"),
 (27,"differential reproduction / birth-side","Differential reproduction run: the epistemic thing as produced-and-kept difference; the barren regime"),
 (28,"no-how / non-discursive","No-how / the non-discursive: method as stopgap, the journal as note; negative knowledge as the only figure"),
]

X0, STEP = 300, 34
SPINE_TOP, SPINE_BOT = 318, 374
def sx(n): return X0 + (n - 1) * STEP
NEXT_X = sx(29)
first_of_day = {}
for n, d in SESSIONS: first_of_day.setdefault(d, n)

def build_svg():
    s = ['<svg id="score" viewBox="0 172 1440 442" role="img" aria-label="The spine: 28 journal pages, works and errors per night, three threads born late; the session register follows as a table.">']

    # thread ribbons, born late, staying open
    for i, (sn, short, full) in enumerate(THREADS):
        x, y = sx(sn), 232 + i * 26
        s.append(f'<path class="rp" d="M{x} {SPINE_TOP} C {x-2} {y+40}, {x+4} {y+14}, {x+16} {y}" fill="none"/>')
        s.append(f'<path class="th" d="M{x+16} {y} C {x+70} {y-4}, {NEXT_X-60} {y-2}, {NEXT_X+6} {y-3}"/>')
        s.append(f'<text class="t-thread" x="{x-16}" y="{y-10}" text-anchor="end">{esc(short)}<title>{esc(full)}</title></text>')
    s.append(f'<text class="t-note-a" x="{NEXT_X+14}" y="{234}">threads stay</text>')
    s.append(f'<text class="t-note-a" x="{NEXT_X+14}" y="{248}">open →</text>')

    # the Fehlerkataster band (red strikes above the spine) — 21 entries by add-date
    s.append(f'<text class="t-sess" x="{X0-58}" y="{300}" text-anchor="end">FEHLERKATASTER · 21</text>')
    for d, cnt in FEHLER.items():
        x = sx(first_of_day[d])
        for k in range(cnt):
            y = 306 - k * 9
            s.append(f'<path class="rp" d="M{x-5} {y} L{x+5} {y-5}"/>')

    # the spine: 28 pages + the unwritten next page
    for n, d in SESSIONS:
        x = sx(n)
        s.append(f'<path class="page" d="M{x} {SPINE_TOP} V{SPINE_BOT}"><title>S{n} — {d} (journal/, verbatim)</title></path>')
        if n in (1, 5, 10, 15, 20, 25, 28):
            s.append(f'<text class="t-sess-n" x="{x}" y="{SPINE_BOT+16}" text-anchor="middle">S{n}</text>')
    s.append(f'<path class="page page-next" d="M{NEXT_X} {SPINE_TOP} V{SPINE_BOT}"/>')
    s.append(f'<text class="t-note-a" x="{NEXT_X+12}" y="{(SPINE_TOP+SPINE_BOT)//2-2}">tonight’s page —</text>')
    s.append(f'<text class="t-note-a" x="{NEXT_X+12}" y="{(SPINE_TOP+SPINE_BOT)//2+12}">not yet written</text>')
    s.append(f'<text class="t-lane-a" x="{X0-58}" y="{(SPINE_TOP+SPINE_BOT)//2-6}" text-anchor="end">JOURNAL</text>')
    s.append(f'<text class="t-note-a" x="{X0-58}" y="{(SPINE_TOP+SPINE_BOT)//2+10}" text-anchor="end">28 pages · S1–S28</text>')

    # date marginalia (rotated, at day change) + constitution asterisks
    for d, n in first_of_day.items():
        x = sx(n)
        s.append(f'<text class="t-date-r" transform="rotate(-90 {x+3} {SPINE_BOT+66})" x="{x+3}" y="{SPINE_BOT+66}" text-anchor="middle">{d[5:]}</text>')
        if d in PROTOCOL:
            s.append(f'<text class="t-ast" x="{x}" y="{SPINE_TOP-8}" text-anchor="middle">✳<title>constitution amended — PROTOCOL.md changed {d} (git)</title></text>')
    s.append(f'<text class="t-note-a" x="{X0-58}" y="{SPINE_TOP-8}" text-anchor="end">✳ constitution amended · 7×</text>')

    # works hanging under their night (slabs, stacked)
    s.append(f'<text class="t-lane-a" x="{X0-58}" y="{490}" text-anchor="end">WORKS · 27</text>')
    s.append(f'<text class="t-note-a" x="{X0-58}" y="{506}" text-anchor="end">hung by git add-date</text>')
    for d, cnt in WORKS.items():
        x = sx(first_of_day[d])
        for k in range(cnt):
            y = 468 + k * 22
            s.append(f'<rect class="slab" x="{x-4}" y="{y}" width="8" height="16"><title>{d} — {cnt} work(s) added (git)</title></rect>')

    s.append('</svg>')
    return "\n".join(s)

EXTRA = """
.page{stroke:var(--ink);stroke-width:2.4;opacity:.85}
.page-next{stroke:var(--ink-2);stroke-dasharray:3 4;opacity:.9}
.t-sess-n{font:600 11px var(--font-record);fill:var(--ink-2)}
.t-lane-a{font:600 12px var(--font-record);letter-spacing:.1em;fill:var(--ink)}
.t-date-r{font:10px var(--font-record);fill:var(--ink-2)}
.t-ast{font:12px var(--font-record);fill:var(--c-graphite)}
"""

def table_html():
    rows = []
    for n, d in SESSIONS:
        w = (WORKS.get(d) or "—") if first_of_day[d] == n else ""
        f = (FEHLER.get(d) or "—") if first_of_day[d] == n else ""
        p = "✳" if (d in PROTOCOL and first_of_day[d] == n) else ""
        t = next((f"thread born: {short}" for sn, short, _ in THREADS if sn == n), "")
        rows.append(f'<tr><td>S{n}</td><td class="mono">{d}</td><td>{w}</td><td>{f}</td><td>{p}</td><td class="q">{esc(t)}</td></tr>')
    return f'''<section class="record"><h2>Session register — all 28 pages (counts shown at each day’s first page)</h2>
<div class="tbl-wrap"><table><thead><tr><th>page</th><th>date</th><th>works added</th><th>errors catalogued</th><th>constitution</th><th></th></tr></thead>
<tbody>{"".join(rows)}</tbody></table></div></section>'''

RAIL = """
  <nav class="blattrand" aria-label="Margin rail — the only standing navigation">
    <a href="#" title="/atelier — the current sheet">this sheet</a>
    <a href="#" title="/atelier/problems">sheets</a>
    <a href="#" title="/atelier/werke">works</a>
    <span class="br-here">journal</span>
    <a href="#" title="/atelier/material">material</a>
    <a href="#" title="/atelier/apparatus">apparatus</a>
    <span class="br-door">→ the middle</span>
  </nav>"""

page = f"""<!doctype html>
<html lang="en" data-theme="light" data-theme-mode="auto"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Atelier — the spine · S1–S28</title>
{THEME_HEAD}<style>{ATELIER_CSS}{BASE_CSS}{EXTRA}</style></head>
<body>
<div class="wrap">
  {TOGGLE_BTN}
  <p class="kicker"><span>Atelier · the journal as a spine of pages</span><span>irrtum-als-methode</span>
  <span>S1 · 2026-06-28 → S28 · 2026-07-14</span><span class="chip">design study — wording pending approval</span></p>
  {RAIL}
  <h1>Twenty-eight nights; the next page is not written.</h1>
  <p class="status"><b>28 journal pages · 27 works · 21 catalogued errors · 7 constitution amendments · 3 threads, all born in the last three sessions</b> · the practice counts in sessions; dates ride below as marginalia</p>
  <figure>{build_svg()}</figure>
  {table_html()}
  <footer>
    <span>compiled read-only from {esc(PROV)} · research-ecology @{SHA}</span>
    <span>scale rule (grammar §7, atelier flavour): pages gather into quires when the spine outgrows the sheet</span>
  </footer>
</div>
</body></html>"""

out = OUT / "atelier-historie.html"
out.write_text(page)
print("wrote", out)
