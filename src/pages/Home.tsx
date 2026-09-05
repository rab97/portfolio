import { Link } from 'react-router'
import { PageHead } from '@/components/Head'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { useLocale } from '@/i18n/LocaleProvider'
import { workPath } from '@/i18n/routes'

/** Guscio della home. Le sezioni ancora mancanti (About, Skills, Work, Path,
 *  Contact) arrivano nei task successivi: qui c'è l'hero più il minimo che
 *  rende la pagina pre-renderizzabile e i case study raggiungibili da un
 *  crawler. */
export default function Home() {
  const { locale, copy } = useLocale()

  return (
    <>
      <PageHead title={copy.meta.title} description={copy.meta.description} />
      <Nav />
      <main>
        <Hero />
        <nav aria-label={copy.work.title}>
          <ul>
            {copy.work.projects.map((project) => (
              <li key={project.slug}>
                <Link to={workPath(locale, project.slug)}>{project.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
      <Footer />
    </>
  )
}
