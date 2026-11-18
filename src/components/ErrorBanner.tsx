import { Button } from '@/components/ui/Button'

interface Props {
  messages: string[]
  isRetrying: boolean
  onRetry: () => void
}

export function ErrorBanner({ messages, isRetrying, onRetry }: Props) {
  if (messages.length === 0) return null
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-300 bg-red-50 px-4 py-3"
    >
      <div className="text-sm text-red-900">
        <p className="font-semibold">Some data could not be loaded</p>
        <p>{messages.join(' · ')}</p>
      </div>
      <Button variant="primary" disabled={isRetrying} onClick={onRetry}>
        {isRetrying ? 'Retrying…' : 'Try again'}
      </Button>
    </div>
  )
}
