# Screenwell by Tilda Research

Screenwell helps clinical trial coordinators decide which patients can join a
trial. It shows AI-suggested eligibility verdicts with confidence and chart
evidence, and the coordinator confirms or changes each one before finalizing.

> All data is synthetic. The AI and the backend are simulated (MSW).

## Features

- **Candidate queue:** debounced search, status filter, sorting, pagination
- **Screening funnel:** Screened → Eligible → Consented → Enrolled
- **Simple review screen:** shows only criteria that need attention
- **Clear AI vs human labels:** "AI suggestion" vs "Confirmed/Changed by you"
- **Missing-data handling:** AI answer hidden, manual verification required
- **Optimistic decisions** with 5-second undo and rollback on failure
- **Trial page:** details, progress, AI confidence, documents
- **Drug page:** details and interim results with full medical terms
- Loading, empty and error states; responsive; keyboard accessible

## Tech stack

React, TypeScript, Vite, Tailwind CSS, Radix UI, TanStack Query,
React Router, MSW, Vitest, React Testing Library, Playwright

## Getting started

Requires Node 20+.

```bash
npm install
cp .env.example .env
npm run dev          # http://localhost:5173
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server with mock API |
| `npm run build` | Type-check and production build |
| `npm run preview` | Serve the production build |
| `npm run test` | Unit and component tests (Vitest) |
| `npm run test:e2e` | End-to-end tests (Playwright) |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |

## Debugging

- **Query cache:** TanStack Query Devtools (bottom-left in dev)
- **Network:** MSW logs every mocked request in the browser console
- **Simulate problems** in `.env`:
  - `VITE_API_LATENCY=800` slows responses (see skeletons)
  - `VITE_FAILURE_RATE=0.3` fails 30% of requests (see errors, rollback)
- **Empty state:** search for a term that matches nothing
- **Tests:** `npm run test -- --watch` or `npx playwright test --ui`

## Architecture

(to write: feature-based folders, data flow, state split of server state in
TanStack Query, URL state for filters, small local state for UI)

## Key decisions, trade-offs, next steps

(to write: why these libraries, assumptions, and what I'd build next:
real AI re-screen, drug analytics, risk matrix, Completed/Withdrawn funnel
stages, server-side pagination, more e2e tests)

## How I used AI tools

(to write)