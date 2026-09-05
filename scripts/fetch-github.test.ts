import { buildRepo } from './fetch-github'

const repoInfo = {
  full_name: 'cirulla/basil',
  html_url: 'https://github.com/cirulla/basil',
  language: 'TypeScript',
}

const contributors = [
  { login: 'someone', contributions: 300 },
  { login: 'rab97', contributions: 131 },
  { login: 'another', contributions: 348 },
]

test('costruisce un Repo a partire da repo info e contributori validi', () => {
  expect(buildRepo(repoInfo, contributors, 'rab97')).toEqual({
    fullName: 'cirulla/basil',
    url: 'https://github.com/cirulla/basil',
    language: 'TypeScript',
    contributors: 3,
    commits: 779,
    authorCommits: 131,
  })
})

test("l'abbinamento dell'autore non distingue maiuscole/minuscole", () => {
  expect(buildRepo(repoInfo, contributors, 'RAB97')?.authorCommits).toBe(131)
})

test('autore assente fra i contributori: authorCommits a zero, il resto resta valido', () => {
  const repo = buildRepo(repoInfo, contributors, 'qualcun-altro')
  expect(repo?.authorCommits).toBe(0)
  expect(repo?.commits).toBe(779)
  expect(repo?.contributors).toBe(3)
})

test('repo info malformato non fa esplodere nulla', () => {
  expect(buildRepo(null, contributors, 'rab97')).toBeNull()
  expect(buildRepo({}, contributors, 'rab97')).toBeNull()
  expect(buildRepo({ full_name: 'x' }, contributors, 'rab97')).toBeNull()
})

test('contributori malformati non fanno esplodere nulla', () => {
  expect(buildRepo(repoInfo, null, 'rab97')).toBeNull()
  expect(buildRepo(repoInfo, 'nope', 'rab97')).toBeNull()
  expect(buildRepo(repoInfo, [], 'rab97')).toBeNull()
})

test('scarta le voci malformate dentro un array di contributori altrimenti valido', () => {
  const messy = [null, 42, { login: 'rab97' }, { login: 'someone', contributions: 5 }]
  const repo = buildRepo(repoInfo, messy, 'rab97')
  expect(repo?.contributors).toBe(1)
  expect(repo?.commits).toBe(5)
  expect(repo?.authorCommits).toBe(0)
})
