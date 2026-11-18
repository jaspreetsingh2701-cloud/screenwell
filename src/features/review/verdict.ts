import type { CriterionType, Verdict } from '@/types'

const LABELS: Record<CriterionType, Record<Verdict, string>> = {
  inclusion: { pass: 'Met', fail: 'Not met', unclear: 'Unclear' },
  exclusion: { pass: 'No, not excluded', fail: 'Yes, excluded', unclear: 'Unclear' },
}

export function verdictLabel(type: CriterionType, verdict: Verdict): string {
  return LABELS[type][verdict]
}

export function confidenceLabel(confidence: number): string {
  if (confidence < 0.6) return 'Low'
  if (confidence < 0.85) return 'Medium'
  return 'High'
}
