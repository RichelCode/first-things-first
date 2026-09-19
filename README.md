# First Things First

A single-file weekly planner and time tracker, built for someone running a full-time
job alongside contract work, research, and graduate-school applications — where the
problem is not a missing to-do list but no honest picture of where the week went.

The design premise: **you write down everything you are carrying, assign each piece a
day, and the day is then made of exactly that.** No prescribed schedule to fail — the
app has no opinion about when you work until you give it one. Ticking a task logs its
estimate, so on Saturday the report can show where the hours really went against what
you assigned.

## What it does

| View | Purpose |
|---|---|
| **Today** | A verse for the date, a load bar with a four-hour mark on it, and the tasks assigned to today. Ticking one logs its estimate to its track. Plus daily checks with streaks, a stopwatch, a reading-plan pacer, and a pull-in button for anything late. |
| **Week** | Seven days, each holding its assigned tasks, plus a "give these a day" card that schedules the rest of the backlog a tap at a time. |
| **Backlog** | A brain dump box that turns free text into editable, schedulable tasks — plus every task editable in place: title, track, estimate, priority, and the day it happens. |
| **Report** | Hours by track against the planned mark, a hit/due grid for the daily checks, plan adherence, energy, a written read of the week, and the week's raw log. |

Setup lives behind the gear in the header, not in the tab bar: weekly hour targets,
reading-plan position, the rhythm itself as editable JSON, and full export/import.

### Recurring tasks

A task repeats **once / daily / weekdays / weekly**. Completing one both logs its time
and spawns the next occurrence at the next matching date, so there is no background
materialisation and no chance of duplicates — the next instance exists only because
the last one was finished.

### Billing is Mondays

A hard rule in the seed rhythm, enforced in three places: the day chips bounce a
billing task landing on any other day back to the next Monday, the brain-dump prompt
carries the rule, and a config migration (`v1 → v2`) strips billing blocks from every
other day of a rhythm already in the store. That migration is surgical — it keeps
edits made elsewhere in the week — but it does rebuild Monday evening from 4pm when
the day holds under four hours of billing, since Monday now carries the whole job.

### Brain dump → scheduled tasks

The backlog opens with a free-text box. Write a paragraph, a list, or half-sentences;
**Break it into tasks** turns it into a reviewable set of proposals — each with a
suggested track, a realistic estimate, a priority, and a day — which you edit before
anything lands in the backlog. It asks Claude to do the splitting when the host page
grants the `sample` capability, and falls back to splitting on lines and sentences
otherwise, so the feature works either way.

Scheduling is one tap: every task and every proposal carries a row of day chips
(Today, Tomorrow, then the next five days, plus *No day*). Sunday chips are marked
`·rest` and greyed, so putting work there is a deliberate act rather than an accident.
Assigned tasks then appear under their day in the Week view.

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
app/tasks       the backlog — every task carries its day, estimate and repeat rule
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
