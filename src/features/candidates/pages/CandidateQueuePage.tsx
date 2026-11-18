import { useState } from 'react'
import { DataState } from '@/components/DataState'
import { ErrorBanner } from '@/components/ErrorBanner'
import { Pagination } from '@/components/Pagination'
import { Button } from '@/components/ui/Button'
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback'
import { useTrial } from '@/features/trial/hooks/useTrial'
import { CandidateTable } from '../components/CandidateTable'
import { FiltersBar } from '../components/FiltersBar'
import { SummaryCards } from '../components/SummaryCards'
import { TableSkeleton } from '../components/TableSkeleton'
import { TrialSnapshot } from '../components/TrialSnapshot'
import { PAGE_SIZES, useCandidateFilters } from '../hooks/useCandidateFilters'
import { useCandidates } from '../hooks/useCandidates'

export default function CandidateQueuePage() {
  const { params, update } = useCandidateFilters()
  const candidates = useCandidates(params)
  const trial = useTrial()

  const [searchText, setSearchText] = useState(params.q)
  const pushSearch = useDebouncedCallback((value: string) => update({ q: value }), 300)

  function handleSearch(value: string) {
    setSearchText(value)
    pushSearch(value)
  }

  function clearFilters() {
    setSearchText('')
    update({ q: '', status: 'all' })
  }

  const failures: string[] = []
  if (trial.isError) failures.push('Trial overview')
  if (candidates.isError) failures.push('Candidate list and counts')

  function retryFailed() {
    if (trial.isError) void trial.refetch()
    if (candidates.isError) void candidates.refetch()
  }

  const data = candidates.data
  const hasFilters = params.q !== '' || params.status !== 'all'

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold">Candidate queue</h1>
        <p className="text-sm text-gray-600">
          AI has pre-screened every candidate. Review each suggestion before finalizing.
        </p>
      </div>

      <ErrorBanner
        messages={failures}
        isRetrying={trial.isFetching || candidates.isFetching}
        onRetry={retryFailed}
      />

      <TrialSnapshot
        trial={trial.data}
        counts={data?.counts}
        trialFailed={trial.isError}
        countsFailed={candidates.isError && !data}
      />
      <SummaryCards
        counts={data?.counts}
        failed={candidates.isError && !data}
        active={params.status}
        onSelect={(status) => update({ status })}
      />
      <FiltersBar
        searchText={searchText}
        onSearchText={handleSearch}
        status={params.status}
        onStatus={(status) => update({ status })}
        sort={params.sort}
        onSort={(sort) => update({ sort })}
        hasFilters={hasFilters}
        onClear={clearFilters}
        disabled={candidates.isPending}
      />

      <section
        aria-label="Candidates"
        aria-busy={candidates.isFetching}
        className="relative overflow-hidden rounded-xl border border-gray-200 bg-white"
      >
        {candidates.isFetching && (
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 z-10 h-0.5 animate-pulse bg-teal-600"
          />
        )}
        <DataState
          isLoading={candidates.isPending}
          error={candidates.error}
          isEmpty={data?.items.length === 0}
          loading={<TableSkeleton />}
          empty={
            <div className="flex flex-col items-start gap-3 p-6">
              <h2 className="text-base font-semibold">No candidates match your filters</h2>
              <p className="text-sm text-gray-600">Try a different search or clear the filters.</p>
              <Button variant="primary" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          }
        >
          {data && (
            <div>
              <p role="status" className="sr-only">
                {data.total} candidates found
              </p>
              <CandidateTable items={data.items} reserveRows={params.pageSize} />
              <Pagination
                page={params.page}
                pageSize={params.pageSize}
                total={data.total}
                pageSizes={PAGE_SIZES}
                disabled={candidates.isFetching}
                onPageChange={(page) => update({ page })}
                onPageSizeChange={(pageSize) => update({ pageSize })}
              />
            </div>
          )}
        </DataState>
      </section>
    </div>
  )
}
