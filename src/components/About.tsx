import { useLocale } from '@/i18n/LocaleProvider'
import { Rich } from '@/components/Rich'
import { SectionMark } from '@/components/SectionMark'
import { Portrait } from '@/components/Portrait'
import { SECTION_IDS } from '@/components/sections'
import './About.css'

/** Sezione "chi sono": titolo, paragrafi ricchi, la lista di fatti e il
 *  ritratto. L'`id` è `SECTION_IDS[0]` ("about"), non l'etichetta tradotta
 *  del marcatore — è a quell'id che punta il link "chi"/"about" del menu
 *  (vedi src/components/sections.ts). */
export function About() {
  const { copy } = useLocale()
  const { about, meta } = copy

  return (
    <section className="sec" id={SECTION_IDS[0]}>
      <div className="shell">
        <SectionMark index="01" label={about.mark} />

        <div className="about">
          <div>
            <h2 className="sec-title">{about.title}</h2>
            {about.paragraphs.map((paragraph, i) => (
              <p key={i}>
                <Rich text={paragraph} />
              </p>
            ))}
          </div>

          <div className="about-aside">
            <div className="about-portrait">
              <Portrait alt={meta.portraitAlt} />
            </div>

            <dl className="facts">
              {about.facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.accent ? <em>{fact.value}</em> : fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
