import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/** Unico punto in cui il codice legge `prefers-reduced-motion`: ogni
 *  componente con animazioni pilotate da JavaScript (Metric, MagneticButton)
 *  passa da qui invece di interrogare `matchMedia` per conto proprio. */
export function useReducedMotion(): boolean {
  // Parte da false, non da window: il pre-rendering gira in Node.
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}
