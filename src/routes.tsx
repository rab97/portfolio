import type { RouteRecord } from 'vite-react-ssg'
import { LOCALES } from '@/content/schema'
import { itContent } from '@/content/it'
import { LocaleProvider } from '@/i18n/LocaleProvider'
import { homePath, notFoundPath, workPath } from '@/i18n/routes'
import Home from '@/pages/Home'
import CaseStudy from '@/pages/CaseStudy'
import NotFound from '@/pages/NotFound'
import RootRedirect from '@/pages/RootRedirect'

/** Gli slug sono identici nelle due lingue (lo verifica content.test.ts),
 *  quindi una lista sola basta a enumerare tutte le pagine da pre-renderizzare. */
const SLUGS = itContent.work.projects.map((project) => project.slug)

export const routes: RouteRecord[] = [
  { path: '/', element: <RootRedirect /> },
  ...LOCALES.flatMap((locale): RouteRecord[] => [
    {
      path: homePath(locale),
      element: (
        <LocaleProvider locale={locale}>
          <Home />
        </LocaleProvider>
      ),
    },
    {
      path: workPath(locale, ':slug'),
      element: (
        <LocaleProvider locale={locale}>
          <CaseStudy />
        </LocaleProvider>
      ),
      getStaticPaths: () => SLUGS.map((slug) => workPath(locale, slug)),
    },
    {
      path: notFoundPath(locale),
      element: (
        <LocaleProvider locale={locale}>
          <NotFound />
        </LocaleProvider>
      ),
    },
    {
      path: `/${locale}/*`,
      element: (
        <LocaleProvider locale={locale}>
          <NotFound />
        </LocaleProvider>
      ),
    },
  ]),
  {
    path: '*',
    element: (
      <LocaleProvider locale="en">
        <NotFound />
      </LocaleProvider>
    ),
  },
]
