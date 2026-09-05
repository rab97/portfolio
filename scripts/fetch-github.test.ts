import { selectRepos } from './fetch-github'

const raw = [
  { name: 'a', description: 'x', html_url: 'u', stargazers_count: 5, language: 'TypeScript', fork: false, archived: false },
  { name: 'b', description: null, html_url: 'u', stargazers_count: 9, language: null, fork: true, archived: false },
  { name: 'c', description: 'y', html_url: 'u', stargazers_count: 1, language: 'Go', fork: false, archived: true },
]

test('scarta fork e archiviati', () => {
  expect(selectRepos(raw).map((r) => r.name)).toEqual(['a'])
})

test('ordina per stelle decrescenti e taglia a sei', () => {
  const many = Array.from({ length: 10 }, (_, i) => ({
    name: `r${i}`, description: null, html_url: 'u', stargazers_count: i, language: null, fork: false, archived: false,
  }))
  const selected = selectRepos(many)
  expect(selected).toHaveLength(6)
  expect(selected[0].name).toBe('r9')
})

test('una risposta malformata non fa esplodere nulla', () => {
  expect(selectRepos([null, 42, {}] as unknown[])).toEqual([])
})
