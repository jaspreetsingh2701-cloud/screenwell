import { cn } from '@/lib/cn'
import type { CandidateStatus } from '@/types'
import { STATUS_META } from '../statusMeta'

export function StatusBadge({ status }: { status: CandidateStatus }) {
  const meta = STATUS_META[status]
  return (
    <span
      className={cn(
        'inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
        meta.badge,
      )}
    >
      {meta.label}
    </span>
  )
}
