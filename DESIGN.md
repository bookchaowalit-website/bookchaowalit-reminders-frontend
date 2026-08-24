# Tideboard — Design System

## Overview

Tideboard is a quiet local reminder chart. The next open mark surfaces like a tide reading, while the full list remains a practical log of dates, completion, and clearing.

## Colors

- Deep water: #10282D and dock water: #1B3B3E.
- Sand type: #EFE4CF with soft sand #F6EFDF.
- Coral: #EC745E for active marks and action.
- Aqua: #A2D2C4 for calm state and logged work.
- Line: #416061 and muted text: #9DB3A9.

## Typography

- Georgia gives the board a calm journal voice.
- Geist Sans handles reminder messages and explanatory text.
- Geist Mono carries dates, current counts, and status labels.
- Time is large and highly visible only for the next open mark.

## Layout

- The frame has masthead, next-mark thesis, mark dock, current chart, and footer.
- The next mark gets a dedicated horizon block; the chart remains the source of truth.
- Each row uses an ordinal, current marker, reminder copy, completion state, and clear action.
- Mobile stacks the form and places completion beneath each reminder.

## Elevation & Depth

- Depth comes from layered deep-water surfaces and a restrained outer shadow.
- The next-mark horizon is an inset instrument, not a floating card.
- Completed items flatten into muted type and a struck message.

## Shapes

- Square inputs and a single round current marker.
- Hairline rules create the chart; coral markers create the tide reading.
- No pills, progress rings, or decorative waves.

## Components

- Horizon: next time, next message, and empty-board fallback.
- Mark form: message, datetime-local input, and set action.
- Chart row: open/logged state, complete checkbox, and clear action.
- Local boundary note: explicitly states no alerts or sync.

## Do's and Don'ts

- Do keep the next open reminder visible before the whole list.
- Do preserve completion and delete behavior in localStorage.
- Don't imply notifications, calendar sync, or cross-device state.
- Don't use urgency colors for ordinary reminders; coral is the mark, not an alarm.
