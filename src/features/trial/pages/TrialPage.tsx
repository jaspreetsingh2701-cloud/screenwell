import { BarList } from '@/components/BarList'
import { Card } from '@/components/Card'
import { DataState } from '@/components/DataState'
import { PageSkeleton } from '@/components/PageSkeleton'
import { ProgressBar } from '@/components/ProgressBar'
import { SimpleTable, type Column } from '@/components/SimpleTable'
import { useToast } from '@/components/toast/toastContext'
import { Button } from '@/components/ui/Button'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { formatDate } from '@/lib/format'
import type { TrialDocument } from '@/types'
import { useTrialOverview } from '../hooks/useTrialOverview'
import { elapsedFraction, monthsBetween } from '../timeline'

export default function TrialPage() {
  useDocumentTitle('Trial')
  const overview = useTrialOverview()
  const { toast } = useToast()
  const data = overview.data

  const documentColumns: Column<TrialDocument>[] = [
    { header: 'Document', cell: (doc) => doc.name },
    { header: 'Version', cell: (doc) => doc.version },
    { header: 'Approved', cell: (doc) => formatDate(doc.approvedOn) },
    {
      header: 'Status',
      cell: (doc) => (
        <>
          {doc.status === 'current' ? 'Current' : 'Superseded'}
          {doc.note && <span className="block text-xs text-gray-600">{doc.note}</span>}
        </>
      ),
    },
    {
      header: 'Download',
      hideHeader: true,
      align: 'right',
      cell: (doc) => (
        <Button
          variant="ghost"
          aria-label={`Download ${doc.name}`}
          onClick={() => toast({ message: 'Downloads are simulated in this demo.' })}
        >
          Download
        </Button>
      ),
    },
  ]

  return (
    <DataState
      isLoading={overview.isPending}
      error={overview.error}
      isEmpty={false}
      onRetry={() => void overview.refetch()}
      loading={<PageSkeleton />}
      empty={null}
    >
      {data && <TrialContent data={data} columns={documentColumns} />}
    </DataState>
  )
}

function TrialContent({
  data,
  columns,
}: {
  data: NonNullable<ReturnType<typeof useTrialOverview>['data']>
  columns: Column<TrialDocument>[]
}) {
  const { stats, confidence } = data
  const monthsTotal = monthsBetween(data.startDate, data.primaryCompletion)
  const monthsElapsed = Math.round(
    elapsedFraction(data.startDate, data.primaryCompletion) * monthsTotal,
  )
  const rated = confidence.high + confidence.medium + confidence.low
  const share = (count: number) => (rated ? Math.round((count / rated) * 100) : 0)

  const details: [string, string][] = [
    ['Sponsor', data.sponsor],
    ['Phase', stats.phase],
    ['Condition', stats.condition],
    ['Start date', formatDate(data.startDate)],
    ['Primary completion (estimated)', formatDate(data.primaryCompletion)],
    ['Target enrollment', `${stats.target} participants`],
    ['Sites', stats.sites.join(', ')],
    ['Principal Investigator', data.principalInvestigator],
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold">Trial {stats.id}</h1>
        <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-900 ring-1 ring-teal-700/40 ring-inset">
          {data.status}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Trial details">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            {details.map(([term, value]) => (
              <div key={term} className="contents">
                <dt className="text-gray-600">{term}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card title="Progress">
          <div className="flex flex-col gap-4 text-sm">
            <div className="flex flex-col gap-1.5">
              <span>
                Enrollment:{' '}
                <strong>
                  {stats.enrolled} of {stats.target}
                </strong>
              </span>
              <ProgressBar label="Enrollment" value={stats.enrolled} max={stats.target} />
            </div>
            <div className="flex flex-col gap-1.5">
              <span>
                Time elapsed:{' '}
                <strong>
                  {monthsElapsed} of {monthsTotal} months
                </strong>
              </span>
              <ProgressBar
                label="Time elapsed"
                value={monthsElapsed}
                max={monthsTotal}
                color="bg-gray-600"
              />
            </div>
            <p className="text-gray-600">
              Consented {stats.consented} · Enrolled {stats.enrolled} · Screen failures{' '}
              {stats.screenFailed}
            </p>
          </div>
        </Card>

        <Card
          title="AI confidence"
          description={`Average ${Math.round(confidence.average * 100)}% across ${rated} answered criteria`}
        >
          <BarList
            suffix="%"
            items={[
              { label: 'High (85%+)', value: share(confidence.high), color: '#0f766e' },
              { label: 'Medium (60–84%)', value: share(confidence.medium), color: '#b45309' },
              { label: 'Low (under 60%)', value: share(confidence.low), color: '#9a3412' },
            ]}
          />
          <p className="mt-3 text-sm text-amber-900">
            {confidence.missing} criteria had missing data, so AI did not answer them.
          </p>
        </Card>
      </div>

      <Card title="Trial documents">
        <SimpleTable
          caption="Trial documents"
          columns={columns}
          rows={data.documents}
          getKey={(doc) => doc.id}
          minWidth={560}
        />
      </Card>
    </div>
  )
}
