import { api } from '@/lib/apiClient'
import type { CandidateDetail, Verdict } from '@/types'

const base = (id: string) => `/api/candidates/${encodeURIComponent(id)}`

export const fetchCandidate = (id: string) => api<CandidateDetail>(base(id))

export const putDecision = (id: string, criterionId: string, verdict: Verdict, reason?: string) =>
  api<CandidateDetail>(`${base(id)}/criteria/${criterionId}/decision`, {
    method: 'PUT',
    body: JSON.stringify({ verdict, reason }),
  })

export const deleteDecision = (id: string, criterionId: string) =>
  api<CandidateDetail>(`${base(id)}/criteria/${criterionId}/decision`, { method: 'DELETE' })

export const putFlag = (id: string, criterionId: string, flagged: boolean, note?: string) =>
  api<CandidateDetail>(`${base(id)}/criteria/${criterionId}/flag`, {
    method: 'PUT',
    body: JSON.stringify({ flagged, note }),
  })

export const postRescreen = (id: string) =>
  api<CandidateDetail>(`${base(id)}/rescreen`, { method: 'POST' })

export const postFinalize = (id: string) =>
  api<CandidateDetail>(`${base(id)}/finalize`, { method: 'POST' })
