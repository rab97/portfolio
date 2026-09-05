import { PageHead } from '@/components/Head'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Skills } from '@/components/Skills'
import { Work } from '@/components/Work'
import { Timeline } from '@/components/Timeline'
import { Contact } from '@/components/Contact'
import { useLocale } from '@/i18n/LocaleProvider'

/** Guscio della home: hero, "chi sono", competenze, progetti, percorso e
 *  contatti — tutte e cinque le sezioni a cui punta la navigazione (vedi
 *  src/components/sections.ts). I case study restano raggiungibili da un
 *  crawler perché ogni `ProjectCard` linka il proprio al titolo. */
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
        <Timeline />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
