import { Link } from 'react-router'
import { PageHead } from '@/components/Head'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { useLocale } from '@/i18n/LocaleProvider'
import { homePath } from '@/i18n/routes'

export default function NotFound() {
  const { locale, copy } = useLocale()

  return (
    <>
      <PageHead title={copy.notFound.title} description={copy.notFound.body} />
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
