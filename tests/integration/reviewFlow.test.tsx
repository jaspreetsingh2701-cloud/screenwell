import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { needsAttention } from '@/lib/eligibility'
import * as db from '@/mocks/db'
import { renderReviewPage } from '../renderReviewPage'

function pickCandidateWithAgreeableItem(): string {
  const { items } = db.listCandidates({
    page: 1,
    pageSize: 50,
    q: '',
    status: 'needs_review',
    sort: 'id_asc',
  })
  for (const item of items) {
    const detail = db.getCandidate(item.id)
    const found = detail.criteria.some(
      (c) => needsAttention(c) && c.ai && c.ai.verdict !== 'unclear',
    )
    if (found) return detail.id
  }
  throw new Error('The seed data has no suitable candidate')
}

const progress = () => screen.getByRole('progressbar', { name: 'Review progress' })

describe('candidate review flow', () => {
  it('loads a candidate and blocks finalizing while items need attention', async () => {
    const id = pickCandidateWithAgreeableItem()
    renderReviewPage(id)

    expect(screen.getByRole('status', { name: 'Loading candidate' })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: id })).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Finalize eligibility' })).toBeDisabled()
    expect(screen.getByText(/^Finish \d+ items? to finalize$/)).toBeInTheDocument()
  })

  it('agreeing with the AI updates progress at once and offers undo', async () => {
    const id = pickCandidateWithAgreeableItem()
    renderReviewPage(id)
    await screen.findByRole('heading', { name: id })

    const before = Number(progress().getAttribute('aria-valuenow'))
    await userEvent.setup().click(screen.getAllByRole('button', { name: /^Agree:/ })[0])

    await waitFor(() => expect(progress()).toHaveAttribute('aria-valuenow', String(before + 1)))
    expect(await screen.findByText(/^Saved:/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument()
  })
})
