import { describe, expect, it } from 'vitest'
import { applyClearDecision, applyDecision, applyFlag } from '@/features/review/optimistic'
import { makeAi, makeCandidate, makeCriterion } from '../factories'

const unsure = () => makeCriterion({ ai: makeAi('unclear', 0.4) })

describe('applyDecision', () => {
  it('records a confirmed decision when the answer matches the AI', () => {
    const next = applyDecision(makeCandidate([makeCriterion()]), 'c1', 'pass')
    expect(next.criteria[0].decision?.kind).toBe('confirmed')
  })

  it('records a changed decision with a trimmed reason when the answer differs', () => {
    const next = applyDecision(makeCandidate([makeCriterion()]), 'c1', 'fail', '  Chart says no  ')
    expect(next.criteria[0].decision).toMatchObject({
      kind: 'changed',
      verdict: 'fail',
      reason: 'Chart says no',
    })
  })

  it('clears a flag when the user answers the item', () => {
    const flagged = makeCriterion({ flagged: true, flagNote: 'Please check' })
    const next = applyDecision(makeCandidate([flagged]), 'c1', 'pass')
    expect(next.criteria[0].flagged).toBe(false)
    expect(next.criteria[0].flagNote).toBeUndefined()
  })

  it('recomputes the candidate status', () => {
    const before = makeCandidate([unsure()])
    expect(before.status).toBe('needs_review')
    expect(applyDecision(before, 'c1', 'pass', 'Verified').status).toBe('confirmed')
  })

  it('does not mutate the original candidate', () => {
    const before = makeCandidate([unsure()])
    applyDecision(before, 'c1', 'pass', 'Verified')
    expect(before.criteria[0].decision).toBeNull()
  })
})

describe('applyClearDecision', () => {
  it('reopens a decided criterion', () => {
    const decided = applyDecision(makeCandidate([unsure()]), 'c1', 'pass', 'Verified')
    const reopened = applyClearDecision(decided, 'c1')
    expect(reopened.criteria[0].decision).toBeNull()
    expect(reopened.status).toBe('needs_review')
  })
})

describe('applyFlag', () => {
  it('sets and removes a flag with its note', () => {
    const flagged = applyFlag(makeCandidate([makeCriterion()]), 'c1', true, ' Look at MRI ')
    expect(flagged.criteria[0]).toMatchObject({ flagged: true, flagNote: 'Look at MRI' })
    expect(flagged.status).toBe('needs_review')

    const cleared = applyFlag(flagged, 'c1', false)
    expect(cleared.criteria[0].flagged).toBe(false)
    expect(cleared.criteria[0].flagNote).toBeUndefined()
  })
})
