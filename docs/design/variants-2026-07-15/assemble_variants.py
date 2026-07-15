#!/usr/bin/env python3
"""Design-session assembler: deterministic score-map (Partitur) for enc-2026-001.

One generator, three skins. The SVG is generated ONCE from the real ledger data and
shared verbatim by all three variants; art direction lives entirely in CSS custom
properties + chrome. This is the working sketch of the future `score` renderer form
in packages/projections (see docs/design/zeichengrammatik-2026-07-15.md §5).

No randomness, no clock reads: every coordinate is a pure function of the data.
"""
import json, subprocess, html, pathlib

OUT = pathlib.Path("/Users/frankbultge/Documents/GitHub/research-ecology/docs/design/variants-2026-07-15")
SHA = subprocess.run(["git", "-C", "/Users/frankbultge/Documents/GitHub/research-ecology",
                      "rev-parse", "--short", "HEAD"], capture_output=True, text=True).stdout.strip()

# ---------------------------------------------------------------- real data (fixture-derived)
D = {
    "encounter_id": "enc-2026-001-calibration-gap-travels",
    "headline": "A work found the flaw in the instrument it was built from.",
    "status": "unresolved — both readings stand",
    "as_of": "2026-07-14",
    "approval": "wording approved (Frank, 2026-07-15) · editorial narrative authored by the-middle-editorial",
    "lanes": [
        {"id": "meridian", "label": "MERIDIAN", "role": "source",
         "local": "correction applied; register revised; obligations active"},
        {"id": "conductor", "label": "CONDUCTOR", "role": "transport only",
         "local": "not an authoring party to either side's assertions", "thin": True},
        {"id": "ensemble", "label": "ENSEMBLE", "role": "receiver",
         "local": "premiered; live-status obligation active"},
    ],
    "events": [
        {"id": "evt-enc2026001-01-contract-published", "type": "contract.published",
         "date": "2026-07-11", "lane": "meridian", "station": 1,
         "quote": "a caveat stated once here must not go unstated twice downstream",
         "attribution": "standing self-binding commitment of the source, session 22"},
        {"id": "evt-enc2026001-02-object-admitted", "type": "object.admitted",
         "date": "2026-07-12", "lane": "ensemble", "station": 2,
         "quote": "Live status travels; load-bearing caveats survive re-voicing; corrections flow upstream, never silently sideways",
         "attribution": "the work's own admission contract, session 07"},
        {"id": "evt-enc2026001-03-correction-issued", "type": "correction.issued",
         "date": "2026-07-12", "lane": "conductor", "station": 4,
         "quote": "Although the panel did not rely on AI-detection evidence, it credited graders' ability to identify AI-written work […]",
         "attribution": "reported by the work into the source archive, delivered by the conductor"},
        {"id": "evt-enc2026001-04-translation-loss-declared", "type": "translation.loss_declared",
         "date": "2026-07-12", "lane": "ensemble", "station": 3,
         "quote": "A work about machine judgment may not borrow stakes the record does not attribute to the machine",
         "attribution": "rationale stated in the work, session 08"},
        {"id": "evt-enc2026001-05-correction-applied", "type": "correction.applied",
         "date": "2026-07-12", "lane": "meridian", "station": 5,
         "quote": "Arrived as the collective's first downstream correction report",
         "attribution": "register revised after a renewed verification pass, session 33"},
        {"id": "evt-enc2026001-06-derivative-published", "type": "derivative.published",
         "date": "2026-07-12", "lane": "ensemble", "station": None,
         "quote": "derivative published by the work", "attribution": "ensemble"},
        {"id": "evt-enc2026001-07-derivative-published", "type": "derivative.published",
         "date": "2026-07-12", "lane": "ensemble", "station": None, "infra": True,
         "quote": "derivative published via gated integration", "attribution": "studio-integrate (infrastructure)"},
    ],
    "obligations": [
        {"id": "obl-enc2026001-caveat-preservation", "lane": "meridian", "from_evt": 0, "label": "caveat-preservation — active"},
        {"id": "obl-enc2026001-live-status-travels", "lane": "ensemble", "from_evt": 1, "label": "live-status-travels — active"},
    ],
    "divergence": {
        "left_label": "Meridian's framing", "left_quote": "a detector-in-the-accusation observation, not court-attributed detector harm",
        "right_label": "Ensemble's refusal band", "right_quote": "the University of Minnesota expulsion case as detector-attributed harm on the work's verdict card",
        "closing": "no shared resolution", "station": 6,
    },
    "akte": "/akte/encounters/enc-2026-001-calibration-gap-travels",
    "non_relation": "ULYSSES — documented non-participant in this encounter (designed non-relation; drawn as absence, not as edge)",
}

# ---------------------------------------------------------------- deterministic layout
W, H = 1440, 800
LANE_Y = {"meridian": 300, "conductor": 450, "ensemble": 580}
LANE_X0, LANE_X1 = 210, 1336            # lane extent; 1336 = as-of edge
EVT_X = [340, 470, 600, 730, 860, 970, 1060]   # ledger order, ordinal slots
ASOF_X = 1336
DIV_X = 1250                             # divergence terminal
RULER_Y = 232

def esc(s): return html.escape(str(s), quote=True)

def glyph(e, x, y):
    """Sign per event-type family (Zeichengrammatik §2). Returns svg fragment."""
    fam = e["type"].split(".")[0]
    c = f"pr-{e['lane']}" if not e.get("infra") else "pr-infra"
    g = []
    if e["type"] == "contract.published":
        g.append(f'<path class="mk {c}" d="M{x} {y-16} V{y+16}" />')
        g.append(f'<path class="mk mk-lt {c}" d="M{x+7} {y-16} V{y+16}" />')
        g.append(f'<path class="mk {c}" d="M{x+7} {y} H{x+20}" marker-end="url(#tick)"/>')
    elif fam == "object":
        g.append(f'<rect class="mk-fill {c}" x="{x-8}" y="{y-8}" width="16" height="16" />')
    elif e["type"] == "translation.loss_declared":
        g.append(f'<rect class="mk-hatch {c}" x="{x-16}" y="{y-7}" width="11" height="14" />')
        g.append(f'<rect class="mk-hatch {c}" x="{x+5}" y="{y-7}" width="11" height="14" />')
        g.append(f'<path class="mk-void" d="M{x-3} {y-11} V{y+11}" />')
    elif e["type"] == "correction.issued":
        g.append(f'<path class="mk {c}" d="M{x} {y-11} L{x+11} {y} L{x} {y+11} L{x-11} {y} Z" fill="none"/>')
    elif e["type"] == "correction.applied":
        g.append(f'<path class="mk {c}" d="M{x-10} {y+2} L{x-3} {y+9} L{x+11} {y-9}" fill="none"/>')
    elif fam == "derivative":
        g.append(f'<path class="mk-stem {c}" d="M{x} {y} V{y+30}" />')
        g.append(f'<circle class="mk {c}" cx="{x}" cy="{y+38}" r="7" fill="var(--surface)"/>')
    else:  # documented fallback, never a guessed sign
        g.append(f'<circle class="mk mk-unknown" cx="{x}" cy="{y}" r="9" fill="none"/>')
        g.append(f'<text class="t-note" x="{x}" y="{y+24}" text-anchor="middle">{esc(e["type"])}</text>')
    return "\n".join(g)

def badge(n, x, y):
    return (f'<circle class="badge" cx="{x}" cy="{y}" r="9"/>'
            f'<text class="badge-n" x="{x}" y="{y+3.2}" text-anchor="middle">{n}</text>')

def build_svg():
    s = []
    s.append(f'<svg id="score" viewBox="0 192 {W} 496" role="img" '
             f'aria-label="Score map of encounter {esc(D["encounter_id"])}: 7 ledger events across three lanes; the full event table follows below.">')
    s.append('<defs>'
             '<pattern id="hatch" width="5" height="5" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">'
             '<line x1="0" y1="0" x2="0" y2="5" class="hatch-line"/></pattern>'
             '<marker id="tick" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto">'
             '<path d="M1 1 L7 4 L1 7" fill="none" class="marker-stroke"/></marker>'
             '<marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" orient="auto">'
             '<path d="M1 1 L9 5 L1 9" fill="none" class="marker-stroke"/></marker>'
             '</defs>')

    # graticule: verticals at event slots (recessive chrome)
    for x in EVT_X:
        s.append(f'<path class="grat" d="M{x} {RULER_Y+16} V{LANE_Y["ensemble"]+96}"/>')

    # day ruler (ordinal slots, honest day labels)
    s.append(f'<path class="ruler" d="M{LANE_X0} {RULER_Y} H{ASOF_X}"/>')
    day_first = {}
    for i, e in enumerate(D["events"]):
        day_first.setdefault(e["date"], EVT_X[i])
    for d_, x in day_first.items():
        s.append(f'<path class="ruler" d="M{x} {RULER_Y-6} V{RULER_Y+6}"/>')
        s.append(f'<text class="t-note" x="{x}" y="{RULER_Y-14}" text-anchor="middle">{d_}</text>')
    s.append(f'<path class="ruler" d="M{ASOF_X} {RULER_Y-6} V{RULER_Y+6}"/>')
    s.append(f'<text class="t-note" x="{ASOF_X}" y="{RULER_Y-14}" text-anchor="middle">{D["as_of"]}</text>')
    s.append(f'<text class="t-note t-dim" x="{LANE_X0+2}" y="{RULER_Y+22}">ordinal · ledger order</text>')

    # lanes
    for lane in D["lanes"]:
        y = LANE_Y[lane["id"]]; thin = lane.get("thin")
        s.append(f'<path class="lane {"lane-thin" if thin else ""} pr-{lane["id"]}" d="M{LANE_X0} {y} H{DIV_X-24 if not thin else EVT_X[4]}"/>')
        s.append(f'<text class="t-lane pr-{lane["id"]}" x="{LANE_X0-14}" y="{y-16}" text-anchor="end">{esc(lane["label"])}</text>')
        s.append(f'<text class="t-note t-dim" x="{LANE_X0-14}" y="{y+2}" text-anchor="end">{esc(lane["role"])}</text>')

    # flows -------------------------------------------------------------------
    x1, y1 = EVT_X[0], LANE_Y["meridian"]; x2, y2 = EVT_X[1], LANE_Y["ensemble"]
    s.append(f'<path class="flow flow-down pr-ensemble" marker-end="url(#arrow)" '
             f'd="M{x1+22} {y1+6} C {x1+90} {y1+60}, {x2-80} {y2-70}, {x2-14} {y2-10}"/>')
    s.append(f'<text class="t-note" x="{(x1+x2)//2+14}" y="{(y1+y2)//2-8}">transfer · downstream ↓</text>')
    xc, yc = EVT_X[2], LANE_Y["conductor"]; xa, ya = EVT_X[4], LANE_Y["meridian"]
    s.append(f'<path class="flow flow-up pr-ensemble" d="M{EVT_X[2]} {LANE_Y["ensemble"]-8} V{yc+14}"/>')
    s.append(f'<path class="flow flow-up pr-conductor" marker-end="url(#arrow)" '
             f'd="M{xc+12} {yc-8} C {xc+70} {yc-60}, {xa-90} {ya+64}, {xa-16} {ya+10}"/>')
    s.append(f'<text class="t-note" x="{(xc+xa)//2+2}" y="{(yc+ya)//2+64}">correction · upstream ↑</text>')

    # obligations: sustained hairlines to the as-of edge (label above the line, right end)
    for ob in D["obligations"]:
        y = LANE_Y[ob["lane"]] + 26; x0 = EVT_X[ob["from_evt"]]
        s.append(f'<path class="obl pr-{ob["lane"]}" d="M{x0} {y} H{ASOF_X-6}"/>')
        s.append(f'<text class="t-note t-dim" x="{ASOF_X-12}" y="{y-6}" text-anchor="end">{esc(ob["label"])}</text>')

    # events (glyph + badge + hover/focus target linking into the Akte)
    for i, e in enumerate(D["events"]):
        x = EVT_X[i]; y = LANE_Y[e["lane"]]
        s.append(f'<g class="evt" data-i="{i}" tabindex="0">')
        s.append(glyph(e, x, y))
        if e["station"]:
            bx, by = (x + 24, y - 30) if e["lane"] == "ensemble" else (x - 22, y - 34)
            s.append(badge(e["station"], bx, by))
        s.append(f'<rect class="hit" x="{x-24}" y="{y-30}" width="48" height="{92 if e["type"].startswith("derivative") else 60}" fill="transparent"/>')
        s.append('</g>')

    # divergence terminal: two open rings that never converge
    dv = D["divergence"]; ym, ye = LANE_Y["meridian"], LANE_Y["ensemble"]
    s.append(f'<circle class="ring pr-meridian" cx="{DIV_X}" cy="{ym}" r="10" fill="none"/>')
    s.append(f'<circle class="ring pr-ensemble" cx="{DIV_X}" cy="{ye}" r="10" fill="none"/>')
    s.append(f'<path class="gap" d="M{DIV_X} {ym+26} V{(ym+ye)//2-24} M{DIV_X} {(ym+ye)//2+24} V{ye-26}"/>')
    s.append(badge(dv["station"], DIV_X - 26, (ym+ye)//2 - 44))
    s.append(f'<text class="t-note" x="{DIV_X}" y="{(ym+ye)//2-4}" text-anchor="middle">{esc(dv["closing"])}</text>')
    s.append(f'<text class="t-note t-dim" x="{DIV_X}" y="{(ym+ye)//2+14}" text-anchor="middle">both stand</text>')
    lx = DIV_X - 28
    s.append(f'<text class="t-note t-dim" x="{lx}" y="{ym-58}" text-anchor="end">{esc(dv["left_label"])}</text>')
    s.append(f'<text class="t-quote pr-meridian" x="{lx}" y="{ym-44}" text-anchor="end">'
             f'<tspan x="{lx}" dy="0">“a detector-in-the-accusation observation,</tspan>'
             f'<tspan x="{lx}" dy="14">not court-attributed detector harm”</tspan></text>')
    s.append(f'<text class="t-note t-dim" x="{lx}" y="{ye+42}" text-anchor="end">{esc(dv["right_label"])}</text>')
    s.append(f'<text class="t-quote pr-ensemble" x="{lx}" y="{ye+56}" text-anchor="end">'
             f'<tspan x="{lx}" dy="0">“the University of Minnesota expulsion case as</tspan>'
             f'<tspan x="{lx}" dy="14">detector-attributed harm on the work’s verdict card”</tspan></text>')

    # as-of edge: behind it there is nothing
    s.append(f'<path class="asof" d="M{ASOF_X} {RULER_Y+16} V{LANE_Y["ensemble"]+96}"/>')
    s.append(f'<text class="t-note" transform="rotate(-90 {ASOF_X+16} {LANE_Y["conductor"]})" x="{ASOF_X+16}" y="{LANE_Y["conductor"]}" text-anchor="middle">here ends what the ledger knows</text>')
    s.append('</svg>')
    return "\n".join(s)

# ---------------------------------------------------------------- shared page pieces
def legend_html():
    def mini(body): return f'<svg viewBox="0 0 46 30" class="mini">{body}</svg>'
    signs = [
        (mini('<path class="mk pr-meridian" d="M14 4 V26"/><path class="mk mk-lt pr-meridian" d="M21 4 V26"/><path class="mk pr-meridian" d="M21 15 H33" marker-end="url(#tick)"/>'), "contract.* — threshold: an offer under conditions"),
        (mini('<rect class="mk-fill pr-ensemble" x="15" y="7" width="16" height="16"/>'), "object.* — a work enters, conditions included"),
        (mini('<rect class="mk-hatch pr-ensemble" x="8" y="8" width="11" height="14"/><rect class="mk-hatch pr-ensemble" x="27" y="8" width="11" height="14"/><path class="mk-void" d="M23 4 V26"/>'), "translation.* — declared loss: a designed gap, not an error"),
        (mini('<path class="mk pr-conductor" d="M23 4 L34 15 L23 26 L12 15 Z" fill="none"/>'), "correction.issued — in transit, not yet accepted"),
        (mini('<path class="mk pr-meridian" d="M12 17 L19 24 L34 6" fill="none"/>'), "correction.applied — arrived and worked in"),
        (mini('<path class="mk-stem pr-ensemble" d="M23 2 V16"/><circle class="mk pr-ensemble" cx="23" cy="23" r="6" fill="var(--surface)"/>'), "derivative.* — offspring on a stem"),
        (mini('<circle class="mk mk-unknown" cx="23" cy="15" r="9" fill="none"/>'), "unknown family — documented fallback, never guessed"),
    ]
    flows = [
        (mini('<path class="flow flow-down pr-ensemble" d="M6 6 C 18 26, 30 26, 40 8" marker-end="url(#arrow)"/>'), "downstream ↓ — transfer, source to receiver"),
        (mini('<path class="flow flow-up pr-conductor" d="M6 24 C 18 4, 30 4, 40 22" marker-end="url(#arrow)"/>'), "upstream ↑ — correction against the stream"),
        (mini('<path class="obl pr-meridian" d="M4 15 H42"/>'), "obligation — sustained until the as-of edge"),
        (mini('<circle class="ring pr-meridian" cx="14" cy="15" r="7" fill="none"/><circle class="ring pr-ensemble" cx="34" cy="15" r="7" fill="none"/>'), "divergence — open rings that never converge"),
    ]
    row = lambda m, t: f'<div class="lg-row">{m}<span>{esc(t)}</span></div>'
    return f'''
<aside class="legend" aria-label="Map key">
  <div class="lg-col"><h3>Practices</h3>
    <div class="lg-row"><i class="sw pr-meridian"></i><span>Meridian — source · scientific research practice</span></div>
    <div class="lg-row"><i class="sw pr-ensemble"></i><span>Ensemble — receiver · artistic research and practice</span></div>
    <div class="lg-row"><i class="sw pr-conductor"></i><span>Conductor — transport only, authors nothing</span></div>
    <div class="lg-row"><i class="sw pr-ulysses"></i><span>{esc(D["non_relation"])}</span></div>
  </div>
  <div class="lg-col"><h3>Signs</h3>{''.join(row(m,t) for m,t in signs)}</div>
  <div class="lg-col"><h3>Currents</h3>{''.join(row(m,t) for m,t in flows)}
    <p class="lg-note">Narrative badges ①–⑥ give the telling's order; the map keeps the ledger's.
    Same ledger ⇒ same map, byte for byte. No force layout, no randomness, no clock.</p>
  </div>
</aside>'''

def table_html():
    rows = "".join(
        f'<tr><td>{i+1}</td><td class="mono">{esc(e["id"])}</td><td>{esc(e["type"])}</td>'
        f'<td>{esc(e["date"])}</td><td>{esc(e["attribution"] if e.get("infra") else e["lane"])}</td>'
        f'<td class="q">“{esc(e["quote"])}”</td></tr>'
        for i, e in enumerate(D["events"]))
    return f'''
<section class="record" aria-label="Event table (register extract)">
<h2>Register extract — the same seven events, as a table</h2>
<div class="tbl-wrap"><table>
<thead><tr><th>#</th><th>event</th><th>type</th><th>date</th><th>issuer</th><th>verbatim quote</th></tr></thead>
<tbody>{rows}</tbody></table></div>
</section>'''

TOOLTIP_JS = """
<script type="application/json" id="evts">%s</script>
<script>
(function(){
  var evts = JSON.parse(document.getElementById('evts').textContent);
  var tip = document.getElementById('tip');
  function show(g, ev){
    var e = evts[+g.dataset.i];
    tip.innerHTML = '<b>'+e.type+'</b><br><span class="tid">'+e.id+'</span><br>'+
      e.date+' · '+(e.infra ? 'studio-integrate (infrastructure)' : e.lane)+
      '<hr>“'+e.quote+'”<br><i>— '+e.attribution+'</i>';
    tip.hidden = false;
    var r = g.getBoundingClientRect(), tw = tip.offsetWidth;
    var x = Math.min(Math.max(8, r.left + r.width/2 - tw/2), innerWidth - tw - 8);
    tip.style.left = x + 'px';
    tip.style.top = (r.top + scrollY - tip.offsetHeight - 10) + 'px';
  }
  document.querySelectorAll('.evt').forEach(function(g){
    g.addEventListener('mouseenter', function(ev){ show(g, ev); });
    g.addEventListener('focus', function(ev){ show(g, ev); });
    g.addEventListener('mouseleave', function(){ tip.hidden = true; });
    g.addEventListener('blur', function(){ tip.hidden = true; });
  });
})();
</script>""" % json.dumps(D["events"])

# ---------------------------------------------------------------- variants (skins)
BASE_CSS = """
*{box-sizing:border-box;margin:0}
body{background:var(--page);color:var(--ink);font-family:var(--font-ui);-webkit-font-smoothing:antialiased}
.wrap{max-width:1520px;margin:0 auto;padding:34px 40px 60px;background:var(--surface)}
.kicker{font-family:var(--font-record);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-2);display:flex;gap:1.4em;flex-wrap:wrap}
.kicker .chip{border:1px solid var(--hairline);padding:1px 8px;border-radius:2px;color:var(--ink-2)}
h1{font-family:var(--font-display);font-size:clamp(34px,4.6vw,64px);line-height:1.04;letter-spacing:var(--h1-track);margin:.45em 0 .2em;max-width:22ch;font-weight:var(--h1-weight)}
.status{font-family:var(--font-record);font-size:14px;color:var(--ink-2)}
.status b{color:var(--ink);font-weight:600}
figure{margin:26px 0 8px}
svg#score{width:100%;height:auto;display:block}
/* --- grammar strokes (shared; colors via practice classes) --- */
.pr-meridian{--pr:var(--c-meridian)} .pr-ensemble{--pr:var(--c-ensemble)}
.pr-conductor{--pr:var(--c-conductor)} .pr-ulysses{--pr:var(--c-ulysses)} .pr-infra{--pr:var(--c-conductor)}
.lane{stroke:var(--pr);stroke-width:2;opacity:.92}
.lane-thin{stroke-width:1;stroke-dasharray:1 5;opacity:.75}
.mk{stroke:var(--pr);stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}
.mk-lt{opacity:.45;stroke-width:1.4}
.mk-fill{fill:var(--pr)}
.mk-hatch{fill:url(#hatch);stroke:var(--pr);stroke-width:1.1}
.hatch-line{stroke:var(--ink-2);stroke-width:1.1}
.mk-void{stroke:var(--ink-2);stroke-width:1;stroke-dasharray:2 4;opacity:.8}
.mk-stem{stroke:var(--pr);stroke-width:1.2;opacity:.85}
.mk-unknown{stroke:var(--ink-2);stroke-dasharray:2 3}
.flow{fill:none;stroke:var(--pr);stroke-width:1.8}
.flow-up{stroke-dasharray:6 5}
.obl{stroke:var(--pr);stroke-width:.9;opacity:.6;stroke-dasharray:1 4}
.ring{stroke:var(--pr);stroke-width:2.2}
.gap{stroke:var(--ink-2);stroke-width:1;stroke-dasharray:3 5}
.asof{stroke:var(--ink-2);stroke-width:1.4}
.ruler{stroke:var(--ink-2);stroke-width:1;opacity:.9}
.grat{stroke:var(--hairline);stroke-width:1}
.marker-stroke{stroke:var(--ink-2);stroke-width:1.6}
.badge{fill:var(--badge-bg);stroke:var(--hairline)} .badge-n{font:600 10.5px var(--font-record);fill:var(--ink)}
text{fill:var(--ink)}
.t-lane{font:600 13px var(--font-record);letter-spacing:.12em;fill:var(--ink)}
.t-note{font:11.5px var(--font-record);fill:var(--ink-2)}
.t-dim{opacity:.75}
.t-quote{font:italic 11.5px var(--font-display);fill:var(--ink-2)}
.evt{cursor:pointer;outline:none}
.evt:hover .mk,.evt:focus .mk{stroke-width:3}
.evt:focus .hit{stroke:var(--ink-2);stroke-dasharray:2 3}
/* legend + table */
.legend{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:26px;border-top:1px solid var(--hairline);border-bottom:1px solid var(--hairline);padding:20px 0;margin:14px 0 26px}
.legend h3{font:600 11px var(--font-record);letter-spacing:.16em;text-transform:uppercase;color:var(--ink-2);margin-bottom:10px}
.lg-row{display:flex;gap:10px;align-items:center;margin:5px 0;font:12.5px var(--font-record);color:var(--ink-2)}
.mini{width:46px;height:30px;flex:none}
.sw{width:22px;height:8px;background:var(--pr);flex:none;border-radius:1px}
.lg-note{font:11.5px var(--font-record);color:var(--ink-2);margin-top:12px;max-width:44ch;opacity:.85}
.record h2{font:600 13px var(--font-record);letter-spacing:.12em;text-transform:uppercase;color:var(--ink-2);margin:8px 0 10px}
.tbl-wrap{overflow-x:auto}
table{border-collapse:collapse;width:100%;font:12.5px var(--font-record)}
th{text-align:left;font-weight:600;color:var(--ink-2);letter-spacing:.06em}
th,td{border-top:1px solid var(--hairline);padding:7px 14px 7px 0;vertical-align:top}
td.mono{white-space:nowrap;color:var(--ink-2)} td.q{font-style:italic;max-width:52ch}
footer{margin-top:26px;font:11.5px var(--font-record);color:var(--ink-2);display:flex;justify-content:space-between;gap:2em;flex-wrap:wrap}
#tip{position:absolute;max-width:360px;background:var(--tip-bg);color:var(--tip-ink);border:1px solid var(--hairline);padding:10px 12px;font:12.5px var(--font-record);line-height:1.45;pointer-events:none;box-shadow:0 6px 24px rgba(0,0,0,.25)}
#tip hr{border:none;border-top:1px solid var(--hairline);margin:6px 0}
#tip .tid{opacity:.7} #tip i{opacity:.8}
@media (prefers-reduced-motion: reduce){*{transition:none!important;animation:none!important}}
"""

VARIANTS = {
    "a-observatorium": {
        "title": "Variante A — Observatorium",
        "note": "dark canvas · instrument calm · the ZKM projection candidate · light/dark/auto",
        "css": """
:root{--font-ui:system-ui,-apple-system,"Segoe UI",sans-serif;--font-display:var(--font-ui);
--font-record:ui-monospace,"SF Mono",Menlo,monospace;--h1-track:-0.022em;--h1-weight:650}
/* resolved theme is ALWAYS set on <html> by the head controller (site convention, Base.astro) */
:root[data-theme="dark"]{--page:#0b0d11;--surface:#101318;--ink:#e8ebef;--ink-2:#98a2ad;
--hairline:#232a33;--c-meridian:#3987e5;--c-ensemble:#d95926;--c-conductor:#77828d;
--c-ulysses:#9085e9;--badge-bg:#181d24;--tip-bg:#161b22;--tip-ink:#e8ebef;--h1-ink:#f4f6f8}
:root[data-theme="light"]{--page:#e9edf2;--surface:#f4f6f9;--ink:#16191d;--ink-2:#5b6672;
--hairline:#d5dbe2;--c-meridian:#2a78d6;--c-ensemble:#c1481c;--c-conductor:#6b7684;
--c-ulysses:#4a3aa7;--badge-bg:#e7ebf0;--tip-bg:#ffffff;--tip-ink:#16191d;--h1-ink:#0d1013}
.wrap{border:1px solid var(--hairline)}
h1{color:var(--h1-ink)}
.theme-toggle{position:absolute;top:26px;right:34px;width:34px;height:34px;display:flex;
align-items:center;justify-content:center;background:none;border:1px solid var(--hairline);
border-radius:6px;color:var(--ink-2);cursor:pointer}
.theme-toggle:hover{color:var(--ink)}
.theme-toggle svg{display:none}
:root[data-theme-mode="auto"] .theme-toggle .i-auto{display:block}
:root[data-theme-mode="light"] .theme-toggle .i-sun{display:block}
:root[data-theme-mode="dark"] .theme-toggle .i-moon{display:block}
.wrap{position:relative}
""",
        "theme": True,
    },
    "b-kartenwerk": {
        "title": "Variante B — Kartenwerk",
        "note": "paper · print forensics · the Calculating-Empires gesture",
        "css": """
:root{--page:#ece7dd;--surface:#f7f4ee;--ink:#1a1712;--ink-2:#5f594e;--hairline:#d8d2c4;
--c-meridian:#2a78d6;--c-ensemble:#c1481c;--c-conductor:#7a7468;--c-ulysses:#4a3aa7;
--badge-bg:#efeadf;--tip-bg:#fffdf8;--tip-ink:#1a1712;
--font-ui:"Iowan Old Style",Georgia,serif;--font-display:"Iowan Old Style",Georgia,serif;
--font-record:ui-monospace,"SF Mono",Menlo,monospace;--h1-track:-0.008em;--h1-weight:600}
.wrap{outline:1px solid var(--ink-2);outline-offset:-14px;border:1px solid var(--ink-2);padding:48px 54px 66px}
.kicker{color:var(--ink-2)}
h1{font-style:italic}
""",
    },
    "c-konsole": {
        "title": "Variante C — Konsole",
        "note": "strict monospace grid · survives a TTY",
        "css": """
:root{--page:#08090b;--surface:#0c0e10;--ink:#d6dbd6;--ink-2:#7f8b84;--hairline:#1e2422;
--c-meridian:#3987e5;--c-ensemble:#d95926;--c-conductor:#6f7a74;--c-ulysses:#9085e9;
--badge-bg:#12161a;--tip-bg:#10141a;--tip-ink:#d6dbd6;
--font-ui:ui-monospace,"SF Mono",Menlo,monospace;--font-display:var(--font-ui);
--font-record:var(--font-ui);--h1-track:-0.01em;--h1-weight:600}
.wrap{border:1px solid var(--ink-2)}
h1{max-width:30ch;font-size:clamp(28px,3.6vw,46px)}
h1::after{content:"▌";color:var(--ink-2);margin-left:.12em}
.prompt{font:13px var(--font-record);color:var(--ink-2);margin-bottom:14px}
.prompt b{color:var(--ink);font-weight:600}
footer{border-top:1px solid var(--hairline);padding-top:10px}
""",
        "prompt": '<p class="prompt"><b>middle</b> map enc-2026-001 --lens transfer --as-of 2026-07-14 <span style="opacity:.6"># deterministic · same ledger, same map</span></p>',
    },
}

THEME_HEAD = """
<script>
// Site convention (frankbueltge.de Base.astro): localStorage 'theme' = explicit override
// ('light'|'dark'), absent = auto (follow OS). <html> ALWAYS carries the resolved
// data-theme and the data-theme-mode (auto/light/dark) for the toggle icon.
(function(){
  var root = document.documentElement;
  function readMode(){ try { return localStorage.getItem('theme') || 'auto' } catch(e){ return 'auto' } }
  function resolve(m){ return m === 'auto' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : m }
  function apply(m){ root.setAttribute('data-theme', resolve(m)); root.setAttribute('data-theme-mode', m); }
  apply(readMode());
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(){
    if (readMode() === 'auto') apply('auto');
  });
  window.__cycleTheme = function(){
    var order = ['auto','light','dark'];
    var next = order[(order.indexOf(readMode()) + 1) % order.length];
    try { next === 'auto' ? localStorage.removeItem('theme') : localStorage.setItem('theme', next) } catch(e){}
    apply(next);
  };
})();
</script>"""

TOGGLE_BTN = """
<button class="theme-toggle" data-theme-toggle aria-label="Theme: auto / light / dark" title="Theme: auto / light / dark" onclick="__cycleTheme()">
  <svg class="i-auto" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/></svg>
  <svg class="i-sun" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4l1.4-1.4M18 6l1.4-1.4"/></svg>
  <svg class="i-moon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 14.2A8.2 8.2 0 1 1 9.8 3.4a6.8 6.8 0 1 0 10.8 10.8z"/></svg>
</button>"""

def page(key, v, svg):
    prompt = v.get("prompt", "")
    themed = v.get("theme", False)
    head_extra = THEME_HEAD if themed else ""
    toggle = TOGGLE_BTN if themed else ""
    html_attrs = ' data-theme="dark" data-theme-mode="auto"' if themed else ""
    return f"""<!doctype html>
<html lang="en"{html_attrs}><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(v['title'])} — The Middle · {esc(D['encounter_id'])}</title>
{head_extra}<style>{v['css']}{BASE_CSS}</style></head>
<body>
<div class="wrap">
  {toggle}{prompt}
  <p class="kicker"><span>The Middle · contact zone record</span><span>{esc(D['encounter_id'])}</span>
  <span>as of {esc(D['as_of'])}</span><span class="chip">wording approved · 2026-07-15</span></p>
  <h1>{esc(D['headline'])}</h1>
  <p class="status"><b>{esc(D['status'])}</b> · 7 ledger events · 3 lanes · 2 obligations active · 1 designed non-relation</p>
  <figure>{svg}</figure>
  {legend_html()}
  {table_html()}
  <footer>
    <span>deterministic projection of the encounter ledger · generated from fixture data, research-ecology @{SHA} · no timestamp beyond the data's own</span>
    <span>{esc(D['approval'])}</span>
  </footer>
</div>
<div id="tip" hidden></div>
{TOOLTIP_JS}
</body></html>"""

OUT.mkdir(parents=True, exist_ok=True)
svg = build_svg()
for key, v in VARIANTS.items():
    (OUT / f"{key}.html").write_text(page(key, v, svg))
    print("wrote", OUT / f"{key}.html")
