import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DataState } from '@/components/DataState'
import { useToast } from '@/components/toast/toastContext'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { StatusBadge } from '@/features/candidates/components/StatusBadge'
import { countDone, needsAttention } from '@/lib/eligibility'
import type { Criterion, Verdict } from '@/types'
import { CriterionCard } from '../components/CriterionCard'
import { FlagDialog } from '../components/FlagDialog'
import { OverrideDialog } from '../components/OverrideDialog'
import { ReviewedList } from '../components/ReviewedList'
import { useCandidate } from '../hooks/useCandidate'
import { useReviewActions } from '../hooks/useReviewActions'

type Tab = 'attention' | 'all'
type DialogState =
  | { kind: 'override'; criterion: Criterion; verdict: Verdict }
  | { kind: 'flag'; criterion: Criterion }
  | null

function ReviewSkeleton() {
  return (
    <div role="status" aria-label="Loading candidate" className="flex flex-col gap-4">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  )
}

export default function CandidateDetailPage() {
  const { id = '' } = useParams()
  const candidate = useCandidate(id)
  const actions = useReviewActions(id)
  const { toast } = useToast()
  const [tab, setTab] = useState<Tab>('attention')
  const [dialog, setDialog] = useState<DialogState>(null)

  const data = candidate.data
  const attention = data
    ? data.criteria
        .filter(needsAttention)
        .sort((a, b) => (a.ai?.confidence ?? -1) - (b.ai?.confidence ?? -1))
    : []
  const reviewed = data ? data.criteria.filter((c) => !needsAttention(c)) : []
  const total = data?.criteria.length ?? 0
  const done = data ? countDone(data.criteria) : 0
  const isFinal = data?.status === 'confirmed'
  const canFinalize = !!data && attention.length === 0 && !isFinal && !actions.isFinalizing

  function handleAnswer(criterion: Criterion, verdict: Verdict) {
    if (criterion.ai?.verdict === verdict) actions.decide(criterion, verdict)
    else setDialog({ kind: 'override', criterion, verdict })
  }

  function handleToggleFlag(criterion: Criterion) {
    if (criterion.flagged) actions.setFlag(criterion.id, false)
    else setDialog({ kind: 'flag', criterion })
  }

  function renderCard(criterion: Criterion) {
    return (
      <CriterionCard
        key={criterion.id}
        criterion={criterion}
        onAnswer={(verdict) => handleAnswer(criterion, verdict)}
        onUndo={() => actions.undo(criterion.id)}
        onToggleFlag={() => handleToggleFlag(criterion)}
        onManual={() => setDialog({ kind: 'override', criterion, verdict: 'pass' })}
        onRequestData={() => toast({ message: 'Request sent to the site (simulated).' })}
      />
    )
  }

  const helper = isFinal
    ? 'Eligibility finalized'
    : attention.length > 0
      ? `Finish ${attention.length} ${attention.length === 1 ? 'item' : 'items'} to finalize`
      : 'Everything is reviewed'

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <nav aria-label="Breadcrumb" className="text-sm">
        <Link to="/" className="text-teal-800 underline">
          Candidate queue
        </Link>{' '}
        <span className="text-gray-600">/ {id}</span>
      </nav>

      <DataState
        isLoading={candidate.isPending}
        error={candidate.error}
        isEmpty={false}
        onRetry={() => void candidate.refetch()}
        loading={<ReviewSkeleton />}
        empty={null}
      >
        {data && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-semibold">{data.id}</h1>
                  <StatusBadge status={data.status} />
                </div>
                <p className="text-sm text-gray-600">
                  {data.age} / {data.sex} · {data.site} · Trial ONC-204
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Button variant="dark" disabled={!canFinalize} onClick={actions.finalize}>
                  {actions.isFinalizing ? 'Finalizing…' : 'Finalize eligibility'}
                </Button>
                <span className="text-sm text-gray-600">{helper}</span>
              </div>
            </div>

            <div className="text-sm">
              {done} of {total} criteria reviewed
              <div
                role="progressbar"
                aria-label="Review progress"
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={done}
                className="mt-1.5 h-2 rounded bg-gray-200"
              >
                <div
                  className="h-2 rounded bg-teal-700 transition-all"
                  style={{ width: `${(done / total) * 100}%` }}
                />
              </div>
            </div>

            <div role="group" aria-label="Criteria view" className="flex flex-wrap gap-2">
              <Button
                className="rounded-full"
                variant={tab === 'attention' ? 'dark' : 'secondary'}
                aria-pressed={tab === 'attention'}
                onClick={() => setTab('attention')}
              >
                Needs your attention ({attention.length})
              </Button>
              <Button
                className="rounded-full"
                variant={tab === 'all' ? 'dark' : 'secondary'}
                aria-pressed={tab === 'all'}
                onClick={() => setTab('all')}
              >
                All criteria ({total})
              </Button>
            </div>

            {tab === 'attention' ? (
              <>
                {attention.length === 0 ? (
                  <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="text-base font-semibold">Nothing needs your attention</h2>
                    <p className="text-sm text-gray-600">
                      {isFinal
                        ? 'This candidate is finalized.'
                        : 'Every criterion is reviewed. You can finalize eligibility.'}
                    </p>
                  </div>
                ) : (
                  attention.map(renderCard)
                )}
                <ReviewedList criteria={reviewed} onShowAll={() => setTab('all')} />
              </>
            ) : (
              data.criteria.map(renderCard)
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
              <span>Your decisions are kept if you re-run the AI.</span>
              <Button variant="ghost" disabled={actions.isRescreening} onClick={actions.rescreen}>
                {actions.isRescreening ? 'Re-running AI…' : 'Re-run AI screening'}
              </Button>
            </div>
          </>
        )}
      </DataState>

      {dialog?.kind === 'override' && (
        <OverrideDialog
          key={dialog.criterion.id}
          criterion={dialog.criterion}
          initialVerdict={dialog.verdict}
          onClose={() => setDialog(null)}
          onSubmit={(verdict, reason) => {
            actions.decide(dialog.criterion, verdict, reason)
            setDialog(null)
          }}
        />
      )}
      {dialog?.kind === 'flag' && (
        <FlagDialog
          key={dialog.criterion.id}
          criterion={dialog.criterion}
          onClose={() => setDialog(null)}
          onSubmit={(note) => {
            actions.setFlag(dialog.criterion.id, true, note)
            setDialog(null)
          }}
        />
      )}
    </div>
  )
}
