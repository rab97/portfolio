import { readStoredMode, storeMode, applyMode } from './themeMode'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-mode')
})

test('senza nulla in memoria il tema è auto', () => {
  expect(readStoredMode()).toBe('auto')
})

test('un valore salvato viene riletto', () => {
  storeMode('dark')
  expect(readStoredMode()).toBe('dark')
})

test('un valore corrotto in memoria non rompe nulla', () => {
  localStorage.setItem('fr.mode', 'banana')
  expect(readStoredMode()).toBe('auto')
})

test('applyMode scrive data-mode sulla radice', () => {
  applyMode('light')
  expect(document.documentElement.getAttribute('data-mode')).toBe('light')
})

test('applyMode con auto rimuove data-mode', () => {
  applyMode('dark')
  applyMode('auto')
  expect(document.documentElement.hasAttribute('data-mode')).toBe(false)
})

test('con localStorage inaccessibile non solleva eccezioni', () => {
  const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('bloccato')
  })
  expect(() => storeMode('dark')).not.toThrow()
  spy.mockRestore()
})
