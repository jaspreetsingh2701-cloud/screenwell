const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

export function formatRelative(iso: string, now = Date.now()): string {
  const hours = Math.round((new Date(iso).getTime() - now) / 3_600_000)
  if (Math.abs(hours) < 1) return 'Just now'
  if (Math.abs(hours) < 24) return rtf.format(hours, 'hour')
  return rtf.format(Math.round(hours / 24), 'day')
}

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatDate(iso: string): string {
  return dateFormat.format(new Date(iso))
}
