import { render, screen, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { HelmetProvider } from 'react-helmet-async'
import type { RouteObject } from 'react-router'
import { routes } from '@/routes'

/** Come in CaseStudy.test.tsx: in produzione è `ViteReactSSG` a montare
 *  l'HelmetProvider attorno all'app, qui lo rimontiamo a mano. */
function renderAt(path: string) {
  const router = createMemoryRouter(routes as RouteObject[], { initialEntries: [path] })
  return render(
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>,
  )
}

/** Il contratto documentato in `src/components/sections.ts`: ogni ancora
 *  che `Nav` costruisce da `SECTION_IDS` deve atterrare su un elemento
 *  realmente presente nella pagina. Finché una sola sezione mancava (il
 *  contatto, arrivato con questo task) il test non poteva ancora
 *  verificarlo per l'intera home: ora che tutte e cinque esistono, lo fa
 *  rendendo l'intera pagina e cercando, per ognuna delle ancore prodotte
 *  dalla navigazione, l'elemento con quell'id nel documento. */
test('ogni ancora della navigazione atterra su una sezione realmente presente', async () => {
  renderAt('/it/')

  const nav = await screen.findByRole('navigation')
  const anchors = within(nav)
    .getAllByRole('link')
    .filter((link) => link.getAttribute('href')?.startsWith('#'))

  // Deve esserci almeno un'ancora da verificare, altrimenti il test
  // passerebbe a vuoto se `Nav` smettesse di produrne.
  expect(anchors.length).toBeGreaterThan(0)

  for (const anchor of anchors) {
    const id = anchor.getAttribute('href')!.slice(1)
    expect(document.getElementById(id), `nessun elemento con id="${id}"`).not.toBeNull()
  }
})
