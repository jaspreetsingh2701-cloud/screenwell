import { confidenceLabel } from '@/features/review/verdict'
import type { ConfidenceStats } from '@/types'
import * as db from './db'

export function confidenceStats(): ConfidenceStats {
  const { items } = db.listCandidates({
    page: 1,
    pageSize: 1000,
    q: '',
    status: 'all',
    sort: 'id_asc',
  })
  const counts = { high: 0, medium: 0, low: 0, missing: 0, total: 0 }
  let sum = 0

  for (const item of items) {
    for (const criterion of db.getCandidate(item.id).criteria) {
      counts.total++
      if (!criterion.ai) {
        counts.missing++
        continue
      }
      sum += criterion.ai.confidence
      const band = confidenceLabel(criterion.ai.confidence).toLowerCase() as
        'high' | 'medium' | 'low'
      counts[band]++
    }
  }

  const rated = counts.high + counts.medium + counts.low
  return { ...counts, average: rated ? sum / rated : 0 }
}
