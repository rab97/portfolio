import { render, screen } from '@testing-library/react'
import { LocaleProvider } from '@/i18n/LocaleProvider'
import { Timeline } from './Timeline'
import { itContent } from '@/content/it'

test('rende una voce per ogni riga del percorso', () => {
  render(
    <LocaleProvider locale="it">
      <Timeline />
    </LocaleProvider>,
  )
  expect(screen.getAllByRole('listitem')).toHaveLength(itContent.path.entries.length)
})

test('la voce corrente è marcata anche semanticamente', () => {
  render(
    <LocaleProvider locale="it">
      <Timeline />
    </LocaleProvider>,
  )
  const current = itContent.path.entries.find((e) => e.current)!
  expect(screen.getByText(current.period).closest('li')).toHaveAttribute('aria-current', 'true')
})
