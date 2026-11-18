import { createContext, useContext } from 'react'

export interface ToastOptions {
  message: string
  tone?: 'info' | 'error'
  actionLabel?: string
  onAction?: () => void
  durationMs?: number
}

export const ToastContext = createContext<{ toast: (options: ToastOptions) => void } | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside ToastProvider')
  return context
}
