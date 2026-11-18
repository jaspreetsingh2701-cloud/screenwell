import { Button } from '@/components/ui/Button'

export default function RouteError() {
  return (
    <div role="alert" className="mx-auto flex max-w-xl flex-col items-start gap-3 p-10">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-sm text-gray-600">An unexpected error stopped this page from loading.</p>
      <Button variant="primary" onClick={() => window.location.assign('/')}>
        Back to the candidate queue
      </Button>
    </div>
  )
}
