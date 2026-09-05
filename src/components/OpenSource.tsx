import { useLocale } from '@/i18n/LocaleProvider'
import { SectionMark } from '@/components/SectionMark'
import type { Repo } from '@/content/schema'
import './OpenSource.css'

interface OpenSourceProps {
  /** Recuperati a tempo di build da `scripts/fetch-github.ts` e serializzati
   *  in `src/content/github.json`: il chiamante (`Home`) importa quel file
   *  e lo passa qui, così il componente resta puro rispetto ai dati e
   *  testabile senza toccare la rete. Non contengono la descrizione: quella
   *  è scritta a mano in `copy.openSource.repos` e viene abbinata qui per
   *  `fullName`. */
  repos: Repo[]
}

/** Sostituisce i segnaposto `{token}` di una stringa di copy (es.
 *  `"{author} commit su {total}"`) con i valori numerici corrispondenti. */
function renderTemplate(template: string, values: Record<string, number>): string {
  return Object.entries(values).reduce(
    (text, [token, value]) => text.replaceAll(`{${token}}`, String(value)),
    template,
  )
}

/** Sezione "open source": il progetto a cui il committente ha contribuito,
 *  non un elenco dei propri repository — per questo è pensata per reggere
 *  bene anche una sola scheda, non una griglia da sei. Non ha una voce di
 *  menu, quindi non prende un id da `SECTION_IDS` (vedi
 *  src/components/sections.ts): nessun link di navigazione punta qui.
 *
 *  Un repository presente nei contenuti (`copy.openSource.repos`) ma privo
 *  del corrispondente dato da GitHub — perché non è mai stato recuperato,
 *  o il nome pieno non combacia — non viene mostrato affatto: con un solo
 *  repository configurato, questo significa che basta un dato mancante per
 *  svuotare la sezione, ed è esattamente il caso per cui esiste
 *  `copy.openSource.unavailable`. */
export function OpenSource({ repos }: OpenSourceProps) {
  const { copy } = useLocale()
  const { openSource } = copy

  const cards = openSource.repos.flatMap((entry) => {
    const repo = repos.find((r) => r.fullName === entry.fullName)
    return repo ? [{ ...repo, description: entry.description }] : []
  })

  return (
    <section className="sec" id="open-source">
      <div className="shell">
        <SectionMark index="05" label={openSource.mark} />

        <h2 className="sec-title">{openSource.title}</h2>
        <p className="sec-lede">{openSource.lede}</p>

        {cards.length > 0 ? (
          cards.map((repo) => (
            <article className="repo-showcase" key={repo.fullName}>
              <div className="repo-main">
                <h3 className="repo-name">
                  <a href={repo.url} target="_blank" rel="noopener noreferrer">
                    {repo.fullName}
                  </a>
                </h3>
                <p className="repo-desc">{repo.description}</p>
                {repo.language && <span className="tag">{repo.language}</span>}
              </div>

              <div className="repo-stats">
                <span className="repo-stat">
                  {renderTemplate(openSource.commitStat, {
                    author: repo.authorCommits,
                    total: repo.commits,
                  })}
                </span>
                <span className="repo-stat">
                  {renderTemplate(openSource.contributorStat, { count: repo.contributors })}
                </span>
              </div>
            </article>
          ))
        ) : (
          <p className="repo-empty">{openSource.unavailable}</p>
        )}
      </div>
    </section>
  )
}
