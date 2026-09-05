import { createContext, useContext, type ReactNode } from 'react'
import type { Locale, Portfolio } from '@/content/schema'
import { itContent } from '@/content/it'
import { enContent } from '@/content/en'

const CONTENT: Record<Locale, Portfolio> = { it: itContent, en: enContent }

interface LocaleValue {
  locale: Locale
  copy: Portfolio
}

const LocaleContext = createContext<LocaleValue | null>(null)

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <LocaleContext.Provider value={{ locale, copy: CONTENT[locale] }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): LocaleValue {
  const value = useContext(LocaleContext)
  if (!value) throw new Error('useLocale va usato dentro un LocaleProvider')
  return value
}
