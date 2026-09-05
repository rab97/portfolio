import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { LocaleProvider } from '@/i18n/LocaleProvider'
import { Nav } from './Nav'
import { itContent } from '@/content/it'

function setup(initialEntries: string[]) {
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <LocaleProvider locale="it">
        <Nav />
      </LocaleProvider>
    </MemoryRouter>,
  )
}

test('espone un landmark di navigazione', () => {
  setup(['/it/'])
  expect(screen.getByRole('navigation')).toBeInTheDocument()
})

test('mostra lo stato di disponibilità dai contenuti', () => {
  setup(['/it/'])
  expect(screen.getByText(itContent.availability)).toBeInTheDocument()
})

test('contiene entrambi i controlli, lingua e tema', () => {
  setup(['/it/'])
  expect(screen.getByRole('group', { name: itContent.langLabel })).toBeInTheDocument()
  expect(screen.getByRole('group', { name: itContent.themeLabels.group })).toBeInTheDocument()
})

test('sulla home i link di navigazione sono ancore semplici', () => {
  setup(['/it/'])
  expect(screen.getByRole('link', { name: itContent.nav.about })).toHaveAttribute(
    'href',
    '#about',
  )
})

test('su una pagina di case study i link puntano alla home seguita dall ancora', () => {
  setup(['/it/progetti/design-system'])
  expect(screen.getByRole('link', { name: itContent.nav.about })).toHaveAttribute(
    'href',
    '/it/#about',
  )
  expect(screen.getByRole('link', { name: itContent.nav.contact })).toHaveAttribute(
    'href',
    '/it/#contact',
  )
})
