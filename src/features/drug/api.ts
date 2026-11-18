import { api } from '@/lib/apiClient'
import type { DrugResponse } from '@/types'

export function fetchDrug() {
  return api<DrugResponse>('/api/drug')
}
