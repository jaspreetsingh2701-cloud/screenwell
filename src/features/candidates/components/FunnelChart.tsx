export interface FunnelStep {
  label: string
  value: number
  color: string
}

export function FunnelChart({ steps }: { steps: FunnelStep[] }) {
  const max = Math.max(1, ...steps.map((step) => step.value))
  return (
    <ul className="flex flex-col gap-2">
      {steps.map((step) => (
        <li key={step.label} className="grid grid-cols-[84px_1fr_32px] items-center gap-3 text-sm">
          <span>{step.label}</span>
          <div aria-hidden="true" className="h-4 rounded bg-gray-100">
            <div
              className="h-4 rounded"
              style={{
                width: `${Math.max(2, (step.value / max) * 100)}%`,
                backgroundColor: step.color,
              }}
            />
          </div>
          <strong className="text-right">{step.value}</strong>
        </li>
      ))}
    </ul>
  )
}
