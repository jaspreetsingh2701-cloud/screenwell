import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import type { Criterion } from '@/types'

interface Props {
  criterion: Criterion
  onClose: () => void
  onSubmit: (note: string) => void
}

export function FlagDialog({ criterion, onClose, onSubmit }: Props) {
  const [note, setNote] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSubmit(note.trim())
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      title="Ask the investigator"
      description={criterion.title}
    >
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Note (optional)
          <textarea
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="What should the investigator look at?"
            className="rounded-lg border border-gray-400 p-2"
          />
        </label>
        <p className="text-sm text-gray-700">
          This item stays open until the flag is withdrawn or you answer it.
        </p>
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">
            Send
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
