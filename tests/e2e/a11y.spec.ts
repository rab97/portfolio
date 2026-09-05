import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/** I due temi vanno misurati entrambi, e su pagine diverse: il contrasto è
 *  l'unica cosa che può rompersi passando da scuro a chiaro, perché è l'unica
 *  proprietà che dipende dal valore dei token invece che dalla struttura del
 *  markup. Una pagina che passa in scuro non dice nulla sulla stessa pagina in
 *  chiaro. */
const THEMES = ['dark', 'light'] as const

/** Home e case study non condividono componenti a sufficienza da poter
 *  concludere dall'una all'altra: la home ha Hero, Skills, Timeline e Contact,
 *  il case study ha lo schema tecnico e le note. */
const PAGES = [
  { name: 'home italiana', path: '/it/' },
  // Barra finale: senza, `vite preview` serve il fallback SPA invece del
  // documento pre-renderizzato — axe misurerebbe una pagina ricostruita dal
  // client dopo un disallineamento di idratazione, non quella vera.
  { name: 'case study design-system', path: '/it/progetti/design-system/' },
] as const

/** Si forza il tema da `localStorage` prima del primo paint, non cliccando il
 *  toggle: lo script inline in `index.html` legge `fr.mode` e mette
 *  `data-mode` sulla radice prima che React esista. Così axe misura la pagina
 *  nel suo stato stabile, senza dipendere da una transizione appena avvenuta. */
async function openWithTheme(page: Page, path: string, mode: 'light' | 'dark') {
  await page.addInitScript((value) => localStorage.setItem('fr.mode', value), mode)
  // La preferenza di sistema è messa all'opposto della scelta esplicita: se
  // `data-mode` non vincesse sulla media query, il test lo vedrebbe.
  await page.emulateMedia({
    colorScheme: mode === 'light' ? 'dark' : 'light',
    reducedMotion: 'reduce',
  })

  await page.goto(path)
  await expect(page.locator('html')).toHaveAttribute('data-mode', mode)
  // Le webfont cambiano le metriche del testo, e con esse quali nodi axe
  // considera "large text" ai fini della soglia di contrasto.
  await page.evaluate(() => document.fonts.ready)
}

async function expectNoBlockingViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()

  const blocking = results.violations.filter(
    (violation) => violation.impact === 'serious' || violation.impact === 'critical',
  )

  // Il messaggio deve bastare a capire cosa correggere senza rieseguire:
  // regola, impatto e i selettori dei nodi colpiti.
  expect(
    blocking,
    blocking
      .map(
        (violation) =>
          `[${violation.impact}] ${violation.id}: ${violation.help}\n` +
          violation.nodes
            .map((node) => `    ${node.target.join(' ')}\n      ${node.failureSummary ?? ''}`)
            .join('\n'),
      )
      .join('\n'),
  ).toEqual([])
}

for (const theme of THEMES) {
  for (const target of PAGES) {
    test(`nessuna violazione grave di accessibilità: ${target.name}, tema ${theme}`, async ({
      page,
    }) => {
      await openWithTheme(page, target.path, theme)
      await expectNoBlockingViolations(page)
    })
  }
}

/** I quattro test sopra passano sempre da una scelta esplicita, quindi da un
 *  `data-mode` sulla radice: coprono i blocchi `:root[data-mode='light']` e
 *  `:root[data-mode='dark']` e mai il ramo `@media (prefers-color-scheme:
 *  light)`. Ma quel ramo è ciò che vede chi non ha mai toccato il selettore,
 *  cioè la maggior parte dei visitatori.
 *
 *  I sei valori chiari vivono duplicati in due blocchi, e il task che li ha
 *  corretti li ha modificati a mano in entrambi: oggi coincidono, ma nulla lo
 *  impone. Se un giorno divergessero, senza questo test il tema chiaro
 *  predefinito potrebbe tornare sotto soglia con la suite tutta verde. */
test('nessuna violazione grave di accessibilità: tema chiaro di sistema, senza scelta esplicita', async ({
  page,
}) => {
  // Nessuno `addInitScript`: `localStorage` resta vuoto, lo script inline non
  // trova `fr.mode` e non scrive nulla sulla radice.
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })

  await page.goto('/it/')
  // L'assenza dell'attributo è il punto: è la prova che il tema in vigore
  // arriva dalla media query e non da `[data-mode]`.
  await expect(page.locator('html')).not.toHaveAttribute('data-mode', /.*/)
  await page.evaluate(() => document.fonts.ready)

  await expectNoBlockingViolations(page)
})
