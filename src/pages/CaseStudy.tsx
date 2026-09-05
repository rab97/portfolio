import { Link, useParams } from 'react-router'
import { PageHead } from '@/components/Head'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { Rich } from '@/components/Rich'
import { useLocale } from '@/i18n/LocaleProvider'
import { homePath } from '@/i18n/routes'
import { SCHEMAS } from '@/schemas'
import NotFound from './NotFound'
import '@/components/ProjectCard.css'
import './CaseStudy.css'

/** Pagina del case study. Gli slug sono gli stessi nelle due lingue, quindi
 *  uno slug ignoto è una 404 vera, non un errore da lanciare.
 *
 *  Importa `ProjectCard.css` oltre al proprio foglio: `.schema` e
 *  `.card-stats` sono definite lì, e questa pagina li riusa così come sono
 *  invece di duplicarli (vedi il brief: il vocabolario visivo è quello
 *  della card progetto, non uno nuovo). */
export default function CaseStudy() {
  const { locale, copy } = useLocale()
  const { slug } = useParams()
  const project = copy.work.projects.find((candidate) => candidate.slug === slug)

  if (!project) return <NotFound />

  const Schema = SCHEMAS[project.schema]

  return (
    <>
      <PageHead title={project.title} description={project.summary} />
      <Nav />
      <main>
        <div className="shell case-study">
          <Link className="case-study-back" to={homePath(locale)}>
            {copy.caseStudy.back}
          </Link>

          <header className="case-study-head">
            <h1>{project.title}</h1>
            <p className="case-study-period">{project.period}</p>
            <div className="tags">
              {project.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="schema case-study-schema">
            {/* `schemaDescription` dice cosa raffigura il disegno, non cosa
             *  fa il progetto (quello è `summary`, già letto altrove). */}
            <Schema label={project.schemaDescription} labels={project.schemaLabels} />
          </div>

          {project.metrics.length > 0 && (
            <div className="card-stats case-study-stats">
              {project.metrics.map((metric) => (
                <div key={metric.label}>
                  <b>{metric.value}</b>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          )}

          <section className="case-study-intro" aria-label={copy.caseStudy.overview}>
            <p>{project.caseStudy.intro}</p>
          </section>

          {project.caseStudy.sections.map((section) => (
            <section className="case-study-section" key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph, index) => (
                <p key={index}>
                  <Rich text={paragraph} />
                </p>
              ))}
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
