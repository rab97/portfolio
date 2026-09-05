/* ============================================================
   SEGNAPOSTO — inventario

   Non ne resta nessuno. Ogni affermazione di questo file è verificabile: i
   fatti sulla persona vengono dal suo CV e dal committente, i numeri di
   Basil (131 commit su 779, secondo di sette contributori) si leggono su
   github.com/cirulla/basil in dieci secondi, e i due prodotti aziendali
   sono descritti per quello che sono senza nominare clienti, architetture
   interne o cifre di catalogo — vincolo di riservatezza esplicito.

   Nessun numero è stato inventato per riempire un blocco del design. Dove
   non c'era un numero vero, il blocco è più corto:

     hero.metrics       tre voci, non quattro: anno d'ingresso in azienda,
                        numero di prodotti su cui lavora, commit su Basil
     work.projects[]    `metrics: []` per i tre prodotti privati, di cui non
                        si possono pubblicare misure; solo Basil ne ha
     caseStudy.sections poche e corte per i prodotti aziendali, perché di
                        loro si può dire poco; più concrete per Basil, che
                        è pubblico

   Resta un segnaposto **grafico**, non testuale: la foto del ritratto non
   esiste e `src/components/Portrait.tsx` disegna le iniziali su una
   griglia. `meta.portraitAlt` lo dice, invece di descrivere una foto che
   non c'è.
   ============================================================ */

import type { Portfolio } from './schema'

export const itContent = {
  meta: {
    title: 'Francesco Rabezzano — Fullstack Engineer',
    description:
      'Sviluppatore a Torino: React e TypeScript sul frontend, C# e .NET sul backend. Lavoro su un PIM e su un CPQ.',
    portraitAlt: 'Segnaposto del ritratto: le iniziali FR su una griglia',
    ogImageAlt:
      'Scheda di anteprima su fondo scuro: il nome Francesco Rabezzano, il ruolo Fullstack Engineer e una riga di nodi collegati.',
    languageName: 'Italiano',
    ogLocale: 'it_IT',
  },
  nav: { about: 'chi', skills: 'skill', work: 'progetti', path: 'percorso', contact: 'contatti' },
  location: 'Torino, Italia',
  themeLabels: { group: 'Tema', auto: 'AUTO', light: 'Tema chiaro', dark: 'Tema scuro' },
  langLabel: 'Lingua',
  hero: {
    prompt: 'whoami --verbose',
    headline: 'Dati di prodotto, e le {interfacce} per lavorarci.',
    sub: 'Sviluppatore **frontend**, con lavoro **backend** vero: React e TypeScript da una parte, C# e .NET dall’altra. Da due anni in azienda su un PIM e un CPQ; prima, progetti da autonomo.',
    ctaPrimary: 'Vedi i progetti',
    diagramTitle: 'Il flusso su cui lavoro',
    diagramBadge: 'semplificato',
    nodes: ['Dati prodotto', 'PIM', 'Catalogo', 'Canali'],
    // Tre, non quattro: l'anno d'ingresso in azienda, i prodotti su cui
    // sviluppa e i commit su Basil sono i soli numeri veri e verificabili
    // che ci siano. Il quarto riquadro del mockup resta vuoto apposta.
    metrics: [
      { value: '2024', label: 'in azienda dal' },
      { value: '2', label: 'prodotti: PIM e CPQ' },
      { value: '131', label: 'commit su Basil' },
    ],
  },
  about: {
    mark: 'chi sono',
    title: 'Frontend di partenza, backend per necessità',
    paragraphs: [
      'Ho iniziato dal frontend e ci sono rimasto: **React e TypeScript** sono il posto in cui lavoro meglio. Il backend è arrivato dopo, lavorando sugli stessi prodotti dall’altra parte — **C# e .NET** — perché è lì che i dati che l’interfaccia mostra vengono decisi.',
      'Da due anni sviluppo su due prodotti dell’azienda per cui lavoro: un **PIM**, che raccoglie e organizza le informazioni sui prodotti per distribuirle ai canali di vendita, e un **CPQ**, che le usa per configurare, prezzare e preventivare. Da quattro mesi lavoro a un **server MCP** per il PIM.',
      'Ho studiato Ingegneria informatica al Politecnico di Torino, poi ho iniziato la magistrale in Cybersecurity, che non ho concluso. Il resto l’ho imparato lavorando.',
    ],
    facts: [
      { label: 'Base', value: 'Torino, Italia' },
      { label: 'Ruolo', value: 'Junior developer' },
      { label: 'Lato forte', value: 'Frontend' },
      { label: 'Lingue', value: 'Italiano, Inglese B2, Spagnolo A1' },
      { label: 'Ora', value: 'Un server MCP per il PIM', accent: true },
    ],
  },
  skills: {
    mark: 'competenze',
    title: 'Per strato, non per percentuale',
    lede: 'Le barre "React 90%" non dicono niente. Qui le tecnologie sono ordinate per strato del sistema, e i pallini dicono quanto ci ho lavorato davvero: due anni in azienda e qualche progetto da autonomo. Nessun cinque su cinque.',
    layers: [
      {
        id: 'interface',
        title: 'Interfaccia',
        caption: 'strato 1',
        skills: [
          { name: 'React · TypeScript', level: 4 },
          { name: 'Radix UI · MUI', level: 3 },
          { name: 'CSS · Stitches', level: 3 },
          { name: 'Figma', level: 2 },
        ],
        foot: 'Molti componenti su due prodotti aziendali',
      },
      {
        id: 'services',
        title: 'Servizi & dati',
        caption: 'strato 2',
        skills: [
          { name: 'C# · .NET', level: 3 },
          { name: 'Node · NestJS', level: 2 },
          { name: 'Server MCP', level: 2 },
          { name: 'Stripe', level: 2 },
          { name: 'Directus', level: 2 },
        ],
        foot: 'Il backend dei due prodotti aziendali, in C# e .NET',
      },
      {
        id: 'delivery',
        title: 'Consegna',
        caption: 'strato 3',
        skills: [
          { name: 'Git · conventional commit', level: 3 },
          { name: 'Monorepo npm workspaces', level: 2 },
          { name: 'Quality gate · SonarCloud', level: 2 },
        ],
        foot: 'Tutte e tre su Basil, e verificabili nel repository',
      },
    ],
  },
  work: {
    mark: 'progetti',
    title: 'Due prodotti aziendali, uno strumento nuovo, un progetto pubblico',
    lede: 'Niente screenshot: ogni progetto è disegnato come lo schema che lo descrive. Dei prodotti aziendali il codice è privato e i dettagli restano generici; di Basil, invece, è pubblico tutto.',
    projects: [
      {
        slug: 'coolpim',
        schema: 'pipeline',
        // Ordine nell'SVG dall'alto verso il basso, sinistra verso destra:
        // i quattro nodi della fila, poi la didascalia sotto la riga di
        // separazione. I quattro verbi sono quelli della definizione di PIM,
        // non una descrizione dell'implementazione, che è privata.
        schemaLabels: [
          'RACCOGLIE',
          'ORGANIZZA',
          'GESTISCE',
          'CANALI',
          'le informazioni di prodotto in un posto solo, poi verso i canali',
        ],
        schemaDescription:
          'Il flusso di un PIM: dalla raccolta delle informazioni di prodotto ai canali di vendita',
        featured: true,
        kicker: 'In evidenza',
        period: '2024 — oggi',
        title: 'Coolpim',
        summary:
          'Il PIM dell’azienda: raccoglie e organizza le informazioni sui prodotti e le distribuisce a e-commerce, cataloghi e canali di vendita. Ci lavoro dal 2024, soprattutto sul frontend.',
        tags: ['React', 'TypeScript', 'C#', '.NET'],
        metrics: [],
        links: [
          { kind: 'caseStudy', label: 'Leggi il case study →' },
          { kind: 'private', label: 'Codice privato' },
        ],
        caseStudy: {
          intro:
            'Coolpim è un PIM — Product Information Management — ed è un prodotto proprietario dell’azienda per cui lavoro. Ci sviluppo dal 2024: molti componenti sul frontend in React e TypeScript, e lavoro sul backend in C# e .NET.',
          sections: [
            {
              heading: 'Che cos’è un PIM',
              body: [
                'Un PIM è il sistema aziendale che raccoglie, organizza e gestisce le informazioni sui prodotti, per poi distribuirle ai canali che le usano: e-commerce, cataloghi, canali di vendita.',
              ],
            },
            {
              heading: 'Cosa ci faccio',
              body: [
                'Lavoro soprattutto sul frontend, in React e TypeScript, dove ho implementato molti componenti del prodotto. Sul backend, in C# e .NET, contribuisco alla parte che quei componenti consumano.',
                'Il codice è privato e i clienti non sono nominabili: quello che si può raccontare finisce qui.',
              ],
            },
          ],
        },
      },
      {
        slug: 'coolsales',
        schema: 'configurator',
        // Ordine nell'SVG dall'alto verso il basso, sinistra verso destra —
        // **non** l'ordine del markup sorgente: il nodo in alto (y=12) è
        // scritto dopo quello di sinistra (y=20), e l'etichetta del vincolo
        // (y=80) precede nel disegno la didascalia in fondo (y=122):
        //   0: nodo in alto, le opzioni
        //   1: nodo di sinistra, il prodotto (in evidenza)
        //   2: nodo di destra, il preventivo
        //   3: etichetta del vincolo tratteggiato
        //   4: didascalia in fondo, l'acronimo CPQ per esteso
        schemaLabels: ['OPZIONI', 'PRODOTTO', 'PREVENTIVO', 'vincolo', 'CONFIGURE · PRICE · QUOTE'],
        schemaDescription: 'Un CPQ: grafo di opzioni con vincoli, dal prodotto al preventivo',
        featured: false,
        kicker: 'CPQ',
        period: '2024 — oggi',
        title: 'Coolsales',
        summary:
          'Il CPQ dell’azienda — configura, prezza, preventiva — integrato principalmente con il PIM e con Salesforce. Usato per clienti industriali.',
        tags: ['React', 'TypeScript', 'C#', '.NET', 'Salesforce'],
        metrics: [],
        links: [
          { kind: 'caseStudy', label: 'Case study →' },
          { kind: 'private', label: 'Codice privato' },
        ],
        caseStudy: {
          intro:
            'Coolsales è un CPQ: uno strumento per configurare un prodotto, calcolarne il prezzo e produrre un preventivo. Si integra principalmente con il PIM aziendale e con Salesforce, ed è usato per clienti industriali.',
          sections: [
            {
              heading: 'Cosa ci faccio',
              body: [
                'Come sul PIM: frontend in React e TypeScript, molti componenti, e lavoro backend in C# e .NET. È l’altro dei due prodotti su cui sviluppo dal 2024.',
              ],
            },
            {
              heading: 'Perché resta generico',
              body: [
                'Il codice è privato e i clienti non sono nominabili. Le architetture interne restano fuori: di un CPQ si può dire cosa fa, non com’è fatto dentro.',
              ],
            },
          ],
        },
      },
      {
        slug: 'mcp-server',
        schema: 'mcp',
        // Ordine nell'SVG per colonne, non riga per riga: le tre
        // intestazioni (che stanno tutte sulla stessa riga in alto), poi le
        // tre righe della colonna di sinistra, poi le tre della colonna di
        // destra, infine la nota in fondo. Vedi il commento in cima a
        // src/schemas/McpSchema.tsx, che consuma questi indici.
        schemaLabels: [
          'CHI LO USA',
          'SERVER MCP',
          'OGGETTI',
          'sviluppatori',
          'amministratori',
          'clienti',
          'prodotti',
          'schemi di oggetto',
          'catalogo',
          'lo stesso server per chi sviluppa, chi amministra e i clienti',
        ],
        schemaDescription:
          'Tre colonne: chi usa il server MCP, il server, gli oggetti del catalogo',
        featured: false,
        kicker: 'MCP',
        period: '2026',
        title: 'Server MCP per il PIM',
        summary:
          'Da quattro mesi sviluppo un server MCP per il PIM: espone strumenti per creare e modificare prodotti, schemi di oggetto e quanto serve a costruire un catalogo.',
        tags: ['MCP', 'PIM'],
        metrics: [],
        links: [
          { kind: 'caseStudy', label: 'Case study →' },
          { kind: 'private', label: 'Codice privato' },
        ],
        caseStudy: {
          intro:
            'Da quattro mesi lavoro allo sviluppo di un server MCP per il PIM aziendale. Espone come strumenti la creazione e la modifica di prodotti, di schemi di oggetto e di quanto serve alla costruzione di un catalogo.',
          sections: [
            {
              heading: 'A chi serve',
              body: [
                'Gli stessi strumenti servono a tre tipi di utente: chi sviluppa sul PIM, chi lo amministra e i clienti che ci costruiscono il catalogo.',
              ],
            },
            {
              heading: 'A che punto è',
              body: [
                'È lavoro in corso, iniziato quattro mesi fa. Il codice è privato: non c’è altro da mostrare che la forma del percorso qui sopra.',
              ],
            },
          ],
        },
      },
      {
        slug: 'basil',
        schema: 'monorepo',
        // Ordine nell'SVG dall'alto verso il basso, sinistra verso destra:
        //   0: intestazione del riquadro del monorepo
        //   1: pacchetto di sinistra, in evidenza (il mio lato)
        //   2: pacchetto di destra
        //   3: didascalia della barra del contributo
        //   4: il valore, a sinistra sotto la barra
        //   5: la posizione fra i contributori, a destra sotto la barra
        // I due numeri sono quelli di github.com/cirulla/basil.
        schemaLabels: [
          'MONOREPO · NPM WORKSPACES',
          'frontend',
          'backend',
          'IL MIO CONTRIBUTO',
          '131 commit su 779',
          'secondo contributore su sette',
        ],
        schemaDescription:
          'Monorepo con frontend e backend separati, e la quota dei miei commit sul totale',
        featured: false,
        kicker: 'Open source',
        period: '2021',
        title: 'Basil',
        summary:
          'Web app per gruppi di acquisto solidale, progetto del corso di Software Engineering II al Politecnico di Torino. Team di sette persone, repository pubblico: sono il secondo contributore con 131 commit su 779.',
        tags: ['React', 'TypeScript', 'MUI', 'NestJS', 'npm workspaces'],
        metrics: [
          { value: '131', label: 'commit miei' },
          { value: '779', label: 'commit in tutto' },
          { value: '7', label: 'persone nel team' },
        ],
        links: [
          { kind: 'caseStudy', label: 'Case study →' },
          { kind: 'repo', label: 'GitHub →', href: 'https://github.com/cirulla/basil' },
        ],
        caseStudy: {
          intro:
            'Basil è una web app per gruppi di acquisto solidale, sviluppata nel 2021 per il corso di Software Engineering II al Politecnico di Torino da un team di sette persone. Il repository è pubblico: è l’unico progetto di cui tutto quello che segue si verifica in un minuto.',
          sections: [
            {
              heading: 'Il mio contributo',
              body: [
                'Sono il secondo contributore del repository, con 131 commit sui 779 totali, e ho lavorato principalmente sul frontend: React, TypeScript e MUI.',
              ],
            },
            {
              heading: 'Com’era tenuto insieme',
              body: [
                'Un monorepo npm workspaces con frontend e backend separati — React da una parte, NestJS dall’altra — un quality gate SonarCloud, i conventional commit imposti da un git hook e licenza MIT.',
              ],
            },
          ],
        },
      },
    ],
  },
  path: {
    mark: 'percorso',
    title: 'Studi, progetti, azienda',
    entries: [
      {
        period: '2024 — oggi',
        current: true,
        role: 'Junior developer',
        org: 'Coolshop',
        body: 'Sviluppo su due prodotti dell’azienda, un PIM e un CPQ: frontend in React e TypeScript, backend in C# e .NET. Da quattro mesi, un server MCP per il PIM.',
        tags: ['React', 'TypeScript', 'C#', '.NET'],
      },
      {
        period: '2022 — oggi',
        current: false,
        role: 'Sviluppatore, da autonomo',
        org: 'Trader Without Money',
        body: 'Applicazione per attività di trading. Sviluppo principalmente frontend, con contributi backend. Progetto in sviluppo e temporaneamente sospeso.',
        tags: ['React', 'TypeScript', 'Stitches', 'Radix UI', 'NestJS', 'Stripe'],
      },
      {
        period: '2021',
        current: false,
        role: 'Sviluppatore frontend, da autonomo',
        org: 'LVerify',
        body: 'Applicazione web per la gestione documentale di ristrutturazioni di abitazioni ed edifici. Ho sviluppato il frontend.',
        tags: ['React', 'TypeScript', 'MUI', 'Figma', 'Directus'],
      },
      {
        period: '2016 — 2020',
        current: false,
        role: 'Laurea in Ingegneria Informatica',
        org: 'Politecnico di Torino',
        body: 'Dal 2020 la magistrale in Cybersecurity, nello stesso ateneo: interrotta, non conclusa.',
        tags: ['Ingegneria informatica', 'Cybersecurity'],
      },
    ],
  },
  contact: {
    mark: 'contatti',
    title: 'Se ti va, {scrivimi}.',
    note: 'Non sto cercando lavoro. Se vuoi parlare di PIM, di frontend o di qualcosa che hai letto qui, la casella è aperta.',
    links: [
      {
        label: 'Email',
        value: 'francescorabezzano@gmail.com',
        href: 'mailto:francescorabezzano@gmail.com',
        arrow: '→',
      },
      { label: 'GitHub', value: 'github.com/rab97', href: 'https://github.com/rab97', arrow: '→' },
      {
        label: 'LinkedIn',
        value: 'in/francesco-rabezzano',
        href: 'https://linkedin.com/in/francesco-rabezzano/',
        arrow: '→',
      },
    ],
  },
  footer: {
    left: '© 2026 · costruito con React, Vite e troppa attenzione ai dettagli',
    right: 'ospitato su GitHub Pages',
  },
  notFound: {
    title: '404 — pagina non trovata',
    body: 'La rotta che cerchi non esiste, o è stata spostata. Succede anche ai sistemi migliori.',
    cta: 'Torna alla home',
  },
  caseStudy: {
    back: '← Torna ai progetti',
    overview: 'Panoramica progetto',
  },
} satisfies Portfolio

export default itContent
