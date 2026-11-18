import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import DrugPage from '@/features/drug/pages/DrugPage'
import TrialPage from '@/features/trial/pages/TrialPage'
import { renderWithProviders } from '../renderWithProviders'

describe('Trial page', () => {
  it('shows trial details, AI confidence and documents', async () => {
    renderWithProviders(<TrialPage />, '/trial')

    expect(await screen.findByRole('heading', { name: 'Trial ONC-204' })).toBeInTheDocument()
    expect(screen.getByText('Principal Investigator')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'AI confidence' })).toBeInTheDocument()

    const documents = screen.getByRole('table', { name: 'Trial documents' })
    expect(within(documents).getByText('Study protocol')).toBeInTheDocument()
    expect(
      within(documents).getByRole('button', { name: 'Download Study protocol' }),
    ).toBeInTheDocument()
  })
})

describe('Drug page', () => {
  it('spells out medical abbreviations in full', async () => {
    renderWithProviders(<DrugPage />, '/drug')

    expect(await screen.findByText('Objective Response Rate (ORR)')).toBeInTheDocument()
    expect(screen.getByText('Serious Adverse Events (SAE)')).toBeInTheDocument()
    expect(
      screen.getByText('Programmed Cell Death Protein 1 (PD-1) blocking monoclonal antibody'),
    ).toBeInTheDocument()
    expect(screen.getByRole('table', { name: 'Participants by month' })).toBeInTheDocument()
  })
})
