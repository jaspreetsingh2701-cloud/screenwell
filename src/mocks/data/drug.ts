import type { DrugResponse } from '@/types'

export const drug: DrugResponse = {
  info: {
    name: 'ONC-204',
    drugClass: 'Programmed Cell Death Protein 1 (PD-1) blocking monoclonal antibody',
    route: 'Intravenous (into a vein) infusion',
    dose: '200 milligrams every 3 weeks',
    comparator: 'Standard-of-care chemotherapy',
    condition: 'Advanced non-small cell lung cancer (NSCLC)',
    dataAsOf: '2026-11-15',
  },
  results: [
    {
      measure: 'Objective Response Rate',
      abbreviation: 'ORR',
      treatment: '38%',
      control: '22%',
      reading: 'Higher is better',
    },
    {
      measure: 'Median Progression-Free Survival',
      abbreviation: 'PFS',
      treatment: '7.4 months',
      control: '5.1 months',
      reading: 'Higher is better',
    },
    {
      measure: 'Overall Survival at 12 months',
      abbreviation: 'OS',
      treatment: '64%',
      control: '55%',
      reading: 'Higher is better',
    },
    {
      measure: 'Adverse Events of grade 3 or higher',
      abbreviation: 'AE',
      treatment: '21%',
      control: '29%',
      reading: 'Lower is better',
    },
    {
      measure: 'Serious Adverse Events',
      abbreviation: 'SAE',
      treatment: '8%',
      control: '11%',
      reading: 'Lower is better',
    },
  ],
  monthly: [
    { month: 'September 2026', screened: 14, enrolled: 3, withdrawn: 0 },
    { month: 'October 2026', screened: 17, enrolled: 4, withdrawn: 1 },
    { month: 'November 2026 (to date)', screened: 17, enrolled: 2, withdrawn: 0 },
  ],
}
