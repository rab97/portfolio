import { render, screen } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router'
import { HelmetProvider } from 'react-helmet-async'
import { routes } from './routes'
import RootRedirect from '@/pages/RootRedirect'
import { itContent } from '@/content/it'
import { enContent } from '@/content/en'
import type { RouteObject } from 'react-router'

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
  expect(await screen.findByRole('main')).toBeInTheDocument()
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

test('la radice rende i link alle due lingue anche senza JavaScript', () => {
  // renderToStaticMarkup non esegue gli effetti: è esattamente quello che vede
  // uno scraper social, che JavaScript non lo esegue.
  const html = renderToStaticMarkup(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/']}>
        <RootRedirect />
      </MemoryRouter>
    </HelmetProvider>,
  )
  expect(html).toContain('href="/it/"')
  expect(html).toContain('href="/en/"')
  expect(html).toContain(itContent.meta.languageName)
  expect(html).toContain(enContent.meta.languageName)
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
