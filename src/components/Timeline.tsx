import { useLocale } from '@/i18n/LocaleProvider'
import { SectionMark } from '@/components/SectionMark'
import { SECTION_IDS } from '@/components/sections'
import './Timeline.css'

/** Sezione "percorso": una riga per ogni tappa professionale, dalla più
 *  recente alla più vecchia. L'`id` è `SECTION_IDS[3]` ("path"), non
 *  l'etichetta tradotta del marcatore (vedi src/components/sections.ts).
 *
 *  Nel mockup il ruolo attuale è segnalato da un pallino verde generato
 *  dal CSS (`.tl.now .tl-when::before`), puramente decorativo: chi usa
 *  uno screen reader non lo percepisce. La voce con `entry.current` porta
 *  quindi anche `aria-current="true"`, così l'informazione esiste anche
 *  senza il colore. */
export function Timeline() {
  const { copy } = useLocale()
  const { path } = copy

  return (
    <section className="sec" id={SECTION_IDS[3]}>
      <div className="shell">
        <SectionMark index="04" label={path.mark} />

        <h2 className="sec-title">{path.title}</h2>

        <ul className="timeline">
          {path.entries.map((entry) => (
            <li
              className={entry.current ? 'tl now' : 'tl'}
              aria-current={entry.current ? 'true' : undefined}
              key={entry.period}
            >
              <div className="tl-when">{entry.period}</div>
              <div className="tl-what">
                <h3>
                  {entry.role} <em>· {entry.org}</em>
                </h3>
                <p>{entry.body}</p>
                <div className="tags">
                  {entry.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
