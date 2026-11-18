import { RouterProvider } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import Providers from '@/app/providers'
import { router } from '@/app/router'

export default function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
      <SpeedInsights />
    </Providers>
  )
}
