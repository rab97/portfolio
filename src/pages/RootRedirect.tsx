import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { Head } from 'vite-react-ssg'
import type { Locale, Portfolio } from '@/content/schema'
import { LOCALES } from '@/content/schema'
import { itContent } from '@/content/it'
import { enContent } from '@/content/en'
import { detectLocale, homePath } from '@/i18n/routes'
import { readStoredLocale } from '@/i18n/langStorage'

const CONTENT: Record<Locale, Portfolio> = { it: itContent, en: enContent }

/** La radice non è una lingua: rende i link a entrambe le versioni — così un
 *  crawler senza JavaScript le raggiunge comunque — e in un effetto porta il
 *  browser sulla lingua scelta in precedenza, o su quella del browser. */
export default function RootRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    const stored = readStoredLocale()
    const target = stored ?? detectLocale(navigator.language)
    navigate(homePath(target), { replace: true })
  }, [navigate])

  return (
    <>
      <Head>
        <title>{enContent.meta.title}</title>
        <meta name="description" content={enContent.meta.description} />
        {LOCALES.map((locale) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={homePath(locale)} />
        ))}
        <link rel="alternate" hrefLang="x-default" href={homePath('en')} />
      </Head>
      <main>
        <ul>
          {LOCALES.map((locale) => (
            <li key={locale}>
              <Link to={homePath(locale)}>{CONTENT[locale].meta.languageName}</Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}
