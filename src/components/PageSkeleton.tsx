import { Skeleton } from '@/components/ui/Skeleton'

export function PageSkeleton() {
  return (
    <div role="status" aria-label="Loading page" className="flex flex-col gap-4">
      <Skeleton className="h-9 w-1/2" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
      <Skeleton className="h-56 w-full" />
    </div>
  )
}
