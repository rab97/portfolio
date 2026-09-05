import { Link, useParams } from 'react-router'
import { PageHead } from '@/components/Head'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { Rich } from '@/components/Rich'
import { useLocale } from '@/i18n/LocaleProvider'
import { homePath } from '@/i18n/routes'
import NotFound from './NotFound'

/** Guscio del case study. Gli slug sono gli stessi nelle due lingue, quindi
 *  uno slug ignoto è una 404 vera, non un errore da lanciare. */
export default function CaseStudy() {
  const { locale, copy } = useLocale()
  const { slug } = useParams()
  const project = copy.work.projects.find((candidate) => candidate.slug === slug)

  if (!project) return <NotFound />

  return (
    <>
      <PageHead title={project.title} description={project.summary} />
      <Nav />
      <main>
        <p>{project.kicker}</p>
        <h1>{project.title}</h1>
        <p>{project.period}</p>
        <section aria-label={copy.caseStudy.overview}>
          <p>{project.caseStudy.intro}</p>
          <ul>
            {project.metrics.map((metric) => (
              <li key={metric.label}>
                {metric.value} {metric.label}
              </li>
            ))}
          </ul>
        </section>
        {project.caseStudy.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.body.map((paragraph, index) => (
              <p key={index}>
                <Rich text={paragraph} />
              </p>
            ))}
          </section>
        ))}
        <Link to={homePath(locale)}>{copy.caseStudy.back}</Link>
      </main>
      <Footer />
    </>
  )
}
