/**
 * Resolves an image path to a fully qualified URL.
 * Paths starting with "/" are treated as relative to the public folder.
 */
export function resolveImage(path: string | undefined, domain: string): string | undefined {
  if (!path) return undefined
  const base = domain.replace(/\/$/, '')
  return path.startsWith('http') ? path : `${base}${path}`
}
