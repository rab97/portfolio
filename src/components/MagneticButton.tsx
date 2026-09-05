import { useEffect, useRef, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/** Come nel mockup: orizzontale più contenuto, verticale più pronunciato. */
const FACTOR_X = 0.22
const FACTOR_Y = 0.34

interface MagneticButtonProps {
  variant: 'solid' | 'ghost'
  onClick?: () => void
  children: ReactNode
}

export function MagneticButton({ variant, onClick, children }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    // Niente listener registrati quando il moto è ridotto: non solo
    // l'animazione va spenta, l'ascolto stesso non deve esistere.
    if (reducedMotion) return

    const el = ref.current
    if (!el) return

    function onPointerMove(e: PointerEvent) {
      const rect = el!.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) * FACTOR_X
      const y = (e.clientY - rect.top - rect.height / 2) * FACTOR_Y
      el!.style.transform = `translate(${x}px, ${y}px)`
    }
    function onPointerLeave() {
      el!.style.transform = ''
    }

    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerleave', onPointerLeave)
    return () => {
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [reducedMotion])

  return (
    <button
      ref={ref}
      type="button"
      className={variant === 'solid' ? 'btn btn-solid' : 'btn btn-ghost'}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
