import { render } from '@testing-library/react'
import { SCHEMAS } from './index'
import { itContent } from '@/content/it'

test('esiste uno schema per ogni identificatore usato dai progetti', () => {
  for (const project of itContent.work.projects) {
    expect(SCHEMAS[project.schema]).toBeDefined()
  }
})

test.each(Object.entries(SCHEMAS))('%s: nessun colore esadecimale nell SVG', (_id, Schema) => {
  const { container } = render(<Schema label="test" labels={Array(12).fill('x')} />)
  // Senza eccezioni: le sei tessere di colore "a marchio" dello schema del
  // design system erano l'unica ammessa, e sono sparite con lo schema. Il
  // test non ha più nulla da escludere dal markup prima di cercare.
  expect(container.innerHTML).not.toMatch(/#[0-9a-fA-F]{3,8}\b/)
})

test.each(Object.entries(SCHEMAS))('%s: è etichettato per gli screen reader', (_id, Schema) => {
  const { container } = render(<Schema label="descrizione" labels={Array(12).fill('x')} />)
  const svg = container.querySelector('svg')
  expect(svg).toHaveAttribute('role', 'img')
  expect(svg).toHaveAttribute('aria-label', 'descrizione')
})
