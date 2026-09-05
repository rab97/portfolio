import { useLocale } from '@/i18n/LocaleProvider'
import { SectionMark } from '@/components/SectionMark'
import { ProjectCard } from '@/components/ProjectCard'
import { SECTION_IDS } from '@/components/sections'

/** Sezione "progetti selezionati": la card in evidenza (l'unica con
 *  `featured: true`, il design system multi-brand) più una griglia con le
 *  altre tre. L'`id` è `SECTION_IDS[2]` ("work"), non l'etichetta tradotta
 *  del marcatore — è a quell'id che punta il link "progetti"/"work" del
 *  menu (vedi src/components/sections.ts). */
export function Work() {
  const { copy } = useLocale()
  const { work } = copy
  const featured = work.projects.find((project) => project.featured)
  const rest = work.projects.filter((project) => !project.featured)

  return (
    <section className="sec" id={SECTION_IDS[2]}>
      <div className="shell">
        <SectionMark index="03" label={work.mark} />

        <h2 className="sec-title">{work.title}</h2>
        <p className="sec-lede">{work.lede}</p>

        <div className="projects">
          {featured && <ProjectCard project={featured} featured />}

          <div className="card-grid">
            {rest.map((project) => (
              <ProjectCard project={project} featured={false} key={project.slug} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
