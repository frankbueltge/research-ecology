#!/usr/bin/env python3
"""SPECIMEN — scale test of the deep-record score over 19 months. SYNTHETIC DATA.

Answers one design question: does the grammar survive months/years? Rules under test
(Zeichengrammatik §7): span-driven bin size (here: ISO weeks), amplitude = commits per
bin, marks cluster into counted knots within a bin, encounters compress to crossing
knots, the ruler labels months and emphasises year boundaries, canvas width constant.

Every value below is SYNTHETIC (deterministic hash shapes, seed-free, reproducible) —
this file is a crash-test dummy, not a record, and says so on the page itself.
"""
import datetime, hashlib, html
from assemble_variants import BASE_CSS, THEME_HEAD, TOGGLE_BTN, VARIANTS, OUT, SHA

def esc(s): return html.escape(str(s), quote=True)

DAY0 = datetime.date(2026, 6, 8)     # Monday — bins are ISO weeks
ASOF = datetime.date(2027, 12, 27)
NWEEKS = (ASOF - DAY0).days // 7 + 1  # 82 bins
X0 = 268
STEP = 13
def wx(week): return X0 + week * STEP
def dx(iso):
    d = datetime.date.fromisoformat(iso)
    return wx((d - DAY0).days // 7)
ASOF_X = wx(NWEEKS - 1) + 14

def u(key):
    return int(hashlib.sha256(key.encode()).hexdigest()[:8], 16) / 0xFFFFFFFF

LANES = [
 {"id":"site","label":"FRANKBUELTGE.DE","sub":"site · nightly automatons","y":268,"thin":True,"born_w":0,"cls":"pr-conductor"},
 {"id":"ulysses","label":"ULYSSES","sub":"atelier","y":352,"born_w":2,"cls":"pr-ulysses"},
 {"id":"meridian","label":"MERIDIAN","sub":"field","y":436,"born_w":3,"cls":"pr-meridian"},
 {"id":"ensemble","label":"ENSEMBLE","sub":"studio","y":520,"born_w":4,"cls":"pr-ensemble"},
 {"id":"middle","label":"THE MIDDLE","sub":"contact zone","y":598,"thin":True,"born_w":5,"cls":"pr-conductor"},
]
LY = {l["id"]: l["y"] for l in LANES}
BORN = {l["id"]: l["born_w"] for l in LANES}

# synthetic encounters: (week, source lane, receiver lane, resolved?)
ENCOUNTERS = [(5,"meridian","ensemble",False), (19,"ulysses","meridian",True),
              (33,"ensemble","ulysses",False), (52,"meridian","ensemble",True),
              (71,"ulysses","ensemble",False)]
QUIET = set(range(40, 47))  # a documented quiet stretch — gaps are content

def activity(lane, week):
    """Deterministic synthetic shape: bursty practices, steady automatons."""
    if week < BORN[lane]: return 0
    r = u(f"{lane}:{week}")
    if week in QUIET and lane != "site": return 1 if r > 0.8 else 0
    base = {"site": 18, "ulysses": 4, "meridian": 9, "ensemble": 5, "middle": 3}[lane]
    burst = 0
    for ew, s, rcv, _ in ENCOUNTERS:
        if lane in (s, rcv, "middle") and abs(week - ew) <= 1:
            burst += 26 * (1 - abs(week - ew) * 0.5)
    seasonal = 1 + 0.5 * u(f"season:{lane}:{week // 9}")
    return round((base * seasonal + burst) * (0.4 + 1.2 * r))

def build_svg():
    s = [f'<svg id="score" viewBox="0 176 1440 560" role="img" aria-label="Scale specimen: five lifelines over 19 months of synthetic data, week bins.">']
    RY = 212
    s.append(f'<path class="ruler" d="M{X0-14} {RY} H{ASOF_X}"/>')
    d = DAY0
    while d < ASOF:                       # month ticks, year boundary emphasised
        if d.day <= 7:
            x = dx(d.isoformat()); jan = d.month == 1
            s.append(f'<path class="ruler" d="M{x} {RY-5} V{RY+5}" stroke-width="{2 if jan else 1}"/>')
            if jan:
                s.append(f'<text class="t-lane" x="{x}" y="{RY-12}" text-anchor="middle">{d.year}</text>')
            elif d.month % 2 == 1:
                s.append(f'<text class="t-note" x="{x}" y="{RY-12}" text-anchor="middle">{d.strftime("%b").lower()}</text>')
        d += datetime.timedelta(days=7)
    s.append(f'<path class="ruler" d="M{ASOF_X} {RY-5} V{RY+5}"/>')
    s.append(f'<text class="t-note" x="{ASOF_X}" y="{RY-12}" text-anchor="middle">as of</text>')
    s.append(f'<text class="t-note t-dim" x="{X0-14}" y="{RY+20}">ISO weeks · one column per week (bin rule: span 82 weeks → week bins)</text>')

    for l in LANES:
        y = l["y"]
        s.append(f'<path class="lane {"lane-thin" if l.get("thin") else ""} {l["cls"]}" d="M{wx(l["born_w"])} {y} H{ASOF_X-8}"/>')
        s.append(f'<text class="t-lane {l["cls"]}" x="{X0-26}" y="{y-14}" text-anchor="end">{esc(l["label"])}</text>')
        s.append(f'<text class="t-note t-dim" x="{X0-26}" y="{y+2}" text-anchor="end">{esc(l["sub"])}</text>')
        s.append(f'<circle class="ring {l["cls"]}" cx="{wx(l["born_w"])}" cy="{y}" r="5" fill="var(--surface)"/>')
        for w in range(l["born_w"], NWEEKS):
            n = activity(l["id"], w)
            if n:
                h = round(3.2 * (n ** 0.5), 1)
                s.append(f'<path class="act {l["cls"]}" d="M{wx(w)} {y-2} V{y-2-h}"/>')

    # encounters compress to crossing knots at week resolution
    for w, src, rcv, resolved in ENCOUNTERS:
        x = wx(w); y1, y2 = LY[src], LY[rcv]
        mid = (y1 + y2) // 2
        s.append(f'<path class="flow flow-down pr-{rcv}" d="M{x-4} {min(y1,y2)+8} C {x-10} {mid}, {x+10} {mid}, {x+4} {max(y1,y2)-8}"/>')
        s.append(f'<path class="flow flow-up pr-conductor" d="M{x+8} {max(y1,y2)-8} C {x+16} {mid}, {x+2} {mid}, {x+8} {min(y1,y2)+8}"/>')
        ring = 'ring' if not resolved else 'mk'
        s.append(f'<circle class="{ring} pr-conductor" cx="{x+2}" cy="{mid}" r="4.5" fill="{"var(--surface)" if not resolved else "none"}"/>')
    # mark clusters: knots with ×n instead of fans when a bin holds many marks
    CLUSTERS = [(19,"middle",4), (33,"middle",6), (52,"middle",5), (71,"middle",7)]
    for w, lane, n in CLUSTERS:
        x, y = wx(w), LY[lane]
        s.append(f'<rect class="mk pr-conductor" x="{x-5}" y="{y-5}" width="10" height="10" fill="none" transform="rotate(45 {x} {y})"/>')
        s.append(f'<text class="t-note" x="{x}" y="{y-14}" text-anchor="middle">×{n}</text>')

    # shifts band with year-scale clustering
    SHIFT_Y = 668
    s.append(f'<path class="ruler" d="M{X0-14} {SHIFT_Y} H{ASOF_X}" opacity=".45"/>')
    s.append(f'<text class="t-lane" x="{X0-26}" y="{SHIFT_Y-14}" text-anchor="end">SHIFTS</text>')
    s.append(f'<text class="t-note t-dim" x="{X0-26}" y="{SHIFT_Y+2}" text-anchor="end">synthetic</text>')
    for w in range(NWEEKS):
        r = u(f"shift:{w}")
        if r > 0.82 and w not in QUIET:
            x = wx(w)
            s.append(f'<path class="mk pr-ulysses" d="M{x} {SHIFT_Y-8} L{x+4} {SHIFT_Y+8}"/>')

    # the quiet stretch, honestly labelled
    qx0, qx1 = wx(min(QUIET)), wx(max(QUIET))
    s.append(f'<path class="gap" d="M{qx0} 240 V648 M{qx1} 240 V648" opacity=".5"/>')
    s.append(f'<text class="t-note t-dim" x="{(qx0+qx1)//2}" y="316" text-anchor="middle">seven quiet weeks —</text>')
    s.append(f'<text class="t-note t-dim" x="{(qx0+qx1)//2}" y="330" text-anchor="middle">the gap stays visible</text>')

    s.append(f'<path class="asof" d="M{ASOF_X} {RY+10} V{SHIFT_Y+14}"/>')
    s.append(f'<text class="t-note" transform="rotate(-90 {ASOF_X+16} 440)" x="{ASOF_X+16}" y="440" text-anchor="middle">here ends what the ledger knows</text>')
    s.append('</svg>')
    return "\n".join(s)

EXTRA_CSS = """
.act{stroke:var(--pr);stroke-width:2.2;opacity:.5}
.specimen-band{font:600 12px var(--font-record);letter-spacing:.14em;text-transform:uppercase;
color:var(--c-ensemble);border:1px dashed var(--c-ensemble);display:inline-block;padding:2px 10px;margin-bottom:14px}
"""

a = VARIANTS["a-observatorium"]
page = f"""<!doctype html>
<html lang="en" data-theme="dark" data-theme-mode="auto"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Specimen — 19 months, week bins · scale test</title>
{THEME_HEAD}<style>{a['css']}{BASE_CSS}{EXTRA_CSS}</style></head>
<body>
<div class="wrap">
  {TOGGLE_BTN}
  <p class="specimen-band">Specimen · synthetic data · not a record</p>
  <p class="kicker"><span>The Middle · deep record</span><span>scale test: 19 months, 82 week-bins, 5 encounters</span></p>
  <h1>The same grammar, nineteen months wide.</h1>
  <p class="status"><b>Everything on this page is synthetic</b> (deterministic hash shapes, reproducible from the generator) — it exists only to test whether the deep-record form survives months and years: week bins, crossing knots for encounters, ×n mark clusters, an honestly visible quiet stretch, year-emphasised ruler, constant canvas width.</p>
  <figure>{build_svg()}</figure>
  <footer>
    <span>scale specimen for Zeichengrammatik §7 · generator: specimen_viz.py · research-ecology @{SHA}</span>
    <span>no register table — nothing here is a record</span>
  </footer>
</div>
</body></html>"""

out = OUT / "specimen-19-monate.html"
out.write_text(page)
print("wrote", out)
