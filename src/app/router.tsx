import { createBrowserRouter } from 'react-router-dom'
import Layout from './Layout'
import CandidateQueuePage from '@/features/candidates/pages/CandidateQueuePage'
import CandidateDetailPage from '@/features/review/pages/CandidateDetailPage'
import TrialPage from '@/features/trial/pages/TrialPage'
import DrugPage from '@/features/drug/pages/DrugPage'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <CandidateQueuePage /> },
      { path: '/candidates/:id', element: <CandidateDetailPage /> },
      { path: '/trial', element: <TrialPage /> },
      { path: '/drug', element: <DrugPage /> },
    ],
  },
])
