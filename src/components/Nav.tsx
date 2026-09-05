import { Link, useLocation } from 'react-router'
import { useLocale } from '@/i18n/LocaleProvider'
import { homePath } from '@/i18n/routes'
import { LangToggle } from '@/i18n/LangToggle'
import { ThemeToggle } from '@/theme/ThemeToggle'
import { SECTION_IDS } from './sections'
import './Nav.css'

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

        {/* Pillola informativa: dice dove sta, non se è disponibile. Era
            un annuncio di disponibilità col pallino pulsante, ed è stato
            tolto perché non stava cercando lavoro — il pallino resta come
            marcatore fermo, l'animazione è sparita con l'annuncio. */}
        <span className="status">
          <i aria-hidden="true" />
          <span>{copy.location}</span>
        </span>

        <div className="nav-links">
          {SECTION_IDS.map((section) => (
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
