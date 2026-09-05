import type { LayerId } from '@/content/schema'
import { useLocale } from '@/i18n/LocaleProvider'
import { SectionMark } from '@/components/SectionMark'
import { SECTION_IDS } from '@/components/sections'
import './Skills.css'

/** Mappa esplicita da `layer.id` alla classe di colore dello strato:
 *  `is-fe`/`is-be`/`is-ops` non si ricavano concatenando `layer.id`
 *  (nomi diversi, "interface" vs "fe") — una voce mancante qui è un
 *  errore di compilazione, non un pallino silenziosamente incolore. */
const LAYER_CLASS: Record<LayerId, string> = {
  interface: 'is-fe',
  services: 'is-be',
  delivery: 'is-ops',
}

/** Sezione "competenze": tre strati del sistema (interfaccia, servizi,
 *  consegna), ciascuno con le proprie tecnologie e un livello da 1 a 5
 *  reso come pallini. L'`id` è `SECTION_IDS[1]` ("skills"), non
 *  l'etichetta tradotta del marcatore — è a quell'id che punta il link
 *  "skill"/"skills" del menu (vedi src/components/sections.ts). */
export function Skills() {
  const { copy } = useLocale()
  const { skills } = copy

  return (
    <section className="sec" id={SECTION_IDS[1]}>
      <div className="shell">
        <SectionMark index="02" label={skills.mark} />

        <h2 className="sec-title">{skills.title}</h2>
        <p className="sec-lede">{skills.lede}</p>

        <div className="layers">
          {skills.layers.map((layer) => (
            <div className={`layer ${LAYER_CLASS[layer.id]}`} key={layer.id}>
              <div className="layer-head">
                <h3>{layer.title}</h3>
                <span>{layer.caption}</span>
              </div>
              <ul className="skill-list">
                {layer.skills.map((skill) => (
                  <li className="skill" key={skill.name}>
                    <span>{skill.name}</span>
                    <span className="dots" role="img" aria-label={`${skill.level}/5`}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <i className={i < skill.level ? 'on' : undefined} key={i} />
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="layer-foot">{layer.foot}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
