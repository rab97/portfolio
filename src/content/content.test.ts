import { itContent } from './it'
import { enContent } from './en'
import type { Portfolio } from './schema'

const locales: Array<[string, Portfolio]> = [
  ['it', itContent],
  ['en', enContent],
]

function keyPaths(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) return value.flatMap((v, i) => keyPaths(v, `${prefix}[${i}]`))
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => keyPaths(v, prefix ? `${prefix}.${k}` : k))
  }
  return [prefix]
}

test('le due lingue hanno esattamente le stesse chiavi', () => {
  expect(keyPaths(enContent).sort()).toEqual(keyPaths(itContent).sort())
})

test.each(locales)('%s: nessun testo è vuoto', (_name, content) => {
  const empty = keyPaths(content).filter((path) => {
    const value = path
      .replace(/\[(\d+)\]/g, '.$1')
      .split('.')
      .reduce<any>((acc, key) => acc?.[key], content)
    return typeof value === 'string' && value.trim() === ''
  })
  expect(empty).toEqual([])
})

test.each(locales)('%s: gli slug dei progetti sono unici', (_name, content) => {
  const slugs = content.work.projects.map((p) => p.slug)
  expect(new Set(slugs).size).toBe(slugs.length)
})

test('gli slug dei progetti coincidono fra le lingue', () => {
  expect(enContent.work.projects.map((p) => p.slug)).toEqual(
    itContent.work.projects.map((p) => p.slug),
  )
})

test.each(locales)('%s: esiste esattamente un progetto in evidenza', (_name, content) => {
  expect(content.work.projects.filter((p) => p.featured)).toHaveLength(1)
})
