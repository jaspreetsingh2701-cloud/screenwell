import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { CandidateListParams } from '@/types'
import { fetchCandidates } from '../api'

export function useCandidates(params: CandidateListParams) {
  return useQuery({
    queryKey: ['candidates', params],
    queryFn: () => fetchCandidates(params),
    placeholderData: keepPreviousData,
  })
}
