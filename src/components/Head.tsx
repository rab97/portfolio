import { Head } from 'vite-react-ssg'
import { useLocation } from 'react-router'
import { LOCALES } from '@/content/schema'
import { useLocale } from '@/i18n/LocaleProvider'
import { homePath, swapLocale } from '@/i18n/routes'

/** Origine pubblica del sito. `og:url` e `hreflang` vanno assoluti e
 *  fully-qualified: relativi, gli scraper social e Google li ignorano.
 *
 *  In build `vite.config.ts` pretende `VITE_SITE_URL` e fallisce senza. Qui
 *  resta vuota solo sotto test e in dev, dove gli URL diventano relativi alla
 *  radice del sito — cosa che non raggiunge mai nessuno scraper. */
const SITE_URL = (import.meta.env.VITE_SITE_URL ?? '').replace(/\/$/, '')
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

function absolute(path: string): string {
  return `${SITE_URL}${BASE}${path}`
}

interface PageHeadProps {
  title: string
  description: string
}

export function PageHead({ title, description }: PageHeadProps) {
  const { locale, copy } = useLocale()
  const { pathname } = useLocation()
  const url = absolute(pathname)

  // Niente `prioritizeSeoTags`: sposta i tag og:* e description in
  // `helmet.priority`, che vite-react-ssg non legge — sparirebbero dall'HTML.
  return (
    <Head htmlAttributes={{ lang: locale }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={copy.meta.title} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content={copy.meta.ogLocale} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {LOCALES.map((other) => (
        <link
          key={other}
          rel="alternate"
          hrefLang={other}
          href={absolute(swapLocale(pathname, other))}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={absolute(homePath('en'))} />
    </Head>
  )
}
