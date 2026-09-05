/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
// Solo per l'augmentation di `UserConfig` che aggiunge `ssgOptions`.
import type {} from 'vite-react-ssg'
// Le funzioni che decidono se la build si ferma, come esce l'HTML e se la
// 404 di produzione esiste. Stanno in un modulo a parte perché sono coperte
// da test (build/config.test.ts): vedi il commento in testa a quel file.
import { requireSiteUrl, resolveBase, hoistCharset, emitNotFoundShell } from './build/config.ts'

export default defineConfig(({ command }) => {
  // Vite espone già `VITE_SITE_URL` e `VITE_BASE` dall'ambiente: qui si
  // pretende solo che ci siano, prima che parta qualunque lavoro. Entrambe
  // sono obbligatorie in build, ed è quello che il README promette.
  if (command === 'build') requireSiteUrl()

  return {
    plugins: [react()],
    base: resolveBase(command),
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
      // `build/` sta nell'elenco perché anche la logica di build ha i suoi
      // test unitari, e girano nella stessa esecuzione di `npm test`.
      include: ['src/**/*.{test,spec}.{ts,tsx}', 'build/**/*.{test,spec}.ts'],
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./vitest.setup.ts'],
      css: true,
      // I test dell'head asseriscono sugli URL assoluti veri, non su pathname.
      env: { VITE_SITE_URL: 'https://example.test' },
    },
  }
})
