import { describe, expect, it } from 'vitest'
import { elapsedFraction, monthsBetween } from '@/features/trial/timeline'

const start = '2026-01-01'
const end = '2026-12-31'

describe('elapsedFraction', () => {
  it('is 0 before the start and 1 after the end', () => {
    expect(elapsedFraction(start, end, Date.parse('2025-06-01'))).toBe(0)
    expect(elapsedFraction(start, end, Date.parse('2027-06-01'))).toBe(1)
  })

  it('is about half way in the middle of the range', () => {
    expect(elapsedFraction(start, end, Date.parse('2026-07-02'))).toBeCloseTo(0.5, 1)
  })

  it('is 0 for an invalid range', () => {
    expect(elapsedFraction(end, start)).toBe(0)
  })
})

describe('monthsBetween', () => {
  it('rounds to whole months', () => {
    expect(monthsBetween('2026-01-12', '2027-09-30')).toBe(21)
  })
})
