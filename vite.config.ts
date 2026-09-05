/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
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
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./vitest.setup.ts'],
      css: true,
      // I test dell'head asseriscono sugli URL assoluti veri, non su pathname.
      env: { VITE_SITE_URL: 'https://example.test' },
    },
  }
})
