import { useCallback, useEffect, useState } from 'react'

export type ThemeMode = 'auto' | 'light' | 'dark'

const KEY = 'fr.mode'
const MODES: readonly ThemeMode[] = ['auto', 'light', 'dark'] as const

function isMode(value: unknown): value is ThemeMode {
  return typeof value === 'string' && (MODES as readonly string[]).includes(value)
}

export function readStoredMode(): ThemeMode {
  try {
    const raw = localStorage.getItem(KEY)
    return isMode(raw) ? raw : 'auto'
  } catch {
    return 'auto'
  }
}

export function storeMode(mode: ThemeMode): void {
  try {
    localStorage.setItem(KEY, mode)
  } catch {
    /* storage bloccato: la scelta vale solo per questa visita */
  }
}

export function applyMode(mode: ThemeMode): void {
  const root = document.documentElement
  if (mode === 'auto') root.removeAttribute('data-mode')
  else root.setAttribute('data-mode', mode)
}

export function useThemeMode() {
  const [mode, setModeState] = useState<ThemeMode>('auto')

  // Non si legge durante il render: il pre-rendering gira in Node.
  useEffect(() => {
    setModeState(readStoredMode())
  }, [])

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next)
    storeMode(next)
    applyMode(next)
  }, [])

  return { mode, setMode }
}
