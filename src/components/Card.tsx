import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface Props {
  title: string
  description?: string
  className?: string
  children: ReactNode
}

export function Card({ title, description, className, children }: Props) {
  const headingId = useId()
  return (
    <section
      aria-labelledby={headingId}
      className={cn('rounded-xl border border-gray-200 bg-white p-5', className)}
    >
      <h2 id={headingId} className="text-base font-semibold">
        {title}
      </h2>
      {description && <p className="mt-0.5 text-sm text-gray-600">{description}</p>}
      <div className="mt-3">{children}</div>
    </section>
  )
}
