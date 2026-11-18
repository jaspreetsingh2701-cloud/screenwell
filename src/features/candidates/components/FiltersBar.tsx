import { Button } from '@/components/ui/Button'
import type { CandidateListParams, CandidateSort } from '@/types'
import { SORT_OPTIONS } from '../hooks/useCandidateFilters'
import { STATUS_META, STATUS_ORDER } from '../statusMeta'

interface Props {
  searchText: string
  onSearchText: (value: string) => void
  status: CandidateListParams['status']
  onStatus: (value: CandidateListParams['status']) => void
  sort: CandidateSort
  onSort: (value: CandidateSort) => void
  hasFilters: boolean
  onClear: () => void
  disabled: boolean
}

const field = 'h-11 rounded-lg border border-gray-400 bg-white px-3 text-sm disabled:bg-gray-100'

export function FiltersBar(props: Props) {
  return (
    <section aria-label="Filters" className="flex flex-wrap items-end gap-3">
      <label className="flex min-w-56 flex-1 flex-col gap-1 text-sm text-gray-700">
        Search candidates
        <input
          type="search"
          value={props.searchText}
          disabled={props.disabled}
          onChange={(event) => props.onSearchText(event.target.value)}
          placeholder="Candidate ID or site"
          className={field}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Status
        <select
          value={props.status}
          disabled={props.disabled}
          onChange={(event) => props.onStatus(event.target.value as CandidateListParams['status'])}
          className={field}
        >
          <option value="all">All statuses</option>
          {STATUS_ORDER.map((status) => (
            <option key={status} value={status}>
              {STATUS_META[status].label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Sort by
        <select
          value={props.sort}
          disabled={props.disabled}
          onChange={(event) => props.onSort(event.target.value as CandidateSort)}
          className={field}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      {props.hasFilters && (
        <Button variant="ghost" disabled={props.disabled} onClick={props.onClear}>
          Clear filters
        </Button>
      )}
    </section>
  )
}
