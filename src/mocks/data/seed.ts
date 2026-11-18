import type {
  AiSuggestion,
  Candidate,
  CandidateStatus,
  Criterion,
  CriterionType,
  Verdict,
} from '@/types'

interface Template {
  type: CriterionType
  title: string
  rule: string
  source: string
}

const TEMPLATES: Template[] = [
  {
    type: 'inclusion',
    title: 'Age 18 years or older',
    rule: 'Age 18 years or older at consent',
    source: 'Registration record',
  },
  {
    type: 'inclusion',
    title: 'Confirmed lung cancer diagnosis',
    rule: 'Histologically confirmed non-small cell lung cancer (NSCLC)',
    source: 'Pathology report',
  },
  {
    type: 'inclusion',
    title: 'Advanced stage disease',
    rule: 'Stage IIIB or IV disease',
    source: 'Staging scan report',
  },
  {
    type: 'inclusion',
    title: 'Able to carry out light daily activity',
    rule: 'ECOG (Eastern Cooperative Oncology Group) performance status 0 or 1',
    source: 'Clinic visit note',
  },
  {
    type: 'inclusion',
    title: 'Measurable tumour on imaging',
    rule: 'At least one measurable tumour on imaging',
    source: 'CT scan report',
  },
  {
    type: 'inclusion',
    title: 'Liver and kidney function acceptable',
    rule: 'Adequate organ function (laboratory values)',
    source: 'Laboratory report',
  },
  {
    type: 'inclusion',
    title: 'Signed consent on file',
    rule: 'Written informed consent signed',
    source: 'Consent form record',
  },
  {
    type: 'inclusion',
    title: 'Expected survival of 12 weeks or more',
    rule: 'Life expectancy of 12 weeks or more',
    source: 'Oncology note',
  },
  {
    type: 'exclusion',
    title: 'Immunotherapy in the last 12 months?',
    rule: 'Anti-PD-1 (Programmed Cell Death Protein 1) therapy within 12 months',
    source: 'Oncology note',
  },
  {
    type: 'exclusion',
    title: 'Active brain metastases?',
    rule: 'Active brain metastases (cancer that has spread to the brain)',
    source: 'MRI report',
  },
  {
    type: 'exclusion',
    title: 'Autoimmune disease needing treatment?',
    rule: 'Autoimmune disease requiring treatment in the last 2 years',
    source: 'Medication history',
  },
  {
    type: 'exclusion',
    title: 'Pregnant or breastfeeding?',
    rule: 'Pregnant or breastfeeding',
    source: 'Clinic visit note',
  },
  {
    type: 'exclusion',
    title: 'Serious active infection?',
    rule: 'Active serious infection',
    source: 'Clinic visit note',
  },
  {
    type: 'exclusion',
    title: 'Another cancer in the last 3 years?',
    rule: 'Another cancer diagnosed within the last 3 years',
    source: 'Medical history',
  },
]

const SITES = ['Boston Central', 'Denver North', 'Austin Medical', 'Seattle West']
const REVIEWER = 'M. Rivera'
const NOW = Date.parse('2026-11-18T10:00:00Z')
const HOUR = 3_600_000

const EVIDENCE: Record<Verdict, string> = {
  pass: 'Findings are consistent with this criterion being satisfied.',
  fail: 'Findings indicate this criterion is not satisfied.',
  unclear: 'Relevant details are incomplete or conflicting.',
}

function createRng(seed: number) {
  let state = seed
  const next = () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return {
    next,
    between: (min: number, max: number) => min + next() * (max - min),
    int: (maxExclusive: number) => Math.floor(next() * maxExclusive),
    pick: <T>(items: readonly T[]): T => items[Math.floor(next() * items.length)],
    shuffle: <T>(items: readonly T[]): T[] => {
      const copy = [...items]
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1))
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
      }
      return copy
    },
  }
}

type Rng = ReturnType<typeof createRng>

function suggestion(template: Template, verdict: Verdict, confidence: number): AiSuggestion {
  return {
    verdict,
    confidence: Math.round(confidence * 100) / 100,
    evidence: { text: EVIDENCE[verdict], source: template.source },
  }
}

function buildCriteria(target: CandidateStatus, rng: Rng): Criterion[] {
  const criteria: Criterion[] = TEMPLATES.map((t, i) => ({
    id: `c${i + 1}`,
    type: t.type,
    title: t.title,
    rule: t.rule,
    dataStatus: 'present',
    ai: suggestion(t, 'pass', rng.between(0.86, 0.99)),
    decision: null,
    flagged: false,
  }))

  const order = rng.shuffle(criteria.map((_, i) => i))
  const decide = (criterion: Criterion) => {
    criterion.decision = {
      kind: 'confirmed',
      verdict: criterion.ai?.verdict ?? 'pass',
      decidedBy: REVIEWER,
      decidedAt: new Date(NOW - rng.int(48) * HOUR).toISOString(),
    }
  }

  switch (target) {
    case 'confirmed':
      criteria.forEach(decide)
      break
    case 'likely_eligible':
      order.slice(0, 3).forEach((i) => decide(criteria[i]))
      break
    case 'likely_ineligible':
      order.slice(0, rng.next() < 0.5 ? 1 : 2).forEach((i) => {
        criteria[i].ai = suggestion(TEMPLATES[i], 'fail', rng.between(0.82, 0.97))
      })
      break
    case 'needs_review': {
      const problems = 1 + rng.int(3)
      order.slice(0, problems).forEach((i) => {
        const kind = rng.pick(['unclear', 'missing', 'medium'] as const)
        if (kind === 'missing') {
          criteria[i].dataStatus = 'missing'
          criteria[i].ai = null
        } else if (kind === 'unclear') {
          criteria[i].ai = suggestion(TEMPLATES[i], 'unclear', rng.between(0.3, 0.55))
        } else {
          criteria[i].ai = suggestion(TEMPLATES[i], 'pass', rng.between(0.62, 0.78))
        }
      })
      order.slice(problems, problems + 2).forEach((i) => decide(criteria[i]))
      break
    }
  }
  return criteria
}

export function buildCandidates(): Candidate[] {
  const rng = createRng(204)
  const targets: CandidateStatus[] = rng.shuffle([
    ...Array<CandidateStatus>(19).fill('needs_review'),
    ...Array<CandidateStatus>(14).fill('likely_eligible'),
    ...Array<CandidateStatus>(9).fill('likely_ineligible'),
    ...Array<CandidateStatus>(6).fill('confirmed'),
  ])

  return targets.map((target, i) => ({
    id: `CND-${String(400 + i).padStart(4, '0')}`,
    age: 45 + rng.int(36),
    sex: rng.next() < 0.5 ? 'F' : 'M',
    site: rng.pick(SITES),
    updatedAt: new Date(NOW - rng.int(120) * HOUR).toISOString(),
    criteria: buildCriteria(target, rng),
  }))
}
