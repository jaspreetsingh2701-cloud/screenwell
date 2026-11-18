import { describe, expect, it } from 'vitest'
import { confidenceStats } from '@/mocks/stats'

describe('confidenceStats', () => {
  it('accounts for every criterion of every candidate', () => {
    const stats = confidenceStats()
    expect(stats.total).toBe(48 * 14)
    expect(stats.high + stats.medium + stats.low + stats.missing).toBe(stats.total)
  })

  it('reports missing data and a sensible average', () => {
    const stats = confidenceStats()
    expect(stats.missing).toBeGreaterThan(0)
    expect(stats.average).toBeGreaterThan(0.6)
    expect(stats.average).toBeLessThanOrEqual(1)
  })
})
