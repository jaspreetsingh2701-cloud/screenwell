import { Card } from '@/components/Card'
import { DataState } from '@/components/DataState'
import { PageSkeleton } from '@/components/PageSkeleton'
import { SimpleTable } from '@/components/SimpleTable'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { formatDate } from '@/lib/format'
import type { DrugResponse } from '@/types'
import { useDrug } from '../hooks/useDrug'

export default function DrugPage() {
  useDocumentTitle('Drug and results')
  const drug = useDrug()

  return (
    <DataState
      isLoading={drug.isPending}
      error={drug.error}
      isEmpty={false}
      onRetry={() => void drug.refetch()}
      loading={<PageSkeleton />}
      empty={null}
    >
      {drug.data && <DrugContent data={drug.data} />}
    </DataState>
  )
}

function DrugContent({ data }: { data: DrugResponse }) {
  const { info } = data
  const details: [string, string][] = [
    ['Drug class', info.drugClass],
    ['Route', info.route],
    ['Dose', info.dose],
    ['Comparator', info.comparator],
    ['Condition', info.condition],
  ]

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold">{info.name}: drug details and interim results</h1>
        <p className="mt-1 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Synthetic interim data as of {formatDate(info.dataAsOf)}, for demonstration only. Not for
          clinical use.
        </p>
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-3">
        <Card title="Drug details" className="min-w-0">
          <dl className="grid grid-cols-1 gap-y-3 text-sm sm:grid-cols-[minmax(7rem,auto)_1fr] sm:gap-x-4 sm:gap-y-2">
            {details.map(([term, value]) => (
              <div key={term} className="grid min-w-0 grid-cols-1 gap-0.5 sm:contents">
                <dt className="text-xs font-medium text-gray-600 sm:text-sm">{term}</dt>
                <dd className="min-w-0 break-words font-medium sm:font-normal">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card title="Interim study results" className="min-w-0 lg:col-span-2">
          <div className="flex flex-col gap-3 md:hidden">
            {data.results.map((row) => (
              <article key={row.abbreviation} className="rounded-lg border border-gray-200 p-3">
                <h3 className="text-sm font-semibold">
                  {row.measure}{' '}\n                  <span className="font-normal text-gray-600">({row.abbreviation})</span>
                </h3>
                <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                  <div className="min-w-0">
                    <dt className="text-xs text-gray-600">{info.name} arm</dt>
                    <dd className="mt-0.5 break-words font-semibold">{row.treatment}</dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-xs text-gray-600">Control arm</dt>
                    <dd className="mt-0.5 break-words">{row.control}</dd>
                  </div>
                  <div className="col-span-2 border-t border-gray-100 pt-2">
                    <dt className="text-xs text-gray-600">How to read</dt>
                    <dd className="mt-0.5 break-words text-gray-700">{row.reading}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
          <div className="hidden md:block">
            <SimpleTable
              caption="Interim study results by treatment arm"
              rows={data.results}
              getKey={(row) => row.abbreviation}
              minWidth={640}
              columns={[
                { header: 'Measure', cell: (row) => `${row.measure} (${row.abbreviation})` },
                { header: `${info.name} arm`, cell: (row) => <strong>{row.treatment}</strong> },
                { header: 'Control arm', cell: (row) => row.control },
                {
                  header: 'How to read',
                  cell: (row) => <span className="text-gray-600">{row.reading}</span>,
                },
              ]}
            />
          </div>
        </Card>
      </div>

      <Card title="Participants by month" className="min-w-0">
        <div className="flex flex-col gap-3 md:hidden">
          {data.monthly.map((row) => (
            <article key={row.month} className="rounded-lg border border-gray-200 p-3">
              <h3 className="text-sm font-semibold">{row.month}</h3>
              <dl className="mt-2 grid grid-cols-3 gap-2 text-sm">
                <div className="min-w-0">
                  <dt className="text-xs text-gray-600">Screened</dt>
                  <dd className="mt-0.5 font-semibold tabular-nums">{row.screened}</dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-xs text-gray-600">Enrolled</dt>
                  <dd className="mt-0.5 font-semibold tabular-nums">{row.enrolled}</dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-xs text-gray-600">Withdrawn</dt>
                  <dd className="mt-0.5 font-semibold tabular-nums">{row.withdrawn}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
        <div className="hidden md:block">
          <SimpleTable
            caption="Participants by month"
            rows={data.monthly}
            getKey={(row) => row.month}
            columns={[
              { header: 'Month', cell: (row) => row.month },
              { header: 'Screened', cell: (row) => row.screened, align: 'right' },
              { header: 'Enrolled', cell: (row) => row.enrolled, align: 'right' },
              { header: 'Withdrawn', cell: (row) => row.withdrawn, align: 'right' },
            ]}
          />
        </div>
      </Card>
    </div>
  )
}
