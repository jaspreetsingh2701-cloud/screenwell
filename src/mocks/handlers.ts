import { delay, http, HttpResponse } from 'msw'
import type { CandidateListParams, CandidateSort, CandidateStatus, Verdict } from '@/types'
import * as db from './db'

const latency = Number(import.meta.env.VITE_API_LATENCY ?? 600)
const failureRate = Number(import.meta.env.VITE_FAILURE_RATE ?? 0)

async function simulateFailure(extraDelay = 0) {
  await delay(latency + extraDelay)
  if (Math.random() < failureRate) {
    return HttpResponse.json(
      { message: 'Simulated server error. Please try again.' },
      { status: 500 },
    )
  }
  return null
}

function respond<T extends object>(run: () => T) {
  try {
    return HttpResponse.json(run())
  } catch (error) {
    if (error instanceof db.DbError) {
      return HttpResponse.json({ message: error.message }, { status: error.status })
    }
    throw error
  }
}

export const handlers = [
  http.get('/api/candidates', async ({ request }) => {
    const failure = await simulateFailure()
    if (failure) return failure
    const q = new URL(request.url).searchParams
    const params: CandidateListParams = {
      page: Math.max(1, Number(q.get('page') ?? 1)),
      pageSize: Math.min(50, Math.max(1, Number(q.get('pageSize') ?? 10))),
      q: q.get('q') ?? '',
      status: (q.get('status') ?? 'all') as CandidateStatus | 'all',
      sort: (q.get('sort') ?? 'confidence_asc') as CandidateSort,
    }
    return respond(() => db.listCandidates(params))
  }),

  http.get('/api/candidates/:id', async ({ params }) => {
    const failure = await simulateFailure()
    if (failure) return failure
    return respond(() => db.getCandidate(String(params.id)))
  }),

  http.put('/api/candidates/:id/criteria/:criterionId/decision', async ({ params, request }) => {
    const failure = await simulateFailure()
    if (failure) return failure
    const body = (await request.json()) as { verdict: Verdict; reason?: string }
    return respond(() =>
      db.setDecision(String(params.id), String(params.criterionId), body.verdict, body.reason),
    )
  }),

  http.delete('/api/candidates/:id/criteria/:criterionId/decision', async ({ params }) => {
    const failure = await simulateFailure()
    if (failure) return failure
    return respond(() => db.clearDecision(String(params.id), String(params.criterionId)))
  }),

  http.put('/api/candidates/:id/criteria/:criterionId/flag', async ({ params, request }) => {
    const failure = await simulateFailure()
    if (failure) return failure
    const body = (await request.json()) as { flagged: boolean; note?: string }
    return respond(() =>
      db.setFlag(String(params.id), String(params.criterionId), body.flagged, body.note),
    )
  }),

  http.post('/api/candidates/:id/rescreen', async ({ params }) => {
    const failure = await simulateFailure(Math.max(1500, latency * 2))
    if (failure) return failure
    return respond(() => db.rescreen(String(params.id)))
  }),
]
