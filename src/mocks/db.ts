import { countDone, deriveStatus, lowestConfidence, needsAttention } from '@/lib/eligibility'
import type {
  Candidate,
  CandidateDetail,
  CandidateListParams,
  CandidateListResponse,
  CandidateStatus,
  CandidateSummary,
  Criterion,
  Verdict,
} from '@/types'
import { buildCandidates } from './data/seed'

const CURRENT_USER = 'M. Rivera'
const candidates = new Map<string, Candidate>(buildCandidates().map((c) => [c.id, c]))

export class DbError extends Error {
  status: number
  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
}

function toSummary(c: Candidate): CandidateSummary {
  return {
    id: c.id,
    age: c.age,
    sex: c.sex,
    site: c.site,
    status: deriveStatus(c.criteria),
    criteriaTotal: c.criteria.length,
    criteriaDone: countDone(c.criteria),
    needsAttention: c.criteria.filter(needsAttention).length,
    lowestConfidence: lowestConfidence(c.criteria),
    updatedAt: c.updatedAt,
  }
}

function toDetail(c: Candidate): CandidateDetail {
  return {
    id: c.id,
    age: c.age,
    sex: c.sex,
    site: c.site,
    status: deriveStatus(c.criteria),
    updatedAt: c.updatedAt,
    criteria: c.criteria,
  }
}

function getOrThrow(id: string): Candidate {
  const candidate = candidates.get(id)
  if (!candidate) throw new DbError('Candidate not found', 404)
  return candidate
}

function findCriterion(
  id: string,
  criterionId: string,
): { candidate: Candidate; criterion: Criterion } {
  const candidate = getOrThrow(id)
  const criterion = candidate.criteria.find((c) => c.id === criterionId)
  if (!criterion) throw new DbError('Criterion not found', 404)
  return { candidate, criterion }
}

const sorters: Record<string, (a: CandidateSummary, b: CandidateSummary) => number> = {
  confidence_asc: (a, b) => a.lowestConfidence - b.lowestConfidence || a.id.localeCompare(b.id),
  updated_desc: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
  id_asc: (a, b) => a.id.localeCompare(b.id),
}

export function listCandidates(params: CandidateListParams): CandidateListResponse {
  const all = [...candidates.values()].map(toSummary)
  const counts: Record<CandidateStatus, number> = {
    needs_review: 0,
    likely_eligible: 0,
    likely_ineligible: 0,
    confirmed: 0,
  }
  all.forEach((s) => counts[s.status]++)

  const query = params.q.trim().toLowerCase()
  const rows = all
    .filter((s) => params.status === 'all' || s.status === params.status)
    .filter(
      (s) => !query || s.id.toLowerCase().includes(query) || s.site.toLowerCase().includes(query),
    )
    .sort(sorters[params.sort] ?? sorters.confidence_asc)

  const start = (params.page - 1) * params.pageSize
  return {
    items: rows.slice(start, start + params.pageSize),
    total: rows.length,
    page: params.page,
    pageSize: params.pageSize,
    counts,
  }
}

export function getCandidate(id: string): CandidateDetail {
  return toDetail(getOrThrow(id))
}

export function setDecision(
  id: string,
  criterionId: string,
  verdict: Verdict,
  reason?: string,
): CandidateDetail {
  const { candidate, criterion } = findCriterion(id, criterionId)
  const kind = criterion.ai?.verdict === verdict ? 'confirmed' : 'changed'
  if (kind === 'changed' && !reason?.trim()) {
    throw new DbError('A reason is required when you change the AI answer.')
  }
  criterion.decision = {
    kind,
    verdict,
    reason: reason?.trim() || undefined,
    decidedBy: CURRENT_USER,
    decidedAt: new Date().toISOString(),
  }
  criterion.flagged = false
  candidate.updatedAt = new Date().toISOString()
  return toDetail(candidate)
}

export function clearDecision(id: string, criterionId: string): CandidateDetail {
  const { candidate, criterion } = findCriterion(id, criterionId)
  criterion.decision = null
  candidate.updatedAt = new Date().toISOString()
  return toDetail(candidate)
}

export function setFlag(
  id: string,
  criterionId: string,
  flagged: boolean,
  note?: string,
): CandidateDetail {
  const { candidate, criterion } = findCriterion(id, criterionId)
  criterion.flagged = flagged
  criterion.flagNote = flagged ? note?.trim() || undefined : undefined
  candidate.updatedAt = new Date().toISOString()
  return toDetail(candidate)
}

export function rescreen(id: string): CandidateDetail {
  const candidate = getOrThrow(id)
  candidate.criteria.forEach((criterion) => {
    if (!criterion.decision && criterion.ai) {
      const bumped = Math.round((criterion.ai.confidence + 0.05) * 100) / 100
      criterion.ai = { ...criterion.ai, confidence: Math.min(0.99, bumped) }
    }
  })
  candidate.updatedAt = new Date().toISOString()
  return toDetail(candidate)
}

export function finalize(id: string): CandidateDetail {
  const candidate = getOrThrow(id)
  if (candidate.criteria.some(needsAttention)) {
    throw new DbError('Resolve every item that needs attention first.')
  }
  candidate.criteria.forEach((criterion) => {
    if (!criterion.decision && criterion.ai) {
      criterion.decision = {
        kind: 'confirmed',
        verdict: criterion.ai.verdict,
        decidedBy: CURRENT_USER,
        decidedAt: new Date().toISOString(),
      }
    }
  })
  candidate.updatedAt = new Date().toISOString()
  return toDetail(candidate)
}
