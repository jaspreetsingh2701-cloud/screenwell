import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { ToastContext, type ToastOptions } from './toastContext'

interface Item extends ToastOptions {
  id: number
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([])
  const nextId = useRef(1)
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>())

  const dismiss = useCallback((id: number) => {
    clearTimeout(timers.current.get(id))
    timers.current.delete(id)
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = nextId.current++
      setItems((current) => [...current.slice(-2), { ...options, id }])
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), options.durationMs ?? 4000),
      )
    },
    [dismiss],
  )

  useEffect(() => {
    const map = timers.current
    return () => map.forEach((timer) => clearTimeout(timer))
  }, [])

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              'pointer-events-auto flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-white shadow-lg',
              item.tone === 'error' ? 'bg-red-800' : 'bg-gray-900',
            )}
          >
            <span>{item.message}</span>
            {item.actionLabel && (
              <button
                type="button"
                className="min-h-11 rounded px-2 font-semibold underline focus-visible:outline-2 focus-visible:outline-white"
                onClick={() => {
                  item.onAction?.()
                  dismiss(item.id)
                }}
              >
                {item.actionLabel}
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
