import { useParams } from 'react-router-dom'

export default function CandidateDetailPage() {
  const { id } = useParams()
  return <h1 className="text-2xl font-semibold">Candidate {id}</h1>
}
