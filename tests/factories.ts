import { deriveStatus } from '@/lib/eligibility'
import type { AiSuggestion, CandidateDetail, Criterion, Decision, Verdict } from '@/types'

export function makeAi(verdict: Verdict, confidence: number): AiSuggestion {
  return { verdict, confidence, evidence: { text: 'Evidence text.', source: 'Clinic note' } }
}

export function makeDecision(overrides: Partial<Decision> = {}): Decision {
  return {
    kind: 'confirmed',
    verdict: 'pass',
    decidedBy: 'Tester',
    decidedAt: '2026-11-18T10:00:00Z',
    ...overrides,
  }
}

export function makeCriterion(overrides: Partial<Criterion> = {}): Criterion {
  return {
    id: 'c1',
    type: 'inclusion',
    title: 'Age 18 years or older',
    rule: 'Age 18 years or older at consent',
    dataStatus: 'present',
    ai: makeAi('pass', 0.95),
    decision: null,
    flagged: false,
    ...overrides,
  }
}

export function makeCandidate(criteria: Criterion[]): CandidateDetail {
  return {
    id: 'CND-TEST',
    age: 58,
    sex: 'F',
    site: 'Boston Central',
    status: deriveStatus(criteria),
    updatedAt: '2026-11-18T10:00:00Z',
    criteria,
  }
}
