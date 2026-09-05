import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { HelmetProvider } from 'react-helmet-async'
import type { RouteObject } from 'react-router'
import { routes } from '@/routes'
import { itContent } from '@/content/it'

/** Come in routes.test.tsx: in produzione è `ViteReactSSG` a montare
 *  l'HelmetProvider attorno all'app, qui lo rimontiamo a mano. */
function renderAt(path: string) {
  const router = createMemoryRouter(routes as RouteObject[], { initialEntries: [path] })
  return render(
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>,
  )
}

test('rende intro e tutte le sezioni', async () => {
  const project = itContent.work.projects[0]
  renderAt(`/it/progetti/${project.slug}`)
  expect(await screen.findByText(project.caseStudy.intro)).toBeInTheDocument()
  for (const section of project.caseStudy.sections) {
    expect(screen.getByRole('heading', { name: section.heading })).toBeInTheDocument()
  }
})

test('ha un link di ritorno alla home nella lingua giusta', async () => {
  renderAt(`/it/progetti/${itContent.work.projects[0].slug}`)
  expect(await screen.findByRole('link', { name: itContent.caseStudy.back })).toHaveAttribute(
    'href',
    '/it/',
  )
})
