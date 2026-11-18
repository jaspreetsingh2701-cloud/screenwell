import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function NotFoundPage() {
  useDocumentTitle('Page not found')
  return (
    <div className="flex flex-col items-start gap-3 py-10">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-sm text-gray-600">The page you are looking for does not exist.</p>
      <Link to="/" className="text-sm font-semibold text-teal-800 underline">
        Back to the candidate queue
      </Link>
    </div>
  )
}
