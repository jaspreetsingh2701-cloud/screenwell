import { useQuery } from '@tanstack/react-query'
import { fetchCandidate } from '../api'

export function useCandidate(id: string) {
  return useQuery({ queryKey: ['candidate', id], queryFn: () => fetchCandidate(id), enabled: !!id })
}
