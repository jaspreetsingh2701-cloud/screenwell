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
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold">{info.name}: drug details and interim results</h1>
        <p className="mt-1 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Synthetic interim data as of {formatDate(info.dataAsOf)}, for demonstration only. Not for
          clinical use.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Drug details">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            {details.map(([term, value]) => (
              <div key={term} className="contents">
                <dt className="text-gray-600">{term}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card title="Interim study results" className="lg:col-span-2">
          <SimpleTable
            caption="Interim study results by treatment arm"
            rows={data.results}
            getKey={(row) => row.abbreviation}
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
        </Card>
      </div>

      <Card title="Participants by month">
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
      </Card>
    </div>
  )
}
