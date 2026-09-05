import { Link, useLocation } from 'react-router'
import { useLocale } from '@/i18n/LocaleProvider'
import { homePath } from '@/i18n/routes'
import { LangToggle } from '@/i18n/LangToggle'
import { ThemeToggle } from '@/theme/ThemeToggle'
import './Nav.css'

/** Chiavi di `copy.nav`, nell'ordine in cui compaiono nel mockup. Doppiano
 *  anche l'id delle sezioni della home a cui puntano: id stabili e uguali
 *  nelle due lingue, non le etichette tradotte che invece cambiano. */
const NAV_SECTIONS = ['about', 'skills', 'work', 'path', 'contact'] as const

export function Nav() {
  const { locale, copy } = useLocale()
  const { pathname } = useLocation()
  const onHome = pathname === homePath(locale)

  return (
    <nav className="nav">
      <div className="nav-in">
        <Link className="nav-logo" to={homePath(locale)}>
          fr<em>.</em>dev
        </Link>

        <span className="status">
          <i aria-hidden="true" />
          <span>{copy.availability}</span>
        </span>

        <div className="nav-links">
          {NAV_SECTIONS.map((section) => (
            <a key={section} href={`${onHome ? '' : homePath(locale)}#${section}`}>
              {copy.nav[section]}
            </a>
          ))}
        </div>

        <div className="controls">
          <LangToggle />
          <ThemeToggle labels={copy.themeLabels} />
        </div>
      </div>
    </nav>
  )
}
