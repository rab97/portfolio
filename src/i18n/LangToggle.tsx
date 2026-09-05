import { useLocation, useNavigate } from 'react-router'
import type { Locale } from '@/content/schema'
import { useLocale } from './LocaleProvider'
import { swapLocale } from './routes'
import { storeLocale } from './langStorage'

export function LangToggle() {
  const { locale, copy } = useLocale()
  const location = useLocation()
  const navigate = useNavigate()

  const goTo = (target: Locale) => {
    navigate(swapLocale(location.pathname, target))
    storeLocale(target)
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
