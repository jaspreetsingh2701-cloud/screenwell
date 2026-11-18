import type { CandidateStatus, Criterion, Verdict } from '@/types'

export const ATTENTION_THRESHOLD = 0.8

export function effectiveVerdict(criterion: Criterion): Verdict | null {
  return criterion.decision?.verdict ?? criterion.ai?.verdict ?? null
}

export function needsAttention(criterion: Criterion): boolean {
  if (criterion.decision) return false
  if (criterion.flagged) return true
  if (criterion.dataStatus === 'missing' || !criterion.ai) return true
  return criterion.ai.verdict === 'unclear' || criterion.ai.confidence < ATTENTION_THRESHOLD
}

export function deriveStatus(criteria: Criterion[]): CandidateStatus {
  if (criteria.some(needsAttention)) return 'needs_review'
  if (criteria.every((c) => c.decision)) return 'confirmed'
  if (criteria.some((c) => effectiveVerdict(c) === 'fail')) return 'likely_ineligible'
  return 'likely_eligible'
}

export function countDone(criteria: Criterion[]): number {
  return criteria.filter((c) => !needsAttention(c)).length
}

export function lowestConfidence(criteria: Criterion[]): number {
  const open = criteria.filter((c) => !c.decision)
  return Math.min(1, ...open.map((c) => c.ai?.confidence ?? 0))
}
