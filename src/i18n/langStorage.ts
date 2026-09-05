import type { Locale } from '@/content/schema'
import { LOCALES } from '@/content/schema'

const KEY = 'fr.lang'

function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}

/** Va chiamata solo da un effetto o da un gestore di evento: durante il
 *  pre-rendering non esiste `localStorage`. */
export function readStoredLocale(): Locale | null {
  try {
    const raw = localStorage.getItem(KEY)
    return isLocale(raw) ? raw : null
  } catch {
    return null
  }
}

export function storeLocale(locale: Locale): void {
  try {
    localStorage.setItem(KEY, locale)
  } catch {
    /* storage bloccato: la scelta vale solo per questa visita */
  }
}
