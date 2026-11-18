import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/cn'
import type { CandidateListParams, CandidateStatus } from '@/types'
import { STATUS_META, STATUS_ORDER } from '../statusMeta'

interface Props {
  counts?: Record<CandidateStatus, number>
  failed: boolean
  active: CandidateListParams['status']
  onSelect: (status: CandidateListParams['status']) => void
}

export function SummaryCards({ counts, failed, active, onSelect }: Props) {
  return (
    <section aria-label="Status summary" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {STATUS_ORDER.map((status) => {
        const meta = STATUS_META[status]
        const selected = active === status
        return (
          <button
            key={status}
            type="button"
            disabled={!counts}
            aria-pressed={selected}
            onClick={() => onSelect(selected ? 'all' : status)}
            className={cn(
              'flex min-h-11 flex-col gap-1 rounded-xl border bg-white p-4 text-left',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700',
              'disabled:opacity-70',
              selected
                ? 'border-gray-900 ring-2 ring-gray-900'
                : 'border-gray-200 hover:border-gray-400',
            )}
          >
            <span className="text-sm text-gray-700">{meta.label}</span>
            {counts ? (
              <span className={cn('text-3xl font-bold', meta.number)}>{counts[status]}</span>
            ) : failed ? (
              <span className="text-sm text-gray-600">No data available</span>
            ) : (
              <Skeleton className="h-9 w-12" />
            )}
          </button>
        )
      })}
    </section>
  )
}
