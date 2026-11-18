import { cn } from '@/lib/cn'

interface Props {
  label: string
  value: number
  max: number
  color?: string
}

export function ProgressBar({ label, value, max, color = 'bg-teal-700' }: Props) {
  const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className="h-2.5 rounded bg-gray-200"
    >
      <div className={cn('h-2.5 rounded', color)} style={{ width: `${percent}%` }} />
    </div>
  )
}
