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

        <span className="status">
          <i aria-hidden="true" />
          <span>{copy.availability}</span>
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
