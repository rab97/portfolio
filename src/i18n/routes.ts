import type { Locale } from '@/content/schema'
import { LOCALES } from '@/content/schema'

const WORK_SEGMENT: Record<Locale, string> = { it: 'progetti', en: 'work' }

export function homePath(locale: Locale): string {
  return `/${locale}/`
}

/** Con la barra finale: è la forma dei file realmente serviti (case study
 *  pre-renderizzati come directory + `index.html`, `dirStyle: 'nested'` in
 *  vite.config.ts), quindi anche quella dei link cliccabili — non solo dei
 *  metadati in Head.tsx, che la barra la eredita da qui tramite `pathname`.
 *  Il router accetta comunque entrambe le forme in ingresso (`compilePath`
 *  di react-router tratta la barra finale come opzionale), quindi non
 *  serve altro per far combaciare le rotte. */
export function workPath(locale: Locale, slug: string): string {
  return `/${locale}/${WORK_SEGMENT[locale]}/${slug}/`
}

export function notFoundPath(locale: Locale): string {
  return `/${locale}/404`
}

export function detectLocale(preferred: string | undefined): Locale {
  return preferred?.toLowerCase().startsWith('it') ? 'it' : 'en'
}

export function swapLocale(pathname: string, to: Locale): string {
  const parts = pathname.split('/').filter(Boolean)
  const from = parts[0]
  if (!(LOCALES as readonly string[]).includes(from)) return homePath(to)

  const rest = parts.slice(1)
  if (rest.length === 0) return homePath(to)
  if (rest[0] === WORK_SEGMENT[from as Locale] && rest[1]) return workPath(to, rest[1])
  if (rest[0] === '404') return notFoundPath(to)
  return homePath(to)
}
