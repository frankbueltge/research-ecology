# fixtures/ — the encounter ledger (archived 2026-10-05)

**Archived as of 2026-10-05.** The encounter fixtures (`enc-*`) and the joint-inquiry dossiers
(`ji-*`) are kept here unchanged as the record they were. They are no longer written, and the Middle
Scribe routine that wrote them is retired.

Why: the ledger mostly tracked data-snack's failing cook automation (`enc-2026-004`), not what the
three practices do with each other; since the ecology's v3 rebuild (2026-08-30) it ignored their
collaboration; its nightly runs stranded on branches nothing merged; and on 2026-10-04 a run failed
because the private data-snack repository could not be cloned.

What replaces it: The Middle is now a relay desk. `relay/relay.json` (contract `middle-relay/1`,
see `relay/README.md`) records every cross-reference between the practices and the handoffs they
have offered each other, each with evidence refs. Decision record:
[`docs/2026-10-05-middle-becomes-relay.md`](../docs/2026-10-05-middle-becomes-relay.md).

The site's `/encounters` register still reads these directories, so nothing here is moved or
deleted. `practice-profiles/` is not part of the ledger and is unaffected.
