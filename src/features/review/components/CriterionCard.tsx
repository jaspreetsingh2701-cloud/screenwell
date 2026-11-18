import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import type { Criterion, Verdict } from '@/types'
import { sourceVariant, type SourceVariant } from '../sourceVariant'
import { confidenceLabel, verdictLabel } from '../verdict'
import { SourceBadge } from './SourceBadge'

const FRAME: Record<SourceVariant, string> = {
  ai: 'border-2 border-dashed border-sky-300 bg-sky-50',
  ai_high: 'border border-gray-200 bg-white',
  missing: 'border-2 border-amber-700 bg-amber-50',
  flagged: 'border-2 border-pink-700 bg-pink-50',
  confirmed: 'border border-gray-300 bg-white',
  changed: 'border border-gray-300 bg-white',
}

interface Props {
  criterion: Criterion
  onAnswer: (verdict: Verdict) => void
  onUndo: () => void
  onToggleFlag: () => void
  onManual: () => void
  onRequestData: () => void
}

export function CriterionCard({
  criterion,
  onAnswer,
  onUndo,
  onToggleFlag,
  onManual,
  onRequestData,
}: Props) {
  const { type, ai, decision } = criterion
  const variant = sourceVariant(criterion)
  const label = (verdict: Verdict) => verdictLabel(type, verdict)

  return (
    <article className={cn('flex flex-col gap-3 rounded-xl p-4', FRAME[variant])}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-base font-semibold">{criterion.title}</h3>
        <SourceBadge variant={variant} />
      </div>
      <p className="text-sm text-gray-700">
        {type === 'inclusion' ? 'Inclusion rule' : 'Exclusion rule'}: {criterion.rule}
      </p>

      {criterion.flagged && (
        <p className="rounded-lg bg-pink-100 px-3 py-2 text-sm text-pink-900">
          Sent to the investigator{criterion.flagNote ? `: ${criterion.flagNote}` : '.'}
        </p>
      )}

      {decision ? (
        <div className="text-sm">
          {decision.kind === 'changed' && ai ? (
            <p>
              AI said <s>{label(ai.verdict)}</s>,{' '}
              <strong>you said {label(decision.verdict)}</strong>
            </p>
          ) : (
            <p>
              Your answer: <strong>{label(decision.verdict)}</strong>
              {ai && ' (AI agreed)'}
            </p>
          )}
          {decision.reason && <p className="mt-1 text-gray-700">Reason: {decision.reason}</p>}
        </div>
      ) : ai ? (
        <>
          <p className="text-sm">
            AI says: <strong>{label(ai.verdict)}</strong> · {confidenceLabel(ai.confidence)}{' '}
            confidence ({Math.round(ai.confidence * 100)}%)
          </p>
          <blockquote className="rounded-lg border border-gray-200 bg-white/80 px-3 py-2 text-sm text-gray-800">
            {ai.evidence.text}
            <span className="mt-1 block text-xs text-gray-600">Source: {ai.evidence.source}</span>
          </blockquote>
        </>
      ) : (
        <p className="text-sm">
          <strong>AI cannot answer this.</strong> No supporting records were found, so it would only
          be guessing.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {decision ? (
          <Button onClick={onUndo}>Reopen</Button>
        ) : ai ? (
          <>
            {(['pass', 'fail'] as const).map((verdict) => {
              const agrees = ai.verdict === verdict
              return (
                <Button
                  key={verdict}
                  variant={agrees ? 'primary' : 'secondary'}
                  onClick={() => onAnswer(verdict)}
                >
                  {agrees ? 'Agree: ' : ''}
                  {label(verdict)}
                </Button>
              )
            })}
            <Button variant="ghost" onClick={onToggleFlag}>
              {criterion.flagged ? 'Withdraw flag' : 'Ask investigator'}
            </Button>
          </>
        ) : (
          <>
            <Button variant="primary" onClick={onRequestData}>
              Request records
            </Button>
            <Button onClick={onManual}>I checked it myself</Button>
            <Button variant="ghost" onClick={onToggleFlag}>
              {criterion.flagged ? 'Withdraw flag' : 'Ask investigator'}
            </Button>
          </>
        )}
      </div>
    </article>
  )
}
