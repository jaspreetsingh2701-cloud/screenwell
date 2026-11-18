import { Skeleton } from '@/components/ui/Skeleton'

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div role="status" aria-label="Loading candidates" className="flex flex-col gap-3 p-4">
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  )
}
