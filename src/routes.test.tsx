import { render, screen } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { HelmetProvider } from 'react-helmet-async'
import { routes } from './routes'
import { itContent } from '@/content/it'
import { enContent } from '@/content/en'
import type { RouteObject } from 'react-router'
import type { FilledContext } from 'react-helmet-async'

/** Deve combaciare con `test.env.VITE_SITE_URL` di vite.config.ts. */
const SITE = 'https://example.test'

/** Le stesse sostituzioni che react-helmet-async applica ai valori degli
 *  attributi: senza, il test si romperebbe al primo apostrofo nei contenuti. */
function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

afterEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

// In produzione è `ViteReactSSG` a montare l'HelmetProvider attorno all'app:
// qui lo rimontiamo a mano perché le pagine dichiarano il proprio head.
function renderAt(path: string) {
  const router = createMemoryRouter(routes as RouteObject[], { initialEntries: [path] })
  return render(
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>,
  )
}

test('la home italiana rende il landmark main', async () => {
  renderAt('/it/')
  expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument()
})

test('ogni progetto ha una pagina in entrambe le lingue', async () => {
  for (const project of itContent.work.projects) {
    const view = renderAt(`/it/progetti/${project.slug}`)
    expect(await screen.findByRole('heading', { level: 1, name: project.title })).toBeInTheDocument()
    view.unmount()
  }
  for (const project of enContent.work.projects) {
    const view = renderAt(`/en/work/${project.slug}`)
    expect(await screen.findByRole('heading', { level: 1, name: project.title })).toBeInTheDocument()
    view.unmount()
  }
})

test('uno slug inesistente porta alla 404 nella lingua giusta', async () => {
  renderAt('/it/progetti/non-esiste')
  expect(await screen.findByText(itContent.notFound.title)).toBeInTheDocument()
})

test('una rotta sconosciuta porta alla 404', async () => {
  renderAt('/en/qualsiasi/cosa')
  expect(await screen.findByRole('main')).toBeInTheDocument()
  expect(screen.getByText(enContent.notFound.title)).toBeInTheDocument()
})

/** Rende una rotta come la rende il pre-rendering: niente DOM, niente effetti,
 *  e l'head raccolto nel contesto invece che applicato al documento — cioè
 *  esattamente i gruppi `meta` e `link` che `extractHelmet` di vite-react-ssg
 *  legge per costruire l'`<head>` del file HTML. */
function prerender(path: string) {
  const context = {} as FilledContext
  const wasClient = HelmetProvider.canUseDOM
  HelmetProvider.canUseDOM = false
  try {
    const router = createMemoryRouter(routes as RouteObject[], { initialEntries: [path] })
    const html = renderToStaticMarkup(
      <HelmetProvider context={context}>
        <RouterProvider router={router} />
      </HelmetProvider>,
    )
    return { html, helmet: context.helmet }
  } finally {
    HelmetProvider.canUseDOM = wasClient
  }
}

test('la radice rende i link alle due lingue anche senza JavaScript', () => {
  // renderToStaticMarkup non esegue gli effetti: è quello che vede uno scraper
  // social, che JavaScript non lo esegue.
  const { html } = prerender('/')
  expect(html).toContain('href="/it/"')
  expect(html).toContain('href="/en/"')
  expect(html).toContain(itContent.meta.languageName)
  expect(html).toContain(enContent.meta.languageName)
})

test("la pagina di un case study emette l'head che vite-react-ssg raccoglie", () => {
  const project = itContent.work.projects[0]
  const twin = enContent.work.projects[0]
  const { helmet } = prerender(`/it/progetti/${project.slug}`)
  const meta = helmet.meta.toString()
  // Helmet tiene il nome della prop React (`hrefLang`); il serializzatore di
  // vite-react-ssg lo normalizza in `hreflang` nel file. Gli attributi HTML
  // non hanno maiuscole significative, quindi si confronta senza.
  const link = helmet.link.toString().toLowerCase()
  const url = `${SITE}/it/progetti/${project.slug}/`

  // Il title è il gruppo che extractHelmet legge per primo.
  expect(helmet.title.toString()).toContain(escapeAttr(project.title))
  expect(helmet.htmlAttributes.toString()).toContain('lang="it"')

  // I tag da cui dipende l'anteprima social. Con `prioritizeSeoTags` finirebbero
  // in `helmet.priority`, che vite-react-ssg non legge: qui sparirebbero.
  expect(meta).toContain(`name="description" content="${escapeAttr(project.summary)}"`)
  expect(meta).toContain('property="og:type" content="website"')
  expect(meta).toContain(`property="og:title" content="${escapeAttr(project.title)}"`)
  expect(meta).toContain(`property="og:description" content="${escapeAttr(project.summary)}"`)
  expect(meta).toContain(`property="og:url" content="${url}"`)
  expect(meta).toContain('property="og:locale" content="it_IT"')

  // Senza immagine l'anteprima è una scheda di solo testo: metà di ciò per
  // cui esiste il pre-rendering. L'indirizzo è assoluto come canonical e
  // og:url, per lo stesso motivo (relativo, uno scraper lo scarta).
  expect(meta).toContain(`property="og:image" content="${SITE}/og.png"`)
  expect(meta).toContain('property="og:image:width" content="1200"')
  expect(meta).toContain('property="og:image:height" content="630"')
  expect(meta).toContain(
    `property="og:image:alt" content="${escapeAttr(itContent.meta.ogImageAlt)}"`,
  )
  expect(meta).toContain('name="twitter:card" content="summary_large_image"')

  // hreflang assoluti e fully-qualified, verso la stessa pagina nell'altra lingua.
  expect(link).toContain(`rel="canonical" href="${url}"`)
  expect(link).toContain(`hreflang="it" href="${url}"`)
  expect(link).toContain(`hreflang="en" href="${SITE}/en/work/${twin.slug}/"`)
  expect(link).toContain(`hreflang="x-default" href="${SITE}/en/"`)
})

test('anche la radice emette hreflang assoluti, come ogni altra pagina', () => {
  const { helmet } = prerender('/')
  const link = helmet.link.toString().toLowerCase()

  expect(link).toContain(`rel="canonical" href="${SITE}/"`)
  expect(link).toContain(`hreflang="it" href="${SITE}/it/"`)
  expect(link).toContain(`hreflang="en" href="${SITE}/en/"`)
  expect(link).toContain(`hreflang="x-default" href="${SITE}/en/"`)
})

test('la radice porta alla lingua salvata in localStorage', async () => {
  localStorage.setItem('fr.lang', 'it')
  vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-GB')
  renderAt('/')
  expect(await screen.findByText(itContent.work.projects[0].title)).toBeInTheDocument()
})

test('senza scelta salvata la radice segue la lingua del browser', async () => {
  vi.spyOn(navigator, 'language', 'get').mockReturnValue('it-IT')
  renderAt('/')
  expect(await screen.findByText(itContent.work.projects[0].title)).toBeInTheDocument()
})
