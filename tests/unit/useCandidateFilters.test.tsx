import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { useCandidateFilters } from '@/features/candidates/hooks/useCandidateFilters'

function setup(url: string) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
  )
  return renderHook(() => useCandidateFilters(), { wrapper })
}

describe('useCandidateFilters', () => {
  it('reads valid values from the URL', () => {
    const { result } = setup('/?page=2&status=confirmed&q=denver&pageSize=25')
    expect(result.current.params).toEqual({
      page: 2,
      pageSize: 25,
      q: 'denver',
      status: 'confirmed',
      sort: 'confidence_asc',
    })
  })

  it('falls back to defaults for invalid values', () => {
    const { result } = setup('/?page=-4&status=bogus&sort=bogus&pageSize=7')
    expect(result.current.params).toEqual({
      page: 1,
      pageSize: 10,
      q: '',
      status: 'all',
      sort: 'confidence_asc',
    })
  })

  it('resets to page 1 when a filter changes', () => {
    const { result } = setup('/?page=3')
    act(() => result.current.update({ q: 'boston' }))
    expect(result.current.params.page).toBe(1)
    expect(result.current.params.q).toBe('boston')
  })

  it('keeps other filters when only the page changes', () => {
    const { result } = setup('/?q=denver')
    act(() => result.current.update({ page: 2 }))
    expect(result.current.params).toMatchObject({ page: 2, q: 'denver' })
  })
})
