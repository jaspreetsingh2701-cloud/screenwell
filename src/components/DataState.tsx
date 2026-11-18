import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'

interface Props {
  isLoading: boolean
  error: Error | null
  isEmpty: boolean
  onRetry?: () => void
  loading: ReactNode
  empty: ReactNode
  children: ReactNode
}

export function DataState({ isLoading, error, isEmpty, onRetry, loading, empty, children }: Props) {
  if (isLoading) return <>{loading}</>
  if (error) {
    return (
      <div role="status" className="flex flex-col items-start gap-2 p-6">
        <h2 className="text-base font-semibold text-gray-900">No data available</h2>
        <p className="text-sm text-gray-600">{error.message}</p>
        {onRetry && (
          <Button variant="primary" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    )
  }
  if (isEmpty) return <>{empty}</>
  return <>{children}</>
}
