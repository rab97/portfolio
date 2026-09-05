import { test, expect } from '@playwright/test'

test('la home italiana è pre-renderizzata, non costruita dal client', async ({ page }) => {
  const response = await page.goto('/it/')
  const html = await response!.text()

  // Il corpo della risposta HTTP, non il DOM dopo l'idratazione: è ciò che
  // vede uno scraper che non esegue JavaScript. Se il contenuto comparisse
  // solo nel DOM, questa asserzione fallirebbe — ed è esattamente il caso che
  // il pre-rendering esiste per evitare.
  expect(html).toContain('Progetto sistemi che')
  expect(html).toContain('Undici anni')

  // Anche la prova che l'HTML non è il guscio vuoto di una SPA.
  expect(html).not.toContain('<div id="root"></div>')
})

/** La barra finale non è cosmetica: `ssgOptions.dirStyle: 'nested'` scrive
 *  `it/progetti/design-system/index.html`, e il server statico di `vite
 *  preview` serve quel file solo all'URL con la barra — senza, cade sul
 *  fallback SPA e restituisce il guscio della radice. Il documento
 *  pre-renderizzato si chiede quindi all'URL con la barra. */
test('anche un case study arriva pre-renderizzato', async ({ page }) => {
  const response = await page.goto('/it/progetti/design-system/')
  const html = await response!.text()

  expect(response!.status()).toBe(200)
  expect(html).toContain('Design system multi-brand')
  expect(html).toContain('Una sola libreria di componenti per sette brand')
  // Gli URL assoluti dell'head sono costruiti a build time dalla stessa
  // origine su cui gira questo server: se divergessero, `og:url` punterebbe
  // a una pagina diversa da quella servita.
  expect(html).toContain('property="og:url" content="http://localhost:4173/it/progetti/design-system/"')
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
  await page.goto('/it/progetti/design-system/')

  await page.getByRole('button', { name: 'EN', exact: true }).click()
  await expect(page).toHaveURL(/\/en\/work\/design-system$/)
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
