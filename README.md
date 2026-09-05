# Portfolio personale

Sito personale in React + TypeScript, bilingue (italiano/inglese), con tema
chiaro/scuro/automatico e pagine di case study pre-renderizzate a build time
con [`vite-react-ssg`](https://github.com/tbgse/vite-react-ssg). Niente
backend, niente chiamate di rete in build: il sito è interamente statico e
pensato per essere pubblicato su GitHub Pages.

## Avviare l'ambiente di sviluppo

Richiede Node 20 o superiore.

```bash
npm ci
npm run dev
```

Il dev server parte su `http://localhost:5173`. In sviluppo non serve
impostare `VITE_SITE_URL` né `VITE_BASE`: valgono i valori di ripiego (radice
del sito), e la build vera e propria (`npm run build`) è quella che li
pretende — vedi più sotto.

## Test

**Unitari** (Vitest + Testing Library), contenuti, componenti e head delle
pagine:

```bash
npm test          # una sola esecuzione
npm run test:watch
```

**End-to-end** (Playwright, browser Chromium reale), sulla build statica
vera servita da `vite preview` — non sul dev server: è l'unico punto della
suite che verifica che il pre-rendering funzioni davvero:

```bash
npm run test:e2e
npm run test:e2e:ui   # con l'interfaccia di Playwright
```

Alla prima esecuzione, se il browser non è già installato:

```bash
npx playwright install --with-deps chromium
```

Controllo dei tipi e lint:

```bash
npm run typecheck
npm run lint
```

## Dove stanno i contenuti e come si modificano

**Tutti i testi del sito sono segnaposto** e vanno sostituiti prima della
pubblicazione. Vivono in due file, uno per lingua, con la stessa identica
struttura (un test automatico, `src/content/content.test.ts`, verifica che
le due lingue abbiano esattamente le stesse chiavi — se se ne modifica una
senza l'altra, `npm test` fallisce):

- `src/content/it.ts` — contenuti italiani
- `src/content/en.ts` — contenuti inglesi

La forma di questi file (quali campi esistono, quali sono obbligatori) è
definita in `src/content/schema.ts`. Coprono: intestazione ed elevator pitch
(`hero`), presentazione (`about`), competenze (`skills`), i quattro progetti
(`work.projects`, vedi sotto), il percorso professionale (`timeline`) e i
contatti (`contact`).

Alcuni vincoli su cui i test insistono, utili da sapere prima di modificare:

- nessun testo può essere vuoto in nessuna delle due lingue;
- gli slug dei progetti (`work.projects[].slug`) devono essere identici fra
  le due lingue e unici entro ciascuna lingua — sono la chiave che lega la
  versione italiana e inglese della stessa pagina di case study, e finiscono
  nell'URL (`/it/progetti/<slug>` e `/en/work/<slug>`);
  - esattamente un progetto per lingua deve avere `featured: true` (il
  progetto in evidenza).

## Come si aggiunge un progetto

Un progetto compare come card nella sezione lavori della home **e** come
pagina di case study separata e pre-renderizzata. Per aggiungerne uno:

1. **Contenuti in entrambe le lingue.** Aggiungere una voce a
   `work.projects` sia in `src/content/it.ts` sia in `src/content/en.ts`,
   con lo stesso `slug` nei due file. Ogni voce include titolo, sintesi,
   tag, metriche, link e il testo del case study (`caseStudy.intro` e
   `caseStudy.sections`).
2. **Uno schema SVG.** Il sito non usa screenshot: ogni progetto è
   rappresentato da uno schema disegnato a componenti SVG, a token di tema
   (mai colori esadecimali fuori da `src/theme/tokens.css`). Creare un nuovo
   componente in `src/schemas/`, che rispetti l'interfaccia `SchemaProps`
   (`src/schemas/types.ts`: una label accessibile più le etichette di testo
   disegnate dentro, prese da `project.schemaLabels`).
3. **La voce nella mappa `SCHEMAS`.** Registrare il nuovo componente in
   `src/schemas/index.ts`, con una chiave (`SchemaId`, da aggiungere anche
   in `src/content/schema.ts`) che corrisponde al campo `schema` della voce
   di contenuto creata al punto 1. Senza questa voce, il progetto non
   compila: `SCHEMAS` è tipizzata come `Record<SchemaId, ...>` apposta,
   così uno schema dimenticato è un errore a build time, non una card muta
   in produzione.

Il resto (routing, pre-rendering della pagina, meta tag, link fra le due
lingue) segue automaticamente dal contenuto: non c'è altro da collegare a
mano.

## Cambiare il nome del repository

Il sito legge la propria base URL da due variabili d'ambiente, entrambe
obbligatorie in build (`npm run build` fallisce apposta se mancano — è un
controllo voluto, non un bug):

- `VITE_BASE` — il percorso da cui il sito è servito. Per un repository
  pubblicato all'indirizzo `https://<utente>.github.io/<nome-repo>/` vale
  `/<nome-repo>/`.
- `VITE_SITE_URL` — l'origine assoluta del sito (`https://<utente>.github.io`,
  senza percorso), usata per costruire indirizzi canonici, `og:url` e i
  link fra lingue in forma assoluta: senza, scraper social e motori di
  ricerca li ignorerebbero.

In locale:

```bash
VITE_BASE=/portfolio/ VITE_SITE_URL=https://rab97.github.io npm run build
```

Nel deploy automatico (`.github/workflows/deploy.yml`) questi due valori
sono impostati come variabili di repository (Settings → Secrets and
variables → Actions → Variables), con lo stesso nome:

| Variabile | Valore per questo repository |
|---|---|
| `VITE_BASE` | `/portfolio/` |
| `VITE_SITE_URL` | `https://rab97.github.io` |

Rinominare il repository significa cambiare solo questi due valori (o le
variabili di repository, senza toccare il workflow) — non c'è nessun altro
posto nel codice dove il nome del repository è scritto a mano.

## Collegare un dominio proprio

Aggiungere un file `public/CNAME` con dentro, su una riga sola, il dominio
scelto (es. `portfolio.miodominio.it`), poi configurare un record DNS che
punti a GitHub Pages secondo le [istruzioni ufficiali](https://docs.github.com/it/pages/configuring-a-custom-domain-for-your-github-pages-site).
Con un dominio proprio il sito è servito dalla radice, quindi anche
`VITE_BASE` e `VITE_SITE_URL` vanno aggiornati di conseguenza (`VITE_BASE`
vuota o `/`, `VITE_SITE_URL` sul nuovo dominio).

## Pubblicazione

Il deploy su GitHub Pages è automatico: un push sul branch principale (o
un avvio manuale da GitHub, scheda Actions) esegue controllo dei tipi, test
unitari e build, poi pubblica il contenuto di `dist/`. I test end-to-end
non girano in questo workflow — richiedono il download di un browser e
allungherebbero ogni pubblicazione — ma girano separatamente
(`.github/workflows/e2e.yml`) su ogni pull request.
