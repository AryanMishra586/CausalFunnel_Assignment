# Timed Quiz App

A 15-question timed quiz built with Next.js App Router and shadcn/ui. Users enter an email to start, answer questions within 30 minutes, navigate freely with an overview panel, and receive a detailed report showing their answers vs the correct answers.

## Features

- Start page with email capture
- 15 questions fetched from OpenTDB (`https://opentdb.com/api.php?amount=15`)
- Countdown timer (30 minutes) with auto-submit on expiry
- Navigate directly to any question; overview indicates visited/attempted
- Report page with per-question comparison and overall score
- State persisted to `localStorage` (safe reload)
- Responsive layout and subtle transitions

## Structure

- `app/` routes:
  - `/` start page
  - `/quiz` quiz page (timer, overview, question card)
  - `/report` final report
- `components/quiz/*` reusable components and provider
- `lib/quiz-*` types and utilities

## Setup

- Open in v0 or deploy to Vercel (recommended).
- No special environment variables required.
- Uses SWR for client-side fetching; all state is client-managed and persisted.

## Assumptions

- Only 15 questions per attempt, fetched at start.
- HTML entities from OpenTDB are decoded on the client.
- No server-side scoring; all evaluation is client-side.

## Challenges

- Handling HTML entities in OpenTDB payloads: resolved via `DOMParser` decode.
- Persisting the timer across reloads: start time stored in localStorage; timer computes remaining time from start timestamp.

## Improvements (optional)

- Add animations when switching questions.
- Add category/difficulty filters before start.
- Show progress bar for time remaining.
