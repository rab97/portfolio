import { renderHook } from '@testing-library/react'
import { useReducedMotion } from './useReducedMotion'

test('è false quando la media query non corrisponde', () => {
  expect(renderHook(() => useReducedMotion()).result.current).toBe(false)
})

test('è true quando la media query corrisponde', () => {
  vi.spyOn(window, 'matchMedia').mockReturnValue({
    matches: true,
    addEventListener: () => {},
    removeEventListener: () => {},
  } as unknown as MediaQueryList)
  expect(renderHook(() => useReducedMotion()).result.current).toBe(true)
})
