import { api } from '@/lib/apiClient'
import type { TrialStats } from '@/types'

export function fetchTrial() {
  return api<TrialStats>('/api/trial')
}
