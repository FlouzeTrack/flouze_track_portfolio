export function formatTimestamp(timestamp: string | number): string {
  const date = typeof timestamp === 'string' ? Number(timestamp) : timestamp
  return new Date(date * 1000).toISOString()
}
