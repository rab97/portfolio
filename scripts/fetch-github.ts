import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import type { Repo } from '../src/content/schema.ts'

/** Lista esplicita di repository da mostrare, come "proprietario/repo".
 *  Non è più "i repository di un utente": il committente vuole mostrare
 *  un progetto specifico di cui non è proprietario (`cirulla/basil`), cosa
 *  che un elenco per utente non potrebbe mai trovare. Configurabile via
 *  `GITHUB_REPOS` (lista separata da virgole) per lo stesso motivo per cui
 *  lo era il nome utente: il valore qui dentro è solo il ripiego. */
const DEFAULT_REPOS = ['cirulla/basil']

/** Account di cui evidenziare il contributo (commit su commit totali) in
 *  ogni repository della lista. Non seleziona più "i repository di
 *  questo utente" — quel ruolo non esiste più — ma resta utile: dice quale
 *  riga della tabella dei contributori è quella da mettere in risalto. */
const DEFAULT_AUTHOR = 'rab97'

// Risolto da `process.cwd()` invece che da `import.meta.url`: lo script gira
// sempre da `npm run fetch:github` con la radice del progetto come cwd, ed
// `import.meta.url` non è un URL `file:` affidabile sotto ogni test runner.
const OUTPUT_PATH = resolve(process.cwd(), 'src/content/github.json')

const GITHUB_HEADERS = { Accept: 'application/vnd.github+json' }

interface RawRepoInfo {
  full_name?: unknown
  html_url?: unknown
  language?: unknown
}

interface RawContributor {
  login?: unknown
  contributions?: unknown
}

function isValidContributor(value: unknown): value is { login?: string; contributions: number } {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as RawContributor).contributions === 'number'
  )
}

/** Funzione pura: unisce la risposta di `GET /repos/:owner/:repo` e quella
 *  di `GET /repos/:owner/:repo/contributors` in un `Repo`, mettendo in
 *  risalto il contributo di `authorLogin` (commit suoi su commit totali).
 *  Non esplode su una risposta malformata — un `repoInfo` senza i campi
 *  attesi, o dei `contributors` che non sono un array (o senza nessuna
 *  voce valida), fanno tornare `null` invece di propagare un errore. Le
 *  voci malformate dentro un array altrimenti valido vengono scartate,
 *  non fanno fallire l'intero repository. Testata senza rete in
 *  `fetch-github.test.ts`. */
export function buildRepo(repoInfo: unknown, contributors: unknown, authorLogin: string): Repo | null {
  if (typeof repoInfo !== 'object' || repoInfo === null) return null
  const info = repoInfo as RawRepoInfo
  if (typeof info.full_name !== 'string' || typeof info.html_url !== 'string') return null

  if (!Array.isArray(contributors)) return null
  const valid = contributors.filter(isValidContributor)
  if (valid.length === 0) return null

  const commits = valid.reduce((sum, c) => sum + c.contributions, 0)
  const author = valid.find(
    (c) => typeof c.login === 'string' && c.login.toLowerCase() === authorLogin.toLowerCase(),
  )

  return {
    fullName: info.full_name,
    url: info.html_url,
    language: typeof info.language === 'string' ? info.language : null,
    contributors: valid.length,
    commits,
    authorCommits: author?.contributions ?? 0,
  }
}

/** Interroga l'API pubblica per ciascun repository della lista esplicita,
 *  unisce repo info e contributori con `buildRepo`, e scrive
 *  `src/content/github.json`. Se la rete non risponde, un repository non
 *  esiste, o una risposta non è valida, stampa un avviso su stderr e
 *  lascia il file esistente intatto — l'intera lista è tutto-o-niente:
 *  un deploy non deve fallire perché l'API di GitHub ha avuto un
 *  singhiozzo, ma non deve nemmeno pubblicare una sezione con solo metà
 *  dei repository richiesti perché uno era momentaneamente irraggiungibile. */
async function main(): Promise<void> {
  const repoNames = (process.env.GITHUB_REPOS?.trim() || DEFAULT_REPOS.join(','))
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean)
  const authorLogin = process.env.GITHUB_USERNAME?.trim() || DEFAULT_AUTHOR

  try {
    const repos: Repo[] = []

    for (const fullName of repoNames) {
      const [owner, repo] = fullName.split('/')
      if (!owner || !repo) {
        throw new Error(`nome repository non valido: "${fullName}" (atteso "proprietario/repo")`)
      }

      const [repoRes, contributorsRes] = await Promise.all([
        fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers: GITHUB_HEADERS }),
        fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100`, {
          headers: GITHUB_HEADERS,
        }),
      ])

      if (!repoRes.ok) {
        throw new Error(`GitHub API ha risposto ${repoRes.status} ${repoRes.statusText} per "${fullName}"`)
      }
      if (!contributorsRes.ok) {
        throw new Error(
          `GitHub API ha risposto ${contributorsRes.status} ${contributorsRes.statusText} per i contributori di "${fullName}"`,
        )
      }

      const repoInfo: unknown = await repoRes.json()
      const contributors: unknown = await contributorsRes.json()

      const repository = buildRepo(repoInfo, contributors, authorLogin)
      if (!repository) {
        throw new Error(`risposta di GitHub imprevista per "${fullName}"`)
      }
      repos.push(repository)
    }

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
// non quando `buildRepo` viene importata dai test.
const isMainModule =
  typeof process.argv[1] === 'string' && import.meta.url === pathToFileURL(process.argv[1]).href

if (isMainModule) {
  void main()
}
