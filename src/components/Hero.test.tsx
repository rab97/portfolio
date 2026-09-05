import { render, screen } from '@testing-library/react'
import { LocaleProvider } from '@/i18n/LocaleProvider'
import { Hero } from './Hero'
import { itContent } from '@/content/it'

test('il titolo è un h1 e contiene la parola evidenziata', () => {
  render(
    <LocaleProvider locale="it">
      <Hero />
    </LocaleProvider>,
  )
  const h1 = screen.getByRole('heading', { level: 1 })
  expect(h1).toHaveTextContent('Progetto sistemi che reggono')
  expect(h1.querySelector('mark')).not.toBeNull()
})

test('mostra tutte le metriche dei contenuti', () => {
  render(
    <LocaleProvider locale="it">
      <Hero />
    </LocaleProvider>,
  )
  for (const metric of itContent.hero.metrics) {
    expect(screen.getByText(metric.label)).toBeInTheDocument()
  }
})

test('mostra i quattro nodi del diagramma e i due bottoni', () => {
  render(
    <LocaleProvider locale="it">
      <Hero />
    </LocaleProvider>,
  )
  for (const node of itContent.hero.nodes) {
    expect(screen.getByText(node)).toBeInTheDocument()
  }
  expect(screen.getByRole('button', { name: itContent.hero.ctaPrimary })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: itContent.hero.ctaSecondary })).toBeInTheDocument()
})
