import { createBrowserRouter } from 'react-router-dom'
import CandidateQueuePage from '@/features/candidates/pages/CandidateQueuePage'
import DrugPage from '@/features/drug/pages/DrugPage'
import CandidateDetailPage from '@/features/review/pages/CandidateDetailPage'
import TrialPage from '@/features/trial/pages/TrialPage'
import Layout from './Layout'
import NotFoundPage from './NotFoundPage'
import RouteError from './RouteError'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      { path: '/', element: <CandidateQueuePage /> },
      { path: '/candidates/:id', element: <CandidateDetailPage /> },
      { path: '/trial', element: <TrialPage /> },
      { path: '/drug', element: <DrugPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
