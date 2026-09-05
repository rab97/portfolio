/**
 * Genera `public/og.png`, l'immagine di anteprima social del sito.
 *
 *   npm run og:image
 *
 * Perché uno script e non un PNG disegnato a mano: l'immagine dice il nome e
 * il ruolo, cioè due stringhe che vivono in `src/content/*.ts` e che verranno
 * riscritte quando i segnaposto diventeranno testi veri. Un PNG statico si
 * disallineerebbe in silenzio dal sito; questo si rifà con un comando, e il
 * comando è la documentazione di com'è fatta l'immagine.
 *
 * L'anteprima è una sola per tutte e tredici le pagine e per entrambe le
 * lingue: prende quindi solo i contenuti che nelle due lingue coincidono
 * (`meta.title` e `hero.prompt` sono identici in it.ts e en.ts, e lo script
 * si ferma se smettessero di esserlo). Il testo alternativo, che invece è
 * per pagina e tradotto, sta in `meta.ogImageAlt` e lo emette `Head.tsx`.
 *
 * Il file prodotto va committato: la build non lo rigenera, e GitHub Pages
 * pubblica `public/` così com'è.
 */
import { chromium } from '@playwright/test'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath, URL } from 'node:url'
import { itContent } from '../../src/content/it.ts'
import { enContent } from '../../src/content/en.ts'

const ROOT = new URL('../../', import.meta.url)
const OUTPUT = fileURLToPath(new URL('public/og.png', ROOT))

/** 1200×630 è la misura che Open Graph, LinkedIn e X ritagliano senza
 *  ricampionare: sotto, l'anteprima grande viene sgranata; sopra, non
 *  cambia nulla se non il peso. Gli stessi numeri finiscono in
 *  `og:image:width` e `og:image:height` (src/components/Head.tsx): sono
 *  ripetuti in due posti perché uno è il pixel e l'altro è la dichiarazione,
 *  e se divergessero lo scraper crederebbe alla dichiarazione. */
const WIDTH = 1200
const HEIGHT = 630

/** Il nome e il ruolo sono le due metà di `meta.title`, separate dal trattino
 *  lungo. Se un giorno il titolo non lo contenesse più, l'intero titolo fa da
 *  nome e il ruolo resta vuoto: meglio un'anteprima con una riga sola che uno
 *  script che si pianta. */
function splitTitle(title) {
  const [name, ...rest] = title.split('—')
  return { name: name.trim(), role: rest.join('—').trim() }
}

function requireSameInBothLanguages(label, italian, english) {
  if (italian !== english) {
    throw new Error(
      `${label} non coincide più fra it.ts e en.ts:\n` +
        `  it: ${italian}\n  en: ${english}\n` +
        "L'immagine di anteprima è una sola per entrambe le lingue, quindi può usare\n" +
        'solo campi identici nelle due. Scegliere cosa mostrare e aggiornare questo script.',
    )
  }
  return italian
}

function fill(template, values) {
  return Object.entries(values).reduce(
    (html, [key, value]) => html.replaceAll(`{{${key}}}`, value),
    template,
  )
}

/** Il testo va inserito come testo, non come markup: un `&` o un `<` in un
 *  nome romperebbe la pagina invece di comparire. */
function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const title = requireSameInBothLanguages(
  'meta.title',
  itContent.meta.title,
  enContent.meta.title,
)
const prompt = requireSameInBothLanguages(
  'hero.prompt',
  itContent.hero.prompt,
  enContent.hero.prompt,
)
const { name, role } = splitTitle(title)

const [template, tokens] = await Promise.all([
  readFile(new URL('template.html', import.meta.url), 'utf8'),
  readFile(new URL('src/theme/tokens.css', ROOT), 'utf8'),
])

const html = fill(template, {
  tokens,
  name: escapeHtml(name),
  role: escapeHtml(role),
  prompt: escapeHtml(prompt),
})

const browser = await chromium.launch()
try {
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    // Il PNG è a densità 1: gli scraper ritagliano a 1200×630 e un'immagine
    // a densità doppia peserebbe il quadruplo per nessuna resa in più.
    deviceScaleFactor: 1,
    // La palette è fissata da `data-mode="dark"` nel template, ma se la
    // macchina che genera fosse in tema chiaro la media query si attiverebbe
    // comunque per un istante: emularla scura toglie anche quel margine.
    colorScheme: 'dark',
  })

  // `waitUntil: 'networkidle'` perché il foglio dei font è una richiesta di
  // rete: senza, si catturerebbe la pagina prima che arrivi.
  await page.setContent(html, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)

  const hasWebfont = await page.evaluate(() => document.fonts.check('600 78px "IBM Plex Mono"'))
  if (!hasWebfont) {
    throw new Error(
      "IBM Plex Mono non si è caricato: l'immagine uscirebbe col monospace di sistema,\n" +
        'diversa dal sito. Serve una connessione a fonts.googleapis.com per generarla.',
    )
  }

  const png = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } })
  await writeFile(OUTPUT, png)
  console.log(`og:image scritta in ${OUTPUT} (${WIDTH}×${HEIGHT}, ${png.length} byte)`)
} finally {
  await browser.close()
}
