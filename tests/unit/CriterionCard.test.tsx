import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CriterionCard } from '@/features/review/components/CriterionCard'
import type { Criterion } from '@/types'
import { makeAi, makeCriterion, makeDecision } from '../factories'

function renderCard(criterion: Criterion) {
  const props = {
    onAnswer: vi.fn(),
    onUndo: vi.fn(),
    onToggleFlag: vi.fn(),
    onManual: vi.fn(),
    onRequestData: vi.fn(),
  }
  render(<CriterionCard criterion={criterion} {...props} />)
  return props
}

describe('CriterionCard', () => {
  it('shows an AI suggestion with the evidence and answer buttons', async () => {
    const props = renderCard(makeCriterion({ ai: makeAi('pass', 0.6) }))
    expect(screen.getByText('AI suggestion')).toBeInTheDocument()
    expect(screen.getByText(/Evidence text\./)).toBeInTheDocument()

    await userEvent.setup().click(screen.getByRole('button', { name: 'Agree: Met' }))
    expect(props.onAnswer).toHaveBeenCalledWith('pass')
  })

  it('sends the opposite answer when the user disagrees', async () => {
    const props = renderCard(makeCriterion({ ai: makeAi('pass', 0.6) }))
    await userEvent.setup().click(screen.getByRole('button', { name: 'Not met' }))
    expect(props.onAnswer).toHaveBeenCalledWith('fail')
  })

  it('words the answers correctly for an exclusion rule', () => {
    renderCard(makeCriterion({ type: 'exclusion', ai: makeAi('pass', 0.6) }))
    expect(screen.getByRole('button', { name: 'Agree: No, not excluded' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Yes, excluded' })).toBeInTheDocument()
  })

  it('does not offer an AI answer when data is missing', () => {
    renderCard(makeCriterion({ dataStatus: 'missing', ai: null }))
    expect(screen.getByText('Data missing')).toBeInTheDocument()
    expect(screen.getByText('AI cannot answer this.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Request records' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'I checked it myself' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Agree/ })).not.toBeInTheDocument()
  })

  it('shows a changed decision as human, with the reason, and lets the user reopen it', async () => {
    const props = renderCard(
      makeCriterion({
        decision: makeDecision({
          kind: 'changed',
          verdict: 'fail',
          reason: 'Clinic note records ECOG 2.',
        }),
      }),
    )
    expect(screen.getByText('Changed by you')).toBeInTheDocument()
    expect(screen.getByText('Reason: Clinic note records ECOG 2.')).toBeInTheDocument()

    await userEvent.setup().click(screen.getByRole('button', { name: 'Reopen' }))
    expect(props.onUndo).toHaveBeenCalled()
  })

  it('shows the flag state and offers to withdraw it', () => {
    renderCard(makeCriterion({ flagged: true, flagNote: 'Needs MRI review' }))
    expect(screen.getByText('Flagged for investigator')).toBeInTheDocument()
    expect(screen.getByText(/Sent to the investigator: Needs MRI review/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Withdraw flag' })).toBeInTheDocument()
  })
})
