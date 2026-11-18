const DAY_MS = 86_400_000

export function elapsedFraction(start: string, end: string, now = Date.now()): number {
  const from = Date.parse(start)
  const to = Date.parse(end)
  if (to <= from) return 0
  return Math.min(1, Math.max(0, (now - from) / (to - from)))
}

export function monthsBetween(start: string, end: string): number {
  return Math.round((Date.parse(end) - Date.parse(start)) / (30.44 * DAY_MS))
}
