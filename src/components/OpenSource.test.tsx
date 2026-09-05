import { render, screen } from '@testing-library/react'
import { LocaleProvider } from '@/i18n/LocaleProvider'
import { OpenSource } from './OpenSource'
import { itContent } from '@/content/it'
import type { Repo } from '@/content/schema'

const repos: Repo[] = [
  {
    name: 'design-token-forge',
    description: 'Style Dictionary pipeline for tokens.',
    url: 'https://github.com/rab97/design-token-forge',
    stars: 128,
    language: 'TypeScript',
  },
  {
    name: 'catalog-sync-pipeline',
    description: null,
    url: 'https://github.com/rab97/catalog-sync-pipeline',
    stars: 64,
    language: null,
  },
]

test('rende una card per ogni repository, con nome, descrizione, linguaggio e stelle', () => {
  render(
    <LocaleProvider locale="it">
      <OpenSource repos={repos} />
    </LocaleProvider>,
  )

  for (const repo of repos) {
    expect(screen.getByText(repo.name)).toBeInTheDocument()
    if (repo.description) expect(screen.getByText(repo.description)).toBeInTheDocument()
    if (repo.language) expect(screen.getByText(repo.language)).toBeInTheDocument()
    expect(screen.getByText(String(repo.stars))).toBeInTheDocument()
  }
})

test('ogni repository linka a GitHub con rel="noopener"', () => {
  render(
    <LocaleProvider locale="it">
      <OpenSource repos={repos} />
    </LocaleProvider>,
  )

  for (const repo of repos) {
    const link = screen.getByRole('link', { name: new RegExp(repo.name) })
    expect(link).toHaveAttribute('href', repo.url)
    expect(link.getAttribute('rel')).toMatch(/noopener/)
  }
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
