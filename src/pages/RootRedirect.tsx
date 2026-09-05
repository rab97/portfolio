import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import type { Locale, Portfolio } from '@/content/schema'
import { LOCALES } from '@/content/schema'
import { itContent } from '@/content/it'
import { enContent } from '@/content/en'
import { PageHead } from '@/components/Head'
import { useLocale } from '@/i18n/LocaleProvider'
import { detectLocale, homePath } from '@/i18n/routes'
import { readStoredLocale } from '@/i18n/langStorage'

const CONTENT: Record<Locale, Portfolio> = { it: itContent, en: enContent }

/** La radice non è una lingua: rende i link a entrambe le versioni — così un
 *  crawler senza JavaScript le raggiunge comunque — e in un effetto porta il
 *  browser sulla lingua scelta in precedenza, o su quella del browser.
 *
 *  La rotta è comunque avvolta in un `LocaleProvider`, così l'head lo emette
 *  `PageHead` come per ogni altra pagina: una seconda implementazione qui
 *  significherebbe hreflang costruiti in modo diverso, quindi sbagliati. */
export default function RootRedirect() {
  const { copy } = useLocale()
  const navigate = useNavigate()

  useEffect(() => {
    const stored = readStoredLocale()
    const target = stored ?? detectLocale(navigator.language)
    navigate(homePath(target), { replace: true })
  }, [navigate])

  return (
    <>
      <PageHead title={copy.meta.title} description={copy.meta.description} />
      <main>
        <ul>
          {LOCALES.map((locale) => (
            <li key={locale}>
              {/* `lang` e `hreflang`: il documento dichiara una lingua sola, ma
                  ognuna di queste etichette è nella propria. */}
              <Link to={homePath(locale)} lang={locale} hrefLang={locale}>
                {CONTENT[locale].meta.languageName}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}
