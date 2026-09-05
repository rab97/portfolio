import { render, screen, within } from '@testing-library/react'
import { LocaleProvider } from '@/i18n/LocaleProvider'
import { Skills } from './Skills'
import { itContent } from '@/content/it'

test('rende i tre strati', () => {
  render(
    <LocaleProvider locale="it">
      <Skills />
    </LocaleProvider>,
  )
  for (const layer of itContent.skills.layers) {
    expect(screen.getByRole('heading', { name: layer.title })).toBeInTheDocument()
  }
})

test('il livello è esposto a chi non vede i pallini', () => {
  render(
    <LocaleProvider locale="it">
      <Skills />
    </LocaleProvider>,
  )
  // Scoperto durante l'esecuzione dei test: più competenze in strati diversi
  // condividono lo stesso livello (es. più voci a "5/5" nei contenuti it),
  // quindi `getByRole` senza ambito trova più corrispondenze e fallisce. Si
  // scopa la ricerca alla riga della competenza in esame tramite il suo nome.
  const first = itContent.skills.layers[0].skills[0]
  const row = screen.getByText(first.name).closest('li')
  expect(row).not.toBeNull()
  expect(within(row as HTMLElement).getByRole('img', { name: `${first.level}/5` })).toBeInTheDocument()
})
