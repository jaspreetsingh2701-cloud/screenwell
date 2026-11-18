import type { TrialDocument, TrialStats } from '@/types'

export const trial: TrialStats = {
  id: 'ONC-204',
  phase: 'II',
  condition: 'Advanced non-small cell lung cancer (NSCLC)',
  sites: ['Boston Central', 'Denver North', 'Austin Medical', 'Seattle West'],
  target: 40,
  enrolled: 9,
  consented: 12,
  screenFailed: 9,
}

export const trialDetails = {
  status: 'Recruiting',
  sponsor: 'Northfield Oncology (fictional)',
  startDate: '2026-01-12',
  primaryCompletion: '2027-09-30',
  principalInvestigator: 'Dr. A. Mehta',
}

export const trialDocuments: TrialDocument[] = [
  { id: 'd1', name: 'Study protocol', version: '3.1', approvedOn: '2025-12-02', status: 'current' },
  {
    id: 'd2',
    name: 'Informed consent form',
    version: '2.0',
    approvedOn: '2025-12-15',
    status: 'current',
  },
  {
    id: 'd3',
    name: "Investigator's brochure",
    version: '4.0',
    approvedOn: '2025-11-20',
    status: 'current',
  },
  {
    id: 'd4',
    name: 'Statistical analysis plan',
    version: '1.2',
    approvedOn: '2026-01-09',
    status: 'superseded',
    note: 'Version 1.3 is in draft',
  },
]
