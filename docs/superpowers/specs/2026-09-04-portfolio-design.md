# Portfolio personale — design

Data: 2026-09-04
Stato: approvato, pronto per il piano di implementazione

## Obiettivo

Un portfolio personale per uno sviluppatore frontend e backend, pubblicato
gratuitamente su GitHub Pages. Deve mostrare esperienze, progetti, competenze e
contatti, essere bilingue (italiano e inglese) e disponibile in tema chiaro e
scuro. Il pubblico sono recruiter tecnici e responsabili di team che valutano
un'assunzione: la pagina deve reggere una lettura di due minuti e una di venti.

Il portfolio deve rendere visibile anche il lavoro backend, non solo le
interfacce. È il vincolo che ha guidato tutte le scelte visive.

## Direzione visiva

Ibrido fra due direzioni valutate in fase di brainstorming, approvato dall'utente
su mockup interattivo.

**Da "Sistema"**: fondo scuro, monospace come voce principale, diagramma di
architettura nell'hero, metriche e log trattati come materiale grafico.

**Da "Cinetico"**: orb ambientali sfocati dietro l'hero, gradiente ambra→corallo
sulle parole chiave e sulle CTA, bottoni magnetici, conteggio animato delle
metriche all'apertura, riflesso che attraversa la miniatura all'hover della card.

### Palette

Ogni colore esiste in due varianti. La variante chiara non è un'inversione: gli
accenti sono stati scuriti perché restino leggibili su fondo chiaro.

| Token         | Scuro     | Chiaro    |
|---------------|-----------|-----------|
| `--ink`       | `#0D1117` | `#F4F6F7` |
| `--panel`     | `#141A21` | `#FFFFFF` |
| `--panel2`    | `#1A2128` | `#EDF0F3` |
| `--line`      | `#232C36` | `#E0E5EA` |
| `--line-2`    | `#2E3A45` | `#C8D1D9` |
| `--amber`     | `#F0A72B` | `#9C6206` |
| `--amber-fill`| `#F0A72B` | `#E09A1F` |
| `--coral`     | `#FF5D47` | `#C93A20` |
| `--teal`      | `#5FD0C5` | `#0B7F72` |
| `--text`      | `#C9D3DE` | `#38434F` |
| `--bright`    | `#F2F6FA` | `#0E141A` |
| `--dim`       | `#7C8B9B` | `#66727F` |
| `--faint`     | `#4E5C6B` | `#93A0AC` |

`--amber` è la variante sicura per testo e bordi, `--amber-fill` quella per i
riempimenti. Sono lo stesso colore in tema scuro e divergono in chiaro: usare la
variante sbagliata produce testo illeggibile ed è l'errore più probabile in fase
di implementazione.

Il gradiente `--sweep` va da `#F0A72B` a `#FF5D47` in scuro e da `#C9800A` a
`#D14428` in chiaro, con testo `--on-sweep` rispettivamente `#14100A` e `#FFFFFF`.

### Tipografia

IBM Plex Mono per titoli, etichette, numeri e navigazione. IBM Plex Sans per il
testo corrente. Nessun altro font. Caricati da Google Fonts con `display=swap` e
stack di fallback dichiarato.

Il monospace non va mai usato per paragrafi lunghi.

### Miniature dei progetti

Ogni progetto ha uno schema SVG disegnato a mano, non uno screenshot. È la scelta
che permette al lavoro backend di avere una rappresentazione visiva: una pipeline
diventa un flusso con i conteggi degli scarti, un design system diventa un grafo
token → tema → componente, una migrazione diventa un grafico di latenza.

Gli SVG prendono i colori dai token CSS (`fill="var(--panel2)"`) e non da valori
esadecimali, altrimenti si rompono al cambio di tema.

## Architettura

### Stack

- React 19 + TypeScript
- Vite come build tool
- `vite-react-ssg` per il pre-rendering statico
- Motion per le animazioni orchestrate
- CSS custom properties per i temi, nessun framework CSS

### Routing e pre-rendering

I case study sono pagine separate con URL propri, condivisibili e con anteprima
social. Questo esclude `HashRouter` (anteprime inesistenti) e il fallback
`404.html` (gli scraper social non eseguono JavaScript e vedrebbero una pagina
vuota).

`vite-react-ssg` genera un file HTML reale per ogni rotta a build time, con
`<title>` e meta Open Graph propri. Il sito resta una SPA dopo il primo
caricamento.

```
/                       redirect alla lingua del browser
/it/                    home italiana
/en/                    home inglese
/it/progetti/<slug>     case study italiano
/en/work/<slug>         case study inglese
/it/404  ·  /en/404     pagina non trovata
```

La lingua sta nel path perché è l'unico modo di avere indicizzazione e anteprime
corrette in entrambe le lingue. Ogni pagina dichiara i propri `hreflang`.

**Rischio.** `vite-react-ssg` richiede che nessun componente tocchi `window`,
`document` o `localStorage` durante il render. Va isolato tutto negli effetti.
Se il pre-rendering si rivela ingestibile, il ripiego è una SPA classica con
`404.html` che duplica `index.html`: si perdono solo le anteprime social, non gli
URL. La decisione di ripiegare va presa esplicitamente, non subita.

### Contenuti

```
src/content/schema.ts     interfaccia Portfolio, fonte di verità
src/content/it.ts         satisfies Portfolio
src/content/en.ts         satisfies Portfolio
src/content/github.json   generato a build time
```

Nessuna stringa visibile all'utente vive dentro un componente. `satisfies
Portfolio` su entrambi i file fa fallire la build se una lingua ha una chiave che
l'altra non ha.

Lo schema copre: dati anagrafici e stato di disponibilità, testo della sezione
"chi sono", competenze raggruppate per strato con livello da 1 a 5, progetti
(slug, titolo, sommario, tag, metriche, link, identificatore dello schema SVG,
corpo del case study), voci del percorso professionale, contatti.

I testi iniziali sono segnaposto realistici, sostituiti in una sessione dedicata
quando la struttura sarà viva.

### Tema

Tre stati: `auto`, `light`, `dark`, su un attributo `data-mode` dell'elemento
`<html>`, persistito in `localStorage`.

Il default è `auto`, che segue il sistema operativo e reagisce in diretta ai suoi
cambiamenti tramite `matchMedia`.

Uno script bloccante in `index.html` applica il tema salvato prima del primo
paint. Senza, le pagine pre-renderizzate mostrerebbero un lampo di tema sbagliato.
Ogni accesso a `localStorage` è dentro `try/catch`: se lo storage è bloccato la
pagina resta sui default di sistema senza errori.

### Lingua

Alla radice `/` viene generato un `index.html` minimo che sceglie la lingua da
`localStorage` e, in sua assenza, da `navigator.language`, con fallback inglese,
e reindirizza. Essendo un sito statico il redirect è lato client: la pagina
contiene anche i link a `/it/` e `/en/` visibili senza JavaScript, così i crawler
raggiungono comunque entrambe le versioni. La scelta esplicita dell'utente viene
salvata in `localStorage` e vince sui redirect successivi.

Il cambio lingua naviga alla rotta equivalente nell'altra lingua mantenendo la
posizione nella pagina, non ricarica.

### Animazioni

**Motion** per la sequenza orchestrata di apertura e per le micro-interazioni.
**CSS puro** per i loop ambientali — orb, caret, flusso sui collegamenti del
diagramma — che non hanno bisogno di JavaScript.

La sequenza di apertura avviene una volta sola: la riga di comando finisce di
scriversi, il diagramma di sistema si compone da sinistra a destra, le metriche
salgono al valore finale. Poi la pagina resta ferma. Ogni elemento parte da uno
stato di riposo visibile: niente `opacity: 0` in attesa di un observer.

Un hook `useReducedMotion` centralizza il rispetto di `prefers-reduced-motion`.
Con le animazioni ridotte la pagina è identica, solo ferma.

**Lenis è escluso.** Dirotta lo scroll nativo, rompe la ricerca nella pagina e la
navigazione da tastiera. Su un portfolio da assunzione uno scroll che si comporta
in modo inatteso è un danno maggiore del guadagno estetico. Si usa
`scroll-behavior: smooth` nativo.

### Sezione open source

Uno script eseguito prima della build interroga l'API pubblica di GitHub e scrive
`src/content/github.json`. Nessuna chiamata a runtime: niente rate limit, niente
stato di caricamento, nessuna dipendenza dalla disponibilità dell'API quando un
recruiter apre la pagina. I dati si aggiornano a ogni deploy.

Se l'API non risponde durante la build, lo script usa il file esistente e stampa
un avviso invece di far fallire il deploy.

### Foto ritratto

Componente `Portrait` con `<picture>` e sorgenti avif, webp e jpg, dimensioni
esplicite per non far saltare il layout durante il caricamento. Fino a quando non
sarà disponibile una foto reale mostra un segnaposto grafico coerente con la
direzione visiva.

## Struttura del progetto

```
src/
  content/      schema.ts, it.ts, en.ts, github.json
  theme/        tokens.css, ThemeProvider.tsx, ThemeToggle.tsx
  i18n/         LocaleProvider.tsx, LangToggle.tsx, useCopy.ts, routes.ts
  components/   Nav, Hero, SystemDiagram, About, Portrait, Skills,
                ProjectCard, Timeline, OpenSource, Contact, Footer
  schemas/      un componente SVG per progetto
  routes/       Home.tsx, CaseStudy.tsx, NotFound.tsx
  hooks/        useReducedMotion.ts, useThemeMode.ts
scripts/
  fetch-github.ts
docs/superpowers/specs/
.github/workflows/deploy.yml
```

Ogni componente ha una responsabilità sola e riceve i dati come props tipizzate:
nessun componente legge direttamente da `content/`, tranne le rotte.

## Test

Sviluppo guidato dai test. Le invarianti che contano:

- **Contenuti**: ogni chiave presente in entrambe le lingue; ogni progetto ha uno
  slug unico e un componente schema corrispondente; nessun campo obbligatorio
  vuoto.
- **Tema**: il toggle cambia `data-mode`; la scelta sopravvive a un reload; in
  `auto` un cambio di `prefers-color-scheme` cambia il tema; con `localStorage`
  inaccessibile la pagina funziona.
- **Lingua**: il cambio lingua porta alla rotta equivalente; la lingua del
  browser determina il redirect iniziale; la scelta salvata vince.
- **Rotte**: ogni progetto genera una pagina in entrambe le lingue; una rotta
  inesistente porta alla 404 nella lingua giusta.

Vitest e Testing Library per unità e integrazione. Playwright per due smoke test
sulle pagine pre-renderizzate, che sono l'unica parte non verificabile a livello
di unità. `axe` in CI su home e un case study.

## Deploy

Workflow GitHub Actions su push del branch `main`: install, lint, test, build,
`upload-pages-artifact`, `deploy-pages`.

Il `base` di Vite arriva da una variabile d'ambiente, così il passaggio da un repo
`username.github.io` a un repo `portfolio` (o a un dominio proprio con file
`CNAME`) resta una modifica di una riga. La scelta del nome del repository è
rimandata e non blocca l'implementazione.

GitHub Pages serve solo contenuto statico: non ci sarà mai un backend vivo. Le
capacità backend si raccontano con schemi, numeri e case study.

## Budget

- JavaScript sotto i 100 KB gzip
- Lighthouse ≥ 95 su performance, accessibilità, best practice e SEO
- Nessuna libreria grafica, nessun font oltre IBM Plex

## Decisioni prese e loro motivazione

**Competenze per strato, non per percentuale.** Le barre "React 90%" non
comunicano niente a chi legge. Le tecnologie sono raggruppate per strato del
sistema — interfaccia, servizi e dati, consegna — con un indicatore a cinque
pallini che rappresenta gli anni in produzione.

**Schemi al posto degli screenshot.** Senza questa scelta metà del lavoro
descritto nel portfolio resterebbe senza rappresentazione visiva.

**Nessuna sezione servizi o testimonianze.** Appartengono a un sito da
freelance, non a un portfolio da assunzione.

**Tema chiaro completo, non un ripiego.** La maggior parte dei portfolio con
estetica da terminale esiste solo in versione scura. Averlo anche in chiaro
raddoppia il lavoro sui token ma è a costo zero a runtime, trattandosi di custom
properties.

## Fuori perimetro

Blog o sezione articoli. Analytics. Modulo di contatto con backend. Animazioni
WebGL o shader. Ricerca interna. Commenti.
