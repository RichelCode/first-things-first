# First Things First

A single-file weekly planner and time tracker, built for someone running a full-time
job alongside contract work, research, and graduate-school applications — where the
problem is not a missing to-do list but no honest picture of where the week went.

The design premise: **you build today's list yourself, and everything else waits in a
backlog until you choose to pull it in.** There is no calendar, no prescribed schedule,
and no week view to keep tidy — two places only, today and later. Ticking a task logs
its estimate, so the report can still show where the hours went.

## What it does

| View | Purpose |
|---|---|
| **Today** | A verse for the date, a load bar marked at four hours, and today's list — which you type straight into the card, setting priority and repeat as you go. Ticking a task logs its estimate to its track; `↓` drops one back to the backlog. Plus daily checks with streaks, a stopwatch and a reading-plan pacer. |
| **Backlog** | A brain dump box that turns free text into editable tasks bound for today or the backlog, and everything still waiting. `↑` pulls one onto today. Every task edits in place: title, track, estimate, priority, repeat. |
| **Report** | Hours by track against the planned mark, a hit/due grid for the daily checks, plan adherence, energy, a written read of the week, and the week's raw log. |

Setup lives behind the gear in the header, not in the tab bar: weekly hour targets,
reading-plan position, the verse list, and full export/import. There is no schedule to
configure — the app has no fixed blocks and no opinion about when you work.

### Task details

A task carries a **details** field, so the specifics from a brain dump survive the
breaking-down instead of being flattened into a title. It renders from a deliberately
tiny markup — a line starting with `- ` becomes a bullet, `**text**` gets emphasised
and highlighted — and collapses behind a *details* chip so a long list still scans.
*Details* in the Today card header expands or collapses all of them at once.

The brain-dump prompt is explicit that no specific may be dropped: every detail in the
dump has to survive in some task's details field.

### The day's challenge

The top of Today is a progress ring showing how many tasks are **left**, four
milestone pips at 25 / 50 / 75 / 100%, and a line that changes as the day goes —
different copy for not-started, a quarter down, past halfway, and one left. Ticking a
task returns a short varied acknowledgement; crossing a milestone says so instead.

Clearing the list flips the card to a gold **Day cleared** state and fires a brief
canvas confetti burst — no library, and skipped entirely under
`prefers-reduced-motion`. Cleared days are recorded like a habit, so the card can show
a **days in a row** streak, and un-ticking a task takes the day back off the streak.

### Three stars to a day

Every task carries a star. Starring one makes it a priority for its day — and a day
takes **three**, enforced: the fourth is refused with a message rather than silently
allowed, and a starred task moved onto an already-full day loses its star and says so.
Starred tasks sort to the top and are ringed; a `★ n/3` counter sits in the Today
header. The scarcity is the whole feature — a star means nothing on a list of
seventeen unless the app holds the line at three.

### Recurring tasks

Repeat is set while you type the task, not afterwards: **Once**, **Every day**, or a
strip of weekday toggles — tap `M` `W` `F` and it comes back on those days. Picking
days also decides where the first one lands: the next matching weekday, today
included. Completing a task both logs its time and spawns the next occurrence, so
there is no background materialisation and no chance of duplicates — the next instance
exists only because the last one was finished.

### Brain dump → scheduled tasks

The backlog opens with a free-text box. Write a paragraph, a list, or half-sentences;
**Break it into tasks** turns it into a reviewable set of proposals — each with a
suggested track, a realistic estimate, a priority, and a day — which you edit before
anything lands in the backlog. It asks Claude to do the splitting when the host page
grants the `sample` capability, and falls back to splitting on lines and sentences
otherwise, so the feature works either way.

Each proposal goes one of two ways — **today** or **the backlog** — with bulk buttons
for both. A task carried over from an earlier day stays on today's list, tagged
`carried over`, rather than needing to be rescheduled.

### A verse for each day

The Today view opens with a verse chosen by day-of-year, so it is the same all day and
rotates through the list over the year. It ships with 48 verses in the **KJV**, which
is public domain; Setup takes any translation as a list of `["reference", "text"]`
pairs.

### Four domains

Tracks roll up into four domains, each with its own hue: **God**, **Paid work**,
**The PhD build**, **Life & body**. The categorical palette was validated for
lightness band, chroma floor, colorblind separation, and contrast against the chart
surface; every bar is also directly labeled, so identity is never carried by color
alone. A table view of the same numbers is one click away.

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
app/config      tracks, weekly targets, habits, reading plan, optional fixed blocks
app/tasks       every task: today's date or "" for the backlog, plus estimate and repeat
app/dump        the brain dump and its pending proposals, so a reload never loses them
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

1. Seed configuration — domains, tracks, habits, verses (no seeded tasks, no seeded week)
2. Date helpers — ISO week keys, minute math, 12-hour formatting
3. `Store` — the persistence adapter
4. `S` — in-memory state, with debounced per-path savers
5. One `view*()` function per tab, each returning an HTML string
6. `wire()` — event binding, re-run after every render

Rendering is full-redraw on every change. At this data size that is faster to reason
about than any diffing, and it removes a whole class of stale-view bugs.

## Look and accessibility

One committed visual world — blush ground, soft pink accents, generous radii — driven
from a single token set on `:root`, with `color-scheme: light` so native controls stay
in the palette even on a dark OS. Fraunces (soft/wonk axes up) for display, Nunito Sans
for text, DM Mono for time columns. Every control has a visible focus ring and an
accessible label; toggles use `aria-pressed`; motion respects
`prefers-reduced-motion`; numeric columns use tabular figures.

## License

MIT
