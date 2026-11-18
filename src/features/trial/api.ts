import { api } from '@/lib/apiClient'
import type { TrialOverview, TrialStats } from '@/types'

export function fetchTrial() {
  return api<TrialStats>('/api/trial')
}

export function fetchTrialOverview() {
  return api<TrialOverview>('/api/trial/overview')
}
