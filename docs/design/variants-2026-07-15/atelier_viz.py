#!/usr/bin/env python3
"""Atelier — das Blatt (working sheet S26–S28). Deliberately NOT the Middle's grammar.

ADR 0010 forbids a shared visual grammar; this sheet establishes the Atelier's own:
no time axis, no lanes, no registry calm — a worktable. Sources enter from the left
margin as graphite stubs; a SWERVE (Ulysses' clinamen) kinks them in red pencil into
ink threads; works hang as slabs; bridges tie works with the practice's own words.

Every node, edge, label and session number is verbatim from irrtum-als-methode
pulse/rhizome.json @ c27857d (repo read-only). Nothing invented; the reserved doorway
at the right edge is empty BECAUSE the external encounter does not exist yet.
"""
import html
from assemble_variants import BASE_CSS, THEME_HEAD, TOGGLE_BTN, OUT, SHA

def esc(s): return html.escape(str(s), quote=True)

PROV = "pulse/rhizome.json @ c27857d · sha256 55d03537… · repo HEAD c413eae · read-only"

NODES = {  # id: (label, kind, date)
 "src-rhein": ("Rheinberger — Experimental Systems (epistemic thing / differential reproduction)", "source", ""),
 "src-frayl": ("Frayling — Research through art", "source", ""),
 "src-schwab": ("Schwab/Borgdorff — Experimental Systems in Artistic Research", "source", ""),
 "src-hase": ("Haseman — Performative Research", "source", ""),
 "src-eigen": ("Eigen — quasispecies / error threshold (the inverted-U’s edge)", "source", ""),
 "src-gerst": ("Gerstgrasser — accumulate vs replace (loss-side cure)", "source", ""),
 "src-mersch": ("Mersch — negative knowledge; the untranslatable", "source", ""),
 "src-maha": ("Maharaj — no-how; method as a stopgap", "source", ""),
 "t1": ("Error subtracted to a special case of the epistemic thing", "thread", ""),
 "t2": ("Differential reproduction run: the epistemic thing as produced-and-kept difference; the barren regime", "thread", ""),
 "t3": ("No-how / the non-discursive: method as stopgap, the journal as note; negative knowledge as the only figure", "thread", ""),
 "w-pos": ("The Epistemic Thing and the Error (position)", "work", "2026-07-14"),
 "w-gu": ("Generative Unknowing", "work", "2026-07-13"),
 "w-ng": ("Named, the Glitch Is No More", "work", "2026-07-07"),
 "w-dr": ("Differential Reproduction", "work", "2026-07-14"),
 "w-nk": ("Negative Knowledge", "work", "2026-07-14"),
 "w-gl": ("Generation Loss", "work", "2026-07-03"),
 "w-cl": ("The Closing Loop", "work", "2026-07-11"),
 "w-lb": ("Low-Background", "work", "2026-07-12"),
}

EDGES = [  # (from, kind, to, session) — all 19, verbatim structure
 ("src-rhein","swerve","t1",26), ("src-frayl","swerve","t1",26),
 ("src-schwab","swerve","t1",26), ("src-hase","swerve","t1",26),
 ("t1","elaborates","w-pos",None), ("t1","elaborates","w-gu",None), ("t1","elaborates","w-ng",None),
 ("w-ng","bridge","w-gu",26),
 ("src-eigen","swerve","t2",27), ("t1","continues","t2",27),
 ("t2","elaborates","w-dr",None),
 ("w-dr","complement","w-gl",27), ("w-dr","complement","w-cl",27), ("w-dr","complement","w-lb",27),
 ("src-gerst","grounds","w-dr",27),
 ("src-mersch","swerve","t3",28), ("src-maha","swerve","t3",28),
 ("t3","elaborates","w-nk",None),
 ("w-nk","bridge","w-dr",28),
]

POS = {  # deterministic sheet positions (id -> x,y)
 "src-rhein": (336, 236), "src-frayl": (336, 268), "src-schwab": (336, 300), "src-hase": (336, 332),
 "src-eigen": (336, 476), "src-gerst": (336, 600),
 "src-mersch": (336, 656), "src-maha": (336, 688),
 "t1": (430, 284), "t2": (450, 484), "t3": (440, 668),   # thread heads (elbow targets)
 "w-pos": (950, 232), "w-gu": (1060, 300), "w-ng": (1210, 366),
 "w-dr": (980, 484), "w-gl": (1150, 584), "w-cl": (1262, 584), "w-lb": (1368, 584),
 "w-nk": (960, 668),
}
T_END = {"t1": (880, 262), "t2": (880, 472), "t3": (880, 654)}
S_ELBOW = {26: (404, 284), 27: (424, 484), 28: (414, 668)}

def thread_path(tid):
    (x0, y0), (x1, y1) = POS[tid], T_END[tid]
    return f"M{x0} {y0} C {x0+150} {y0-14}, {x1-160} {y1+10}, {x1} {y1}"

def build_svg():
    s = ['<svg id="score" viewBox="0 168 1440 600" role="img" aria-label="Atelier working sheet S26 to S28: three threads, six sources, eight works; the full edge list follows as a table.">']

    # threads (ink ribbons) + labels
    for tid, lab_y in (("t1", 236), ("t2", 438), ("t3", 622)):
        s.append(f'<path class="th" d="{thread_path(tid)}"/>')
        lab = NODES[tid][0]
        short = lab if len(lab) <= 76 else lab[:73] + "…"
        s.append(f'<text class="t-thread" x="{POS[tid][0]+34}" y="{lab_y}">{esc(short)}<title>{esc(lab)}</title></text>')

    # sources: graphite stubs from the margin into the session elbow
    for sid in [k for k in NODES if k.startswith("src-")]:
        x, y = POS[sid]
        full = NODES[sid][0]
        short = full if len(full) <= 40 else full[:37] + "…"
        s.append(f'<text class="t-src" x="{x-10}" y="{y+4}" text-anchor="end">{esc(short)}<title>{esc(full)}</title></text>')
        sess = next(e[3] for e in EDGES if e[0] == sid)
        if next(e[1] for e in EDGES if e[0] == sid) == "grounds":
            continue  # grounds drawn separately at the work
        ex, ey = S_ELBOW[sess]
        s.append(f'<path class="stub" d="M{x} {y} H{ex-22}"/>')
        s.append(f'<path class="rp" d="M{ex-22} {y} Q {ex-4} {y}, {ex} {ey}" fill="none"/>')  # the swerve kink
    for sess, (ex, ey) in S_ELBOW.items():
        s.append(f'<circle class="rp-dot" cx="{ex}" cy="{ey}" r="3.5"/>')
        s.append(f'<text class="t-sess" x="{ex-6}" y="{ey+22}" text-anchor="end">S{sess}</text>')

    # continues T1 -> T2 (left-side long curve, red session mark at arrival)
    s.append(f'<path class="th th-cont" d="M{POS["t1"][0]+40} {POS["t1"][1]+8} C 330 380, 350 450, {POS["t2"][0]-18} {POS["t2"][1]-4}"/>')
    s.append(f'<text class="t-note-a" x="330" y="404">continues · S27</text>')

    # works: ink slabs + serif labels (elaborates ties from thread ends)
    SHELF = {"w-gl", "w-cl", "w-lb"}
    for wid in [k for k in NODES if k.startswith("w-")]:
        x, y = POS[wid]; lab, _, date = NODES[wid]
        ghost = wid in SHELF
        s.append(f'<rect class="{"slab-ghost" if ghost else "slab"}" x="{x-6}" y="{y-22}" width="12" height="44"/>')
        anch, lx = ("middle", x) if ghost else ("start", x + 14)
        ly = y + 40 if ghost else y - 2
        s.append(f'<text class="t-work" x="{lx}" y="{ly}" text-anchor="{anch}">{esc(lab if len(lab)<=34 else lab[:31]+"…")}<title>{esc(lab)}</title></text>')
        if date:
            s.append(f'<text class="t-date" x="{lx}" y="{ly+15}" text-anchor="{anch}">{date}</text>')

    # elaborates ties (thin ink from thread end to slab)
    for a, kind, b, _ in EDGES:
        if kind == "elaborates":
            (x1, y1), (x2, y2) = T_END[a], POS[b]
            s.append(f'<path class="tie" d="M{x1} {y1} C {x1+40} {y1}, {x2-46} {y2}, {x2-8} {y2}"/>')

    # the two bridges: double ties, first one carries the practice's own words
    (xg, yg), (xn, yn) = POS["w-gu"], POS["w-ng"]
    for off in (-2.5, 2.5):
        s.append(f'<path class="bridge" d="M{xg+8} {yg+off} C {xg+70} {yg+26+off}, {xn-70} {yn-26+off}, {xn-8} {yn+off}"/>')
    s.append(f'<text class="t-bridge" x="{(xg+xn)//2-16}" y="{(yg+yn)//2+32}" text-anchor="middle">„they are one fact“ · S26</text>')
    (xa, ya), (xb, yb) = POS["w-nk"], POS["w-dr"]
    for off in (-2.5, 2.5):
        s.append(f'<path class="bridge" d="M{xa+off} {ya-24} C {xa+off} {ya-70}, {xb+off} {yb+72}, {xb+off} {yb+24}"/>')
    s.append(f'<text class="t-sess" x="{xa+14}" y="{(ya+yb)//2+6}">bridge · S28</text>')

    # complements (dashed graphite) + grounds (foundation stroke)
    for a, kind, b, _ in EDGES:
        if kind == "complement":
            (x1, y1), (x2, y2) = POS[a], POS[b]
            s.append(f'<path class="comp" d="M{x1+8} {y1+12} C {x1+90} {y1+60}, {x2-40} {y2-46}, {x2} {y2-26}"/>')
    s.append(f'<text class="t-note-a" x="{POS["w-lb"][0]+12}" y="{POS["w-gl"][1]-52}" text-anchor="end">complement · S27 — the loss-side shelf</text>')
    xd, yd = POS["w-dr"]
    s.append(f'<path class="ground" d="M{xd-30} {yd+30} H{xd+30}"/>')
    s.append(f'<path class="stub" d="M{POS["src-gerst"][0]} {POS["src-gerst"][1]} C 420 600, {xd-90} {yd+34}, {xd-32} {yd+30}"/>')
    s.append(f'<text class="t-sess" x="{xd-34}" y="{yd+46}">grounds · S27</text>')

    # the reserved doorway (right margin) — empty on purpose
    s.append('<path class="door" d="M1408 300 V560"/><path class="door" d="M1396 300 H1408 M1396 560 H1408"/>')
    s.append('<text class="t-note-a" transform="rotate(-90 1424 430)" x="1424" y="430" text-anchor="middle">doorway reserved — for an external encounter, once it exists</text>')

    s.append('</svg>')
    return "\n".join(s)

ATELIER_CSS = """
:root{--font-ui:"Iowan Old Style",Georgia,serif;--font-display:"Iowan Old Style",Georgia,serif;
--font-record:ui-monospace,"SF Mono",Menlo,monospace;--h1-track:0;--h1-weight:600}
:root[data-theme="light"]{--page:#ece5d6;--surface:#f6f1e7;--ink:#232019;--ink-2:#6e6558;
--hairline:#ddd4c2;--c-thread:#2c46c8;--c-red:#b03a30;--c-graphite:#8a8377;
--badge-bg:#efe8d9;--tip-bg:#fffdf6;--tip-ink:#232019;--h1-ink:#1b1812}
:root[data-theme="dark"]{--page:#100e0c;--surface:#1b1815;--ink:#e9e2d4;--ink-2:#a1988a;
--hairline:#332e27;--c-thread:#5c76e6;--c-red:#cc584a;--c-graphite:#97907f;
--badge-bg:#242019;--tip-bg:#26221c;--tip-ink:#e9e2d4;--h1-ink:#f2ecdf}
.wrap{border:1px solid var(--hairline);position:relative}
h1{color:var(--h1-ink);font-style:italic;max-width:26ch}
.theme-toggle{position:absolute;top:26px;right:34px;width:34px;height:34px;display:flex;
align-items:center;justify-content:center;background:none;border:1px solid var(--hairline);
border-radius:6px;color:var(--ink-2);cursor:pointer}
.theme-toggle:hover{color:var(--ink)} .theme-toggle svg{display:none}
:root[data-theme-mode="auto"] .theme-toggle .i-auto{display:block}
:root[data-theme-mode="light"] .theme-toggle .i-sun{display:block}
:root[data-theme-mode="dark"] .theme-toggle .i-moon{display:block}
/* Blatt-Zeichen — the Atelier's own, none shared with the Middle's score */
.th{stroke:var(--c-thread);stroke-width:2.6;fill:none;stroke-linecap:round}
.th-cont{stroke-width:1.6;opacity:.75}
.stub{stroke:var(--c-graphite);stroke-width:1.3;fill:none}
.rp{stroke:var(--c-red);stroke-width:1.8}
.rp-dot{fill:var(--c-red)}
.slab{fill:var(--ink)} .slab-ghost{fill:none;stroke:var(--c-graphite);stroke-width:1.2;stroke-dasharray:3 3}
.tie{stroke:var(--ink);stroke-width:1;fill:none;opacity:.65}
.bridge{stroke:var(--ink);stroke-width:1.4;fill:none}
.comp{stroke:var(--c-graphite);stroke-width:1.1;fill:none;stroke-dasharray:5 4}
.ground{stroke:var(--c-graphite);stroke-width:2.6}
.door{stroke:var(--ink-2);stroke-width:1.4;fill:none;stroke-dasharray:6 5}
.t-thread{font:italic 14.5px var(--font-display);fill:var(--c-thread)}
.t-src{font:11.5px var(--font-record);fill:var(--ink-2)}
.t-sess{font:600 11px var(--font-record);fill:var(--c-red)}
.t-work{font:italic 13.5px var(--font-display);fill:var(--ink)}
.t-date{font:10.5px var(--font-record);fill:var(--ink-2)}
.t-bridge{font:italic 12.5px var(--font-display);fill:var(--ink)}
.t-note-a{font:11.5px var(--font-record);fill:var(--ink-2)}
"""

def legend_html():
    return """
<aside class="legend" aria-label="Sheet key">
  <div class="lg-col"><h3>Materials</h3>
    <div class="lg-row"><svg class="mini" viewBox="0 0 46 30"><path class="th" d="M4 20 C 16 12, 30 22, 42 14"/></svg><span>thread — ink; a reading drawn across works</span></div>
    <div class="lg-row"><svg class="mini" viewBox="0 0 46 30"><path class="stub" d="M4 15 H24"/><path class="rp" d="M24 15 Q 32 15, 36 8" fill="none"/></svg><span>swerve — red pencil; a source kinks into a thread (the clinamen)</span></div>
    <div class="lg-row"><svg class="mini" viewBox="0 0 46 30"><rect class="slab" x="20" y="4" width="8" height="22"/></svg><span>work — an ink slab standing on the sheet</span></div>
    <div class="lg-row"><svg class="mini" viewBox="0 0 46 30"><rect class="slab-ghost" x="20" y="4" width="8" height="22"/></svg><span>prior work on the shelf — present, not re-made</span></div>
  </div>
  <div class="lg-col"><h3>Ties</h3>
    <div class="lg-row"><svg class="mini" viewBox="0 0 46 30"><path class="tie" d="M4 15 C 16 8, 30 22, 42 15"/></svg><span>elaborates — a thread holds a work</span></div>
    <div class="lg-row"><svg class="mini" viewBox="0 0 46 30"><path class="bridge" d="M4 13 C 18 6, 28 6, 42 13"/><path class="bridge" d="M4 18 C 18 25, 28 25, 42 18"/></svg><span>bridge — two works tied in the practice’s own words</span></div>
    <div class="lg-row"><svg class="mini" viewBox="0 0 46 30"><path class="comp" d="M4 15 C 16 8, 30 22, 42 15"/></svg><span>complement — the loss-side shelf answers the birth-side run</span></div>
    <div class="lg-row"><svg class="mini" viewBox="0 0 46 30"><path class="ground" d="M10 22 H36"/></svg><span>grounds — a source laid under a work as foundation</span></div>
    <div class="lg-row"><svg class="mini" viewBox="0 0 46 30"><path class="door" d="M36 4 V26"/></svg><span>doorway — reserved for external encounters; empty until one exists</span></div>
  </div>
  <div class="lg-col"><h3>Not this sheet</h3>
    <p class="lg-note">No time axis, no lanes, no practice colors, no as-of edge — those belong to
    The Middle’s score (ADR 0010: no shared visual grammar). The sheet keeps one lab-wide ethic
    unchanged: everything drawn is verbatim and sourced, and the table below compresses nothing.</p>
  </div>
</aside>"""

def table_html():
    rows = "".join(
        f'<tr><td class="q">{esc(NODES[a][0])}</td><td>{esc(k)}</td><td class="q">{esc(NODES[b][0])}</td><td>{esc("S"+str(sess) if sess else "—")}</td></tr>'
        for a, k, b, sess in EDGES)
    return f'''<section class="record"><h2>Edge register — all 19 edges of the sheet, uncompressed</h2>
<div class="tbl-wrap"><table><thead><tr><th>from</th><th>kind</th><th>to</th><th>session</th></tr></thead><tbody>{rows}</tbody></table></div></section>'''

page = f"""<!doctype html>
<html lang="en" data-theme="light" data-theme-mode="auto"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Atelier — das Blatt · S26–S28</title>
{THEME_HEAD}<style>{ATELIER_CSS}{BASE_CSS}</style></head>
<body>
<div class="wrap">
  {TOGGLE_BTN}
  <p class="kicker"><span>Atelier · working sheet S26–S28</span><span>irrtum-als-methode</span>
  <span>drawn 2026-07-14 by the practice itself</span><span class="chip">design study — not yet a product surface</span></p>
  <h1>Error subtracted to a special case of the epistemic thing</h1>
  <p class="status"><b>3 threads · 6 sources · 8 works · 2 bridges</b> · the sheet title is the thread’s own label, verbatim; every edge below is drawn in the rhizome by Ulysses, session 26–28</p>
  <figure>{build_svg()}</figure>
  {legend_html()}
  {table_html()}
  <footer>
    <span>compiled read-only from {esc(PROV)}</span>
    <span>the Atelier’s grammar is its own — ADR 0010 · design docs: atelier-aesthetik-2026-07-15.md</span>
  </footer>
</div>
</body></html>"""

out = OUT / "atelier-blatt.html"
out.write_text(page)
print("wrote", out)
