import { deriveStatus } from '@/lib/eligibility'
import type { CandidateDetail, Criterion, Decision, Verdict } from '@/types'

function update(
  candidate: CandidateDetail,
  criterionId: string,
  change: (criterion: Criterion) => Criterion,
): CandidateDetail {
  const criteria = candidate.criteria.map((c) => (c.id === criterionId ? change(c) : c))
  return { ...candidate, criteria, status: deriveStatus(criteria) }
}

export function applyDecision(
  candidate: CandidateDetail,
  criterionId: string,
  verdict: Verdict,
  reason?: string,
): CandidateDetail {
  return update(candidate, criterionId, (c) => {
    const decision: Decision = {
      kind: c.ai?.verdict === verdict ? 'confirmed' : 'changed',
      verdict,
      reason: reason?.trim() || undefined,
      decidedBy: 'You',
      decidedAt: new Date().toISOString(),
    }
    return { ...c, decision, flagged: false, flagNote: undefined }
  })
}

export function applyClearDecision(
  candidate: CandidateDetail,
  criterionId: string,
): CandidateDetail {
  return update(candidate, criterionId, (c) => ({ ...c, decision: null }))
}

export function applyFlag(
  candidate: CandidateDetail,
  criterionId: string,
  flagged: boolean,
  note?: string,
): CandidateDetail {
  return update(candidate, criterionId, (c) => ({
    ...c,
    flagged,
    flagNote: flagged ? note?.trim() || undefined : undefined,
  }))
}
