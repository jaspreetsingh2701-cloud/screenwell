import { Button } from '@/components/ui/Button'

interface Props {
  page: number
  pageSize: number
  total: number
  pageSizes: readonly number[]
  disabled?: boolean
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

const select = 'h-11 rounded-lg border border-gray-400 bg-white px-2 disabled:bg-gray-100'

export function Pagination({
  page,
  pageSize,
  total,
  pageSizes,
  disabled = false,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1
  const last = Math.min(page * pageSize, total)

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-gray-200 px-4 py-3 text-sm"
    >
      <span>
        Showing {first}–{last} of {total} candidates
      </span>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <div className="flex items-center gap-1.5">
          <Button disabled={disabled || page <= 1} onClick={() => onPageChange(page - 1)}>
            Previous
          </Button>
          <Button disabled={disabled || page >= totalPages} onClick={() => onPageChange(page + 1)}>
            Next
          </Button>
        </div>
        <label className="flex items-center gap-2">
          Page
          <select
            value={page}
            disabled={disabled || totalPages === 1}
            onChange={(event) => onPageChange(Number(event.target.value))}
            className={select}
          >
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
          of {totalPages}
        </label>
        <label className="flex items-center gap-2">
          Rows per page
          <select
            value={pageSize}
            disabled={disabled}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className={select}
          >
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>
    </nav>
  )
}
