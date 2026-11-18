export type Verdict = 'pass' | 'fail' | 'unclear'
export type CriterionType = 'inclusion' | 'exclusion'
export type DataStatus = 'present' | 'missing'
export type DecisionKind = 'confirmed' | 'changed'
export type Sex = 'F' | 'M'

export type CandidateStatus = 'needs_review' | 'likely_eligible' | 'likely_ineligible' | 'confirmed'

export type CandidateSort = 'confidence_asc' | 'updated_desc' | 'id_asc'

export interface Evidence {
  text: string
  source: string
}

export interface AiSuggestion {
  verdict: Verdict
  confidence: number // 0 to 1
  evidence: Evidence
}

export interface Decision {
  kind: DecisionKind
  verdict: Verdict
  reason?: string
  decidedBy: string
  decidedAt: string
}

export interface Criterion {
  id: string
  type: CriterionType
  title: string // plain language
  rule: string // formal wording
  dataStatus: DataStatus
  ai: AiSuggestion | null // null when data is missing
  decision: Decision | null
  flagged: boolean
  flagNote?: string
}

export interface Candidate {
  id: string
  age: number
  sex: Sex
  site: string
  updatedAt: string
  criteria: Criterion[]
}

export interface CandidateSummary {
  id: string
  age: number
  sex: Sex
  site: string
  status: CandidateStatus
  criteriaTotal: number
  criteriaDone: number
  needsAttention: number
  lowestConfidence: number
  updatedAt: string
}

export interface CandidateDetail {
  id: string
  age: number
  sex: Sex
  site: string
  status: CandidateStatus
  updatedAt: string
  criteria: Criterion[]
}

export interface CandidateListParams {
  page: number
  pageSize: number
  q: string
  status: CandidateStatus | 'all'
  sort: CandidateSort
}

export interface CandidateListResponse {
  items: CandidateSummary[]
  total: number
  page: number
  pageSize: number
  counts: Record<CandidateStatus, number>
}

export interface TrialStats {
  id: string
  phase: string
  condition: string
  sites: string[]
  target: number
  enrolled: number
  consented: number
  screenFailed: number
}

export interface TrialDocument {
  id: string
  name: string
  version: string
  approvedOn: string
  status: 'current' | 'superseded'
  note?: string
}

export interface ConfidenceStats {
  average: number // 0 to 1, over criteria the AI answered
  high: number
  medium: number
  low: number
  missing: number // criteria where AI had no data to answer
  total: number
}

export interface TrialOverview {
  stats: TrialStats
  status: string
  sponsor: string
  startDate: string
  primaryCompletion: string
  principalInvestigator: string
  confidence: ConfidenceStats
  documents: TrialDocument[]
}

export interface DrugInfo {
  name: string
  drugClass: string
  route: string
  dose: string
  comparator: string
  condition: string
  dataAsOf: string
}

export interface DrugResult {
  measure: string
  abbreviation: string
  treatment: string
  control: string
  reading: string
}

export interface MonthlyParticipants {
  month: string
  screened: number
  enrolled: number
  withdrawn: number
}

export interface DrugResponse {
  info: DrugInfo
  results: DrugResult[]
  monthly: MonthlyParticipants[]
}
