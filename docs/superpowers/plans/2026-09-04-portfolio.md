# Portfolio personale — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Costruire un portfolio personale bilingue con tema chiaro/scuro, pre-renderizzato staticamente e pubblicato su GitHub Pages.

**Architecture:** React 19 + TypeScript su Vite, pre-renderizzato in HTML statico con `vite-react-ssg`. Tutti i testi vivono in due file di contenuti tipizzati (`it.ts`, `en.ts`) validati l'uno contro l'altro dal compilatore. Tutti i colori passano da CSS custom properties, così il cambio tema non richiede JavaScript oltre all'impostazione di un attributo.

**Tech Stack:** React 19, TypeScript, Vite, vite-react-ssg, react-router, Motion, Vitest + Testing Library, Playwright, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-09-04-portfolio-design.md`

**Riferimento visivo:** `docs/superpowers/specs/2026-09-04-portfolio-mockup.html` — mockup approvato, autonomo, apribile in un browser. È la fonte di verità per markup, CSS, palette e comportamento delle animazioni. Dove il piano dice "porta gli stili dal mockup", si intende copiarli da lì adattandoli al componente, non reinventarli.

## Global Constraints

- Node ≥ 20. React ≥ 19. TypeScript in `strict` mode.
- **Nessuna stringa visibile all'utente dentro un componente.** Tutti i testi arrivano da `src/content/{it,en}.ts`. Un test lo verifica.
- **Nessun colore esadecimale fuori da `src/theme/tokens.css`.** Tutto passa da CSS custom properties, SVG inclusi (`fill="var(--panel2)"`).
- `--amber` è per testo e bordi, `--amber-fill` per i riempimenti. In tema scuro coincidono (`#F0A72B`), in chiaro divergono (`#9C6206` contro `#E09A1F`). Scambiarle produce testo illeggibile in tema chiaro.
- **Nessun componente tocca `window`, `document` o `localStorage` durante il render**, solo dentro `useEffect`. Il pre-rendering gira in Node e fallirebbe.
- Ogni elemento animato parte da uno stato di riposo visibile. Mai `opacity: 0` in attesa di un observer.
- Ogni animazione rispetta `prefers-reduced-motion` tramite l'hook `useReducedMotion`.
- Budget: JavaScript sotto i 100 KB gzip. Nessuna libreria grafica. Nessun font oltre IBM Plex Mono e IBM Plex Sans.
- Chiavi di `localStorage`: `fr.mode` per il tema, `fr.lang` per la lingua.
- Messaggi di commit in conventional commit, in inglese.

---

## Step 0: Gina Workflow

- [ ] **Gina Workflow:** Use AskUserQuestion (header: `Gina Workflow - Finalize Claude Plan`) to ask if the user wants to run `/gina:finalize-claude-plan`. Options: `Yes, run /gina:finalize-claude-plan` | `Skip`. If Yes: execute the command. If Skip: continue with the remaining tasks.

---

## Struttura dei file

```
index.html                        guscio HTML, script anti-flash del tema
vite.config.ts                    base da env, plugin React
package.json
playwright.config.ts
scripts/fetch-github.ts           interroga l'API GitHub a build time
src/
  main.tsx                        entry di vite-react-ssg
  routes.tsx                      definizione delle rotte
  content/
    schema.ts                     interfaccia Portfolio e tipi collegati
    rich.ts                       parser del testo ricco (**forte** e {evidenziato})
    it.ts                         contenuti italiani
    en.ts                         contenuti inglesi
    github.json                   generato, committato
  theme/
    tokens.css                    tutte le custom properties, entrambi i temi
    base.css                      reset, tipografia, utility di layout
    themeMode.ts                  lettura/scrittura/applicazione del tema
    ThemeToggle.tsx
  i18n/
    routes.ts                     costruzione e traduzione dei path
    LocaleProvider.tsx            contesto: locale corrente + copy
    LangToggle.tsx
  hooks/
    useReducedMotion.ts
  components/
    Rich.tsx                      rende i token di rich.ts
    Nav.tsx
    Hero.tsx
    SystemDiagram.tsx
    Metric.tsx                    numero che sale all'apertura
    MagneticButton.tsx
    About.tsx
    Portrait.tsx
    Skills.tsx
    ProjectCard.tsx
    OpenSource.tsx
    Timeline.tsx
    Contact.tsx
    Footer.tsx
    SectionMark.tsx               il marcatore "01 / chi sono ————"
  schemas/
    index.ts                      mappa SchemaId -> componente
    DesignSystemSchema.tsx
    PipelineSchema.tsx
    ConfiguratorSchema.tsx
    HeadlessSchema.tsx
  pages/
    Home.tsx
    CaseStudy.tsx
    NotFound.tsx
    RootRedirect.tsx
tests/e2e/                        Playwright
.github/workflows/deploy.yml
```

Ogni componente riceve i dati come props tipizzate. Solo le pagine leggono da `LocaleProvider`; i componenti non importano mai direttamente da `content/`.

---

## Task 1: Impalcatura del progetto e catena di test

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `vitest.setup.ts`, `.gitignore`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: niente
- Produces: `npm test`, `npm run build`, `npm run dev` funzionanti. Alias `@/` verso `src/`.

- [ ] **Step 1: Creare il progetto Vite**

```bash
cd ~/Projects/portfolio
npm create vite@latest . -- --template react-ts
npm install
```

Rispondere di procedere anche se la cartella non è vuota (contiene già `docs/` e `.git/`). Non deve cancellare `docs/`: verificarlo subito dopo con `ls docs/superpowers/specs`.

- [ ] **Step 2: Installare le dipendenze di test e di runtime**

```bash
npm install react-router vite-react-ssg motion
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitejs/plugin-react
```

- [ ] **Step 3: Configurare Vite e Vitest**

`vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/',
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    css: true,
  },
})
```

`vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'

// jsdom non implementa matchMedia: serve a ogni test che tocca tema o reduced motion.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList
}
```

In `tsconfig.json`, dentro `compilerOptions`, aggiungere:

```json
"strict": true,
"baseUrl": ".",
"paths": { "@/*": ["src/*"] },
"types": ["vitest/globals", "@testing-library/jest-dom"]
```

In `package.json`, aggiungere agli `scripts`:

```json
"test": "vitest run",
"test:watch": "vitest",
"typecheck": "tsc --noEmit"
```

- [ ] **Step 4: Scrivere il test di fumo che fallisce**

`src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import App from './App'

test('rende un landmark main', () => {
  render(<App />)
  expect(screen.getByRole('main')).toBeInTheDocument()
})
```

- [ ] **Step 5: Eseguirlo e verificare che fallisca**

Run: `npm test`
Expected: FAIL — `App` del template Vite non contiene un elemento `<main>`.

- [ ] **Step 6: Sostituire App con il minimo necessario**

`src/App.tsx`:

```tsx
export default function App() {
  return <main />
}
```

Cancellare `src/App.css`, `src/index.css`, `src/assets/`, e ripulire `src/main.tsx` da ogni import di quei file.

- [ ] **Step 7: Verificare che passi e che la build funzioni**

Run: `npm test && npm run build && npm run typecheck`
Expected: test PASS, build senza errori, nessun errore di tipo.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold vite react-ts project with vitest"
```

---

## Task 2: Modello dei contenuti e testo ricco

**Files:**
- Create: `src/content/schema.ts`, `src/content/rich.ts`, `src/content/it.ts`, `src/content/en.ts`, `src/components/Rich.tsx`
- Test: `src/content/rich.test.ts`, `src/content/content.test.ts`

**Interfaces:**
- Consumes: niente
- Produces:
  - `interface Portfolio` e tutti i tipi collegati da `@/content/schema`
  - `parseRich(text: string): RichToken[]` da `@/content/rich`
  - `<Rich text={string} />` da `@/components/Rich`
  - `itContent: Portfolio`, `enContent: Portfolio`

- [ ] **Step 1: Scrivere i test del parser di testo ricco**

`src/content/rich.test.ts`:

```ts
import { parseRich } from './rich'

test('testo semplice produce un solo token', () => {
  expect(parseRich('ciao mondo')).toEqual([{ kind: 'plain', text: 'ciao mondo' }])
})

test('**testo** produce un token forte', () => {
  expect(parseRich('ecco **questo** qui')).toEqual([
    { kind: 'plain', text: 'ecco ' },
    { kind: 'strong', text: 'questo' },
    { kind: 'plain', text: ' qui' },
  ])
})

test('{testo} produce un token evidenziato', () => {
  expect(parseRich('sistemi che {reggono}.')).toEqual([
    { kind: 'plain', text: 'sistemi che ' },
    { kind: 'highlight', text: 'reggono' },
    { kind: 'plain', text: '.' },
  ])
})

test('i due marcatori convivono nella stessa stringa', () => {
  expect(parseRich('**A** e {B}')).toEqual([
    { kind: 'strong', text: 'A' },
    { kind: 'plain', text: ' e ' },
    { kind: 'highlight', text: 'B' },
  ])
})

test('un marcatore non chiuso resta testo semplice', () => {
  expect(parseRich('due ** stelle')).toEqual([{ kind: 'plain', text: 'due ** stelle' }])
})
```

- [ ] **Step 2: Eseguirli e verificare che falliscano**

Run: `npm test -- rich`
Expected: FAIL — `Cannot find module './rich'`.

- [ ] **Step 3: Implementare il parser**

`src/content/rich.ts`:

```ts
export type RichKind = 'plain' | 'strong' | 'highlight'
export interface RichToken {
  kind: RichKind
  text: string
}

const PATTERN = /\*\*([^*]+)\*\*|\{([^}]+)\}/g

export function parseRich(text: string): RichToken[] {
  const tokens: RichToken[] = []
  let last = 0

  for (const match of text.matchAll(PATTERN)) {
    const index = match.index ?? 0
    if (index > last) tokens.push({ kind: 'plain', text: text.slice(last, index) })
    tokens.push(
      match[1] !== undefined
        ? { kind: 'strong', text: match[1] }
        : { kind: 'highlight', text: match[2] },
    )
    last = index + match[0].length
  }

  if (last < text.length) tokens.push({ kind: 'plain', text: text.slice(last) })
  return tokens
}
```

- [ ] **Step 4: Verificare che passino**

Run: `npm test -- rich`
Expected: PASS, 5 test.

- [ ] **Step 5: Scrivere lo schema dei contenuti**

`src/content/schema.ts`:

```ts
export type Locale = 'it' | 'en'
export const LOCALES: readonly Locale[] = ['it', 'en'] as const

export type SchemaId = 'design-system' | 'pipeline' | 'configurator' | 'headless'
export type SkillLevel = 1 | 2 | 3 | 4 | 5
export type LayerId = 'interface' | 'services' | 'delivery'
export type ProjectLinkKind = 'caseStudy' | 'live' | 'repo' | 'private'

export interface Metric {
  /** Valore finale mostrato, es. "214k". La parte numerica iniziale viene animata. */
  value: string
  label: string
}

export interface Skill {
  name: string
  level: SkillLevel
}

export interface SkillLayer {
  id: LayerId
  title: string
  caption: string
  skills: Skill[]
  foot: string
}

export interface ProjectLink {
  kind: ProjectLinkKind
  label: string
  /** Assente per kind 'private' e per 'caseStudy', che viene costruito dalla rotta. */
  href?: string
}

export interface CaseStudySection {
  heading: string
  body: string[]
}

export interface Project {
  /** Identico nelle due lingue: è la chiave che le lega. */
  slug: string
  schema: SchemaId
  /** Etichette di testo che compaiono dentro lo schema SVG, nell'ordine in cui il
   *  componente le consuma. Tradotte come tutto il resto. */
  schemaLabels: string[]
  featured: boolean
  kicker: string
  period: string
  title: string
  summary: string
  tags: string[]
  metrics: Metric[]
  links: ProjectLink[]
  caseStudy: {
    intro: string
    sections: CaseStudySection[]
  }
}

export interface TimelineEntry {
  period: string
  current: boolean
  role: string
  org: string
  body: string
  tags: string[]
}

export interface Fact {
  label: string
  value: string
  accent?: boolean
}

export interface ContactLink {
  label: string
  value: string
  href: string
  arrow: '→' | '↓'
}

export interface Portfolio {
  meta: { title: string; description: string; portraitAlt: string }
  nav: { about: string; skills: string; work: string; path: string; contact: string }
  availability: string
  themeLabels: { group: string; auto: string; light: string; dark: string }
  langLabel: string
  hero: {
    prompt: string
    /** Ammette {evidenziato}. */
    headline: string
    /** Ammette **forte**. */
    sub: string
    ctaPrimary: string
    ctaSecondary: string
    diagramTitle: string
    diagramBadge: string
    nodes: string[]
    metrics: Metric[]
  }
  about: { mark: string; title: string; paragraphs: string[]; facts: Fact[] }
  skills: { mark: string; title: string; lede: string; layers: SkillLayer[] }
  work: { mark: string; title: string; lede: string; projects: Project[] }
  path: { mark: string; title: string; entries: TimelineEntry[] }
  openSource: { mark: string; title: string; lede: string; stars: string; unavailable: string }
  contact: {
    mark: string
    /** Ammette {evidenziato}. */
    title: string
    note: string
    links: ContactLink[]
  }
  footer: { left: string; right: string }
  notFound: { title: string; body: string; cta: string }
  caseStudy: { back: string; overview: string }
}
```

- [ ] **Step 6: Scrivere i test sulle invarianti dei contenuti**

`src/content/content.test.ts`:

```ts
import { itContent } from './it'
import { enContent } from './en'
import type { Portfolio } from './schema'

const locales: Array<[string, Portfolio]> = [
  ['it', itContent],
  ['en', enContent],
]

function keyPaths(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) return value.flatMap((v, i) => keyPaths(v, `${prefix}[${i}]`))
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => keyPaths(v, prefix ? `${prefix}.${k}` : k))
  }
  return [prefix]
}

test('le due lingue hanno esattamente le stesse chiavi', () => {
  expect(keyPaths(enContent).sort()).toEqual(keyPaths(itContent).sort())
})

test.each(locales)('%s: nessun testo è vuoto', (_name, content) => {
  const empty = keyPaths(content).filter((path) => {
    const value = path
      .replace(/\[(\d+)\]/g, '.$1')
      .split('.')
      .reduce<any>((acc, key) => acc?.[key], content)
    return typeof value === 'string' && value.trim() === ''
  })
  expect(empty).toEqual([])
})

test.each(locales)('%s: gli slug dei progetti sono unici', (_name, content) => {
  const slugs = content.work.projects.map((p) => p.slug)
  expect(new Set(slugs).size).toBe(slugs.length)
})

test('gli slug dei progetti coincidono fra le lingue', () => {
  expect(enContent.work.projects.map((p) => p.slug)).toEqual(
    itContent.work.projects.map((p) => p.slug),
  )
})

test.each(locales)('%s: esiste esattamente un progetto in evidenza', (_name, content) => {
  expect(content.work.projects.filter((p) => p.featured)).toHaveLength(1)
})
```

- [ ] **Step 7: Eseguirli e verificare che falliscano**

Run: `npm test -- content`
Expected: FAIL — `Cannot find module './it'`.

- [ ] **Step 8: Scrivere i due file di contenuti**

Prendere tutti i testi dal mockup `docs/superpowers/specs/2026-09-04-portfolio-mockup.html`: l'italiano dagli attributi `data-i`, l'inglese dagli attributi `data-e`. Sono già stati scritti e approvati, non vanno reinventati.

`src/content/it.ts` inizia così e prosegue coprendo ogni campo di `Portfolio`:

```ts
import type { Portfolio } from './schema'

export const itContent = {
  meta: {
    title: 'Francesco Rabezzano — Fullstack Engineer',
    description:
      'Sviluppatore frontend e backend. Design system, API di catalogo e piattaforme e-commerce.',
    portraitAlt: 'Ritratto fotografico',
  },
  nav: { about: 'chi', skills: 'skill', work: 'progetti', path: 'percorso', contact: 'contatti' },
  availability: 'disponibile da Q1',
  themeLabels: { group: 'Tema', auto: 'AUTO', light: 'Tema chiaro', dark: 'Tema scuro' },
  langLabel: 'Lingua',
  hero: {
    prompt: 'whoami --verbose',
    headline: 'Progetto sistemi che {reggono} e interfacce che li rendono ovvi.',
    sub: 'Sviluppatore **frontend e backend**. Undici anni fra design system consumati da decine di team e API che muovono cataloghi da centinaia di migliaia di prodotti.',
    ctaPrimary: 'Vedi i progetti',
    ctaSecondary: 'Scarica il CV (PDF)',
    diagramTitle: 'Architettura tipica su cui lavoro',
    diagramBadge: 'live',
    nodes: ['Fornitori', 'PIM', 'API Gateway', 'Storefront'],
    metrics: [
      { value: '11', label: 'anni' },
      { value: '138', label: 'componenti pubblicati' },
      { value: '214k', label: 'SKU gestiti' },
      { value: '42 ms', label: 'p95 catalog api' },
    ],
  },
  // ... about, skills, work (4 progetti con caseStudy), path, openSource, contact, footer,
  //     notFound, caseStudy — tutti compilati dai testi del mockup
} satisfies Portfolio

export default itContent
```

Per i case study, che nel mockup non esistono, scrivere per ciascun progetto un `intro` di due frasi e tre sezioni — "Il problema", "Come l'ho risolto", "Cosa ne è uscito" — con due paragrafi ciascuna. Sono segnaposto realistici, verranno riscritti in una sessione dedicata.

`src/content/en.ts` ha la stessa forma con i testi inglesi.

- [ ] **Step 9: Verificare che i test passino**

Run: `npm test -- content && npm run typecheck`
Expected: PASS. Se `satisfies Portfolio` segnala un campo mancante, aggiungerlo — è esattamente il suo lavoro.

- [ ] **Step 10: Scrivere il test del componente Rich**

`src/components/Rich.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { Rich } from './Rich'

test('rende i token forti dentro strong', () => {
  render(<Rich text="ecco **questo**" />)
  expect(screen.getByText('questo').tagName).toBe('STRONG')
})

test('rende i token evidenziati dentro mark', () => {
  render(<Rich text="sistemi che {reggono}" />)
  expect(screen.getByText('reggono').tagName).toBe('MARK')
})
```

- [ ] **Step 11: Eseguirlo, verificare che fallisca, implementare**

Run: `npm test -- Rich` → FAIL.

`src/components/Rich.tsx`:

```tsx
import { Fragment } from 'react'
import { parseRich } from '@/content/rich'

export function Rich({ text }: { text: string }) {
  return (
    <>
      {parseRich(text).map((token, i) => {
        if (token.kind === 'strong') return <strong key={i}>{token.text}</strong>
        if (token.kind === 'highlight') return <mark key={i}>{token.text}</mark>
        return <Fragment key={i}>{token.text}</Fragment>
      })}
    </>
  )
}
```

- [ ] **Step 12: Verificare e committare**

Run: `npm test && npm run typecheck`
Expected: tutto PASS.

```bash
git add -A
git commit -m "feat: typed bilingual content model with rich text parser"
```

---

## Task 3: Tema

**Files:**
- Create: `src/theme/tokens.css`, `src/theme/base.css`, `src/theme/themeMode.ts`, `src/theme/ThemeToggle.tsx`
- Modify: `index.html`
- Test: `src/theme/themeMode.test.ts`, `src/theme/ThemeToggle.test.tsx`

**Interfaces:**
- Consumes: `Portfolio['themeLabels']` da Task 2
- Produces:
  - `type ThemeMode = 'auto' | 'light' | 'dark'`
  - `readStoredMode(): ThemeMode`, `storeMode(mode: ThemeMode): void`, `applyMode(mode: ThemeMode): void` da `@/theme/themeMode`
  - `useThemeMode(): { mode: ThemeMode; setMode: (m: ThemeMode) => void }`
  - `<ThemeToggle labels={Portfolio['themeLabels']} />`

- [ ] **Step 1: Scrivere i token**

`src/theme/tokens.css` — copiare integralmente i quattro blocchi di custom properties dal mockup (`:root`, `@media (prefers-color-scheme: light) :root:not([data-theme="dark"])`, `:root[data-theme="light"]`, `body[data-mode=...]`), con una sola differenza: nell'app l'attributo sta sull'elemento radice, quindi i selettori del toggle diventano `:root[data-mode="dark"]` e `:root[data-mode="light"]`, e i due blocchi legati a `[data-theme]` non servono — erano una specificità dell'ambiente artifact.

Restano quindi tre blocchi:

```css
:root { /* palette scura: default */ }
@media (prefers-color-scheme: light) {
  :root:not([data-mode="dark"]) { /* palette chiara */ }
}
:root[data-mode="light"] { /* palette chiara */ }
:root[data-mode="dark"] { /* palette scura */ }
```

I valori sono nella tabella della spec e nel mockup. `:root[data-mode="dark"]` è necessario per vincere sulla media query quando il sistema è chiaro e l'utente ha scelto scuro.

`src/theme/base.css` — reset, `body`, `::selection`, `:focus-visible`, `.shell`, `.sec`, `h2.sec-title`, `.sec-lede`, `.tag`, `.tags`, e il blocco `@media (prefers-reduced-motion: reduce)`, tutti copiati dal mockup.

- [ ] **Step 2: Scrivere i test di themeMode**

`src/theme/themeMode.test.ts`:

```ts
import { readStoredMode, storeMode, applyMode } from './themeMode'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-mode')
})

test('senza nulla in memoria il tema è auto', () => {
  expect(readStoredMode()).toBe('auto')
})

test('un valore salvato viene riletto', () => {
  storeMode('dark')
  expect(readStoredMode()).toBe('dark')
})

test('un valore corrotto in memoria non rompe nulla', () => {
  localStorage.setItem('fr.mode', 'banana')
  expect(readStoredMode()).toBe('auto')
})

test('applyMode scrive data-mode sulla radice', () => {
  applyMode('light')
  expect(document.documentElement.getAttribute('data-mode')).toBe('light')
})

test('applyMode con auto rimuove data-mode', () => {
  applyMode('dark')
  applyMode('auto')
  expect(document.documentElement.hasAttribute('data-mode')).toBe(false)
})

test('con localStorage inaccessibile non solleva eccezioni', () => {
  const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('bloccato')
  })
  expect(() => storeMode('dark')).not.toThrow()
  spy.mockRestore()
})
```

- [ ] **Step 3: Eseguirli, verificare che falliscano, implementare**

Run: `npm test -- themeMode` → FAIL.

`src/theme/themeMode.ts`:

```ts
import { useCallback, useEffect, useState } from 'react'

export type ThemeMode = 'auto' | 'light' | 'dark'

const KEY = 'fr.mode'
const MODES: readonly ThemeMode[] = ['auto', 'light', 'dark'] as const

function isMode(value: unknown): value is ThemeMode {
  return typeof value === 'string' && (MODES as readonly string[]).includes(value)
}

export function readStoredMode(): ThemeMode {
  try {
    const raw = localStorage.getItem(KEY)
    return isMode(raw) ? raw : 'auto'
  } catch {
    return 'auto'
  }
}

export function storeMode(mode: ThemeMode): void {
  try {
    localStorage.setItem(KEY, mode)
  } catch {
    /* storage bloccato: la scelta vale solo per questa visita */
  }
}

export function applyMode(mode: ThemeMode): void {
  const root = document.documentElement
  if (mode === 'auto') root.removeAttribute('data-mode')
  else root.setAttribute('data-mode', mode)
}

export function useThemeMode() {
  const [mode, setModeState] = useState<ThemeMode>('auto')

  // Non si legge durante il render: il pre-rendering gira in Node.
  useEffect(() => {
    setModeState(readStoredMode())
  }, [])

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next)
    storeMode(next)
    applyMode(next)
  }, [])

  return { mode, setMode }
}
```

- [ ] **Step 4: Verificare che i test passino**

Run: `npm test -- themeMode`
Expected: PASS, 6 test.

- [ ] **Step 5: Aggiungere lo script anti-flash**

In `index.html`, dentro `<head>`, prima di qualunque foglio di stile:

```html
<script>
  // Applica il tema salvato prima del primo paint: senza, le pagine
  // pre-renderizzate mostrerebbero un lampo del tema sbagliato.
  try {
    var m = localStorage.getItem('fr.mode')
    if (m === 'light' || m === 'dark') document.documentElement.setAttribute('data-mode', m)
  } catch (e) {}
</script>
```

Nello stesso `<head>` aggiungere i font:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
/>
```

- [ ] **Step 6: Scrivere il test del ThemeToggle**

`src/theme/ThemeToggle.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from './ThemeToggle'

const labels = { group: 'Tema', auto: 'AUTO', light: 'Tema chiaro', dark: 'Tema scuro' }

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-mode')
})

test('parte con auto premuto', () => {
  render(<ThemeToggle labels={labels} />)
  expect(screen.getByRole('button', { name: 'AUTO' })).toHaveAttribute('aria-pressed', 'true')
})

test('scegliere scuro imposta data-mode e lo salva', async () => {
  render(<ThemeToggle labels={labels} />)
  await userEvent.click(screen.getByRole('button', { name: 'Tema scuro' }))
  expect(document.documentElement.getAttribute('data-mode')).toBe('dark')
  expect(localStorage.getItem('fr.mode')).toBe('dark')
})

test('tornare ad auto rimuove data-mode', async () => {
  render(<ThemeToggle labels={labels} />)
  await userEvent.click(screen.getByRole('button', { name: 'Tema chiaro' }))
  await userEvent.click(screen.getByRole('button', { name: 'AUTO' }))
  expect(document.documentElement.hasAttribute('data-mode')).toBe(false)
})
```

- [ ] **Step 7: Eseguirlo, verificare che fallisca, implementare**

Run: `npm test -- ThemeToggle` → FAIL.

`src/theme/ThemeToggle.tsx`: un `<div class="seg" role="group">` con tre `<button>`. Il primo mostra il testo `labels.auto`; gli altri due mostrano le icone SVG di sole e luna copiate dal mockup, con `aria-label` pari a `labels.light` e `labels.dark` e `aria-hidden="true"` sull'SVG. Ogni bottone ha `aria-pressed={mode === suo valore}` e al click chiama `setMode`. Gli stili `.seg` e `.seg button` si portano dal mockup.

- [ ] **Step 8: Verificare e committare**

Run: `npm test && npm run typecheck`

```bash
git add -A
git commit -m "feat: three-state theme with tokens and flash-free hydration"
```

---

## Task 4: Lingua e rotte

**Files:**
- Create: `src/i18n/routes.ts`, `src/i18n/LocaleProvider.tsx`, `src/i18n/LangToggle.tsx`
- Test: `src/i18n/routes.test.ts`, `src/i18n/LangToggle.test.tsx`

**Interfaces:**
- Consumes: `Locale`, `LOCALES` da Task 2; `itContent`, `enContent`
- Produces:
  - `homePath(l: Locale): string`, `workPath(l: Locale, slug: string): string`, `notFoundPath(l: Locale): string`, `swapLocale(pathname: string, to: Locale): string`, `detectLocale(nav: string | undefined): Locale` da `@/i18n/routes`
  - `<LocaleProvider locale={Locale}>`, `useLocale(): { locale: Locale; copy: Portfolio }` da `@/i18n/LocaleProvider`
  - `<LangToggle />`

- [ ] **Step 1: Scrivere i test delle rotte**

`src/i18n/routes.test.ts`:

```ts
import { homePath, workPath, notFoundPath, swapLocale, detectLocale } from './routes'

test('i path della home portano la lingua', () => {
  expect(homePath('it')).toBe('/it/')
  expect(homePath('en')).toBe('/en/')
})

test('il segmento dei progetti è tradotto', () => {
  expect(workPath('it', 'design-system')).toBe('/it/progetti/design-system')
  expect(workPath('en', 'design-system')).toBe('/en/work/design-system')
})

test('la 404 è per lingua', () => {
  expect(notFoundPath('en')).toBe('/en/404')
})

test('swapLocale traduce la home', () => {
  expect(swapLocale('/it/', 'en')).toBe('/en/')
})

test('swapLocale traduce un case study mantenendo lo slug', () => {
  expect(swapLocale('/it/progetti/pipeline', 'en')).toBe('/en/work/pipeline')
  expect(swapLocale('/en/work/pipeline', 'it')).toBe('/it/progetti/pipeline')
})

test('swapLocale su un path sconosciuto porta alla home della lingua', () => {
  expect(swapLocale('/qualcosa/altro', 'en')).toBe('/en/')
})

test('detectLocale riconosce le varianti italiane', () => {
  expect(detectLocale('it-IT')).toBe('it')
  expect(detectLocale('IT')).toBe('it')
})

test('detectLocale ripiega su inglese', () => {
  expect(detectLocale('fr-FR')).toBe('en')
  expect(detectLocale(undefined)).toBe('en')
})
```

- [ ] **Step 2: Eseguirli, verificare che falliscano, implementare**

Run: `npm test -- routes` → FAIL.

`src/i18n/routes.ts`:

```ts
import type { Locale } from '@/content/schema'
import { LOCALES } from '@/content/schema'

const WORK_SEGMENT: Record<Locale, string> = { it: 'progetti', en: 'work' }

export function homePath(locale: Locale): string {
  return `/${locale}/`
}

export function workPath(locale: Locale, slug: string): string {
  return `/${locale}/${WORK_SEGMENT[locale]}/${slug}`
}

export function notFoundPath(locale: Locale): string {
  return `/${locale}/404`
}

export function detectLocale(preferred: string | undefined): Locale {
  return preferred?.toLowerCase().startsWith('it') ? 'it' : 'en'
}

export function swapLocale(pathname: string, to: Locale): string {
  const parts = pathname.split('/').filter(Boolean)
  const from = parts[0]
  if (!(LOCALES as readonly string[]).includes(from)) return homePath(to)

  const rest = parts.slice(1)
  if (rest.length === 0) return homePath(to)
  if (rest[0] === WORK_SEGMENT[from as Locale] && rest[1]) return workPath(to, rest[1])
  if (rest[0] === '404') return notFoundPath(to)
  return homePath(to)
}
```

- [ ] **Step 3: Verificare che passino**

Run: `npm test -- routes`
Expected: PASS, 8 test.

- [ ] **Step 4: Implementare LocaleProvider**

`src/i18n/LocaleProvider.tsx`:

```tsx
import { createContext, useContext, type ReactNode } from 'react'
import type { Locale, Portfolio } from '@/content/schema'
import { itContent } from '@/content/it'
import { enContent } from '@/content/en'

const CONTENT: Record<Locale, Portfolio> = { it: itContent, en: enContent }

interface LocaleValue {
  locale: Locale
  copy: Portfolio
}

const LocaleContext = createContext<LocaleValue | null>(null)

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <LocaleContext.Provider value={{ locale, copy: CONTENT[locale] }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): LocaleValue {
  const value = useContext(LocaleContext)
  if (!value) throw new Error('useLocale va usato dentro un LocaleProvider')
  return value
}
```

- [ ] **Step 5: Scrivere il test del LangToggle**

`src/i18n/LangToggle.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router'
import { LocaleProvider } from './LocaleProvider'
import { LangToggle } from './LangToggle'

function Spy() {
  return <span data-testid="path">{useLocation().pathname}</span>
}

function setup(initial: string) {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <LocaleProvider locale="it">
        <LangToggle />
        <Routes>
          <Route path="*" element={<Spy />} />
        </Routes>
      </LocaleProvider>
    </MemoryRouter>,
  )
}

test('la lingua corrente è premuta', () => {
  setup('/it/')
  expect(screen.getByRole('button', { name: 'IT' })).toHaveAttribute('aria-pressed', 'true')
})

test('cliccare EN naviga alla rotta equivalente', async () => {
  setup('/it/progetti/pipeline')
  await userEvent.click(screen.getByRole('button', { name: 'EN' }))
  expect(screen.getByTestId('path')).toHaveTextContent('/en/work/pipeline')
})

test('la scelta viene salvata', async () => {
  localStorage.clear()
  setup('/it/')
  await userEvent.click(screen.getByRole('button', { name: 'EN' }))
  expect(localStorage.getItem('fr.lang')).toBe('en')
})
```

- [ ] **Step 6: Eseguirlo, verificare che fallisca, implementare**

Run: `npm test -- LangToggle` → FAIL.

`src/i18n/LangToggle.tsx`: un `<div class="seg" role="group">` con `aria-label` da `copy.langLabel` e due bottoni `IT` e `EN`. Il click chiama `navigate(swapLocale(location.pathname, target))` e salva in `localStorage` sotto `fr.lang` dentro un `try/catch`. `aria-pressed` confronta con `locale` dal contesto.

- [ ] **Step 7: Verificare e committare**

Run: `npm test && npm run typecheck`

```bash
git add -A
git commit -m "feat: locale-aware routing with language toggle"
```

---

## Task 5: Router, pre-rendering e gusci delle pagine

**Files:**
- Create: `src/routes.tsx`, `src/pages/Home.tsx`, `src/pages/CaseStudy.tsx`, `src/pages/NotFound.tsx`, `src/pages/RootRedirect.tsx`, `src/components/Head.tsx`
- Modify: `src/main.tsx`, `package.json`, `vite.config.ts`
- Test: `src/routes.test.tsx`

**Interfaces:**
- Consumes: tutto da Task 2 e 4
- Produces: `routes` esportato da `@/routes`, consumato da `main.tsx` e da `vite-react-ssg`. Ogni pagina rende il proprio contenuto dentro un `<main>`.

- [ ] **Step 1: Scrivere il test delle rotte renderizzate**

`src/routes.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { routes } from './routes'
import { itContent } from '@/content/it'

function renderAt(path: string) {
  return render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />)
}

test('la home italiana mostra il titolo hero', async () => {
  renderAt('/it/')
  expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument()
})

test('ogni progetto ha una pagina in entrambe le lingue', async () => {
  for (const project of itContent.work.projects) {
    const view = renderAt(`/it/progetti/${project.slug}`)
    expect(await screen.findByRole('heading', { level: 1, name: project.title })).toBeInTheDocument()
    view.unmount()
  }
})

test('uno slug inesistente porta alla 404 nella lingua giusta', async () => {
  renderAt('/it/progetti/non-esiste')
  expect(await screen.findByText(itContent.notFound.title)).toBeInTheDocument()
})

test('una rotta sconosciuta porta alla 404', async () => {
  renderAt('/en/qualsiasi/cosa')
  expect(await screen.findByRole('main')).toBeInTheDocument()
})
```

- [ ] **Step 2: Eseguirli, verificare che falliscano, implementare le rotte**

Run: `npm test -- routes.test` → FAIL.

`src/routes.tsx` definisce, per ciascuna delle due lingue, la home, il case study con il segmento tradotto, la 404 e un catch-all che rende la 404; più la rotta radice che rende `RootRedirect`. Ogni pagina è avvolta da `<LocaleProvider locale={...}>`.

`vite-react-ssg` ha bisogno che le rotte siano un array statico e che i case study siano enumerabili a build time: la lista degli slug arriva da `itContent.work.projects`, che è già statica.

```tsx
import type { RouteRecord } from 'vite-react-ssg'
import { LOCALES } from '@/content/schema'
import { itContent } from '@/content/it'
import { LocaleProvider } from '@/i18n/LocaleProvider'
import Home from '@/pages/Home'
import CaseStudy from '@/pages/CaseStudy'
import NotFound from '@/pages/NotFound'
import RootRedirect from '@/pages/RootRedirect'

const SLUGS = itContent.work.projects.map((p) => p.slug)
const WORK_SEGMENT = { it: 'progetti', en: 'work' } as const

export const routes: RouteRecord[] = [
  { path: '/', element: <RootRedirect /> },
  ...LOCALES.flatMap((locale) => [
    {
      path: `/${locale}/`,
      element: (
        <LocaleProvider locale={locale}>
          <Home />
        </LocaleProvider>
      ),
    },
    {
      path: `/${locale}/${WORK_SEGMENT[locale]}/:slug`,
      element: (
        <LocaleProvider locale={locale}>
          <CaseStudy />
        </LocaleProvider>
      ),
      getStaticPaths: () => SLUGS.map((slug) => `/${locale}/${WORK_SEGMENT[locale]}/${slug}`),
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
]
```

`CaseStudy` cerca lo slug fra i progetti della lingua corrente e, se non lo trova, rende `<NotFound />` invece di lanciare.

- [ ] **Step 3: Implementare Head, per titolo e meta per pagina**

`src/components/Head.tsx` usa `Head` di `vite-react-ssg` per emettere `<title>`, `<meta name="description">`, `<meta property="og:*">` e i due `<link rel="alternate" hreflang>` verso la stessa pagina nell'altra lingua, costruiti con `swapLocale`.

- [ ] **Step 4: Implementare RootRedirect**

Rende, senza JavaScript, due link visibili a `/it/` e `/en/` — così i crawler raggiungono entrambe le versioni — e in un `useEffect` reindirizza a `localStorage.fr.lang` se presente, altrimenti a `detectLocale(navigator.language)`.

- [ ] **Step 5: Passare a vite-react-ssg**

`src/main.tsx`:

```tsx
import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes'
import '@/theme/tokens.css'
import '@/theme/base.css'

export const createRoot = ViteReactSSG({ routes })
```

In `package.json` sostituire gli script di build:

```json
"dev": "vite-react-ssg dev",
"build": "vite-react-ssg build",
"preview": "vite preview"
```

- [ ] **Step 6: Verificare che la build produca i file statici attesi**

Run: `npm run build && find dist -name '*.html' | sort`
Expected: `dist/index.html`, `dist/it/index.html`, `dist/en/index.html`, e un file per ogni progetto sotto `dist/it/progetti/<slug>/` e `dist/en/work/<slug>/`.

Verificare anche che il testo sia già nell'HTML: `grep -c "Progetto sistemi" dist/it/index.html` deve restituire almeno 1. Se restituisce 0 il pre-rendering non sta funzionando.

- [ ] **Step 7: Se il pre-rendering fallisce**

Se `vite-react-ssg` non arriva a produrre l'HTML dopo un tentativo serio di isolare gli accessi a `window`, fermarsi e chiedere all'utente prima di ripiegare. Il ripiego previsto dalla spec è: tornare a `vite build` con `BrowserRouter`, copiare `dist/index.html` in `dist/404.html` nello step di build, e accettare la perdita delle anteprime social. È una decisione da prendere esplicitamente, non da subire.

- [ ] **Step 8: Verificare i test e committare**

Run: `npm test && npm run typecheck && npm run build`

```bash
git add -A
git commit -m "feat: static pre-rendered bilingual routes"
```

---

## Task 6: Nav e footer

**Files:**
- Create: `src/components/Nav.tsx`, `src/components/Nav.css`, `src/components/Footer.tsx`
- Modify: `src/pages/Home.tsx`, `src/pages/CaseStudy.tsx`, `src/pages/NotFound.tsx`
- Test: `src/components/Nav.test.tsx`

**Interfaces:**
- Consumes: `useLocale()`, `<ThemeToggle>`, `<LangToggle>`
- Produces: `<Nav />` sticky e `<Footer />` — entrambi presenti su tutte le pagine, home e case study compresi

- [ ] **Step 1: Scrivere il test**

`src/components/Nav.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { LocaleProvider } from '@/i18n/LocaleProvider'
import { Nav } from './Nav'
import { itContent } from '@/content/it'

function setup() {
  render(
    <MemoryRouter initialEntries={['/it/']}>
      <LocaleProvider locale="it">
        <Nav />
      </LocaleProvider>
    </MemoryRouter>,
  )
}

test('espone un landmark di navigazione', () => {
  setup()
  expect(screen.getByRole('navigation')).toBeInTheDocument()
})

test('mostra lo stato di disponibilità dai contenuti', () => {
  setup()
  expect(screen.getByText(itContent.availability)).toBeInTheDocument()
})

test('contiene entrambi i controlli, lingua e tema', () => {
  setup()
  expect(screen.getByRole('group', { name: itContent.langLabel })).toBeInTheDocument()
  expect(screen.getByRole('group', { name: itContent.themeLabels.group })).toBeInTheDocument()
})
```

- [ ] **Step 2: Eseguirlo, verificare che fallisca, implementare**

Run: `npm test -- Nav` → FAIL.

`Nav.tsx` porta il markup del mockup: logo, pill di disponibilità con il pallino pulsante, i cinque link di ancora (che su una pagina di case study puntano a `homePath(locale) + '#ancora'` invece che alla sola ancora), e i due `seg` dei toggle. `Nav.css` porta `.nav`, `.nav-in`, `.nav-logo`, `.nav-links`, `.status`, `.controls` e `footer.site` dal mockup.

`Footer.tsx` rende i due testi di `copy.footer` dentro un `<footer>`. È banale ma va prodotto qui perché il case study di Task 11 lo consuma.

- [ ] **Step 3: Verificare e committare**

Run: `npm test && npm run typecheck`

```bash
git add -A
git commit -m "feat: sticky navigation and footer with theme and language controls"
```

---

## Task 7: Hero

**Files:**
- Create: `src/components/Hero.tsx`, `src/components/Hero.css`, `src/components/SystemDiagram.tsx`, `src/components/Metric.tsx`, `src/components/MagneticButton.tsx`, `src/hooks/useReducedMotion.ts`
- Modify: `src/pages/Home.tsx`
- Test: `src/hooks/useReducedMotion.test.ts`, `src/components/Metric.test.tsx`, `src/components/Hero.test.tsx`

**Interfaces:**
- Consumes: `Portfolio['hero']`, `<Rich>`
- Produces: `useReducedMotion(): boolean`, `<Metric value={string} label={string} delayMs={number} />`, `<MagneticButton>`, `<SystemDiagram nodes={string[]} title={string} badge={string} />`, `<Hero />`

- [ ] **Step 1: Test e implementazione di useReducedMotion**

`src/hooks/useReducedMotion.test.ts`:

```ts
import { renderHook } from '@testing-library/react'
import { useReducedMotion } from './useReducedMotion'

test('è false quando la media query non corrisponde', () => {
  expect(renderHook(() => useReducedMotion()).result.current).toBe(false)
})

test('è true quando la media query corrisponde', () => {
  vi.spyOn(window, 'matchMedia').mockReturnValue({
    matches: true,
    addEventListener: () => {},
    removeEventListener: () => {},
  } as unknown as MediaQueryList)
  expect(renderHook(() => useReducedMotion()).result.current).toBe(true)
})
```

Run: `npm test -- useReducedMotion` → FAIL, poi implementare:

```ts
import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

export function useReducedMotion(): boolean {
  // Parte da false, non da window: il pre-rendering gira in Node.
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}
```

Run: `npm test -- useReducedMotion` → PASS.

- [ ] **Step 2: Test di Metric**

`src/components/Metric.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { Metric } from './Metric'

test('mostra subito il valore finale quando il moto è ridotto', () => {
  vi.spyOn(window, 'matchMedia').mockReturnValue({
    matches: true,
    addEventListener: () => {},
    removeEventListener: () => {},
  } as unknown as MediaQueryList)
  render(<Metric value="214k" label="SKU" delayMs={0} />)
  expect(screen.getByText('214k')).toBeInTheDocument()
})

test('arriva al valore finale anche con l animazione attiva', async () => {
  render(<Metric value="138" label="componenti" delayMs={0} />)
  expect(await screen.findByText('138', {}, { timeout: 3000 })).toBeInTheDocument()
})

test('un valore senza parte numerica viene mostrato tale e quale', () => {
  render(<Metric value="p95" label="latenza" delayMs={0} />)
  expect(screen.getByText('p95')).toBeInTheDocument()
})
```

- [ ] **Step 3: Eseguirlo, verificare che fallisca, implementare Metric**

Run: `npm test -- Metric` → FAIL.

`Metric` separa il valore in prefisso numerico e suffisso (`"214k"` → `214` e `"k"`, `"42 ms"` → `42` e `" ms"`, `"p95"` → nessun numero). Se non c'è numero, o se `useReducedMotion()` è true, rende il valore finale e basta. Altrimenti anima da zero con `requestAnimationFrame` ed easing cubico in uscita, durata 1100 ms, partendo dopo `delayMs`, e pulisce timer e frame nel cleanup dell'effetto. Il valore finale resta nel DOM anche se il componente viene smontato a metà.

- [ ] **Step 4: Implementare MagneticButton**

Un `<button>` che al `pointermove` applica `transform: translate(...)` proporzionale alla distanza dal centro (fattori `0.22` orizzontale e `0.34` verticale, come nel mockup) e al `pointerleave` azzera. Se `useReducedMotion()` è true non registra alcun listener. Accetta `variant: 'solid' | 'ghost'` e inoltra `onClick` e `children`.

- [ ] **Step 5: Implementare SystemDiagram**

Rende la riga di nodi con i collegamenti animati fra l'uno e l'altro. Il secondo nodo prende la classe `cool`, il terzo `hot`. I collegamenti sono `<span class="wire">` con l'animazione CSS `flow` sfasata, tutta in `Hero.css`, presa dal mockup.

- [ ] **Step 6: Test e implementazione di Hero**

`src/components/Hero.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { LocaleProvider } from '@/i18n/LocaleProvider'
import { Hero } from './Hero'
import { itContent } from '@/content/it'

test('il titolo è un h1 e contiene la parola evidenziata', () => {
  render(
    <LocaleProvider locale="it">
      <Hero />
    </LocaleProvider>,
  )
  const h1 = screen.getByRole('heading', { level: 1 })
  expect(h1).toHaveTextContent('Progetto sistemi che reggono')
  expect(h1.querySelector('mark')).not.toBeNull()
})

test('mostra tutte le metriche dei contenuti', () => {
  render(
    <LocaleProvider locale="it">
      <Hero />
    </LocaleProvider>,
  )
  for (const metric of itContent.hero.metrics) {
    expect(screen.getByText(metric.label)).toBeInTheDocument()
  }
})
```

Run → FAIL → implementare `Hero.tsx` con orb, prompt con caret, `<h1><Rich text={copy.hero.headline} /></h1>`, sottotitolo con `<Rich>`, due `MagneticButton`, e il riquadro diagramma con `SystemDiagram` e le quattro `Metric` sfasate di 110 ms l'una dall'altra. `Hero.css` porta `.hero`, `.orb*`, `.hero-prompt`, `.caret`, `.hero h1`, `.hero-sub`, `.btn*`, `.diagram*`, `.flowline`, `.node`, `.wire`, `.metrics`, `.metric` dal mockup.

- [ ] **Step 7: Verificare e committare**

Run: `npm test && npm run typecheck && npm run build`

```bash
git add -A
git commit -m "feat: hero with system diagram, counting metrics and magnetic buttons"
```

---

## Task 8: Chi sono e ritratto

**Files:**
- Create: `src/components/About.tsx`, `src/components/About.css`, `src/components/Portrait.tsx`, `src/components/SectionMark.tsx`
- Modify: `src/pages/Home.tsx`
- Test: `src/components/About.test.tsx`

**Interfaces:**
- Consumes: `Portfolio['about']`, `Portfolio['meta'].portraitAlt`, `<Rich>`
- Produces: `<SectionMark index={string} label={string} />`, `<Portrait alt={string} />`, `<About />`

- [ ] **Step 1: Test**

```tsx
test('rende tutti i paragrafi dei contenuti', () => {
  render(<LocaleProvider locale="it"><About /></LocaleProvider>)
  expect(screen.getAllByRole('paragraph')).toHaveLength(itContent.about.paragraphs.length)
})

test('rende ogni fatto come coppia termine-definizione', () => {
  render(<LocaleProvider locale="it"><About /></LocaleProvider>)
  for (const fact of itContent.about.facts) {
    expect(screen.getByText(fact.label)).toBeInTheDocument()
    expect(screen.getByText(fact.value)).toBeInTheDocument()
  }
})

test('il ritratto ha un testo alternativo', () => {
  render(<LocaleProvider locale="it"><About /></LocaleProvider>)
  expect(screen.getByRole('img', { name: itContent.meta.portraitAlt })).toBeInTheDocument()
})
```

- [ ] **Step 2: Eseguire, verificare il fallimento, implementare**

`Portrait.tsx` rende un `<picture>` con sorgenti `avif` e `webp` e un `<img>` di ripiego, tutte da `/portrait.*`, con `width={480}`, `height={600}`, `loading="lazy"`, `decoding="async"` e l'`alt` da `copy.meta.portraitAlt`.

Finché non arriva una foto reale, creare un solo file `public/portrait.svg` — 480×600, fondo `var(--panel)`, una griglia di linee sottili `var(--line-2)` e la sigla in IBM Plex Mono `var(--faint)` al centro — e puntarci l'`<img>` di ripiego. Niente `avif` e `webp` finché non esiste la foto: sorgenti che rimandano a file assenti fanno fallire il caricamento silenziosamente. Quando la foto arriverà, si aggiungono i due `<source>` e si toglie l'SVG.

`About.tsx` rende `SectionMark`, titolo, i paragrafi con `<Rich>`, il `<dl class="facts">` e il ritratto. Stili dal mockup.

- [ ] **Step 3: Verificare e committare**

```bash
git add -A
git commit -m "feat: about section with portrait"
```

---

## Task 9: Competenze

**Files:**
- Create: `src/components/Skills.tsx`, `src/components/Skills.css`
- Modify: `src/pages/Home.tsx`
- Test: `src/components/Skills.test.tsx`

**Interfaces:**
- Consumes: `Portfolio['skills']`
- Produces: `<Skills />`

- [ ] **Step 1: Test**

```tsx
test('rende i tre strati', () => {
  render(<LocaleProvider locale="it"><Skills /></LocaleProvider>)
  for (const layer of itContent.skills.layers) {
    expect(screen.getByRole('heading', { name: layer.title })).toBeInTheDocument()
  }
})

test('il livello è esposto a chi non vede i pallini', () => {
  render(<LocaleProvider locale="it"><Skills /></LocaleProvider>)
  const first = itContent.skills.layers[0].skills[0]
  expect(screen.getByRole('img', { name: `${first.level}/5` })).toBeInTheDocument()
})
```

- [ ] **Step 2: Eseguire, verificare il fallimento, implementare**

I pallini sono cinque `<i>` dentro uno `<span class="dots" role="img" aria-label="4/5">`: senza l'`aria-label` il livello sarebbe invisibile a uno screen reader. La classe dello strato (`is-fe`, `is-be`, `is-ops`) deriva da `layer.id` tramite una mappa esplicita, non da concatenazione di stringhe.

- [ ] **Step 3: Verificare e committare**

```bash
git add -A
git commit -m "feat: skills by system layer with accessible levels"
```

---

## Task 10: Schemi SVG e sezione progetti

**Files:**
- Create: `src/schemas/DesignSystemSchema.tsx`, `src/schemas/PipelineSchema.tsx`, `src/schemas/ConfiguratorSchema.tsx`, `src/schemas/HeadlessSchema.tsx`, `src/schemas/index.ts`, `src/components/ProjectCard.tsx`, `src/components/ProjectCard.css`, `src/components/Work.tsx`
- Modify: `src/pages/Home.tsx`
- Test: `src/schemas/schemas.test.tsx`, `src/components/ProjectCard.test.tsx`

**Interfaces:**
- Consumes: `Project`, `SchemaId`, `workPath`
- Produces:
  - `interface SchemaProps { label: string; labels: string[] }`
  - `SCHEMAS: Record<SchemaId, ComponentType<SchemaProps>>` da `@/schemas`
  - `<ProjectCard project={Project} featured={boolean} />`, `<Work />`

  `label` è la descrizione per gli screen reader che finisce in `aria-label` sull'`<svg>`; `labels` sono le etichette di testo disegnate dentro lo schema.

- [ ] **Step 1: Test degli schemi**

`src/schemas/schemas.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import { SCHEMAS } from './index'
import { itContent } from '@/content/it'

test('esiste uno schema per ogni identificatore usato dai progetti', () => {
  for (const project of itContent.work.projects) {
    expect(SCHEMAS[project.schema]).toBeDefined()
  }
})

test.each(Object.entries(SCHEMAS))('%s: nessun colore esadecimale nell SVG', (_id, Schema) => {
  const { container } = render(<Schema label="test" labels={Array(12).fill('x')} />)
  expect(container.innerHTML).not.toMatch(/#[0-9a-fA-F]{3,8}\b/)
})

test.each(Object.entries(SCHEMAS))('%s: è etichettato per gli screen reader', (_id, Schema) => {
  const { container } = render(<Schema label="descrizione" labels={Array(12).fill('x')} />)
  const svg = container.querySelector('svg')
  expect(svg).toHaveAttribute('role', 'img')
  expect(svg).toHaveAttribute('aria-label', 'descrizione')
})
```

Il secondo test è quello che protegge il tema chiaro: un esadecimale sfuggito dentro un SVG produce uno schema illeggibile su fondo chiaro, e nessuno se ne accorgerebbe finché non cambia tema.

- [ ] **Step 2: Eseguire, verificare il fallimento, portare i quattro SVG**

I quattro SVG esistono già nel mockup, sezione progetti, e usano già `var(--token)`. Vanno trasformati in componenti React: `viewBox` invariato, attributi in camelCase (`strokeWidth`, `strokeDasharray`, `fontSize`, `textAnchor`, `fillOpacity`), le etichette di testo prese da props invece che scritte in chiaro.

Ogni schema riceve le proprie etichette da `project.schemaLabels`, già definito nello schema in Task 2 e popolato nei due file di contenuti con le stringhe che compaiono dentro l'SVG (`PRIMITIVI` / `PRIMITIVES` e simili). L'ordine dell'array è il contratto fra contenuti e componente: documentarlo con un commento in cima a ciascuno schema.

Le sei tessere colorate dei temi nello schema del design system sono l'unica eccezione ammessa alla regola sugli esadecimali: sono campioni di colore di marchi diversi, non colori dell'interfaccia. Vanno estratte in una costante `THEME_SWATCHES` in cima al file con un commento che spiega perché, e il test va scritto per ignorare quel file specifico o quella costante.

- [ ] **Step 3: Test e implementazione di ProjectCard**

```tsx
test('il titolo rimanda al case study nella lingua giusta', () => {
  const project = itContent.work.projects[0]
  render(
    <MemoryRouter>
      <LocaleProvider locale="it">
        <ProjectCard project={project} featured />
      </LocaleProvider>
    </MemoryRouter>,
  )
  expect(screen.getByRole('link', { name: new RegExp(project.title) })).toHaveAttribute(
    'href',
    `/it/progetti/${project.slug}`,
  )
})

test('i link marcati privati non sono link', () => {
  const project = { ...itContent.work.projects[0], links: [{ kind: 'private' as const, label: 'Codice privato' }] }
  render(
    <MemoryRouter>
      <LocaleProvider locale="it">
        <ProjectCard project={project} featured={false} />
      </LocaleProvider>
    </MemoryRouter>,
  )
  expect(screen.queryByRole('link', { name: 'Codice privato' })).not.toBeInTheDocument()
})
```

Un elemento disabilitato non deve essere un link: `<span>` con la stessa resa visiva, non `<a aria-disabled>`, che resta focalizzabile e cliccabile.

- [ ] **Step 4: Implementare Work**

Rende `SectionMark`, titolo, lede, la card in evidenza e la griglia con le altre tre. Stili `.projects`, `.card*`, `.schema`, `.tags`, `.card-links` dal mockup.

- [ ] **Step 5: Verificare e committare**

Run: `npm test && npm run typecheck && npm run build`

```bash
git add -A
git commit -m "feat: project cards with hand-drawn schematic thumbnails"
```

---

## Task 11: Pagina case study

**Files:**
- Modify: `src/pages/CaseStudy.tsx`
- Create: `src/pages/CaseStudy.css`
- Test: `src/pages/CaseStudy.test.tsx`

**Interfaces:**
- Consumes: `Project['caseStudy']`, `SCHEMAS`, `<Head>`, `<Nav>`, `<Footer>`
- Produces: la pagina completa del case study

- [ ] **Step 1: Test**

```tsx
test('rende intro e tutte le sezioni', async () => {
  const project = itContent.work.projects[0]
  renderAt(`/it/progetti/${project.slug}`)
  expect(await screen.findByText(project.caseStudy.intro)).toBeInTheDocument()
  for (const section of project.caseStudy.sections) {
    expect(screen.getByRole('heading', { name: section.heading })).toBeInTheDocument()
  }
})

test('ha un link di ritorno alla home nella lingua giusta', async () => {
  renderAt(`/it/progetti/${itContent.work.projects[0].slug}`)
  expect(await screen.findByRole('link', { name: itContent.caseStudy.back })).toHaveAttribute(
    'href',
    '/it/',
  )
})
```

- [ ] **Step 2: Eseguire, verificare il fallimento, implementare**

La pagina rende `Nav`, un `<Head>` con titolo `"<titolo progetto> — <nome>"` e la descrizione presa da `caseStudy.intro`, il link di ritorno, l'`<h1>` col titolo, il riquadro con lo schema SVG grande, le metriche e i tag, le sezioni del case study, e `Footer`. Riusa le classi esistenti dove possibile invece di inventarne di nuove.

- [ ] **Step 3: Verificare e committare**

```bash
git add -A
git commit -m "feat: case study pages"
```

---

## Task 12: Percorso

**Files:**
- Create: `src/components/Timeline.tsx`, `src/components/Timeline.css`
- Modify: `src/pages/Home.tsx`
- Test: `src/components/Timeline.test.tsx`

**Interfaces:**
- Consumes: `Portfolio['path']`
- Produces: `<Timeline />`

- [ ] **Step 1: Test**

```tsx
test('rende una voce per ogni riga del percorso', () => {
  render(<LocaleProvider locale="it"><Timeline /></LocaleProvider>)
  expect(screen.getAllByRole('listitem')).toHaveLength(itContent.path.entries.length)
})

test('la voce corrente è marcata anche semanticamente', () => {
  render(<LocaleProvider locale="it"><Timeline /></LocaleProvider>)
  const current = itContent.path.entries.find((e) => e.current)!
  expect(screen.getByText(current.period).closest('li')).toHaveAttribute('aria-current', 'true')
})
```

Il pallino verde che nel mockup indica il ruolo attuale è puramente decorativo: `aria-current` è ciò che lo rende percepibile a chi non lo vede.

- [ ] **Step 2: Eseguire, verificare il fallimento, implementare, committare**

```bash
git add -A
git commit -m "feat: career timeline"
```

---

## Task 13: Sezione open source

**Files:**
- Create: `scripts/fetch-github.ts`, `src/content/github.json`, `src/components/OpenSource.tsx`, `src/components/OpenSource.css`
- Modify: `package.json`, `src/pages/Home.tsx`
- Test: `scripts/fetch-github.test.ts`, `src/components/OpenSource.test.tsx`

**Interfaces:**
- Consumes: `Portfolio['openSource']`
- Produces:
  - `interface Repo { name: string; description: string | null; url: string; stars: number; language: string | null }`
  - `selectRepos(raw: unknown[]): Repo[]` da `scripts/fetch-github`
  - `<OpenSource repos={Repo[]} />`

- [ ] **Step 1: Test della selezione dei repo**

```ts
import { selectRepos } from './fetch-github'

const raw = [
  { name: 'a', description: 'x', html_url: 'u', stargazers_count: 5, language: 'TypeScript', fork: false, archived: false },
  { name: 'b', description: null, html_url: 'u', stargazers_count: 9, language: null, fork: true, archived: false },
  { name: 'c', description: 'y', html_url: 'u', stargazers_count: 1, language: 'Go', fork: false, archived: true },
]

test('scarta fork e archiviati', () => {
  expect(selectRepos(raw).map((r) => r.name)).toEqual(['a'])
})

test('ordina per stelle decrescenti e taglia a sei', () => {
  const many = Array.from({ length: 10 }, (_, i) => ({
    name: `r${i}`, description: null, html_url: 'u', stargazers_count: i, language: null, fork: false, archived: false,
  }))
  const selected = selectRepos(many)
  expect(selected).toHaveLength(6)
  expect(selected[0].name).toBe('r9')
})

test('una risposta malformata non fa esplodere nulla', () => {
  expect(selectRepos([null, 42, {}] as unknown[])).toEqual([])
})
```

- [ ] **Step 2: Eseguire, verificare il fallimento, implementare lo script**

`selectRepos` è una funzione pura, testabile senza rete. Lo script chiama `https://api.github.com/users/<utente>/repos?per_page=100&sort=updated`, passa la risposta a `selectRepos` e scrive `src/content/github.json` formattato. In caso di errore di rete o risposta non valida stampa un avviso su `stderr`, lascia il file esistente al suo posto ed esce con codice 0: un deploy non deve fallire perché l'API di GitHub ha singhiozzato.

Committare `src/content/github.json` con i dati reali: è il fallback quando l'API non risponde.

In `package.json`:

```json
"fetch:github": "tsx scripts/fetch-github.ts",
"prebuild": "npm run fetch:github"
```

Installare `tsx` come dipendenza di sviluppo.

- [ ] **Step 3: Test e implementazione della sezione**

La sezione rende una griglia di card con nome, descrizione, linguaggio e stelle. Con `repos` vuoto mostra `copy.openSource.unavailable` invece di una griglia vuota.

- [ ] **Step 4: Verificare e committare**

```bash
git add -A
git commit -m "feat: open source section fed by build-time github data"
```

---

## Task 14: Contatti

**Files:**
- Create: `src/components/Contact.tsx`, `src/components/Contact.css`
- Modify: `src/pages/Home.tsx`
- Test: `src/components/Contact.test.tsx`

**Interfaces:**
- Consumes: `Portfolio['contact']`, `<Rich>`
- Produces: `<Contact />`

- [ ] **Step 1: Test**

```tsx
test('ogni contatto è un link con href corretto', () => {
  render(<LocaleProvider locale="it"><Contact /></LocaleProvider>)
  for (const link of itContent.contact.links) {
    expect(screen.getByRole('link', { name: new RegExp(link.value) })).toHaveAttribute('href', link.href)
  }
})

test('i link esterni si aprono in sicurezza', () => {
  render(<LocaleProvider locale="it"><Contact /></LocaleProvider>)
  for (const anchor of screen.getAllByRole('link')) {
    if (anchor.getAttribute('href')?.startsWith('http')) {
      expect(anchor).toHaveAttribute('rel', expect.stringContaining('noopener'))
    }
  }
})
```

- [ ] **Step 2: Eseguire, verificare il fallimento, implementare, committare**

La freccia di ogni riga (`→` o `↓`) è decorativa: va marcata `aria-hidden`.

```bash
git add -A
git commit -m "feat: contact section"
```

---

## Task 15: Test end-to-end e accessibilità

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/site.spec.ts`, `tests/e2e/a11y.spec.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: il sito costruito in `dist/`
- Produces: `npm run test:e2e`

- [ ] **Step 1: Installare Playwright e axe**

```bash
npm install -D @playwright/test @axe-core/playwright
npx playwright install --with-deps chromium
```

- [ ] **Step 2: Configurare Playwright contro la build statica**

`playwright.config.ts` con `webServer` che esegue `npm run build && npm run preview`, `baseURL: 'http://localhost:4173'`, un solo progetto Chromium.

Questo è importante: i test end-to-end girano sui file statici veri, non sul dev server. È l'unico punto in cui si verifica che il pre-rendering funzioni.

- [ ] **Step 3: Scrivere i test end-to-end**

`tests/e2e/site.spec.ts`:

```ts
import { test, expect } from '@playwright/test'

test('la home italiana è pre-renderizzata, non costruita dal client', async ({ page }) => {
  const response = await page.goto('/it/')
  const html = (await response!.text())
  expect(html).toContain('Progetto sistemi che')
})

test('la scelta del tema sopravvive a un ricaricamento', async ({ page }) => {
  await page.goto('/it/')
  await page.getByRole('button', { name: 'Tema chiaro' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'light')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'light')
})

test('il cambio lingua porta alla rotta equivalente', async ({ page }) => {
  await page.goto('/it/progetti/design-system')
  await page.getByRole('button', { name: 'EN' }).click()
  await expect(page).toHaveURL(/\/en\/work\/design-system$/)
})

test('la radice reindirizza a una lingua', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/(it|en)\/$/)
})

test('uno slug inesistente mostra la pagina non trovata', async ({ page }) => {
  await page.goto('/it/progetti/non-esiste')
  await expect(page.getByRole('main')).toContainText(/non trovat/i)
})
```

`tests/e2e/a11y.spec.ts` esegue `AxeBuilder` su `/it/` e su un case study, in entrambi i temi, e pretende zero violazioni di gravità `serious` o `critical`. Il controllo su entrambi i temi è il punto: il contrasto è l'unica cosa che può rompersi passando da scuro a chiaro.

- [ ] **Step 4: Eseguirli e sistemare quello che emerge**

Run: `npm run test:e2e`

Le violazioni di contrasto in tema chiaro, se ci sono, si correggono nei token, mai nel singolo componente.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "test: end-to-end and accessibility coverage on the static build"
```

---

## Task 16: Deploy su GitHub Pages

**Files:**
- Create: `.github/workflows/deploy.yml`, `README.md`, `public/.nojekyll`
- Modify: `package.json`

**Interfaces:**
- Consumes: `npm run build`
- Produces: il sito pubblicato

- [ ] **Step 1: Scrivere il workflow**

`.github/workflows/deploy.yml`: su push di `main` e su `workflow_dispatch`. Un job `build` con checkout, `actions/setup-node@v4` con Node 20 e cache npm, `npm ci`, `npm run typecheck`, `npm test`, `npm run build` con `VITE_BASE` da una variabile di repository (vuota o `/nome-repo/`), poi `actions/configure-pages@v5` e `actions/upload-pages-artifact@v3` su `dist`. Un job `deploy` con `actions/deploy-pages@v4`, permessi `pages: write` e `id-token: write`, e `concurrency` per non sovrapporre due deploy.

I test end-to-end non girano in questo workflow: aggiungerli come job separato su pull request, così un deploy non aspetta Playwright.

- [ ] **Step 2: Aggiungere .nojekyll**

`public/.nojekyll`, vuoto. Senza, GitHub Pages ignora le cartelle che iniziano con underscore e alcuni asset di Vite spariscono.

- [ ] **Step 3: Scrivere il README**

Deve contenere: cos'è il progetto, come far partire il dev server, come lanciare i test, dove stanno i contenuti e come si modificano, come si aggiunge un progetto (contenuti in due lingue più un componente schema più la voce nella mappa `SCHEMAS`), come si cambia il nome del repository agendo su `VITE_BASE`, e come si collega un dominio proprio aggiungendo `public/CNAME`.

- [ ] **Step 4: Verifica finale prima di pubblicare**

Run: `npm ci && npm run typecheck && npm test && npm run build && npm run test:e2e`
Expected: tutto verde.

Controllare la dimensione del bundle: `du -sh dist/assets/*.js`. Se il JavaScript supera i 100 KB gzip, il budget della spec è violato e va risolto prima del deploy, non dopo.

- [ ] **Step 5: Commit e primo deploy**

```bash
git add -A
git commit -m "ci: deploy to github pages"
```

Chiedere all'utente il nome del repository, creare il remote, fare push, e attivare Pages con sorgente "GitHub Actions" nelle impostazioni del repository. Il push su un remote è un'azione verso l'esterno: va fatta solo dopo conferma esplicita.

---

## Verifica finale contro la spec

- [ ] Direzione visiva ibrida A×C fedele al mockup, in entrambi i temi
- [ ] Bilingue con lingua nel path e `hreflang` corretti
- [ ] Tema a tre stati con default di sistema e nessun lampo al caricamento
- [ ] Case study come pagine separate pre-renderizzate con meta proprie
- [ ] Ritratto e sezione open source presenti
- [ ] Schemi SVG al posto degli screenshot, tutti a token
- [ ] `prefers-reduced-motion` rispettato ovunque
- [ ] JavaScript sotto i 100 KB gzip, Lighthouse ≥ 95
- [ ] Deploy automatico su GitHub Pages, `base` configurabile con una variabile
