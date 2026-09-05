import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { LocaleProvider } from '@/i18n/LocaleProvider'
import { ProjectCard } from './ProjectCard'
import { itContent } from '@/content/it'

test('il titolo rimanda al case study nella lingua giusta', () => {
  const project = itContent.work.projects[0]
  render(
    <MemoryRouter>
      <LocaleProvider locale="it">
        <ProjectCard project={project} featured />
      </LocaleProvider>
    </MemoryRouter>,
  )
  expect(screen.getByRole('link', { name: new RegExp(project.title) })).toHaveAttribute(
    'href',
    `/it/progetti/${project.slug}/`,
  )
})

test('i link marcati privati non sono link', () => {
  const project = { ...itContent.work.projects[0], links: [{ kind: 'private' as const, label: 'Codice privato' }] }
  render(
    <MemoryRouter>
      <LocaleProvider locale="it">
        <ProjectCard project={project} featured={false} />
      </LocaleProvider>
    </MemoryRouter>,
  )
  expect(screen.queryByRole('link', { name: 'Codice privato' })).not.toBeInTheDocument()
})
