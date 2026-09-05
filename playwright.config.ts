import { defineConfig, devices } from '@playwright/test'

/** I test end-to-end girano sui file statici veri prodotti da `vite-react-ssg`,
 *  non sul dev server: è l'unico punto della suite in cui si verifica che il
 *  pre-rendering funzioni davvero, cioè che l'HTML arrivi già pieno dal server
 *  invece di essere costruito dal client dopo l'idratazione.
 *
 *  L'indirizzo compare due volte, e deve essere lo stesso in entrambi i posti:
 *  - come `baseURL`, cioè dove i test navigano;
 *  - come `VITE_SITE_URL`, cioè la radice da cui la build costruisce `og:url`,
 *    `canonical` e gli `hreflang`.
 *  Se divergessero, le pagine servite da questo server dichiarerebbero URL
 *  canonici che puntano altrove — e un test sul pre-rendering che non guarda
 *  gli stessi URL che serve non verifica granché. Da qui la costante unica.
 *
 *  Né `VITE_SITE_URL` né `VITE_BASE` hanno un valore di ripiego: la build
 *  fallisce apposta quando mancano (build/config.ts), quindi vanno passate
 *  esplicitamente nell'ambiente del `webServer`. `vite preview` serve dalla
 *  radice della porta, quindi qui la base è `/`. */
const ORIGIN = 'http://localhost:4173'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'list' : [['list']],
  use: {
    baseURL: ORIGIN,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // `--strictPort`: meglio un errore chiaro che un server silenziosamente su
    // un'altra porta, con tutti i test a sbattere contro `baseURL`.
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    env: { VITE_SITE_URL: ORIGIN, VITE_BASE: '/' },
    url: `${ORIGIN}/it/`,
    reuseExistingServer: !process.env.CI,
    // La build pre-renderizza 13 pagine: il default di 60s è al limite.
    timeout: 180_000,
  },
})
