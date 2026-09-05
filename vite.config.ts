/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { copyFile } from 'node:fs/promises'
import { isAbsolute, join } from 'node:path'
// Solo per l'augmentation di `UserConfig` che aggiunge `ssgOptions`.
import type {} from 'vite-react-ssg'

/** `og:url`, `canonical` e `hreflang` devono essere assoluti e
 *  fully-qualified, altrimenti scraper social e Google li ignorano — cioè
 *  esattamente ciò per cui esiste il pre-rendering. È un dato che il codice
 *  non può indovinare, quindi la build si ferma finché non gliela si dà: un
 *  `og:url` sbagliato si scopre quando qualcuno condivide il link e vede
 *  l'anteprima rotta, cioè troppo tardi. */
function requireSiteUrl(): string {
  const value = process.env.VITE_SITE_URL?.trim()
  if (!value) {
    throw new Error(
      'VITE_SITE_URL non è impostata: senza, og:url, canonical e hreflang delle pagine\n' +
        'pre-renderizzate sarebbero relativi e gli scraper social li ignorerebbero.\n' +
        '  In deploy:  VITE_SITE_URL=https://dominio.esempio npm run build\n' +
        '  In locale:  VITE_SITE_URL=http://localhost:4173 npm run build',
    )
  }
  return value
}

/** vite-react-ssg inserisce title e meta in cima a `<head>`, spingendo il
 *  charset del template oltre i primi 1024 byte: lì il browser smette di
 *  cercarlo e i trattini lunghi e le accentate diventano illeggibili. Lo si
 *  rimette per primo a pagina resa.
 *
 *  L'inserimento viene prima della rimozione, e se non c'è un `<head>` a cui
 *  agganciarsi l'HTML torna intatto: una pagina col charset nel posto
 *  sbagliato è comunque meglio di una senza. */
function hoistCharset(html: string): string {
  const withCharset = html.replace(/<head([^>]*)>/i, '<head$1><meta charset="UTF-8">')
  if (withCharset === html) return html
  return withCharset.replace(
    /(<head[^>]*><meta charset="UTF-8">)([\s\S]*?)\s*<meta\s+charset="[^"]*"\s*\/?>/i,
    '$1$2',
  )
}

/** Il pre-rendering copre le rotte che esistono. Quelle che non esistono —
 *  uno slug sbagliato, un vecchio link, un refuso — non hanno un file, e su
 *  un hosting statico un URL senza file è la fine del discorso: GitHub Pages
 *  risponde con la propria pagina d'errore, non con la nostra, e il router
 *  non entra mai in gioco perché nessun JavaScript del sito viene caricato.
 *
 *  `404.html` alla radice è la convenzione con cui GitHub Pages lascia
 *  rispondere l'applicazione: lo serve per qualunque percorso che non trova.
 *  Copiandoci il guscio della radice, un URL sconosciuto carica comunque
 *  l'app, e il router rende la pagina non trovata nella lingua del percorso
 *  chiesto (`/it/...` sta dentro le rotte italiane).
 *
 *  Il markup pre-renderizzato dentro quel file è quello della radice, quindi
 *  React trova un disallineamento in idratazione e ricostruisce lato client.
 *  Su una pagina d'errore è un prezzo accettabile: è l'unica pagina del sito
 *  di cui non si può conoscere l'URL in anticipo, quindi l'unica che non si
 *  può pre-renderizzare. Tutte le altre restano statiche.
 *
 *  Va fatto qui e non copiando un file a mano in un workflow: il guscio
 *  cambia a ogni build (gli hash degli asset ci sono dentro), e una copia
 *  fatta altrove si stantisce senza dirlo. */
async function emitNotFoundShell(outDir: string): Promise<void> {
  const root = fileURLToPath(new URL('./', import.meta.url))
  const dir = isAbsolute(outDir) ? outDir : join(root, outDir)
  await copyFile(join(dir, 'index.html'), join(dir, '404.html'))
}

export default defineConfig(({ command }) => {
  // Vite espone già `VITE_SITE_URL` dall'ambiente: qui si pretende solo che
  // ci sia, prima che parta qualunque lavoro.
  if (command === 'build') requireSiteUrl()

  return {
    plugins: [react()],
    base: process.env.VITE_BASE ?? '/',
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    ssgOptions: {
      // `/it/progetti/<slug>/index.html` invece di `/it/progetti/<slug>.html`:
      // gli URL restano con la barra finale su qualsiasi hosting statico.
      dirStyle: 'nested',
      // Le pagine dinamiche arrivano dai getStaticPaths delle rotte.
      includeAllRoutes: false,
      onPageRendered: (_route, html) => hoistCharset(html),
      // Ultimo passo della build, quando `dist/index.html` esiste già.
      onFinished: (dir) => emitNotFoundShell(dir),
    },
    test: {
      // Solo i test unitari: `tests/e2e` è di Playwright, che ha un runner
      // suo. Senza questo, il pattern di default di Vitest raccoglie anche
      // quei `.spec.ts` e li esegue in jsdom, dove `page` non esiste.
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./vitest.setup.ts'],
      css: true,
      // I test dell'head asseriscono sugli URL assoluti veri, non su pathname.
      env: { VITE_SITE_URL: 'https://example.test' },
    },
  }
})
