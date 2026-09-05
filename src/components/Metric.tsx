import { useEffect, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/** Come nel mockup: 1100ms, easing cubico in uscita. */
const DURATION_MS = 1100

function easeOutCubic(p: number): number {
  return 1 - Math.pow(1 - p, 3)
}

/** Separa `"214k"` in `214` e `"k"`, `"42 ms"` in `42` e `" ms"`. `"p95"` non
 *  ha una parte numerica iniziale: resta `null`, e il valore va mostrato
 *  tale e quale senza animazione. */
function splitValue(value: string): { target: number; suffix: string } | null {
  const match = /^(\d+)(.*)$/.exec(value)
  if (!match) return null
  return { target: Number(match[1]), suffix: match[2] }
}

interface MetricProps {
  value: string
  label: string
  delayMs: number
}

export function Metric({ value, label, delayMs }: MetricProps) {
  const reducedMotion = useReducedMotion()
  // Primitivi stabili da mettere in dipendenza dell'effetto: l'oggetto
  // restituito da splitValue è ricreato a ogni render, e non lo è.
  const split = splitValue(value)
  const target = split?.target ?? null
  const suffix = split?.suffix ?? ''

  // Stato di riposo: il valore finale, sempre. È ciò che il pre-rendering
  // produce (nessun effetto viene eseguito in Node), ed è ciò che resta se
  // il moto è ridotto o se non c'è nulla da animare.
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    if (target === null || reducedMotion) {
      setDisplay(value)
      return
    }

    let frame: number | undefined
    let start: number | null = null

    function step(t: number) {
      if (start === null) start = t
      const p = Math.min((t - start) / DURATION_MS, 1)
      setDisplay(p < 1 ? `${Math.round(target! * easeOutCubic(p))}${suffix}` : value)
      if (p < 1) frame = requestAnimationFrame(step)
    }

    setDisplay(`0${suffix}`)
    const timeout = setTimeout(() => {
      frame = requestAnimationFrame(step)
    }, delayMs)

    return () => {
      clearTimeout(timeout)
      if (frame !== undefined) cancelAnimationFrame(frame)
    }
  }, [value, target, suffix, delayMs, reducedMotion])

  return (
    <div className="metric">
      <b>{display}</b>
      <span>{label}</span>
    </div>
  )
}
