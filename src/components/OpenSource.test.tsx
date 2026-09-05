import { render, screen } from '@testing-library/react'
import { LocaleProvider } from '@/i18n/LocaleProvider'
import { OpenSource } from './OpenSource'
import { itContent } from '@/content/it'
import type { Repo } from '@/content/schema'

const basil: Repo = {
  fullName: 'cirulla/basil',
  url: 'https://github.com/cirulla/basil',
  language: 'TypeScript',
  contributors: 7,
  commits: 779,
  authorCommits: 131,
}

test('rende la card del repository con la descrizione dai contenuti, il linguaggio e il contributo', () => {
  render(
    <LocaleProvider locale="it">
      <OpenSource repos={[basil]} />
    </LocaleProvider>,
  )

  expect(screen.getByText(basil.fullName)).toBeInTheDocument()
  expect(screen.getByText(itContent.openSource.repos[0].description)).toBeInTheDocument()
  expect(screen.getByText(basil.language!)).toBeInTheDocument()
  expect(screen.getByText('131 commit su 779')).toBeInTheDocument()
  expect(screen.getByText('7 collaboratori')).toBeInTheDocument()
})

test('rende una sola card, non una griglia da sei', () => {
  render(
    <LocaleProvider locale="it">
      <OpenSource repos={[basil]} />
    </LocaleProvider>,
  )
  expect(screen.getAllByRole('link')).toHaveLength(1)
})

test('il link al repository porta rel="noopener"', () => {
  render(
    <LocaleProvider locale="it">
      <OpenSource repos={[basil]} />
    </LocaleProvider>,
  )
  const link = screen.getByRole('link', { name: basil.fullName })
  expect(link).toHaveAttribute('href', basil.url)
  expect(link.getAttribute('rel')).toMatch(/noopener/)
})

test('con repos vuoto mostra il messaggio di indisponibilità invece di una griglia vuota', () => {
  render(
    <LocaleProvider locale="it">
      <OpenSource repos={[]} />
    </LocaleProvider>,
  )
  expect(screen.getByText(itContent.openSource.unavailable)).toBeInTheDocument()
  expect(screen.queryAllByRole('link')).toHaveLength(0)
})

test('un repository nei contenuti senza dato corrispondente da GitHub svuota la sezione', () => {
  render(
    <LocaleProvider locale="it">
      <OpenSource repos={[{ ...basil, fullName: 'qualcun-altro/non-corrisponde' }]} />
    </LocaleProvider>,
  )
  expect(screen.getByText(itContent.openSource.unavailable)).toBeInTheDocument()
})
