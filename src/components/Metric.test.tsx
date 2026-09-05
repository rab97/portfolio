import { render, screen } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Metric } from './Metric'

afterEach(() => {
  vi.restoreAllMocks()
})

test('mostra subito il valore finale quando il moto è ridotto', () => {
  vi.spyOn(window, 'matchMedia').mockReturnValue({
    matches: true,
    addEventListener: () => {},
    removeEventListener: () => {},
  } as unknown as MediaQueryList)
  render(<Metric value="214k" label="SKU" delayMs={0} />)
  expect(screen.getByText('214k')).toBeInTheDocument()
})

test('arriva al valore finale anche con l animazione attiva', async () => {
  render(<Metric value="138" label="componenti" delayMs={0} />)
  expect(await screen.findByText('138', {}, { timeout: 3000 })).toBeInTheDocument()
})

test('un valore senza parte numerica viene mostrato tale e quale', () => {
  render(<Metric value="p95" label="latenza" delayMs={0} />)
  expect(screen.getByText('p95')).toBeInTheDocument()
})

test('cancella il timer se smontato prima che parta l animazione', () => {
  const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout')
  const { unmount } = render(<Metric value="138" label="componenti" delayMs={50} />)
  // Lo smontaggio avviene prima che il setTimeout scada: il cleanup deve
  // comunque cancellarlo, altrimenti il timer scatterebbe su un componente
  // che non esiste più.
  unmount()
  expect(clearTimeoutSpy).toHaveBeenCalled()
})

test('cancella il frame se smontato a metà dell animazione', async () => {
  const cancelFrameSpy = vi.spyOn(window, 'cancelAnimationFrame')
  const { unmount } = render(<Metric value="138" label="componenti" delayMs={0} />)
  // Aspetta che il setTimeout(0) scada e che almeno un frame sia stato
  // richiesto, poi smonta a metà: il cleanup deve cancellarlo.
  await new Promise((resolve) => setTimeout(resolve, 20))
  unmount()
  expect(cancelFrameSpy).toHaveBeenCalled()
})

test('senza effetti (come nel pre-rendering) mostra già il valore finale', () => {
  // renderToStaticMarkup non esegue alcun effetto: è esattamente ciò che il
  // pre-rendering produce. Il valore finale deve essere già lì, non uno zero
  // in attesa dell animazione.
  const html = renderToStaticMarkup(<Metric value="214k" label="SKU" delayMs={0} />)
  expect(html).toContain('214k')
  expect(html).not.toContain('>0k<')
})
