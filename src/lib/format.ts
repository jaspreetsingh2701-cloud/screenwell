const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

export function formatRelative(iso: string, now = Date.now()): string {
  const hours = Math.round((new Date(iso).getTime() - now) / 3_600_000)
  if (Math.abs(hours) < 1) return 'Just now'
  if (Math.abs(hours) < 24) return rtf.format(hours, 'hour')
  return rtf.format(Math.round(hours / 24), 'day')
}
