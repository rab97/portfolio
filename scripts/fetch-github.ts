import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import type { Repo } from '../src/content/schema.ts'

/** Nome utente GitHub da cui leggere i repository pubblici. Si legge da
 *  `GITHUB_USERNAME` — variabile da impostare nella configurazione di
 *  deploy — e in sua assenza si usa `rab97`, il valore fornito dal
 *  committente: resta un default sovrascrivibile, non un valore cablato
 *  altrove nel codice dell'applicazione. */
const DEFAULT_USERNAME = 'rab97'

// Risolto da `process.cwd()` invece che da `import.meta.url`: lo script gira
// sempre da `npm run fetch:github` con la radice del progetto come cwd, ed
// `import.meta.url` non è un URL `file:` affidabile sotto ogni test runner.
const OUTPUT_PATH = resolve(process.cwd(), 'src/content/github.json')

export type { Repo }

/** Forma minima che ci aspettiamo da un elemento della risposta
 *  `GET /users/:user/repos`. Ogni campo è opzionale/`unknown` perché la
 *  risposta arriva dalla rete: non ci si fida della sua forma. */
interface RawRepo {
  name?: unknown
  description?: unknown
  html_url?: unknown
  stargazers_count?: unknown
  language?: unknown
  fork?: unknown
  archived?: unknown
}

function isRawRepo(value: unknown): value is RawRepo {
  return typeof value === 'object' && value !== null
}

/** Funzione pura: scarta fork e archiviati, ordina per stelle decrescenti,
 *  taglia ai primi sei. Non esplode su una risposta malformata — un
 *  elemento che non è un oggetto, o senza un `name` stringa, viene
 *  scartato invece di propagare un errore. Testata senza rete in
 *  `fetch-github.test.ts`. */
export function selectRepos(raw: unknown[]): Repo[] {
  if (!Array.isArray(raw)) return []

  return raw
    .filter(isRawRepo)
    .filter((repo) => typeof repo.name === 'string' && repo.fork !== true && repo.archived !== true)
    .map(
      (repo): Repo => ({
        name: repo.name as string,
        description: typeof repo.description === 'string' ? repo.description : null,
        url: typeof repo.html_url === 'string' ? repo.html_url : '',
        stars: typeof repo.stargazers_count === 'number' ? repo.stargazers_count : 0,
        language: typeof repo.language === 'string' ? repo.language : null,
      }),
    )
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 6)
}

/** Interroga l'API pubblica dei repository dell'utente, seleziona i sei
 *  migliori e scrive `src/content/github.json`. Se la rete non risponde,
 *  la risposta non è valida, o l'utente non esiste, stampa un avviso su
 *  stderr e lascia il file esistente intatto: un deploy non deve fallire
 *  perché l'API di GitHub ha avuto un singhiozzo — il file committato
 *  resta il ripiego. */
async function main(): Promise<void> {
  const username = process.env.GITHUB_USERNAME?.trim() || DEFAULT_USERNAME

  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
      { headers: { Accept: 'application/vnd.github+json' } },
    )

    if (!res.ok) {
      throw new Error(`GitHub API ha risposto ${res.status} ${res.statusText} per l'utente "${username}"`)
    }

    const data: unknown = await res.json()
    if (!Array.isArray(data)) {
      throw new Error('la risposta di GitHub non è un array di repository')
    }

    const repos = selectRepos(data)
    writeFileSync(OUTPUT_PATH, `${JSON.stringify(repos, null, 2)}\n`)
    console.log(`fetch-github: scritti ${repos.length} repository in ${OUTPUT_PATH}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn(
      `fetch-github: impossibile aggiornare i dati GitHub (${message}). ` +
        'src/content/github.json resta invariato.',
    )
  }
}

// Esegue solo quando lo script gira come CLI (via `tsx scripts/fetch-github.ts`),
// non quando `selectRepos` viene importata dai test.
const isMainModule =
  typeof process.argv[1] === 'string' && import.meta.url === pathToFileURL(process.argv[1]).href

if (isMainModule) {
  void main()
}
