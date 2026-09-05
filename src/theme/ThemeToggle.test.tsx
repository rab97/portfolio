import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from './ThemeToggle'

const labels = { group: 'Tema', auto: 'AUTO', light: 'Tema chiaro', dark: 'Tema scuro' }

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-mode')
})

test('parte con auto premuto', () => {
  render(<ThemeToggle labels={labels} />)
  expect(screen.getByRole('button', { name: 'AUTO' })).toHaveAttribute('aria-pressed', 'true')
})

test('scegliere scuro imposta data-mode e lo salva', async () => {
  render(<ThemeToggle labels={labels} />)
  await userEvent.click(screen.getByRole('button', { name: 'Tema scuro' }))
  expect(document.documentElement.getAttribute('data-mode')).toBe('dark')
  expect(localStorage.getItem('fr.mode')).toBe('dark')
})

test('tornare ad auto rimuove data-mode', async () => {
  render(<ThemeToggle labels={labels} />)
  await userEvent.click(screen.getByRole('button', { name: 'Tema chiaro' }))
  await userEvent.click(screen.getByRole('button', { name: 'AUTO' }))
  expect(document.documentElement.hasAttribute('data-mode')).toBe(false)
})
