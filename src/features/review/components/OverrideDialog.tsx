import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import type { Criterion, Verdict } from '@/types'
import { confidenceLabel, verdictLabel } from '../verdict'

interface Props {
  criterion: Criterion
  initialVerdict: Verdict
  onClose: () => void
  onSubmit: (verdict: Verdict, reason: string) => void
}

export function OverrideDialog({ criterion, initialVerdict, onClose, onSubmit }: Props) {
  const [verdict, setVerdict] = useState<Verdict>(initialVerdict)
  const [reason, setReason] = useState('')
  const [touched, setTouched] = useState(false)
  const reasonMissing = reason.trim() === ''
  const { ai, type } = criterion

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setTouched(true)
    if (reasonMissing) return
    onSubmit(verdict, reason.trim())
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      title="Record your answer"
      description={criterion.title}
    >
      <form onSubmit={handleSubmit} noValidate className="mt-4 flex flex-col gap-4">
        <p className="text-sm text-gray-700">
          {ai
            ? `AI suggested: ${verdictLabel(type, ai.verdict)} (${confidenceLabel(ai.confidence)} confidence).`
            : 'AI could not answer this because records are missing.'}
        </p>
        <fieldset className="flex flex-wrap gap-x-6 rounded-lg border border-gray-300 px-4 py-2">
          <legend className="px-1 text-sm">Your answer</legend>
          {(['pass', 'fail'] as const).map((option) => (
            <label key={option} className="flex min-h-11 items-center gap-2 text-sm">
              <input
                type="radio"
                name="verdict"
                value={option}
                checked={verdict === option}
                onChange={() => setVerdict(option)}
              />
              {verdictLabel(type, option)}
            </label>
          ))}
        </fieldset>
        <label className="flex flex-col gap-1 text-sm">
          Reason or source (required)
          <textarea
            rows={3}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            aria-invalid={touched && reasonMissing}
            aria-describedby={touched && reasonMissing ? 'reason-error' : undefined}
            placeholder="For example: Clinic note of 09 Nov records ECOG 2."
            className="rounded-lg border border-gray-400 p-2"
          />
        </label>
        {touched && reasonMissing && (
          <p id="reason-error" role="alert" className="-mt-2 text-sm text-red-800">
            Please add a reason or source.
          </p>
        )}
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">
            Save answer
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
