import type { CandidateStatus } from '@/types'

export const STATUS_ORDER: CandidateStatus[] = [
  'needs_review',
  'likely_eligible',
  'likely_ineligible',
  'confirmed',
]

export const STATUS_META: Record<
  CandidateStatus,
  { label: string; badge: string; number: string }
> = {
  needs_review: {
    label: 'Needs review',
    badge: 'bg-amber-100 text-amber-900 ring-amber-700/40',
    number: 'text-amber-800',
  },
  likely_eligible: {
    label: 'Likely eligible',
    badge: 'bg-teal-100 text-teal-900 ring-teal-700/40',
    number: 'text-teal-800',
  },
  likely_ineligible: {
    label: 'Likely ineligible',
    badge: 'bg-orange-100 text-orange-900 ring-orange-700/40',
    number: 'text-orange-800',
  },
  confirmed: {
    label: 'Confirmed',
    badge: 'bg-indigo-100 text-indigo-900 ring-indigo-700/40',
    number: 'text-indigo-800',
  },
}
