import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router'
import { LocaleProvider } from './LocaleProvider'
import { LangToggle } from './LangToggle'

function Spy() {
  return <span data-testid="path">{useLocation().pathname}</span>
}

function setup(initial: string) {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <LocaleProvider locale="it">
        <LangToggle />
        <Routes>
          <Route path="*" element={<Spy />} />
        </Routes>
      </LocaleProvider>
    </MemoryRouter>,
  )
}

test('la lingua corrente è premuta', () => {
  setup('/it/')
  expect(screen.getByRole('button', { name: 'IT' })).toHaveAttribute('aria-pressed', 'true')
})

test('cliccare EN naviga alla rotta equivalente', async () => {
  setup('/it/progetti/pipeline')
  await userEvent.click(screen.getByRole('button', { name: 'EN' }))
  expect(screen.getByTestId('path')).toHaveTextContent('/en/work/pipeline/')
})

test('la scelta viene salvata', async () => {
  localStorage.clear()
  setup('/it/')
  await userEvent.click(screen.getByRole('button', { name: 'EN' }))
  expect(localStorage.getItem('fr.lang')).toBe('en')
})
