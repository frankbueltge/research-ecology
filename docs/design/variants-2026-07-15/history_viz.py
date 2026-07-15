#!/usr/bin/env python3
"""Historie — the ecology as its repositories remember it (deep-record score, A skin).

Deterministic: every mark is a dated fact from git logs, shifts.md, the encounter
fixture, or an ADR. Activity amplitude = commits per day (sqrt-scaled), labelled as
such. No invented events, no smoothing, no clock reads — the as-of edge is the
latest commit date in the data.
"""
import datetime, html, pathlib
from assemble_variants import BASE_CSS, THEME_HEAD, TOGGLE_BTN, VARIANTS, OUT, SHA

def esc(s): return html.escape(str(s), quote=True)

DAY0 = datetime.date(2026, 6, 10)
ASOF = datetime.date(2026, 7, 15)
X0, STEP = 268, 29
def tx(iso):
    d = datetime.date.fromisoformat(iso)
    return X0 + (d - DAY0).days * STEP
ASOF_X = tx(ASOF.isoformat()) + 18

ACT = {  # commits per day, from `git log --format=%as | sort | uniq -c` (verifiable)
 "site": {"2026-06-10":6,"2026-06-11":28,"2026-06-12":23,"2026-06-13":9,"2026-06-14":19,
  "2026-06-15":5,"2026-06-16":5,"2026-06-17":5,"2026-06-18":5,"2026-06-19":5,"2026-06-20":31,
  "2026-06-21":18,"2026-06-22":21,"2026-06-23":15,"2026-06-24":5,"2026-06-25":21,"2026-06-26":30,
  "2026-06-27":17,"2026-06-28":26,"2026-06-29":21,"2026-06-30":26,"2026-07-01":35,"2026-07-02":93,
  "2026-07-03":29,"2026-07-04":22,"2026-07-05":36,"2026-07-06":36,"2026-07-07":18,"2026-07-08":8,
  "2026-07-09":11,"2026-07-10":17,"2026-07-11":22,"2026-07-12":33,"2026-07-13":19,"2026-07-14":16,"2026-07-15":3},
 "ulysses": {"2026-06-28":3,"2026-06-29":13,"2026-06-30":14,"2026-07-01":2,"2026-07-02":2,
  "2026-07-03":2,"2026-07-04":1,"2026-07-05":4,"2026-07-06":1,"2026-07-07":2,"2026-07-09":1,
  "2026-07-10":1,"2026-07-11":1,"2026-07-12":3,"2026-07-13":2,"2026-07-14":8},
 "meridian": {"2026-07-01":25,"2026-07-02":25,"2026-07-03":12,"2026-07-05":11,"2026-07-06":8,
  "2026-07-07":2,"2026-07-09":6,"2026-07-10":11,"2026-07-11":28,"2026-07-12":17,"2026-07-13":9,"2026-07-14":4},
 "ensemble": {"2026-07-12":23,"2026-07-13":6},
 "middle": {"2026-07-14":5,"2026-07-15":21},
}

LANES = [
 {"id":"site","label":"FRANKBUELTGE.DE","sub":"site · nightly automatons","y":268,"thin":True,"born":"2026-06-10","cls":"pr-conductor",
  "born_note":"rebuild begins — the laboratory ground; Protokollführung (137) and Gegenmessung (86) tick nightly through everything that follows"},
 {"id":"ulysses","label":"ULYSSES","sub":"atelier · irrtum-als-methode","y":352,"born":"2026-06-28","cls":"pr-ulysses",
  "born_note":"first commit of the oldest practice — error as method; sessions S1–S26 follow"},
 {"id":"meridian","label":"MERIDIAN","sub":"field · field-research","y":436,"born":"2026-07-01","cls":"pr-meridian",
  "born_note":"first commit — instrument building, verification passes, sessions 1–33"},
 {"id":"ensemble","label":"ENSEMBLE","sub":"studio","y":520,"born":"2026-07-12","cls":"pr-ensemble",
  "born_note":"born on the day of the encounter: admits Native Speaker (conditions included), declines the most spectacular case, reports the correction, premieres — all on day one"},
 {"id":"middle","label":"THE MIDDLE","sub":"contact zone · research-ecology","y":598,"thin":True,"born":"2026-07-14","cls":"pr-conductor",
  "born_note":"first commit — two days AFTER the encounter it records: the contact zone was found, not planned"},
]
LY = {l["id"]: l["y"] for l in LANES}

MARKS = [  # dated, sourced event marks (hover = detail; table below repeats all)
 {"date":"2026-06-10","lane":"site","kind":"birth","title":"rebuild begins","src":"frankbueltge.de git (first commit)"},
 {"date":"2026-06-28","lane":"ulysses","kind":"birth","title":"first commit — the oldest practice","src":"irrtum-als-methode git"},
 {"date":"2026-07-01","lane":"meridian","kind":"birth","title":"first commit","src":"field-research git"},
 {"date":"2026-07-11","lane":"meridian","kind":"contract","title":"contract.published — an instrument, under conditions","src":"enc-2026-001 ledger"},
 {"date":"2026-07-12","lane":"ensemble","kind":"birth","title":"first commit — admits, declines, corrects, premieres on day one","src":"studio git + enc-2026-001 ledger"},
 {"date":"2026-07-12","lane":"meridian","kind":"rewrite","title":"git history rewritten (team decision) — pointers dangle, content hashes hold","src":"ADR 0009; notes/2026-07-12-history-rewrite-map.md"},
 {"date":"2026-07-14","lane":"middle","kind":"birth","title":"first commit — assembles the encounter it did not witness","src":"research-ecology git"},
 {"date":"2026-07-14","lane":"middle","kind":"spec","title":"v2 — the federation constitution; the first encounter is FOUND in the audit, not invented","src":"docs/spec/, REPOSITORY-AUDIT.md"},
 {"date":"2026-07-15","lane":"middle","kind":"spec","title":"v2.1 — the atelier returns · ADR 0010/0011 · practice profiles (Phase B) · this map's own grammar committed","src":"docs/spec-v2.1/, docs/adrs/, docs/design/"},
]

SHIFTS = [  # verbatim titles from docs/shifts.md (German source quoted as-is)
 ("2026-07-14","Vom Cockpit zur Ökologie."),
 ("2026-07-14","Der erste Encounter wurde gefunden, nicht erfunden."),
 ("2026-07-14","Commit-Hashes sind sterblich."),
 ("2026-07-15","Das Register ist nicht der Eingang."),
 ("2026-07-15","Identität tritt hinter die Praxis zurück."),
 ("2026-07-15","Die Site ist das Experiment."),
 ("2026-07-15","Einsprachig: Englisch."),
 ("2026-07-15","Wir bauen kein Rhizom; wir bauen Bedingungen."),
]
SHIFT_Y = 668

def build_svg():
    s = [f'<svg id="score" viewBox="0 176 1440 560" role="img" aria-label="Deep record of the ecology: five lifelines from 2026-06-10 to 2026-07-15; every mark is listed in the table below.">']
    # week ruler
    RY = 212
    s.append(f'<path class="ruler" d="M{X0-14} {RY} H{ASOF_X}"/>')
    d = DAY0
    while d < ASOF:
        x = tx(d.isoformat())
        s.append(f'<path class="ruler" d="M{x} {RY-5} V{RY+5}"/>')
        s.append(f'<text class="t-note" x="{x}" y="{RY-12}" text-anchor="middle">{d.strftime("%m-%d")}</text>')
        d += datetime.timedelta(days=7)
    s.append(f'<path class="ruler" d="M{ASOF_X} {RY-5} V{RY+5}"/>')
    s.append(f'<text class="t-note" x="{ASOF_X}" y="{RY-12}" text-anchor="middle">as of 07-15</text>')
    s.append(f'<text class="t-note t-dim" x="{X0-14}" y="{RY+20}">calendar days · one column per day</text>')

    # lanes + activity seismogram
    for l in LANES:
        y, x_born = l["y"], tx(l["born"])
        s.append(f'<path class="lane {"lane-thin" if l.get("thin") else ""} {l["cls"]}" d="M{x_born} {y} H{ASOF_X-8}"/>')
        s.append(f'<text class="t-lane {l["cls"]}" x="{X0-26}" y="{y-14}" text-anchor="end">{esc(l["label"])}</text>')
        s.append(f'<text class="t-note t-dim" x="{X0-26}" y="{y+2}" text-anchor="end">{esc(l["sub"])}</text>')
        for iso, n in ACT[l["id"]].items():
            h = round(3.4 * (n ** 0.5), 1)
            s.append(f'<path class="act {l["cls"]}" d="M{tx(iso)} {y-2} V{y-2-h}"><title>{iso} · {n} commits</title></path>')
    # marks
    for m in MARKS:
        x, y = tx(m["date"]), LY[m["lane"]]
        if m["kind"] == "birth":
            body = f'<path class="mk {[l for l in LANES if l["id"]==m["lane"]][0]["cls"]}" d="M{x} {y-13} V{y+13}"/><circle class="ring {[l for l in LANES if l["id"]==m["lane"]][0]["cls"]}" cx="{x}" cy="{y}" r="5" fill="var(--surface)"/>'
        elif m["kind"] == "rewrite":
            body = (f'<path class="mk-void" d="M{x-4} {y} H{x+4}"/>'
                    f'<path class="mk pr-meridian" d="M{x-8} {y+9} L{x-1} {y-9} M{x+1} {y+9} L{x+8} {y-9}"/>')
        elif m["kind"] == "contract":
            body = f'<path class="mk pr-meridian" d="M{x} {y-13} V{y+13}"/><path class="mk mk-lt pr-meridian" d="M{x+6} {y-13} V{y+13}"/>'
        else:  # spec
            if any(b["kind"] == "birth" and b["date"] == m["date"] and b["lane"] == m["lane"] for b in MARKS):
                x += 14
            body = f'<rect class="mk pr-conductor" x="{x-6}" y="{y-6}" width="12" height="12" fill="none" transform="rotate(45 {x} {y})"/>'
        tip = esc(f'{m["date"]} — {m["title"]}  [{m["src"]}]')
        s.append(f'<g class="evt2" tabindex="0">{body}<rect class="hit" x="{x-12}" y="{y-20}" width="24" height="40" fill="transparent"/><title>{tip}</title></g>')

    # the encounter crossing (transfer down 07-11→07-12, correction back up 07-12)
    xa, xb = tx("2026-07-11"), tx("2026-07-12")
    ym, ye = LY["meridian"], LY["ensemble"]
    s.append(f'<path class="flow flow-down pr-ensemble" marker-end="url(#arrow2)" d="M{xa+4} {ym+8} C {xa+20} {ym+52}, {xb-22} {ye-52}, {xb-5} {ye-11}"/>')
    s.append(f'<path class="flow flow-up pr-conductor" marker-end="url(#arrow2)" d="M{xb+6} {ye-10} C {xb+26} {ye-54}, {xb+18} {ym+56}, {xb+9} {ym+11}"/>')
    s.append(f'<text class="t-note" x="{xa-14}" y="{(ym+ye)//2-4}" text-anchor="end">enc-2026-001 · the calibration gap travels</text>')
    s.append(f'<text class="t-note t-dim" x="{xa-14}" y="{(ym+ye)//2+12}" text-anchor="end">unresolved — both readings stand</text>')
    s.append('<defs><marker id="arrow2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M1 1 L9 5 L1 9" fill="none" class="marker-stroke"/></marker></defs>')

    # shifts band (verbatim titles, hover)
    s.append(f'<path class="ruler" d="M{X0-14} {SHIFT_Y} H{ASOF_X}" opacity=".45"/>')
    s.append(f'<text class="t-lane" x="{X0-26}" y="{SHIFT_Y-14}" text-anchor="end">SHIFTS</text>')
    s.append(f'<text class="t-note t-dim" x="{X0-26}" y="{SHIFT_Y+2}" text-anchor="end">docs/shifts.md · verbatim</text>')
    from collections import Counter
    counts = Counter(d for d, _ in SHIFTS)
    seen = {}
    for iso, title in SHIFTS:
        k = seen.get(iso, 0); seen[iso] = k + 1
        x = tx(iso) + round((k - (counts[iso] - 1) / 2) * 8)
        s.append(f'<g class="evt2" tabindex="0"><path class="mk pr-ulysses" d="M{x} {SHIFT_Y-9} L{x+5} {SHIFT_Y+9}"/>'
                 f'<rect class="hit" x="{x-6}" y="{SHIFT_Y-14}" width="16" height="28" fill="transparent"/>'
                 f'<title>{esc(iso)} — „{esc(title)}“ (shifts.md)</title></g>')
    s.append(f'<text class="t-note t-dim" x="{ASOF_X-2}" y="{SHIFT_Y+28}" text-anchor="end">8 recorded shifts in 2 days — the thinking moved faster than the code</text>')

    # as-of edge
    s.append(f'<path class="asof" d="M{ASOF_X} {RY+10} V{SHIFT_Y+14}"/>')
    s.append(f'<text class="t-note" transform="rotate(-90 {ASOF_X+16} 440)" x="{ASOF_X+16}" y="440" text-anchor="middle">as-of edge · data ends here</text>')
    s.append('</svg>')
    return "\n".join(s)

EXTRA_CSS = """
.act{stroke:var(--pr);stroke-width:3;opacity:.5}
.evt2{cursor:help;outline:none}
.evt2:hover .mk,.evt2:focus .mk{stroke-width:3}
"""

def table_html():
    rows = "".join(f'<tr><td>{esc(m["date"])}</td><td>{esc(m["lane"])}</td><td class="q">{esc(m["title"])}</td><td class="mono">{esc(m["src"])}</td></tr>' for m in MARKS)
    rows += "".join(f'<tr><td>{esc(d)}</td><td>shifts</td><td class="q">„{esc(t)}“</td><td class="mono">docs/shifts.md</td></tr>' for d, t in SHIFTS)
    return f'''<section class="record"><h2>Register extract — every mark on this map</h2>
<div class="tbl-wrap"><table><thead><tr><th>date</th><th>line</th><th>event</th><th>source</th></tr></thead><tbody>{rows}</tbody></table></div></section>'''

total = sum(sum(v.values()) for v in ACT.values())
a = VARIANTS["a-observatorium"]
page = f"""<!doctype html>
<html lang="en" data-theme="dark" data-theme-mode="auto"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Historie — the deep record · The Middle</title>
{THEME_HEAD}<style>{a['css']}{BASE_CSS}{EXTRA_CSS}</style></head>
<body>
<div class="wrap">
  {TOGGLE_BTN}
  <p class="kicker"><span>The Middle · deep record</span><span>the ecology, as its repositories remember it</span>
  <span>2026-06-10 → 2026-07-15</span><span class="chip">wording pending approval</span></p>
  <h1>The practices are older than their federation.</h1>
  <p class="status"><b>{total} commits across 5 repositories</b> · 1 encounter · 8 recorded shifts · every mark dated and sourced; activity amplitude = commits per day (√-scaled)</p>
  <figure>{build_svg()}</figure>
  {table_html()}
  <footer>
    <span>deterministic projection of the repositories' own records · research-ecology @{SHA} · no timestamp beyond the data's own</span>
    <span>wording pending approval · editorial framing authored by the-middle-editorial</span>
  </footer>
</div>
</body></html>"""

out = OUT / "historie.html"
out.write_text(page)
print("wrote", out)
