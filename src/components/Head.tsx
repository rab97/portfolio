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

/** Ogni pagina reale è pre-renderizzata come directory + `index.html`
 *  (`dirStyle: 'nested'` in vite.config.ts): l'URL che risponde senza un
 *  redirect è sempre quello con la barra finale. Le rotte di React Router
 *  (vedi `src/i18n/routes.ts`) restano senza — cambiarle sposterebbe
 *  l'incoerenza sulla navigazione interna — quindi la barra si aggiunge qui,
 *  nell'unico punto che compone gli indirizzi assoluti esposti a scraper e
 *  motori di ricerca. */
function absolute(path: string): string {
  const withTrailingSlash = path.endsWith('/') ? path : `${path}/`
  return `${SITE_URL}${BASE}${withTrailingSlash}`
}

/** L'immagine di anteprima social, in `public/` e quindi servita sotto la
 *  base del sito. Assoluta come `canonical` e `og:url`, e per lo stesso
 *  motivo: uno scraper che legge un `og:image` relativo lo scarta, e resta
 *  una scheda di solo testo — cioè metà del motivo per cui questo sito è
 *  pre-renderizzato.
 *
 *  Il file è generato da `scripts/og-image/generate.mjs` (`npm run
 *  og:image`) dal design del sito stesso, e va rifatto quando cambiano il
 *  nome o il ruolo nei contenuti. Le misure sono dichiarate perché lo
 *  scraper possa riservare lo spazio dell'anteprima grande prima di aver
 *  scaricato il PNG, e devono restare uguali a quelle dello script. */
const OG_IMAGE = `${SITE_URL}${BASE}/og.png`
const OG_IMAGE_WIDTH = '1200'
const OG_IMAGE_HEIGHT = '630'

interface PageHeadProps {
  title: string
  description: string
  /** Pagine che esistono come file ma non sono contenuti: le due 404.
   *
   *  Un hosting statico serve `/it/404/` con stato 200 come qualunque altra
   *  pagina, quindi per un motore di ricerca è una pagina normale — e su un
   *  sito da tredici pagine due risultati intitolati "404 — pagina non
   *  trovata" sono il 15% dell'indice. Con `noindex` sparisce dall'indice;
   *  `follow` perché i link che contiene (il ritorno alla home) restano
   *  buoni da seguire.
   *
   *  Insieme all'indicizzazione saltano anche `canonical` e gli `hreflang`:
   *  un canonico a sé stessa è la dichiarazione opposta ("questa pagina è
   *  l'originale, indicizza questa"), e un `hreflang` verso una pagina non
   *  indicizzata non ha nulla da collegare. */
  noindex?: boolean
}

/** TEMPORANEO — TOGLIERE QUANDO I CONTENUTI SARANNO VERI.
 *
 *  Tutti i testi del sito sono ancora segnaposto inventati (l'elenco esatto è
 *  in testa a `src/content/it.ts`): anni di esperienza, aziende, numeri di
 *  produzione e contatti non corrispondono a nessuna persona reale. Finché è
 *  così il sito non deve finire negli indici dei motori di ricerca, perché
 *  un portfolio pubblico che attribuisce al proprietario cose che non ha
 *  fatto è peggio di un portfolio assente — e una volta indicizzato resta in
 *  giro molto dopo la correzione.
 *
 *  A differenza del `noindex` delle 404, questo NON rimuove `canonical` e gli
 *  `hreflang`: quelle dichiarazioni restano corrette, è solo l'indicizzazione
 *  a essere sospesa.
 *
 *  Per rimuoverlo: cancella questa costante e il suo uso qui sotto. */
const PLACEHOLDER_CONTENT = true

export function PageHead({ title, description, noindex = false }: PageHeadProps) {
  const { locale, copy } = useLocale()
  const { pathname } = useLocation()
  const url = absolute(pathname)

  // Niente `prioritizeSeoTags`: sposta i tag og:* e description in
  // `helmet.priority`, che vite-react-ssg non legge — sparirebbero dall'HTML.
  return (
    <Head htmlAttributes={{ lang: locale }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      {(noindex || PLACEHOLDER_CONTENT) && <meta name="robots" content="noindex, follow" />}
      {!noindex && <link rel="canonical" href={url} />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={copy.meta.title} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content={copy.meta.ogLocale} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content={OG_IMAGE_WIDTH} />
      <meta property="og:image:height" content={OG_IMAGE_HEIGHT} />
      <meta property="og:image:alt" content={copy.meta.ogImageAlt} />
      {/* `summary_large_image` e non `summary`: con un'immagine 1200×630
          l'anteprima è la scheda grande, che è quella che il pre-rendering
          esiste per produrre. Con `summary` la stessa immagine verrebbe
          ritagliata in un quadratino di fianco al testo. */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {!noindex &&
        LOCALES.map((other) => (
          <link
            key={other}
            rel="alternate"
            hrefLang={other}
            href={absolute(swapLocale(pathname, other))}
          />
        ))}
      {!noindex && <link rel="alternate" hrefLang="x-default" href={absolute(homePath('en'))} />}
    </Head>
  )
}
