import { Link } from 'react-router'
import type { Project } from '@/content/schema'
import { useLocale } from '@/i18n/LocaleProvider'
import { workPath } from '@/i18n/routes'
import { SCHEMAS } from '@/schemas'
import './ProjectCard.css'

interface ProjectCardProps {
  project: Project
  /** In evidenza (`project.featured`) prende il layout a due colonne e
   *  `.card-featured`: lo decide il chiamante (`Work`), non la card da
   *  sola, perché è una scelta di griglia — quale card va larga — non una
   *  proprietà intrinseca del progetto. */
  featured: boolean
}

/** Una card di progetto: schema disegnato, testata, riassunto, tag,
 *  eventuali metriche e i link (case study, live, repo, o privato).
 *
 *  Il titolo rimanda al case study nella lingua corrente — è così che il
 *  test lo verifica — e lo stesso link compare di nuovo, in chiaro, fra i
 *  `card-links`, per chi cerca la call to action esplicita invece del
 *  titolo. Un link marcato `private` non è un link: è uno `<span>` con la
 *  stessa resa visiva, perché un'ancora "disabilitata" resterebbe comunque
 *  raggiungibile da tastiera e cliccabile. */
export function ProjectCard({ project, featured }: ProjectCardProps) {
  const { locale } = useLocale()
  const Schema = SCHEMAS[project.schema]
  const caseStudyHref = workPath(locale, project.slug)

  return (
    <article className={featured ? 'card card-featured' : 'card'}>
      <div className="card-body">
        <p className="card-kicker">
          <b>{project.kicker}</b>
          <span>· {project.period}</span>
        </p>
        <h3>
          <Link to={caseStudyHref}>{project.title}</Link>
        </h3>
        <p>{project.summary}</p>
        <div className="tags">
          {project.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>

        {project.metrics.length > 0 && (
          <div className="card-stats">
            {project.metrics.map((metric) => (
              <div key={metric.label}>
                <b>{metric.value}</b>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="card-links">
          {project.links.map((link) =>
            link.kind === 'private' ? (
              <span className="card-link-disabled" key={link.label}>
                {link.label}
              </span>
            ) : link.kind === 'caseStudy' ? (
              <Link to={caseStudyHref} key={link.label}>
                {link.label}
              </Link>
            ) : (
              <a href={link.href} key={link.label}>
                {link.label}
              </a>
            ),
          )}
        </div>
      </div>

      <div className="schema">
        {/* Il modello dei contenuti (Task 2) non prevede un campo dedicato
         *  alla descrizione del disegno: `project.summary` è il testo più
         *  ricco e già tradotto che lo riassume, e resta distinto dalle
         *  etichette disegnate dentro lo schema (`project.schemaLabels`,
         *  passate come `labels`) e dal titolo già letto dall'`<h3>`. */}
        <Schema label={project.summary} labels={project.schemaLabels} />
      </div>
    </article>
  )
}
