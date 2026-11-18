import { useQuery } from '@tanstack/react-query'
import { fetchDrug } from '../api'

export function useDrug() {
  return useQuery({ queryKey: ['drug'], queryFn: fetchDrug })
}
