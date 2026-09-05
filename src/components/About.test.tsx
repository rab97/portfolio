import { render, screen } from '@testing-library/react'
import { LocaleProvider } from '@/i18n/LocaleProvider'
import { About } from './About'
import { itContent } from '@/content/it'

test('rende tutti i paragrafi dei contenuti', () => {
  render(
    <LocaleProvider locale="it">
      <About />
    </LocaleProvider>,
  )
  expect(screen.getAllByRole('paragraph')).toHaveLength(itContent.about.paragraphs.length)
})

test('rende ogni fatto come coppia termine-definizione', () => {
  render(
    <LocaleProvider locale="it">
      <About />
    </LocaleProvider>,
  )
  for (const fact of itContent.about.facts) {
    expect(screen.getByText(fact.label)).toBeInTheDocument()
    expect(screen.getByText(fact.value)).toBeInTheDocument()
  }
})

test('il ritratto ha un testo alternativo', () => {
  render(
    <LocaleProvider locale="it">
      <About />
    </LocaleProvider>,
  )
  expect(screen.getByRole('img', { name: itContent.meta.portraitAlt })).toBeInTheDocument()
})
