import type { Portfolio } from '@/content/schema'
import { useThemeMode, type ThemeMode } from './themeMode'

interface ThemeToggleProps {
  labels: Portfolio['themeLabels']
}

export function ThemeToggle({ labels }: ThemeToggleProps) {
  const { mode, setMode } = useThemeMode()

  const isPressed = (value: ThemeMode) => mode === value

  return (
    <div className="seg" role="group" aria-label={labels.group}>
      <button type="button" aria-pressed={isPressed('auto')} onClick={() => setMode('auto')}>
        {labels.auto}
      </button>
      <button
        type="button"
        aria-pressed={isPressed('light')}
        aria-label={labels.light}
        title={labels.light}
        onClick={() => setMode('light')}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
        </svg>
      </button>
      <button
        type="button"
        aria-pressed={isPressed('dark')}
        aria-label={labels.dark}
        title={labels.dark}
        onClick={() => setMode('dark')}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a8.6 8.6 0 1 0 11.1 11.1z" />
        </svg>
      </button>
    </div>
  )
}
