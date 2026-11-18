import { RouterProvider } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import Providers from '@/app/providers'
import { router } from '@/app/router'

export default function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
      <Analytics />
      <SpeedInsights />
    </Providers>
  )
}
