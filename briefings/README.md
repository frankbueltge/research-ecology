# Briefings — what the world is pressing on, before every convening

*Since 2026-10-25 (architect's decision, wording private; the amendment of that date in the three
constitutions).* Before the practices propose the next cycle's question, one research session of the
Middle writes a briefing here. The practices propose only from it. The aim is questions that meet
research and matters of public concern now, instead of questions that grow out of the last cycle.

## When, and who

- A routine runs daily at 08:00 UTC and does something only when the site's
  [`cycle.json`](https://raw.githubusercontent.com/frankbueltge/frankbueltge.de/main/src/data/ecology/cycle.json)
  is in the phase `convening` and its convening block carries no `briefing` yet.
- It writes `after-cycle-NNN.md` here (NNN = `convening.after_cycle`, three digits), unless that file
  already stands, and then links it in `cycle.json` as
  `"briefing": { "url": "<this file on github.com>", "fallback": "<the first matter of Urgent but quiet, as a question>" }`.
- The practices' first convening sessions run the night after. A session that finds no briefing linked
  does not propose.

## Sources, in three layers

Every figure or date comes from a page the session opened, and is linked beside the sentence. A
search result alone is not a source.

1. **Expert agendas** — the current editions of: WEF Global Risks Report; Crisis Group CrisisWatch
   (monthly); Copernicus climate bulletins (monthly); IMF World Economic Outlook; FAO–WFP Hunger
   Hotspots and the FAO Food Price Index; WHO disease outbreak news; International AI Safety Report;
   Stanford AI Index; UN reports (SDG Report, UNEP, UNHCR).
2. **Current research** — news sections of Nature and Science, widely discussed recent preprints,
   and summits or conferences in the coming weeks.
3. **Attention** — Common Ground on the site (`src/data/trending/<date>.json`, the last 30 day
   files, and the arcs in `src/data/trending/terms/`). For each matter count the days it was one of
   the day's cross-platform topics ("converged") and its matches in the day files' signals
   ("mentions"). **Loud**: it converged. **Quiet**: mentions, no convergence. **Absent**: near zero.
   Say how the matching was done.

## What a briefing holds (at most 120 lines, English)

A header with the date and the method of the attention count, then **eight to twelve matters**
spread over these fields: geopolitics and conflict, AI, climate and environment, the world economy
and inequality, health and food, democracy and information. For each matter:

- what is happening, dated and sourced (two or three sentences);
- why it is urgent, after which source;
- the open research question, as the field states it;
- open data to work with;
- its attention in Common Ground, with the numbers.

It ends with **Urgent but quiet**: the matters most urgent by the expert sources and least attended
in Common Ground, best first. The first of them is the convening's fallback.

## What a briefing is not

It proposes no cycle question and ranks no proposal: that stays the practices' and the relay's. It
does not repeat the subject of the two cycles before it as a matter unless the world has moved on it
since, and then says what moved. No quotes from the architect's messages.
