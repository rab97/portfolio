import { homePath, workPath, notFoundPath, swapLocale, detectLocale } from './routes'

test('i path della home portano la lingua', () => {
  expect(homePath('it')).toBe('/it/')
  expect(homePath('en')).toBe('/en/')
})

test('il segmento dei progetti è tradotto', () => {
  expect(workPath('it', 'coolpim')).toBe('/it/progetti/coolpim/')
  expect(workPath('en', 'coolpim')).toBe('/en/work/coolpim/')
})

test('la 404 è per lingua', () => {
  expect(notFoundPath('en')).toBe('/en/404')
})

test('swapLocale traduce la home', () => {
  expect(swapLocale('/it/', 'en')).toBe('/en/')
})

test('swapLocale traduce un case study mantenendo lo slug', () => {
  expect(swapLocale('/it/progetti/pipeline', 'en')).toBe('/en/work/pipeline/')
  expect(swapLocale('/en/work/pipeline', 'it')).toBe('/it/progetti/pipeline/')
})

test('swapLocale su un path sconosciuto porta alla home della lingua', () => {
  expect(swapLocale('/qualcosa/altro', 'en')).toBe('/en/')
})

test('detectLocale riconosce le varianti italiane', () => {
  expect(detectLocale('it-IT')).toBe('it')
  expect(detectLocale('IT')).toBe('it')
})

test('detectLocale ripiega su inglese', () => {
  expect(detectLocale('fr-FR')).toBe('en')
  expect(detectLocale(undefined)).toBe('en')
})
