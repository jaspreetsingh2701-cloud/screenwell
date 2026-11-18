import { useQuery } from '@tanstack/react-query'
import { fetchTrial } from '../api'

export function useTrial() {
  return useQuery({ queryKey: ['trial'], queryFn: fetchTrial })
}
