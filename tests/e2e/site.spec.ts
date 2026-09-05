import { test, expect } from '@playwright/test'

test('la home italiana è pre-renderizzata, non costruita dal client', async ({ page }) => {
  const response = await page.goto('/it/')
  const html = await response!.text()

  // Il corpo della risposta HTTP, non il DOM dopo l'idratazione: è ciò che
  // vede uno scraper che non esegue JavaScript. Se il contenuto comparisse
  // solo nel DOM, questa asserzione fallirebbe — ed è esattamente il caso che
  // il pre-rendering esiste per evitare.
  expect(html).toContain('Dati di prodotto')
  expect(html).toContain('Da due anni in azienda su un PIM e un CPQ')

  // Anche la prova che l'HTML non è il guscio vuoto di una SPA.
  expect(html).not.toContain('<div id="root"></div>')
})

/** La barra finale non è cosmetica: `ssgOptions.dirStyle: 'nested'` scrive
 *  `it/progetti/coolpim/index.html`, e il server statico di `vite
 *  preview` serve quel file solo all'URL con la barra — senza, cade sul
 *  fallback SPA e restituisce il guscio della radice. Il documento
 *  pre-renderizzato si chiede quindi all'URL con la barra. */
test('anche un case study arriva pre-renderizzato', async ({ page }) => {
  const response = await page.goto('/it/progetti/coolpim/')
  const html = await response!.text()

  expect(response!.status()).toBe(200)
  expect(html).toContain('Coolpim')
  expect(html).toContain('raccoglie e organizza le informazioni sui prodotti')
  // Gli URL assoluti dell'head sono costruiti a build time dalla stessa
  // origine su cui gira questo server: se divergessero, `og:url` punterebbe
  // a una pagina diversa da quella servita.
  expect(html).toContain('property="og:url" content="http://localhost:4173/it/progetti/coolpim/"')
})

/** L'head può dichiarare un `og:image` perfetto e l'anteprima restare vuota
 *  lo stesso, se quell'indirizzo non serve un'immagine. È l'unico metadato
 *  del sito che punta a un file invece che a una rotta, e l'unico che nessun
 *  test unitario può verificare fino in fondo: il PNG è committato in
 *  `public/` e lo rigenera `npm run og:image`, non la build. Qui si chiede
 *  al server esattamente l'indirizzo che sta nell'HTML. */
test("l'immagine dichiarata in og:image esiste e viene servita", async ({ page, request }) => {
  const response = await page.goto('/it/')
  const html = await response!.text()

  const declared = html.match(/property="og:image" content="([^"]+)"/)
  expect(declared, 'og:image assente dall’HTML pre-renderizzato').not.toBeNull()

  const image = await request.get(declared![1])
  expect(image.status()).toBe(200)
  expect(image.headers()['content-type']).toContain('image/png')
  expect((await image.body()).byteLength).toBeGreaterThan(0)

  // Con `summary` la stessa immagine finirebbe in un quadratino di fianco al
  // testo invece che nella scheda grande.
  expect(html).toContain('name="twitter:card" content="summary_large_image"')
})

/** La barra è incollata in cima e copre i primi pixel della finestra: senza
 *  `scroll-padding-top` (src/theme/base.css) ogni link del menu porterebbe
 *  l'inizio della sezione *sotto* la barra. È un difetto che nessun test
 *  unitario può vedere — jsdom non ha layout e non scorre — e che si misura
 *  solo su un browser vero: si confronta il bordo alto della sezione con il
 *  bordo basso della barra. Il numero in CSS non è verificato in sé: se la
 *  barra crescesse, sarebbe questo a dirlo. */
test('ogni link del menu porta la sezione sotto la barra, non dietro', async ({ page }) => {
  // Senza moto ridotto lo scorrimento è morbido e la misura arriverebbe a
  // metà animazione.
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/it/')

  const nav = page.locator('nav.nav')
  const anchors = page.locator('nav.nav a[href^="#"]')
  const count = await anchors.count()
  expect(count).toBeGreaterThan(0)

  for (let i = 0; i < count; i += 1) {
    const anchor = anchors.nth(i)
    const id = (await anchor.getAttribute('href'))!.slice(1)
    await anchor.click()

    const navBox = (await nav.boundingBox())!
    const sectionBox = (await page.locator(`#${id}`).boundingBox())!
    expect(sectionBox.y, `la sezione #${id} finisce sotto la barra`).toBeGreaterThanOrEqual(
      navBox.y + navBox.height,
    )
  }
})

test('la CTA dell’hero porta alla sezione progetti', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/it/')

  const work = page.locator('#work')
  expect((await work.boundingBox())!.y).toBeGreaterThan(400)

  await page.getByRole('button', { name: 'Vedi i progetti' }).click()

  const navBox = (await page.locator('nav.nav').boundingBox())!
  const workBox = (await work.boundingBox())!
  expect(workBox.y).toBeGreaterThanOrEqual(navBox.y + navBox.height)
  expect(workBox.y).toBeLessThan(200)
})

/** I tre collegamenti del diagramma dell'hero devono animare sfalsati: è il
 *  punto in cui la direzione visiva promette un diagramma che si compone da
 *  sinistra a destra. Il ritardo vive in uno pseudo-elemento, quindi si legge
 *  solo dallo stile calcolato di `::after` su un browser vero — jsdom non
 *  calcola pseudo-elementi, e una regola che non colpisce niente resta muta
 *  in ogni altro test. */
test('i collegamenti del diagramma partono sfalsati, non in sincrono', async ({ page }) => {
  await page.goto('/it/')

  const delays = await page.$$eval('.flowline .wire', (wires) =>
    wires.map((wire) => getComputedStyle(wire, '::after').animationDelay),
  )

  expect(delays).toEqual(['0s', '0.65s', '1.3s'])
})

test('la scelta del tema sopravvive a un ricaricamento', async ({ page }) => {
  await page.goto('/it/')

  await page.getByRole('button', { name: 'Tema chiaro' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'light')

  await page.reload()
  // Dopo il ricaricamento l'attributo viene rimesso dallo script inline in
  // `index.html`, prima del primo paint: non è React a rimetterlo.
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'light')
  expect(await page.evaluate(() => localStorage.getItem('fr.mode'))).toBe('light')
})

test('il tema automatico non lascia attributo sulla radice', async ({ page }) => {
  await page.goto('/it/')

  await page.getByRole('button', { name: 'Tema scuro' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'dark')

  await page.getByRole('button', { name: 'AUTO', exact: true }).click()
  // "Segui il sistema" è l'assenza dell'attributo, non un terzo valore.
  await expect(page.locator('html')).not.toHaveAttribute('data-mode', /.*/)
})

test('il cambio lingua porta alla rotta equivalente mantenendo la pagina', async ({ page }) => {
  await page.goto('/it/progetti/coolpim/')

  await page.getByRole('button', { name: 'EN', exact: true }).click()
  await expect(page).toHaveURL(/\/en\/work\/coolpim\/$/)
  // Stessa pagina, altra lingua: lo slug è invariato ed è il contenuto
  // inglese a essere reso.
  await expect(page.getByRole('button', { name: 'EN', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  expect(await page.evaluate(() => localStorage.getItem('fr.lang'))).toBe('en')
})

test('dalla home italiana il cambio lingua porta alla home inglese', async ({ page }) => {
  await page.goto('/it/')

  await page.getByRole('button', { name: 'EN', exact: true }).click()
  await expect(page).toHaveURL(/\/en\/$/)
})

test('la radice reindirizza a una lingua', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/(it|en)\/$/)
})

test('la radice rispetta la lingua già scelta', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('fr.lang', 'it'))

  await page.goto('/')
  await expect(page).toHaveURL(/\/it\/$/)
})

/** I due test qui sotto navigano su percorsi che in `dist` non hanno nessun
 *  file. Che rendano la pagina non trovata dipende da chi risponde a un URL
 *  senza file: `vite preview` cade sul fallback SPA, GitHub Pages serve
 *  `404.html` dalla radice. I due comportamenti coincidono solo se quel file
 *  esiste — altrimenti in produzione l'utente vedrebbe la pagina d'errore di
 *  GitHub e questi test descriverebbero qualcosa che non succede.
 *
 *  Questo test tiene insieme le due cose: se la build smettesse di emettere
 *  `404.html`, i due test successivi resterebbero verdi sul preview mentre la
 *  produzione si romperebbe, e sarebbe questo a segnalarlo. Il contenuto
 *  atteso è il guscio dell'applicazione, non una pagina pre-renderizzata: è
 *  l'unica pagina del sito il cui URL non si può conoscere in anticipo. */
test('la build emette il 404.html che serve a GitHub Pages', async ({ page }) => {
  const response = await page.goto('/404.html')
  const html = await response!.text()

  expect(response!.status()).toBe(200)
  expect(html).toContain('id="root"')
  // Con lo script dell'app dentro, il router può rendere la rotta chiesta.
  expect(html).toMatch(/<script type="module"[^>]*src="\/assets\/[^"]+\.js"/)
})

/** `/it/404/` e `/en/404/` sono file veri, serviti con stato 200 come ogni
 *  altra pagina: per un motore di ricerca sono contenuti normali, e su un
 *  sito da tredici pagine sarebbero due risultati intitolati "404 — pagina
 *  non trovata". Il `noindex` deve stare nell'HTML servito, non solo nel
 *  DOM dopo l'idratazione: un crawler legge il primo. */
test('le pagine 404 pre-renderizzate chiedono di non essere indicizzate', async ({ page }) => {
  for (const path of ['/it/404/', '/en/404/']) {
    const response = await page.goto(path)
    const html = await response!.text()

    expect(response!.status()).toBe(200)
    expect(html).toContain('name="robots" content="noindex, follow"')
    expect(html).not.toContain('rel="canonical"')
  }
})

test('uno slug inesistente mostra la pagina non trovata', async ({ page }) => {
  await page.goto('/it/progetti/non-esiste')
  await expect(page.getByRole('main')).toContainText(/non trovat/i)
  // Nessun rimbalzo alla home: l'URL chiesto resta quello.
  await expect(page).toHaveURL(/\/it\/progetti\/non-esiste$/)
})

test('la pagina 404 inglese risponde in inglese', async ({ page }) => {
  await page.goto('/en/work/non-esiste')
  await expect(page.getByRole('main')).toContainText(/not found/i)
})
