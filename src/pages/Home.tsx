import { PageHead } from '@/components/Head'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Skills } from '@/components/Skills'
import { Work } from '@/components/Work'
import { Timeline } from '@/components/Timeline'
import { OpenSource } from '@/components/OpenSource'
import { useLocale } from '@/i18n/LocaleProvider'
import githubRepos from '@/content/github.json'

/** Guscio della home. La sezione ancora mancante (Contact) arriva nel
 *  task successivo: qui c'è l'hero, il "chi sono", le competenze, i
 *  progetti, il percorso e l'open source — i case study restano
 *  raggiungibili da un crawler perché ogni `ProjectCard` linka il proprio
 *  al titolo.
 *
 *  `githubRepos` viene da `src/content/github.json`, scritto a tempo di
 *  build da `scripts/fetch-github.ts` (vedi `npm run fetch:github` /
 *  `prebuild`): la home non interroga mai l'API di GitHub da sola. */
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
        <OpenSource repos={githubRepos} />
      </main>
      <Footer />
    </>
  )
}
