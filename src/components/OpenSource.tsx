import { useLocale } from '@/i18n/LocaleProvider'
import { SectionMark } from '@/components/SectionMark'
import type { Repo } from '@/content/schema'
import './OpenSource.css'

interface OpenSourceProps {
  /** Selezionati a tempo di build da `scripts/fetch-github.ts` e serializzati
   *  in `src/content/github.json`: il chiamante (`Home`) importa quel file
   *  e lo passa qui, così il componente resta puro rispetto ai dati e
   *  testabile senza toccare la rete. */
  repos: Repo[]
}

/** Sezione "open source": una griglia di repository pubblici, alimentata
 *  da dati raccolti a tempo di build (mai a runtime — vedi
 *  `scripts/fetch-github.ts`). Non ha una voce di menu, quindi non prende
 *  un id da `SECTION_IDS` (vedi src/components/sections.ts): nessun link
 *  di navigazione punta qui.
 *
 *  Quando `repos` è vuoto — API irraggiungibile al momento della build,
 *  utente senza repository pubblici selezionabili — mostra
 *  `copy.openSource.unavailable` invece di rendere una griglia vuota. */
export function OpenSource({ repos }: OpenSourceProps) {
  const { copy } = useLocale()
  const { openSource } = copy

  return (
    <section className="sec" id="open-source">
      <div className="shell">
        <SectionMark index="05" label={openSource.mark} />

        <h2 className="sec-title">{openSource.title}</h2>
        <p className="sec-lede">{openSource.lede}</p>

        {repos.length > 0 ? (
          <div className="repo-grid">
            {repos.map((repo) => (
              <article className="repo-card" key={repo.name}>
                <h3 className="repo-name">
                  <a href={repo.url} target="_blank" rel="noopener noreferrer">
                    {repo.name}
                  </a>
                </h3>
                {repo.description && <p className="repo-desc">{repo.description}</p>}
                <div className="repo-meta">
                  {repo.language && <span className="tag">{repo.language}</span>}
                  <span className="repo-stars">
                    <b>{repo.stars}</b> {openSource.stars}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="repo-empty">{openSource.unavailable}</p>
        )}
      </div>
    </section>
  )
}
