# First Things First

A single-file weekly planner and time tracker, built for someone running a full-time
job alongside contract work, research, and graduate-school applications — where the
problem is not a missing to-do list but no honest picture of where the week went.

The design premise: a week has a **shape**, not a queue. You set a repeating rhythm
once, tick the blocks you actually kept, and on Saturday the app tells you where the
hours really landed against what you planned.

## What it does

| View | Purpose |
|---|---|
| **Today** | The day as a timeline with a live "now" marker. One tap on a block logs its planned minutes to the right track. Daily checks with streaks, a stopwatch, a reading-plan pacer, and the three tasks that actually have to move. |
| **The week** | The full Mon–Sun rhythm plus the immovable commitments everything else bends around. Sunday holds nothing. |
| **Tracks** | Eleven tracks grouped into four domains. Each shows logged-vs-planned-vs-target for the week and one named next action. |
| **Backlog** | Everything being carried, with track, due date, estimate, and priority. Totals convert to "about N evenings of deep work" so the list stops lying about capacity. |
| **Time log** | Per-day entries for the week, with manual entry and week-by-week paging. |
| **Weekly report** | Hours by track against the planned mark, a hit/due grid for the daily checks, plan adherence, energy, and a written read of what the week is telling you. |
| **Setup** | Weekly hour targets, reading-plan position, the rhythm itself as editable JSON, and full export/import. |

### Four domains

Tracks roll up into four domains, each with its own hue: **God**, **Paid work**,
**The PhD build**, **Life & body**. The categorical palette was validated for
lightness band, chroma floor, colorblind separation, and contrast against both the
light and dark chart surfaces; every bar is also directly labeled, so identity is
never carried by color alone. A table view of the same numbers is one click away.

## Running it

No build step, no dependencies, no server.

```sh
node build-local.mjs   # wraps app.html into a standalone index.html
open index.html
```

`app.html` is the source of truth — a body fragment so the same file can be published
as a hosted page. `build-local.mjs` wraps it in a document skeleton for filesystem use.
`index.html` is generated and not committed.

## Data

All state is local. Nothing is sent anywhere, and there is no account, no analytics,
and no telemetry.

`Store` in `app.html` is a two-mode adapter: it uses the host page's document store
when one is granted, and `localStorage` otherwise. The same five paths either way:

```
app/config      rhythm, tracks, weekly targets, habits, reading plan
app/tasks       the backlog
app/checks      { habitId: { "YYYY-MM-DD": 1 } }  — drives streaks and the report grid
app/timer       the running stopwatch, so a reload doesn't lose it
logs/<ISO week> { entries: [...], days: { "YYYY-MM-DD": { blocks, one, note, energy } } }
```

One document per ISO week keeps the weekly report a single read and bounds growth to
~52 documents a year. Writes are debounced and last-writer-wins; nothing here needs
transactions.

**Setup → Export everything** writes a JSON backup of the config, backlog, checks, and
the last 26 weeks. Import restores it. Do that before clearing browser data.

## Structure

`app.html` is deliberately one file, in reading order:

1. Seed configuration — domains, tracks, the weekly rhythm, habits, starting backlog
2. Date helpers — ISO week keys, minute math, 12-hour formatting
3. `Store` — the persistence adapter
4. `S` — in-memory state, with debounced per-path savers
5. One `view*()` function per tab, each returning an HTML string
6. `wire()` — event binding, re-run after every render

Rendering is full-redraw on every change. At this data size that is faster to reason
about than any diffing, and it removes a whole class of stale-view bugs.

## Accessibility and theming

Three theme states are handled: explicit light, explicit dark, and the unstamped
system default, all driven from one token set defined on bare `:root`. Every control
has a visible focus ring and an accessible label; toggles use `aria-pressed`; motion
respects `prefers-reduced-motion`; numeric columns use tabular figures.

## License

MIT
