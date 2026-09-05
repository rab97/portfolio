import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LocaleProvider } from '@/i18n/LocaleProvider'
import { Hero } from './Hero'
import { SECTION_IDS } from './sections'
import { itContent } from '@/content/it'

function renderHero() {
  return render(
    <LocaleProvider locale="it">
      <Hero />
    </LocaleProvider>,
  )
}

test('il titolo è un h1 e contiene la parola evidenziata', () => {
  renderHero()
  const h1 = screen.getByRole('heading', { level: 1 })
  expect(h1).toHaveTextContent('Progetto sistemi che reggono')
  expect(h1.querySelector('mark')).not.toBeNull()
})

test('mostra tutte le metriche dei contenuti', () => {
  renderHero()
  for (const metric of itContent.hero.metrics) {
    expect(screen.getByText(metric.label)).toBeInTheDocument()
  }
})

test('mostra i quattro nodi del diagramma e la sola CTA rimasta', () => {
  renderHero()
  for (const node of itContent.hero.nodes) {
    expect(screen.getByText(node)).toBeInTheDocument()
  }
  // Una sola: la seconda era "scarica il CV", tolta perché non c'è un PDF
  // pubblicabile. Se ne ricomparisse una senza azione, questo lo direbbe.
  expect(screen.getAllByRole('button')).toHaveLength(1)
  expect(screen.getByRole('button', { name: itContent.hero.ctaPrimary })).toBeInTheDocument()
})

test('la CTA porta alla sezione progetti', async () => {
  // jsdom non implementa lo scorrimento: si verifica che il bottone chieda
  // alla sezione giusta di portarsi in vista, non di quanti pixel scorra.
  const section = document.createElement('section')
  section.id = SECTION_IDS[2]
  document.body.append(section)
  const scrollIntoView = vi.fn()
  section.scrollIntoView = scrollIntoView

  renderHero()
  await userEvent.click(screen.getByRole('button', { name: itContent.hero.ctaPrimary }))

  // Il bottone più visibile del sito è rimasto inerte per tutta
  // l'implementazione: `onClick` era dichiarato in MagneticButton e Hero non
  // lo passava. Questa asserzione è quella che lo avrebbe visto.
  expect(scrollIntoView).toHaveBeenCalledTimes(1)
  section.remove()
})
