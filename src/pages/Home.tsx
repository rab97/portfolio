import { PageHead } from '@/components/Head'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Skills } from '@/components/Skills'
import { Work } from '@/components/Work'
import { useLocale } from '@/i18n/LocaleProvider'

/** Guscio della home. Le sezioni ancora mancanti (Path, Contact) arrivano
 *  nei task successivi: qui c'è l'hero, il "chi sono", le competenze e i
 *  progetti — i case study restano raggiungibili da un crawler perché
 *  ogni `ProjectCard` linka il proprio al titolo. */
export default function Home() {
  const { copy } = useLocale()

  return (
    <>
      <PageHead title={copy.meta.title} description={copy.meta.description} />
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Work />
      </main>
      <Footer />
    </>
  )
}
