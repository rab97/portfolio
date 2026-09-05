import { Link } from 'react-router'
import { PageHead } from '@/components/Head'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { useLocale } from '@/i18n/LocaleProvider'
import { homePath } from '@/i18n/routes'

/** La pagina non trovata, resa sia sulle rotte `/it/404` e `/en/404` — che
 *  esistono come file pre-renderizzati — sia su qualunque percorso che il
 *  router non riconosce.
 *
 *  `noindex`: un hosting statico serve quei due file con stato 200, quindi
 *  senza dirlo esplicitamente finirebbero nell'indice come pagine normali
 *  (vedi il commento in src/components/Head.tsx). */
export default function NotFound() {
  const { locale, copy } = useLocale()

  return (
    <>
      <PageHead title={copy.notFound.title} description={copy.notFound.body} noindex />
      <Nav />
      <main>
        <h1>{copy.notFound.title}</h1>
        <p>{copy.notFound.body}</p>
        <Link to={homePath(locale)}>{copy.notFound.cta}</Link>
      </main>
      <Footer />
    </>
  )
}
