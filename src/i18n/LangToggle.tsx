import { useLocation, useNavigate } from 'react-router'
import type { Locale } from '@/content/schema'
import { useLocale } from './LocaleProvider'
import { swapLocale } from './routes'

const STORAGE_KEY = 'fr.lang'

function storeLang(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    /* storage bloccato: la scelta vale solo per questa visita */
  }
}

export function LangToggle() {
  const { locale, copy } = useLocale()
  const location = useLocation()
  const navigate = useNavigate()

  const goTo = (target: Locale) => {
    navigate(swapLocale(location.pathname, target))
    storeLang(target)
  }

  return (
    <div className="seg" role="group" aria-label={copy.langLabel}>
      <button type="button" aria-pressed={locale === 'it'} onClick={() => goTo('it')}>
        IT
      </button>
      <button type="button" aria-pressed={locale === 'en'} onClick={() => goTo('en')}>
        EN
      </button>
    </div>
  )
}
