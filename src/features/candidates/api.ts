import { api } from '@/lib/apiClient'
import type { CandidateListParams, CandidateListResponse } from '@/types'

export function fetchCandidates(params: CandidateListParams) {
  const query = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
    status: params.status,
    sort: params.sort,
  })
  if (params.q) query.set('q', params.q)
  return api<CandidateListResponse>('/api/candidates?' + query.toString())
}
