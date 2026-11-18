import { needsAttention } from '@/lib/eligibility'
import type { Criterion } from '@/types'

export type SourceVariant = 'ai' | 'ai_high' | 'missing' | 'flagged' | 'confirmed' | 'changed'

export const SOURCE_LABELS: Record<SourceVariant, string> = {
  ai: 'AI suggestion',
  ai_high: 'AI, high confidence',
  missing: 'Data missing',
  flagged: 'Flagged for investigator',
  confirmed: 'Confirmed by you',
  changed: 'Changed by you',
}

export function sourceVariant(criterion: Criterion): SourceVariant {
  if (criterion.decision) return criterion.decision.kind
  if (criterion.flagged) return 'flagged'
  if (!criterion.ai || criterion.dataStatus === 'missing') return 'missing'
  return needsAttention(criterion) ? 'ai' : 'ai_high'
}
