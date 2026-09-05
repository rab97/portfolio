import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MagneticButton } from './MagneticButton'

/** Era l'unico componente interattivo del progetto senza test, ed è per
 *  questo che le due CTA dell'hero sono rimaste morte: `onClick` era
 *  dichiarato nell'interfaccia e nessuno lo passava, quindi nessuna
 *  asserzione se ne accorgeva. Il primo test qui sotto è quello che l'avrebbe
 *  presa. */

/** jsdom non ha layout: `getBoundingClientRect` restituisce tutti zeri e
 *  `PointerEvent` non esiste. Basta per verificare *che* l'effetto magnetico
 *  si attivi e su quali eventi, non di quanto sposti — quello è un fatto
 *  visivo, e sta nel mockup. */
function pointerMove(el: Element, clientX: number, clientY: number) {
  el.dispatchEvent(new MouseEvent('pointermove', { clientX, clientY, bubbles: true }))
}

afterEach(() => {
  vi.restoreAllMocks()
})

test('rende un bottone di tipo button, non un submit', () => {
  // Dentro un eventuale form, il default `submit` invierebbe il form.
  render(<MagneticButton variant="solid">azione</MagneticButton>)
  expect(screen.getByRole('button', { name: 'azione' })).toHaveAttribute('type', 'button')
})

test('la variante decide la classe, e resta sempre .btn', () => {
  const { rerender } = render(<MagneticButton variant="solid">azione</MagneticButton>)
  expect(screen.getByRole('button')).toHaveClass('btn', 'btn-solid')

  rerender(<MagneticButton variant="ghost">azione</MagneticButton>)
  expect(screen.getByRole('button')).toHaveClass('btn', 'btn-ghost')
})

test('al click chiama onClick', async () => {
  const onClick = vi.fn()
  render(
    <MagneticButton variant="solid" onClick={onClick}>
      azione
    </MagneticButton>,
  )

  await userEvent.click(screen.getByRole('button', { name: 'azione' }))
  expect(onClick).toHaveBeenCalledTimes(1)
})

test('anche da tastiera: è un bottone vero, non un div cliccabile', async () => {
  const onClick = vi.fn()
  render(
    <MagneticButton variant="solid" onClick={onClick}>
      azione
    </MagneticButton>,
  )

  await userEvent.tab()
  expect(screen.getByRole('button')).toHaveFocus()
  await userEvent.keyboard('{Enter}')
  expect(onClick).toHaveBeenCalledTimes(1)
})

test('senza onClick il click non solleva', async () => {
  // La prop è facoltativa: un bottone decorativo non deve rompersi.
  render(<MagneticButton variant="ghost">azione</MagneticButton>)
  await userEvent.click(screen.getByRole('button'))
  expect(screen.getByRole('button')).toBeInTheDocument()
})

test('parte da uno stato di riposo: nessuna trasformazione prima del puntatore', () => {
  render(<MagneticButton variant="solid">azione</MagneticButton>)
  expect(screen.getByRole('button').style.transform).toBe('')
})

test('il puntatore sposta il bottone, e uscendo lo rimette a posto', () => {
  render(<MagneticButton variant="solid">azione</MagneticButton>)
  const button = screen.getByRole('button')

  pointerMove(button, 40, 30)
  expect(button.style.transform).toMatch(/^translate\(/)

  button.dispatchEvent(new MouseEvent('pointerleave', { bubbles: true }))
  expect(button.style.transform).toBe('')
})

test('con moto ridotto non ascolta nemmeno il puntatore', () => {
  vi.spyOn(window, 'matchMedia').mockReturnValue({
    matches: true,
    addEventListener: () => {},
    removeEventListener: () => {},
  } as unknown as MediaQueryList)

  render(<MagneticButton variant="solid">azione</MagneticButton>)
  const button = screen.getByRole('button')

  pointerMove(button, 40, 30)
  // Non solo l'animazione è spenta: il listener non è mai stato registrato,
  // quindi il puntatore non produce nessuna trasformazione.
  expect(button.style.transform).toBe('')
})

test('con moto ridotto il click continua a funzionare', async () => {
  vi.spyOn(window, 'matchMedia').mockReturnValue({
    matches: true,
    addEventListener: () => {},
    removeEventListener: () => {},
  } as unknown as MediaQueryList)

  const onClick = vi.fn()
  render(
    <MagneticButton variant="solid" onClick={onClick}>
      azione
    </MagneticButton>,
  )

  await userEvent.click(screen.getByRole('button'))
  expect(onClick).toHaveBeenCalledTimes(1)
})

test('smontando toglie i listener dal bottone', () => {
  const view = render(<MagneticButton variant="solid">azione</MagneticButton>)
  const button = screen.getByRole('button')
  const remove = vi.spyOn(button, 'removeEventListener')

  view.unmount()

  const removed = remove.mock.calls.map(([type]) => type)
  expect(removed).toContain('pointermove')
  expect(removed).toContain('pointerleave')
})
