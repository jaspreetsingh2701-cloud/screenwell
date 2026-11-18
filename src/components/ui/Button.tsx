import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'dark'

const styles: Record<Variant, string> = {
  primary: 'bg-teal-700 text-white hover:bg-teal-800',
  secondary: 'border border-gray-500 bg-white text-gray-900 hover:bg-gray-50',
  ghost: 'text-teal-800 underline hover:bg-teal-50',
  dark: 'bg-gray-900 text-white hover:bg-gray-800',
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }

export function Button({ variant = 'secondary', className, type = 'button', ...props }: Props) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700',
        'disabled:cursor-not-allowed disabled:opacity-50',
        styles[variant],
        className,
      )}
      {...props}
    />
  )
}
