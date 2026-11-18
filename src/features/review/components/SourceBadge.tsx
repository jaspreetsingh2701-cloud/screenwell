import { cn } from '@/lib/cn'
import { SOURCE_LABELS, type SourceVariant } from '../sourceVariant'

const STYLES: Record<SourceVariant, string> = {
  ai: 'border border-dashed border-sky-800 bg-sky-100 text-sky-900',
  ai_high: 'border border-dashed border-sky-800 bg-sky-50 text-sky-900',
  missing: 'border border-amber-800 bg-amber-100 text-amber-900',
  flagged: 'border border-pink-800 bg-pink-100 text-pink-900',
  confirmed: 'border border-gray-900 bg-gray-900 text-white',
  changed: 'border border-gray-900 bg-gray-900 text-white',
}

export function SourceBadge({ variant }: { variant: SourceVariant }) {
  return (
    <span className={cn('inline-block rounded px-2 py-0.5 text-xs font-bold', STYLES[variant])}>
      {SOURCE_LABELS[variant]}
    </span>
  )
}
