# Briefings — what the world is pressing on, before every convening

*Since 2026-10-25 (architect's decision, wording private; the amendment of that date in the three
constitutions).* Before the practices propose the next cycle's question, one research session of the
Middle writes a briefing here. The practices propose only from it. The aim is questions that meet
research and matters of public concern now, instead of questions that grow out of the last cycle.

## When, and who

*Since 2026-11-01 (architect's decision, wording private; on the site `docs/design/2026-11-01-the-checked-briefing.md`).*
On that day every claim of the briefing after cycle 011 was read against its source, and 27 of 69 failed.
A briefing now passes through two sessions.

- A routine runs at 11:47, 13:47, 17:47 and 19:47 Berlin time and does something only when the site's
  [`cycle.json`](https://raw.githubusercontent.com/frankbueltge/frankbueltge.de/main/src/data/ecology/cycle.json)
  is in the phase `convening` and its convening block carries no `briefing` yet.
- **The first session writes a draft:** `briefings/drafts/after-cycle-NNN.md` and `.json` (NNN =
  `convening.after_cycle`, three digits). A draft is nobody's to read.
- **The next run is a new session and knows nothing of the first.** It finds the draft, reads every claim
  against its source, corrects or drops what fails, and moves both files to `briefings/`. Only then does
  it link the briefing in `cycle.json` as
  `"briefing": { "url": "<the .md on github.com>", "fallback": "<the first matter of Urgent but quiet, as a question>" }`.
- The practices' first convening sessions run the night after. A session that finds no briefing linked
  does not propose.
- The site reads the `.json`: a workflow turns it into a round of Third Reading, a round of Ducking and new
  seeds on Common Ground's watchlist, without a hand.

*While a programme runs (since 2026-11-08, evening; architect's decision, wording private):* the briefing is
still written and checked at every convening, under the title "The world beside the programme", but the
practices propose the next step of the programme from `../programme/STATE.md`, not from the briefing. Its
work is to keep the map current, and with it what the site reads from it.

## Sources, in four layers

Every figure or date comes from a page the session opened, and is linked beside the sentence. A
search result alone is not a source.

- **The original first.** A figure comes from the body that made it wherever that body publishes it:
  the agency, the institute, the study, the report. A newspaper, a trade site or Wikipedia is a lead to
  the original, and is cited only where the original cannot be reached, marked as a report.
- **Every figure says when.** Give the date it is true of. A state of affairs ("no ship has passed") is
  a report of its day. Before writing it in the present, look for what has happened since.
- **Keep the source's strength.** "Could" stays "could", a scenario stays a scenario, an estimate stays an
  estimate, an average of monitored populations stays that. A title claims no more than its sources.
- **A fetch can be old or wrong.** WebFetch answers through a small model and can serve an old copy of a
  page. For a figure, ask for the sentence it stands in, and check the page's own date. If a page fails
  or looks old, fetch it with curl and read the text yourself. What cannot be opened is not confirmed.

1. **The map** — for each of the thirteen fields, the newest editions of its sources in
   [`MAP.md`](MAP.md). This is the fixed reading list: a field is read whether or not anything
   happened in it.
2. **Rankings** — the current editions of the WEF Global Risks Report, the UN SDG Report, 80,000 Hours'
   list of problems, the IRC Emergency Watchlist and Ipsos *What Worries the World*. Each has its
   standpoint, so none of them decides. Read them across the map: what do they put high that this
   briefing leaves out?
3. **Current research** — news sections of Nature and Science, widely discussed recent preprints,
   and summits or conferences in the coming weeks.
4. **Attention** — Common Ground on the site, counted by the house's one rule, never by hand. Write the
   matters and their terms into the draft's `.json`, then in frankbueltge.de run
   `npm run briefing:attention -- <path to the .json>` and copy the table into the briefing. The script
   gives each matter its signals and converged days in the thirty days to the briefing, and one word:
   **loud** (it converged), **quiet** (ten signals or more), **absent** (fewer). The terms are wide on
   purpose, and the same terms feed Third Reading and Ducking, so a number means the same in all three.
   The script also counts the thirteen fields, whose `signals` the map copies. Common Ground is a set of
   public charts, not the world's press: about a third encyclopaedia pages and a quarter developer
   platforms. Quiet means quiet in these charts. Since the day file of 2026-11-02 it reads ten English
   editions of Google News instead of one, so a word after that date does not compare with one before it.

## What a briefing holds (at most 135 lines before the section Checked, English)

A header with the date and the method of the attention count, then **The map**: a table of the thirteen
fields of [`MAP.md`](MAP.md), in that order, each row saying where the field stands (a dated figure from
the original source, linked), its direction and its signals. A field without news still has its row.
A direction is only what the source's own comparison shows: worse, better, steady, or unclear where it
offers none on the same definition.

Then **eight to twelve matters**, taken from the map. A matter can be an event or a state: that hundreds
of millions live in extreme poverty is a matter as much as an outbreak is. Each belongs to one field. At
most two matters per field, and a field that had no matter in either of the last two briefings has to
have one now. `npm run briefing:check` holds a briefing to this. For each matter:

- what is happening, dated and sourced (two or three sentences);
- why it is urgent, after which source;
- the open research question, as the field states it;
- open data to work with;
- its attention in Common Ground, with the numbers.

It ends with **Urgent but quiet**: the matters most urgent by the expert sources and least attended
in Common Ground, best first. The first of them is the convening's fallback.

## The data file

Beside `after-cycle-NNN.md` stands `after-cycle-NNN.json`, the same matters as data, contract `briefing/2`.
The rules are in the site's `src/lib/briefing/briefing.ts` and `map.ts`; `npm run briefing:check -- <file>`
in frankbueltge.de says what is wrong with it. `after-cycle-011.json` is the model for the matters, under
`briefing/1`, and [`map-2026-11-01.json`](map-2026-11-01.json) for the map. For each matter:

- `id`: a stable slug, the same when a matter returns; `title`, and `short` (28 characters at most);
- `field`: its field on the map;
- `gist`: one line for Third Reading, which never gives away a figure an estimate asks for and never says
  how loud the web was;
- `quiet_rank`: its place in Urgent but quiet, or null; `terms`, and `exclude` for a term's false friends;
- `lines`: two to six short sentences a voice reads, each a fact with its date. `text` is what is shown.
  `say` is what is spoken wherever `text` holds a digit, with every number written out;
- `sources`: each with `label`, `url` and `kind`, `primary` or `report`. Every matter has a primary source.

And for the whole: `map`, thirteen lines in the order of the map, each with `field`, `state` (at most 280
characters, holding a dated figure), `as_of` (the date that figure is true of: YYYY, YYYY-MM or YYYY-MM-DD,
at most two years back), `direction`, `compared_with` (the earlier value and date the direction rests on),
`signals`, `lines` (the state for a voice on Ducking's desk, one to three sentences, each with `text` and,
wherever it holds a digit, `say` with every number written out) and `sources` with a primary one; five
`estimates` for Third Reading, each a figure a reader can
guess, with its source and the date in its question; the `fallback`; and `checked`, which only the second
session writes.

## How a claim is checked

The second session did not write the briefing and owes it nothing. It lists every figure, date and
factual statement, in the text and in the data, opens the source of each, and gives each one word:

- **Held:** the source says this.
- **Corrected:** the source says something else, or something newer, or something weaker. Write what the
  source says, and link the original if the draft linked a report.
- **Dropped:** the source does not say it and no other page does. It goes.

**Three more readings, since 2026-11-13** (architect's order after a review of the ecology, wording private).
A claim can agree with its source and still mislead: the state after the programme's first step held three such
claims, each true to the work it came from. The second session therefore also reads

- **the claims against each other.** Two figures for the same thing cannot both be held. One is corrected, or
  the text says why they differ: another denominator, another date, another list.
- **the source's own caveat.** Where a source limits a figure (what it counts, from when, how sure it is), the
  limit travels with the figure. A comparison across a change in what is counted is cut to the span that
  compares, or says what changed.
- **the critique on record.** Where a sibling's critique, a correction or a declined offer contradicts or limits
  a claim, the claim is held only as far as that leaves it, and the critique is linked.

Each of these is a correction like any other and gets its line under **Checked**.

The thirteen lines of the map are claims like any other. A claim that cannot be confirmed is not confirmed.
If a title or a matter rested on a claim that falls, the title changes or the matter goes. It also reads
**Urgent but quiet** against the newest lists of neglected crises named in [`MAP.md`](MAP.md), and names a
crisis high on them that the briefing leaves out, with the reason. Then, at the end of the briefing, a
section **Checked**: the count, and one line for every change. If fewer than eight matters survive, the session opens an issue, links nothing, and
the convening's clock takes its course.

## What a briefing is not

It proposes no cycle question and ranks no proposal: that stays the practices' and the relay's. And a
mirror does not leave out what was just looked at: the subject of a recent cycle stands here like any
other, saying what has moved. It is the proposals that may not repeat it. No quotes from the architect's
messages.
