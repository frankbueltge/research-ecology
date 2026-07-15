#!/usr/bin/env python3
"""The Studio — die Bühne & der Abendzettel. Fourth language, own signs.

Ensemble's practice IS theatrical — its own records speak of premieres, gates,
kills, an Artist, a Kritiker, a Dramaturg. So: the entry is a STAGE (one spotlight
on what is public now; the killed projects as taped X-marks on the dark floor,
each with its verbatim kill reason; the refused material in DIE GASSE, offstage,
visible but unlit), and the history is a PLAYBILL (two evenings, twelve sessions,
set from the chronicle verbatim). The data edge: the next bill is not yet printed.

Chronicle summaries are read directly from the studio repo at build time
(read-only) so every quoted line is verbatim by construction. Kill reasons quote
the session commits. Encounter quotes come from the enc-2026-001 fixture.
"""
import html, json, pathlib
from assemble_variants import BASE_CSS, THEME_HEAD, TOGGLE_BTN, OUT, SHA

def esc(s): return html.escape(str(s), quote=True)

REPO = pathlib.Path("/Users/frankbultge/Documents/GitHub/studio")
CHRON = json.loads((REPO / "chronicle.json").read_text())
PROV = "studio @ 2243fc0 · chronicle.json (read at build, verbatim) · session commits · enc-2026-001 fixture · read-only"

KILLS = [  # (name, session, verbatim reason from the session commits)
 ("Ledger of Days", "S01", "rejected ('wallpaper by definition')"),
 ("Diminishing Returns", "S05", "KILLED (terminal test + material bar failed; observatory remainder handed upstream)"),
 ("Quiet Signature", "S05", "killed by the same razor"),
 ("Certified", "S06", "killed at concept (one page each)"),
 ("No Way of Knowing", "S06", "killed at concept — v2 returns, see the Gasse"),
 ("The Exemption", "S12", "KILLED (Kritiker fetched Art. 50(4): the exemption misstates the statute)"),
 ("Admissible", "S12", "KILLED (unverified spine, sequel form)"),
]

STUDIO_CSS = """
:root{--font-ui:"Bodoni 72",Didot,"Playfair Display",Georgia,serif;
--font-display:var(--font-ui);--font-record:ui-monospace,"SF Mono",Menlo,monospace;
--h1-track:.01em;--h1-weight:500}
:root[data-theme="dark"]{--page:#0e0c0b;--surface:#141110;--ink:#eae4da;--ink-2:#9a9188;
--hairline:#2e2825;--c-lamp:#bd8b21;--c-curtain:#c2455a;
--badge-bg:#1c1816;--tip-bg:#1e1a18;--tip-ink:#eae4da;--h1-ink:#f4efe6;
--spot-core:#f4ead2;--spot-mid:#c8a94e}
:root[data-theme="light"]{--page:#e9e4dc;--surface:#f3efe9;--ink:#221e1b;--ink-2:#6d645c;
--hairline:#dcd4c8;--c-lamp:#8a6a10;--c-curtain:#a83248;
--badge-bg:#ece6dd;--tip-bg:#fffdf8;--tip-ink:#221e1b;--h1-ink:#1a1613;
--spot-core:#fff9ea;--spot-mid:#e6d195}
.wrap{border:1px solid var(--hairline);position:relative}
h1{color:var(--h1-ink)}
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
.br-here{color:var(--ink);text-transform:uppercase;border-bottom:2px solid var(--c-curtain)}
.br-door{margin-left:auto;color:var(--ink-2);text-transform:uppercase}
/* Bühnen-Zeichen: Spot, Marke, X, Gasse, Marquee — nichts geteilt mit Partitur/Blatt/Protokoll */
.stagefloor{fill:var(--surface);stroke:var(--hairline)}
.curtainline{stroke:var(--c-curtain);stroke-width:3}
.tapemark{stroke:var(--ink-2);stroke-width:1.6;fill:none}
.xmark{stroke:var(--c-curtain);stroke-width:2;fill:none}
.gasse{stroke:var(--ink-2);stroke-width:1;stroke-dasharray:5 5}
.t-worktitle{font:500 40px var(--font-display);fill:#2e250f;letter-spacing:.06em}
.t-workmeta{font:12px var(--font-record);fill:var(--ink-2)}
.t-marquee{font:600 13px var(--font-record);fill:var(--c-lamp);letter-spacing:.34em}
.t-quote-s{font:italic 13.5px var(--font-display);fill:var(--ink)}
.t-kill{font:11.5px var(--font-record);fill:var(--ink-2)}
.t-kill-n{font:600 12px var(--font-record);fill:var(--ink)}
.t-gasse{font:600 11px var(--font-record);letter-spacing:.2em;fill:var(--ink-2)}
.evt2{cursor:help;outline:none}
/* Abendzettel (playbill) */
.zettel{max-width:660px;margin:30px auto 10px;text-align:center}
.zettel .abend{font:600 13px var(--font-record);letter-spacing:.3em;color:var(--ink-2);
margin:34px 0 6px;text-transform:uppercase}
.zettel .rule{border:none;border-top:1px solid var(--hairline);margin:12px auto;width:60%}
.zettel .rule-heavy{border-top:2px solid var(--ink);width:40%}
.zettel .nr{font:600 12px var(--font-record);color:var(--c-lamp);letter-spacing:.18em}
.zettel .line{font:19px var(--font-display);color:var(--ink);margin:2px 0 18px;line-height:1.4}
.zettel .line b{font-weight:600}
.zettel .move{font:600 10.5px var(--font-record);letter-spacing:.22em;color:var(--ink-2);text-transform:uppercase}
.zettel .kill{color:var(--c-curtain)}
.zettel .prem{font:500 30px var(--font-display);letter-spacing:.04em;color:var(--h1-ink);margin:6px 0 4px}
.zettel .edge{font:italic 15px var(--font-display);color:var(--ink-2);margin-top:26px}
"""

def rail(active):
    items = [("this stage","/studio — what is public now"),("works","/studio/werke — existing URLs stay"),
             ("playbill","/studio/playbill — the chronicle as an evening bill"),
             ("apparatus","/studio/apparatus — repo, constitution, team channel, nightly runs")]
    out = ['<nav class="blattrand" aria-label="Stage rail — the only standing navigation">']
    for label, hint in items:
        out.append(f'<span class="br-here">{label}</span>' if label == active
                   else f'<a href="#" title="{esc(hint)}">{label}</a>')
    out.append('<span class="br-door" title="/middle — enc-2026-001: the correction it sent upstream">→ the middle</span></nav>')
    return "".join(out)

# ---------------------------------------------------------------- page 1: die Bühne
def stage_svg():
    s = ['<svg id="score" viewBox="0 200 1440 470" role="img" aria-label="The stage: one spotlight on Native Speaker; seven taped X-marks for killed projects; the Gasse holds the refused material; the stage record follows as a table.">']
    s.append('<defs><radialGradient id="spot" cx="50%" cy="46%" r="55%">'
             '<stop offset="0%" stop-color="var(--spot-core)" stop-opacity=".95"/>'
             '<stop offset="55%" stop-color="var(--spot-mid)" stop-opacity=".28"/>'
             '<stop offset="100%" stop-color="var(--spot-mid)" stop-opacity="0"/></radialGradient></defs>')
    s.append('<rect class="stagefloor" x="150" y="226" width="1080" height="416"/>')
    s.append('<path class="curtainline" d="M150 226 H1230"/>')
    # the spot with the premiered work
    cx, cy = 610, 400
    s.append(f'<ellipse cx="{cx}" cy="{cy}" rx="300" ry="170" fill="url(#spot)"/>')
    s.append(f'<g class="evt2" tabindex="0">'
             f'<text class="t-worktitle" x="{cx}" y="{cy-42}" text-anchor="middle">NATIVE SPEAKER</text>'
             f'<text class="t-workmeta" style="fill:#4a3d1c" x="{cx}" y="{cy-18}" text-anchor="middle">premiered 2026-07-13 · session 10 · “The first premiere of the house.”</text>'
             f'<title>works/2026-07-13-native-speaker — graduated through the full gate: Verifier PASS WITH FINDINGS (minors fixed), Dramaturg DELIVERS, Kritiker PREMIERE STANDS (critique published verbatim, five on the record)</title></g>')
    s.append(f'<text class="t-marquee" style="fill:#6b4f0e" x="{cx}" y="{cy+14}" text-anchor="middle">LIVE STATUS TRAVELS · OBLIGATION ACTIVE</text>')
    s.append(f'<text class="t-quote-s" style="fill:#3a2f14" x="{cx}" y="{cy+44}" text-anchor="middle">“Live status travels; load-bearing caveats survive re-voicing;</text>')
    s.append(f'<text class="t-quote-s" style="fill:#3a2f14" x="{cx}" y="{cy+62}" text-anchor="middle">corrections flow upstream, never silently sideways”</text>')
    s.append(f'<text class="t-workmeta" style="fill:#4a3d1c" x="{cx}" y="{cy+82}" text-anchor="middle">— the work’s own admission contract, session 07 (enc-2026-001, verbatim)</text>')
    # blocking tape corners around the spot position
    for dx_, dy_ in ((-330,-120),(330,-120),(-330,120),(330,120)):
        x, y = cx+dx_, cy+dy_
        hx, hy = (18 if dx_<0 else -18), (14 if dy_<0 else -14)
        s.append(f'<path class="tapemark" d="M{x} {y+hy} V{y} H{x+hx}"/>')
    # killed projects: taped X-marks on the dark floor, verbatim reasons on hover
    XPOS = [(255,300),(1105,296),(240,536),(415,600),(830,608),(1040,568),(1150,468)]
    for (name, sess, reason), (x, y) in zip(KILLS, XPOS):
        s.append(f'<g class="evt2" tabindex="0">'
                 f'<path class="xmark" d="M{x-9} {y-9} L{x+9} {y+9} M{x+9} {y-9} L{x-9} {y+9}"/>'
                 f'<text class="t-kill-n" x="{x+16}" y="{y-1}">{esc(name)}</text>'
                 f'<text class="t-kill" x="{x+16}" y="{y+13}">{esc(sess)}</text>'
                 f'<title>{esc(name)} — {esc(sess)}: {esc(reason)}</title></g>')
    s.append('<text class="t-kill" x="230" y="252">seven positions struck — the floor keeps every mark</text>')
    # die Gasse (offstage, visible but unlit)
    s.append('<path class="gasse" d="M1230 226 V642"/>')
    s.append('<text class="t-gasse" transform="rotate(-90 1420 434)" x="1420" y="434" text-anchor="middle">DIE GASSE · OFFSTAGE — VISIBLE, UNLIT</text>')
    s.append('<g class="evt2" tabindex="0">'
             '<text class="t-kill-n" x="1248" y="300">the declined case</text>'
             '<text class="t-kill" x="1248" y="315">session 08</text>'
             '<title>translation.loss_declared — “A work about machine judgment may not borrow stakes the record does not attribute to the machine” (rationale stated in the work, session 08 · enc-2026-001, verbatim). The most spectacular case stays offstage, on purpose.</title></g>')
    s.append('<g class="evt2" tabindex="0">'
             '<text class="t-kill-n" x="1248" y="380">No Way of Knowing v2</text>'
             '<text class="t-kill" x="1248" y="395">HELD · six conditions</text>'
             '<title>S12 — HELD with six conditions: “the strongest material-bar claim of the house; research homework before the gate reopens” (session commit, verbatim)</title></g>')
    s.append('</svg>')
    return "\n".join(s)

def stage_table():
    rows = [
        ('2026-07-12','Native Speaker opened at concept — Artist’s first session; art critic: OPEN-WORTHY, 4 binding conditions','session 06 commit'),
        ('2026-07-12','admission contract stated — “Live status travels; load-bearing caveats survive re-voicing; corrections flow upstream, never silently sideways” (session 07)','enc-2026-001 ledger, verbatim'),
        ('2026-07-12','the most spectacular case declined — stakes the record does not attribute to the machine (session 08)','enc-2026-001 ledger, verbatim'),
        ('2026-07-12','the correction reported upstream, delivered by the conductor','enc-2026-001 ledger'),
        ('2026-07-13','THE PREMIERE — full gate passed, graduated to works/2026-07-13-native-speaker','session 10 commit · chronicle'),
        ('2026-07-13','post-premiere critique becomes THE TAKEDOWN LAW (constitution)','session 11 commit'),
        ('since 2026-07-12','obligation live-status-travels — active','enc-2026-001 obligations'),
    ]
    body = "".join(f'<tr><td class="mono">{esc(d)}</td><td class="q">{esc(e)}</td><td class="mono">{esc(src)}</td></tr>' for d,e,src in rows)
    return f'''<section class="record"><h2>Stage record — every mark, uncompressed</h2>
<div class="tbl-wrap"><table><thead><tr><th>date</th><th>event</th><th>source</th></tr></thead><tbody>{body}</tbody></table></div></section>'''

# ---------------------------------------------------------------- page 2: der Abendzettel
ROMAN = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"]
def playbill_html():
    out = ['<div class="zettel"><hr class="rule rule-heavy">']
    current_date = None
    evening = 0
    for e in CHRON:
        d = e["date"]
        if d != current_date:
            current_date = d; evening += 1
            label = "Erster Abend" if evening == 1 else "Zweiter Abend"
            out.append(f'<p class="abend">{label} — {d}</p><hr class="rule">')
        sess = e["collective_session"]; move = e["move"]; summ = e["summary"]
        first = summ.split(". ")[0].rstrip(".") + "."
        killy = ("KILLED" in summ) or ("killed" in first) or ("nothing opened" in first.lower())
        move_cls = "move kill" if killy or move == "steer" and "KILLED" in summ else "move"
        if move == "ship":
            out.append(f'<p class="nr">{ROMAN[sess-1]} · SHIP</p><p class="prem">The first premiere of the house.</p>'
                       f'<p class="line">{esc(first[len("The first premiere of the house. "):] if first.startswith("The first premiere") else first)}</p>')
        else:
            out.append(f'<p class="nr">{ROMAN[sess-1]} · <span class="{ "kill" if killy else "" }">{esc(move.upper())}</span></p>'
                       f'<p class="line">{esc(first)}</p>')
    out.append('<hr class="rule rule-heavy"><p class="edge">The house plays nightly — the next bill is not yet printed.</p></div>')
    return "".join(out)

def playbill_table():
    rows = "".join(f'<tr><td>S{e["collective_session"]}</td><td class="mono">{esc(e["date"])}</td><td>{esc(e["move"])}</td><td class="q">{esc(e["summary"])}</td></tr>' for e in CHRON)
    return f'''<section class="record"><h2>Chronicle — all twelve entries, full text, uncompressed</h2>
<div class="tbl-wrap"><table><thead><tr><th>session</th><th>date</th><th>move</th><th>summary (verbatim)</th></tr></thead><tbody>{rows}</tbody></table></div></section>'''

def page(title, kicker2, h1, status, rail_active, body, table, footer_extra):
    return f"""<!doctype html>
<html lang="en" data-theme="dark" data-theme-mode="auto"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)}</title>
{THEME_HEAD}<style>{STUDIO_CSS}{BASE_CSS}</style></head>
<body>
<div class="wrap">
  {TOGGLE_BTN}
  <p class="kicker"><span>Studio · {esc(kicker2)}</span><span>studio (Ensemble)</span>
  <span>founded 2026-07-12</span><span class="chip">design study — wording approved 2026-07-15</span></p>
  {rail(rail_active)}
  <h1>{esc(h1)}</h1>
  <p class="status">{status}</p>
  {body}
  {table}
  <footer>
    <span>compiled read-only from {esc(PROV)} · research-ecology @{SHA}</span>
    <span>{footer_extra}</span>
  </footer>
</div>
</body></html>"""

(OUT / "studio-buehne.html").write_text(page(
    "Studio — die Bühne · Native Speaker",
    "the stage · what is public now",
    "One work is on. Seven are struck.",
    "<b>1 premiere · 7 kills · 1 held · 12 sessions in two evenings</b> · the entry to /studio is the stage, not a gallery grid: one spot, and the floor keeps every strike",
    "this stage", f"<figure>{stage_svg()}</figure>", stage_table(),
    "the correction this work sent upstream lives in The Middle → enc-2026-001"))
(OUT / "studio-abendzettel.html").write_text(page(
    "Studio — der Abendzettel · two evenings",
    "the history as an evening bill",
    "Two evenings. Twelve sessions.",
    "<b>founded, built, gated, killed twice over, premiered, then hardened into law</b> · chronicle summaries verbatim; first sentence on the bill, full text in the table",
    "playbill", playbill_html(), playbill_table(),
    "scale rule (grammar §7, studio flavour): one bill per evening; past bills stack in the archive, the season index lists them"))
print("wrote", OUT / "studio-buehne.html")
print("wrote", OUT / "studio-abendzettel.html")
