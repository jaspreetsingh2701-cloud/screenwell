import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface Column<T> {
  header: string
  cell: (row: T) => ReactNode
  align?: 'left' | 'right'
  hideHeader?: boolean
}

interface Props<T> {
  caption: string
  columns: Column<T>[]
  rows: T[]
  getKey: (row: T) => string
  minWidth?: number
}

export function SimpleTable<T>({ caption, columns, rows, getKey, minWidth = 480 }: Props<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm" style={{ minWidth }}>
        <caption className="sr-only">{caption}</caption>
        <thead className="text-xs uppercase tracking-wide text-gray-600">
          <tr>
            {columns.map((column) => (
              <th
                key={column.header}
                scope="col"
                className={cn('px-3 py-2 font-semibold', column.align === 'right' && 'text-right')}
              >
                {column.hideHeader ? (
                  <span className="sr-only">{column.header}</span>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getKey(row)} className="border-t border-gray-200">
              {columns.map((column) => (
                <td
                  key={column.header}
                  className={cn('px-3 py-3', column.align === 'right' && 'text-right')}
                >
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
