import { Button } from '@/components/ui/Button'
import { effectiveVerdict } from '@/lib/eligibility'
import type { Criterion } from '@/types'
import { sourceVariant } from '../sourceVariant'
import { verdictLabel } from '../verdict'
import { SourceBadge } from './SourceBadge'

interface Props {
  criteria: Criterion[]
  onShowAll: () => void
}

export function ReviewedList({ criteria, onShowAll }: Props) {
  if (criteria.length === 0) return null
  return (
    <section
      aria-label="Already reviewed"
      className="rounded-xl border border-gray-200 bg-white px-4 py-2"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Already reviewed ({criteria.length})</h2>
        <Button variant="ghost" onClick={onShowAll}>
          Show all
        </Button>
      </div>
      <ul>
        {criteria.slice(0, 3).map((criterion) => {
          const verdict = effectiveVerdict(criterion)
          return (
            <li
              key={criterion.id}
              className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 py-3 text-sm"
            >
              <span>
                {criterion.title}
                {verdict && (
                  <>
                    : <strong>{verdictLabel(criterion.type, verdict)}</strong>
                  </>
                )}
              </span>
              <SourceBadge variant={sourceVariant(criterion)} />
            </li>
          )
        })}
      </ul>
    </section>
  )
}
