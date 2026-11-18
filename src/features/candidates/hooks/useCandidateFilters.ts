import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { CandidateListParams, CandidateSort, CandidateStatus } from '@/types'
import { STATUS_ORDER } from '../statusMeta'

export const PAGE_SIZES = [10, 25] as const
export const SORT_OPTIONS: { value: CandidateSort; label: string }[] = [
  { value: 'confidence_asc', label: 'Lowest AI confidence' },
  { value: 'updated_desc', label: 'Last updated' },
  { value: 'id_asc', label: 'Candidate ID' },
]

const DEFAULTS: Record<string, string | number> = {
  page: 1,
  pageSize: PAGE_SIZES[0],
  q: '',
  status: 'all',
  sort: 'confidence_asc',
}

export function useCandidateFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const params = useMemo<CandidateListParams>(() => {
    const status = searchParams.get('status')
    const sort = searchParams.get('sort')
    const pageSize = Number(searchParams.get('pageSize'))
    return {
      page: Math.max(1, Number(searchParams.get('page')) || 1),
      pageSize: (PAGE_SIZES as readonly number[]).includes(pageSize) ? pageSize : PAGE_SIZES[0],
      q: searchParams.get('q') ?? '',
      status: STATUS_ORDER.includes(status as CandidateStatus)
        ? (status as CandidateStatus)
        : 'all',
      sort: SORT_OPTIONS.some((option) => option.value === sort)
        ? (sort as CandidateSort)
        : 'confidence_asc',
    }
  }, [searchParams])

  const update = useCallback(
    (changes: Partial<CandidateListParams>) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous)
          const merged: Partial<CandidateListParams> = { ...changes }
          if (!('page' in changes)) merged.page = 1
          for (const [key, value] of Object.entries(merged)) {
            if (value === DEFAULTS[key]) next.delete(key)
            else next.set(key, String(value))
          }
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  return { params, update }
}
