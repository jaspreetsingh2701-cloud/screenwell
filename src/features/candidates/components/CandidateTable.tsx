import { Link } from 'react-router-dom'
import { formatRelative } from '@/lib/format'
import type { CandidateSummary } from '@/types'
import { StatusBadge } from './StatusBadge'

const HEADERS = ['Candidate', 'Age / Sex', 'Site', 'Criteria reviewed', 'Status', 'Updated']
const ROW_HEIGHT = 64
const HEADER_HEIGHT = 44

interface Props {
  items: CandidateSummary[]
  reserveRows: number
}

export function CandidateTable({ items, reserveRows }: Props) {
  return (
    <>
      <ul className="divide-y divide-gray-200 md:hidden">
        {items.map((c) => (
          <li key={c.id}>
            <Link
              to={`/candidates/${c.id}`}
              className="flex flex-col gap-1.5 px-4 py-3 hover:bg-gray-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-700"
            >
              <span className="flex items-center justify-between gap-2">
                <strong className="text-teal-800">{c.id}</strong>
                <StatusBadge status={c.status} />
              </span>
              <span className="text-sm text-gray-700">
                {c.age} / {c.sex} · {c.site}
              </span>
              <span className="text-xs text-gray-600">
                {c.criteriaDone} of {c.criteriaTotal} reviewed
                {c.needsAttention > 0 && (
                  <span className="text-amber-800"> · {c.needsAttention} need attention</span>
                )}{' '}
                · {formatRelative(c.updatedAt)}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div
        className="hidden md:block"
        style={{ minHeight: reserveRows * ROW_HEIGHT + HEADER_HEIGHT }}
      >
        <table className="w-full table-fixed text-left text-sm">
          <caption className="sr-only">Candidates awaiting eligibility review</caption>
          <colgroup>
            <col className="w-[14%]" />
            <col className="w-[11%]" />
            <col className="w-[20%]" />
            <col className="w-[20%]" />
            <col className="w-[19%]" />
            <col className="w-[16%]" />
          </colgroup>
          <thead className="text-xs uppercase tracking-wide text-gray-600">
            <tr style={{ height: HEADER_HEIGHT }}>
              {HEADERS.map((header) => (
                <th key={header} scope="col" className="px-4 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr
                key={c.id}
                style={{ height: ROW_HEIGHT }}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4">
                  <Link
                    to={`/candidates/${c.id}`}
                    className="inline-flex min-h-11 items-center font-semibold text-teal-800 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-teal-700"
                  >
                    {c.id}
                  </Link>
                </td>
                <td className="px-4">
                  {c.age} / {c.sex}
                </td>
                <td className="truncate px-4">{c.site}</td>
                <td className="px-4">
                  {c.criteriaDone} of {c.criteriaTotal}
                  {c.needsAttention > 0 && (
                    <span className="block text-xs text-amber-800">
                      {c.needsAttention} need attention
                    </span>
                  )}
                </td>
                <td className="px-4">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-4 text-gray-600">{formatRelative(c.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
