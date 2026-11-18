import { useQuery } from '@tanstack/react-query'
import { fetchTrialOverview } from '../api'

export function useTrialOverview() {
  return useQuery({ queryKey: ['trial', 'overview'], queryFn: fetchTrialOverview })
}
