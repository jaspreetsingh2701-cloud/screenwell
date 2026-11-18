import { describe, expect, it } from 'vitest'
import { countDone, deriveStatus, effectiveVerdict, needsAttention } from '@/lib/eligibility'
import { makeAi, makeCriterion, makeDecision } from '../factories'

describe('needsAttention', () => {
  it('is false for a high-confidence AI answer nobody has reviewed', () => {
    expect(needsAttention(makeCriterion())).toBe(false)
  })

  it('is true when AI confidence is below the threshold', () => {
    expect(needsAttention(makeCriterion({ ai: makeAi('pass', 0.7) }))).toBe(true)
  })

  it('is true when AI is unclear, even at high confidence', () => {
    expect(needsAttention(makeCriterion({ ai: makeAi('unclear', 0.9) }))).toBe(true)
  })

  it('is true when data is missing, because AI cannot answer', () => {
    expect(needsAttention(makeCriterion({ dataStatus: 'missing', ai: null }))).toBe(true)
  })

  it('is true when the item is flagged for the investigator', () => {
    expect(needsAttention(makeCriterion({ flagged: true }))).toBe(true)
  })

  it('is false once a human has decided, even if AI confidence was low', () => {
    const decided = makeCriterion({ ai: makeAi('pass', 0.4), decision: makeDecision() })
    expect(needsAttention(decided)).toBe(false)
  })
})

describe('effectiveVerdict', () => {
  it('prefers the human decision over the AI suggestion', () => {
    const criterion = makeCriterion({
      ai: makeAi('pass', 0.9),
      decision: makeDecision({ kind: 'changed', verdict: 'fail', reason: 'Chart says otherwise' }),
    })
    expect(effectiveVerdict(criterion)).toBe('fail')
  })

  it('falls back to the AI suggestion, and to null when there is neither', () => {
    expect(effectiveVerdict(makeCriterion({ ai: makeAi('fail', 0.9) }))).toBe('fail')
    expect(effectiveVerdict(makeCriterion({ ai: null, dataStatus: 'missing' }))).toBeNull()
  })
})

describe('deriveStatus', () => {
  it('is needs_review while anything needs attention', () => {
    const criteria = [makeCriterion(), makeCriterion({ id: 'c2', ai: makeAi('unclear', 0.4) })]
    expect(deriveStatus(criteria)).toBe('needs_review')
  })

  it('is likely_eligible when everything passes and nothing needs attention', () => {
    expect(deriveStatus([makeCriterion(), makeCriterion({ id: 'c2' })])).toBe('likely_eligible')
  })

  it('is likely_ineligible when a confident AI answer fails a criterion', () => {
    const criteria = [makeCriterion(), makeCriterion({ id: 'c2', ai: makeAi('fail', 0.93) })]
    expect(deriveStatus(criteria)).toBe('likely_ineligible')
  })

  it('is confirmed once every criterion has a human decision', () => {
    const criteria = [
      makeCriterion({ decision: makeDecision() }),
      makeCriterion({ id: 'c2', decision: makeDecision() }),
    ]
    expect(deriveStatus(criteria)).toBe('confirmed')
  })
})

describe('countDone', () => {
  it('counts criteria that no longer need attention', () => {
    const criteria = [
      makeCriterion(),
      makeCriterion({ id: 'c2', ai: makeAi('unclear', 0.4) }),
      makeCriterion({ id: 'c3', dataStatus: 'missing', ai: null }),
    ]
    expect(countDone(criteria)).toBe(1)
  })
})
