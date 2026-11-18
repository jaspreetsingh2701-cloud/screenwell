import { Skeleton } from '@/components/ui/Skeleton'
import type { CandidateStatus, TrialStats } from '@/types'
import { BarList } from '@/components/BarList'

interface Props {
  trial?: TrialStats
  counts?: Record<CandidateStatus, number>
  trialFailed: boolean
  countsFailed: boolean
}

function Unavailable() {
  return (
    <div role="status" className="py-2">
      <p className="text-sm font-semibold text-gray-800">No data available</p>
    </div>
  )
}

export function TrialSnapshot({ trial, counts, trialFailed, countsFailed }: Props) {
  const screened = counts ? Object.values(counts).reduce((sum, n) => sum + n, 0) : 0
  const eligible = counts ? counts.likely_eligible + counts.confirmed : 0

  return (
    <section aria-label="Trial overview" className="grid gap-3 md:grid-cols-2">
      <div className="flex min-h-40 flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5">
        {trial ? (
          <>
            <div>
              <h2 className="text-base font-semibold">
                {trial.id} Â· Phase {trial.phase}
              </h2>
              <p className="text-sm text-gray-600">
                {trial.condition} Â· {trial.sites.length} sites
              </p>
            </div>
            <div className="flex justify-between text-sm">
              <span>Enrollment</span>
              <strong>
                {trial.enrolled} of {trial.target} target
              </strong>
            </div>
            <div
              role="progressbar"
              aria-label="Enrollment"
              aria-valuemin={0}
              aria-valuemax={trial.target}
              aria-valuenow={trial.enrolled}
              className="h-2.5 rounded bg-gray-200"
            >
              <div
                className="h-2.5 rounded bg-teal-700"
                style={{ width: `${(trial.enrolled / trial.target) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">Screen failures: {trial.screenFailed}</p>
          </>
        ) : trialFailed ? (
          <Unavailable />
        ) : (
          <Skeleton className="h-28 w-full" />
        )}
      </div>
      <div className="flex min-h-40 flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-base font-semibold">Screening funnel</h2>
        {trial && counts ? (
          <BarList
            items={[
              { label: 'Screened', value: screened, color: '#0f766e' },
              { label: 'Eligible', value: eligible, color: '#14b8a6' },
              { label: 'Consented', value: trial.consented, color: '#5eead4' },
              { label: 'Enrolled', value: trial.enrolled, color: '#99f6e4' },
            ]}
          />
        ) : trialFailed || countsFailed ? (
          <Unavailable />
        ) : (
          <Skeleton className="h-28 w-full" />
        )}
      </div>
    </section>
  )
}
