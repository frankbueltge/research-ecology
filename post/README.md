# The address book: where a work may be sent

*Kept since 2026-11-14, on the architect's decision of that day (his wording private). The rule for
when a practice writes a letter stands in the three constitutions, section 8. The site's side
(how a letter is sent and recorded) stands in the site repository,
`docs/design/2026-11-14-the-post-office-sends.md` and `docs/post-office/packet-convention.md`.*

**Why.** The practices' works reach nobody unless they are put before someone with a reason to
look. The post office was built for that in July, and from 2026-08-30 to 2026-11-14 no practice
used it; of the nine letters in its ledger none had left. One reason is that a practice does not
know where a letter could be heard. This folder holds that knowledge, dated.

## What an entry is

A receiver that publishes, on its own site, a channel for outside work of this kind: a submission
form, a tips or pitches address, an open call, a contact for uses of its data or for corrections.
A general customer contact is not such a channel. A private person is never a receiver, and a
named person's address is never written here: where a publication names an editor as its channel,
the entry gives the page that says so.

`addressees.json` (contract `post-addressees/1`) holds the entries. Each has:

| field | what it holds |
|---|---|
| `name`, `home`, `kind` | the receiver; `source` (a holder of data or a research organisation with a stake), `outlet`, `call` (with a deadline) or `newsroom` |
| `standing` | `open` · `disclose` (machine-made work is admitted when it is declared) · `not-now` (a call that is closed or not yet published) · `weak` (a channel exists, the fit is poor) · `closed-to-machine-work` (the receiver refuses machine-written work: do not write) |
| `channel`, `channel_type`, `channel_page` | the address or form as published, and the receiver's own page where it was read |
| `takes` | what the receiver says it accepts |
| `machine_made` | what it says about AI-generated or machine-made work, with the page; or "nothing stated" |
| `deadline`, `cost`, `language` | as stated by the receiver |
| `fits`, `caveat` | which kind of work could suit, and what makes the address weak or risky |
| `checked`, `recheck`, `read_by` | the day the channel page was read, the day it is due again, and how it was read |

`unread` lists receivers that were looked for and could not be read (a page that refused the
reader, a channel that was not found). They are not entries. They are kept so the next reading
knows where to try again.

## What the first reading found (2026-11-14)

Four readers looked at about seventy-five receivers. Twenty-nine publish a channel; eleven of those
stand `open`. Three things are worth knowing before a letter is written:

- **Data holders rarely ask to hear.** Of seventeen sources and research organisations, four
  publish a channel that fits, and none keeps a list of work built on its data. A letter to a data
  holder is a courtesy with a correction or a finding in it, not an entry in a showcase.
- **Many newsrooms refuse machine-written work**, in so many words. They stand in the book so that
  nobody writes to them.
- **Calls have dates.** The open ones on 2026-11-14 are few, and each closes.

The first reading went through a page reader that summarises. An entry's quotation and address are
therefore re-read on the receiver's live page before the first letter goes there (see below).

## Who keeps it

**The Middle**, in the session that writes the state of a step (`programme/README.md`, section 2):

1. Re-read the channel page of at most five entries, those whose `recheck` day has come, oldest
   first. Correct what changed, set `checked` to the day and `recheck` one to three months on (a
   call: two weeks before its deadline, and again when the next call is due). An entry whose
   channel is gone becomes `not-now` with the reason, or moves to `unread`.
2. Try at most three receivers of `unread` again. One that can now be read becomes an entry.
3. Add at most two new receivers, and only ones a practice named in a `For whom:` line or a packet
   since the last step, or that hold data a work of the step used.
4. Land the file in the same pull request as the state. Nothing here is sent, and nobody is
   contacted to find a channel.

**A practice** reads the book when it writes `For whom:` in a score and when it writes a packet.
It may name a receiver the book does not hold: then the packet's `receiver_channel` gives the
receiver's own page that publishes the channel, read in that session, and the Middle takes the
receiver into the book at the next step. A practice never edits this folder.

**Before a letter is written to a receiver**, the practice opens the entry's `channel_page` again
in that session. If the page no longer says what the entry says, no packet is written, and the
bulletin offers the Middle the correction.

## What the book is not

It is not a mailing list. No letter goes to more than one receiver, no receiver gets a second
letter about the same work, and nothing goes to a receiver that stands `closed-to-machine-work`,
`not-now` or `weak` unless the packet says what changed. Sending is the architect's act, from his
own address: a practice writes a letter, the site hands it to him finished, and he sends it or
does not.
