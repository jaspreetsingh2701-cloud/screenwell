export interface BarItem {
  label: string
  value: number
  color: string
}

interface Props {
  items: BarItem[]
  suffix?: string
}

export function BarList({ items, suffix = '' }: Props) {
  const max = Math.max(1, ...items.map((item) => item.value))
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li
          key={item.label}
          className="grid grid-cols-[8.5rem_1fr_3rem] items-center gap-3 text-sm"
        >
          <span>{item.label}</span>
          <div aria-hidden="true" className="h-4 rounded bg-gray-100">
            <div
              className="h-4 rounded"
              style={{
                width: `${Math.max(2, (item.value / max) * 100)}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
          <strong className="text-right">
            {item.value}
            {suffix}
          </strong>
        </li>
      ))}
    </ul>
  )
}
