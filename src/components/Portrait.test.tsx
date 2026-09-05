import { render, screen } from '@testing-library/react'
import { Portrait } from './Portrait'

const ALT = 'Ritratto fotografico'

test('espone il testo alternativo a chi usa uno screen reader', () => {
  render(<Portrait alt={ALT} />)
  expect(screen.getByRole('img', { name: ALT })).toBeInTheDocument()
})

test('non porta colori fissati: ogni colore viene da un token del tema', () => {
  const { container } = render(<Portrait alt={ALT} />)
  // Niente esadecimali: il segnaposto deve seguire il tema (chiaro/scuro),
  // non restare fissato ai valori di un solo tema.
  expect(container.innerHTML).not.toMatch(/#[0-9a-fA-F]{3,8}/)
  // I colori usati arrivano dai token, non da valori inventati.
  expect(container.innerHTML).toContain('var(--panel)')
  expect(container.innerHTML).toContain('var(--line-2)')
  expect(container.innerHTML).toContain('var(--faint)')
})

test('il segnaposto resta in linea nel DOM, non un file esterno', () => {
  const { container } = render(<Portrait alt={ALT} />)
  expect(container.querySelector('svg[role="img"]')).not.toBeNull()
  expect(container.querySelector('img')).toBeNull()
})
