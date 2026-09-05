import type { Portfolio } from './schema'

export const itContent = {
  meta: {
    title: 'Francesco Rabezzano — Fullstack Engineer',
    description:
      'Sviluppatore frontend e backend. Design system, API di catalogo e piattaforme e-commerce.',
    portraitAlt: 'Ritratto fotografico',
    languageName: 'Italiano',
    ogLocale: 'it_IT',
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
  about: {
    mark: 'chi sono',
    title: 'Sto bene in mezzo allo stack',
    paragraphs: [
      "Ho iniziato dal frontend e ci sono rimasto abbastanza da imparare che **la maggior parte dei problemi di interfaccia nasce a monte**: in un modello dati sbagliato, in un'API che restituisce troppo, in un contratto mai scritto. Così sono sceso dall'altra parte.",
      'Oggi il lavoro che mi riesce meglio è quello di confine: definire il contratto fra chi produce i dati e chi li mostra, e poi costruire entrambi i lati. **Design system** e **API** sono lo stesso mestiere visto da due angoli — decidere cosa è pubblico, cosa è stabile, e cosa può cambiare senza rompere nessuno.',
      "Lavoro nell'e-commerce B2B e B2C: cataloghi grandi, molte varianti, molte lingue, molti brand. Un contesto dove le scorciatoie si pagano dopo sei mesi.",
    ],
    facts: [
      { label: 'Base', value: 'Italia · remoto' },
      { label: 'Ruolo', value: 'Fullstack Engineer' },
      { label: 'Lato forte', value: 'Frontend architetturale' },
      { label: 'Lingue', value: 'Italiano, Inglese' },
      { label: 'Stato', value: 'Aperto a proposte', accent: true },
    ],
  },
  skills: {
    mark: 'competenze',
    title: 'Per strato, non per percentuale',
    lede: 'Le barre "React 90%" non dicono niente. Qui le tecnologie sono ordinate per strato del sistema, e i pallini indicano da quanto ci lavoro in produzione, non quanto mi piacciono.',
    layers: [
      {
        id: 'interface',
        title: 'Interfaccia',
        caption: 'strato 1',
        skills: [
          { name: 'React · TypeScript', level: 5 },
          { name: 'Design system', level: 5 },
          { name: 'CSS architetturale', level: 4 },
          { name: 'Accessibilità', level: 4 },
          { name: 'Animazione web', level: 3 },
        ],
        foot: '138 componenti pubblicati su npm privato',
      },
      {
        id: 'services',
        title: 'Servizi & dati',
        caption: 'strato 2',
        skills: [
          { name: '.NET · C#', level: 4 },
          { name: 'Node · Fastify', level: 4 },
          { name: 'PostgreSQL · SQL Server', level: 4 },
          { name: 'REST · GraphQL', level: 5 },
          { name: 'Code di messaggi', level: 3 },
        ],
        foot: 'Pipeline da 214k SKU, sincronizzazione in 3 m',
      },
      {
        id: 'delivery',
        title: 'Consegna',
        caption: 'strato 3',
        skills: [
          { name: 'Docker', level: 4 },
          { name: 'CI/CD · GitLab, Actions', level: 4 },
          { name: 'Azure', level: 3 },
          { name: 'Test end-to-end', level: 4 },
          { name: 'Osservabilità', level: 3 },
        ],
        foot: 'Zero regressioni visive su 4 release al mese',
      },
    ],
  },
  work: {
    mark: 'progetti selezionati',
    title: 'Quattro cose che sono andate in produzione',
    lede: "Niente screenshot: ogni progetto è disegnato come lo schema che lo descrive. È l'unico modo perché anche il lavoro invisibile — una pipeline, un contratto API — abbia una faccia.",
    projects: [
      {
        slug: 'design-system',
        schema: 'design-system',
        // Ordine nell'SVG dall'alto verso il basso, sinistra verso destra:
        // intestazioni delle tre colonne (PRIMITIVI, SEMANTICI, COMPONENTI),
        // poi la didascalia dei temi, poi la nota finale sul pacchetto unico.
        schemaLabels: [
          'PRIMITIVI',
          'SEMANTICI',
          'COMPONENTI',
          '7 TEMI GENERATI A BUILD TIME',
          'un solo pacchetto · nessun fork per cliente',
        ],
        schemaDescription:
          'Token primitivi verso token semantici verso componenti, su sette temi',
        featured: true,
        kicker: 'In evidenza',
        period: '2023 — oggi',
        title: 'Design system multi-brand',
        summary:
          'Una sola libreria di componenti per sette brand con identità diverse. Token semantici in tre livelli, temi generati a build time, nessun fork per cliente.',
        tags: ['React', 'TypeScript', 'Style Dictionary', 'Storybook', 'Chromatic'],
        metrics: [
          { value: '138', label: 'componenti' },
          { value: '7', label: 'brand' },
          { value: '0', label: 'fork' },
        ],
        links: [
          { kind: 'caseStudy', label: 'Leggi il case study →' },
          { kind: 'private', label: 'Codice privato' },
        ],
        caseStudy: {
          intro:
            "Sette brand, un'unica libreria di componenti: la sfida era rendere ogni identità riconoscibile senza duplicare una sola riga di codice. Il risultato sono 138 componenti pubblicati su npm privato e zero fork per cliente.",
          sections: [
            {
              heading: 'Il problema',
              body: [
                'Ogni brand aveva il proprio frontend, costruito da un team diverso in momenti diversi. Gli stessi componenti — bottoni, form, card — esistevano in sette varianti leggermente incompatibili, e ogni modifica al design richiedeva sette pull request separate.',
                "Il team di prodotto voleva poter lanciare un ottavo brand in poche settimane, non in mesi. Con l'architettura esistente, ogni nuovo brand significava un nuovo fork da mantenere per sempre.",
              ],
            },
            {
              heading: "Come l'ho risolto",
              body: [
                'Ho definito tre livelli di token — primitivi, semantici, di componente — con Style Dictionary, così che ogni brand potesse ridefinire solo il livello semantico senza toccare i componenti. I temi vengono generati a build time, non a runtime.',
                'Ho costruito la libreria di componenti in React e TypeScript con Storybook come ambiente di sviluppo isolato, e Chromatic per il visual regression testing su tutti e sette i temi ad ogni pull request.',
              ],
            },
            {
              heading: 'Cosa ne è uscito',
              body: [
                'Oggi la libreria conta 138 componenti pubblicati su un registro npm privato, consumati da sette brand senza un solo fork. Aggiungere un ottavo brand è una questione di token, non di codice.',
                'Il tempo di lancio di un nuovo brand è sceso da mesi a circa tre settimane, e i bug di inconsistenza visiva fra brand sono praticamente scomparsi.',
              ],
            },
          ],
        },
      },
      {
        slug: 'pipeline',
        schema: 'pipeline',
        // Ordine nell'SVG dall'alto verso il basso, sinistra verso destra:
        // l'annotazione degli scarti sopra il nodo di normalizzazione,
        // la riga dei quattro nodi della pipeline, poi l'etichetta del sync completo.
        // Indici 6-7 aggiunti in coda (fix round 1): i conteggi sotto la riga
        // dei nodi, cablati prima con il separatore delle migliaia sbagliato
        // in inglese. Aggiunti in fondo apposta per non spostare gli indici
        // 0-5, già verificati in review.
        schemaLabels: [
          '−520 scarti',
          'FEED CSV',
          'NORMALIZZA',
          'ARRICCHISCI',
          'INDICIZZA',
          'SYNC COMPLETO',
          '214.000',
          '213.480',
        ],
        schemaDescription: "Pipeline di ingestione: dai feed dei fornitori all'indice di ricerca",
        featured: false,
        kicker: 'PIM',
        period: '2021 — 2023',
        title: 'Pipeline catalogo, 214k SKU',
        summary:
          'Ingestione da 40 fornitori con formati diversi, normalizzazione, arricchimento e indicizzazione. Da sei ore a tre minuti.',
        tags: ['.NET', 'RabbitMQ', 'PostgreSQL', 'Elasticsearch'],
        metrics: [
          { value: '40', label: 'fornitori' },
          { value: '214k', label: 'SKU processati' },
          { value: '3 m 08 s', label: 'sync completo' },
        ],
        links: [{ kind: 'caseStudy', label: 'Case study →' }],
        caseStudy: {
          intro:
            'Quaranta fornitori, quaranta formati diversi, un solo catalogo da tenere aggiornato. La sincronizzazione completa è passata da sei ore a tre minuti.',
          sections: [
            {
              heading: 'Il problema',
              body: [
                "Il catalogo veniva aggiornato una volta al giorno con uno script monolitico che leggeva quaranta feed CSV in formati tutti diversi, uno alla volta, in sequenza. Un fornitore con un file malformato bloccava l'intera pipeline.",
                "Non c'era modo di sapere quali prodotti fossero stati scartati o perché, finché qualcuno non se ne accorgeva a catalogo pubblicato, con articoli mancanti o prezzi vecchi in vetrina.",
              ],
            },
            {
              heading: "Come l'ho risolto",
              body: [
                'Ho riscritto la pipeline come una serie di fasi indipendenti su code di messaggi RabbitMQ: normalizzazione, arricchimento, indicizzazione. Ogni fase processa i prodotti in parallelo e pubblica gli scarti su una coda dedicata invece di bloccarsi.',
                'PostgreSQL tiene lo stato canonico dei prodotti, Elasticsearch l\'indice di ricerca. Un fornitore rotto ora scarta solo le sue righe malformate — circa 520 su 214.000 — senza fermare gli altri 39.',
              ],
            },
            {
              heading: 'Cosa ne è uscito',
              body: [
                'La sincronizzazione completa dei 214k SKU è passata da sei ore a tre minuti e otto secondi, con scarti tracciati riga per riga invece che scoperti a posteriori.',
                'Il catalogo può ora aggiornarsi più volte al giorno invece che una, e aggiungere un nuovo fornitore è questione di una mappatura di normalizzazione, non di una nuova pipeline.',
              ],
            },
          ],
        },
      },
      {
        slug: 'configurator',
        schema: 'configurator',
        // Ordine nell'SVG dall'alto verso il basso, sinistra verso destra:
        // etichetta del nodo motore (più in alto), poi telaio e controllo sulla
        // stessa riga, poi l'etichetta del vincolo incompatibile, poi il totale
        // delle configurazioni valide in basso.
        schemaLabels: [
          'MOTORE',
          'TELAIO',
          'CONTROLLO',
          'incompatibile',
          '4.812 CONFIGURAZIONI VALIDE',
        ],
        schemaDescription:
          'Configuratore di prodotto: grafo di opzioni con vincoli di incompatibilità',
        featured: false,
        kicker: 'Industriale',
        period: '2020 — 2021',
        title: 'Configuratore a vincoli',
        summary:
          'Motore di regole che scarta in tempo reale le combinazioni impossibili fra 6 famiglie di opzioni, con preventivo immediato.',
        tags: ['React', 'Node', 'Rules engine'],
        metrics: [
          { value: '6', label: 'famiglie di opzioni' },
          { value: '4.812', label: 'configurazioni valide' },
          { value: '<50 ms', label: 'tempo di validazione' },
        ],
        links: [
          { kind: 'caseStudy', label: 'Case study →' },
          { kind: 'live', label: 'Demo live →', href: 'https://configurator.demo.example.dev' },
        ],
        caseStudy: {
          intro:
            'Un motore di regole scarta in tempo reale le combinazioni impossibili fra sei famiglie di opzioni, invece di farle scoprire a ordine già piazzato. Il risultato sono 4.812 configurazioni valide riconosciute dal grafo dei vincoli, con un preventivo immediato invece che a fine configurazione.',
          sections: [
            {
              heading: 'Il problema',
              body: [
                'Il configuratore esistente lasciava scegliere qualsiasi combinazione di telaio, motore e controllo, e solo al momento dell\'ordine un operatore scopriva che la combinazione era incompatibile o non producibile.',
                'Il preventivo arrivava via email il giorno dopo, spesso per scoprire che andava rifatto perché una delle opzioni scelte non era disponibile insieme alle altre.',
              ],
            },
            {
              heading: "Come l'ho risolto",
              body: [
                'Ho modellato le sei famiglie di opzioni e i loro vincoli di incompatibilità come un grafo, con un motore di regole in Node che valuta ogni scelta in tempo reale e disabilita le opzioni che diventerebbero incompatibili.',
                'Il preventivo si aggiorna a ogni click, calcolato lato client sulle stesse regole validate lato server, cosicché un cliente non possa mai arrivare a un ordine non producibile.',
              ],
            },
            {
              heading: 'Cosa ne è uscito',
              body: [
                'Il grafo dei vincoli riconosce 4.812 configurazioni valide fra le famiglie di opzioni, e ogni combinazione scartata lo è in tempo reale, prima che il cliente completi la scelta.',
                'Gli ordini con configurazione non producibile sono scesi a zero, e il tempo fra configurazione e preventivo è passato da un giorno a meno di un secondo.',
              ],
            },
          ],
        },
      },
      {
        slug: 'headless',
        schema: 'headless',
        // Ordine nell'SVG dall'alto verso il basso, sinistra verso destra:
        // etichetta del monolite, poi etichetta dello switch headless, entrambe
        // sulla stessa riga in alto al grafico.
        schemaLabels: ['monolite', 'switch headless'],
        schemaDescription: 'Latenza p95 prima e dopo la migrazione headless',
        featured: false,
        kicker: 'Storefront',
        period: '2019 — 2020',
        title: 'Migrazione headless',
        summary:
          'Uscita da un monolite senza fermare le vendite: rollout per rotta, doppio traffico, rollback in un minuto.',
        tags: ['Next.js', 'GraphQL', 'CDN edge'],
        metrics: [
          { value: '−78%', label: 'p95 TTFB' },
          { value: '1 min', label: 'rollback' },
          { value: '0', label: 'downtime durante il rollout' },
        ],
        links: [
          { kind: 'caseStudy', label: 'Case study →' },
          { kind: 'repo', label: 'GitHub →', href: 'https://github.com/utente/headless-storefront' },
        ],
        caseStudy: {
          intro:
            'Un monolite che serviva insieme catalogo e checkout viene lasciato una rotta alla volta, con traffico specchiato e un interruttore di rollback pronto in un minuto. Il risultato è un p95 time-to-first-byte sceso del 78%, senza un solo minuto di downtime misurabile durante tutta la migrazione.',
          sections: [
            {
              heading: 'Il problema',
              body: [
                'Lo storefront viveva in un monolite server-rendered che serviva sia il catalogo che il checkout dalla stessa applicazione. Ogni deploy era un tutto-o-niente su tutto il traffico, con un p95 time-to-first-byte vicino ai 900 ms.',
                'Non era possibile migrare a un\'architettura headless senza rischiare ore di downtime durante il periodo di picco vendite, cosa che il business non poteva accettare.',
              ],
            },
            {
              heading: "Come l'ho risolto",
              body: [
                'Ho migrato una rotta alla volta verso un frontend Next.js su CDN edge, con GraphQL come contratto verso il backend esistente, mantenendo il monolite attivo in parallelo come fallback.',
                'Il traffico veniva specchiato sulla nuova rotta prima di essere instradato davvero, per validare i tempi di risposta sotto carico reale, con un interruttore per tornare al monolite in meno di un minuto.',
              ],
            },
            {
              heading: 'Cosa ne è uscito',
              body: [
                "Il p95 time-to-first-byte è sceso del 78%, e l'intera migrazione è avvenuta senza un solo minuto di downtime misurabile sulle vendite.",
                'Il rollback, quando serviva durante il rollout, richiedeva meno di un minuto invece di un deploy di emergenza, il che ha reso l\'intera migrazione a basso rischio.',
              ],
            },
          ],
        },
      },
    ],
  },
  path: {
    mark: 'percorso',
    title: 'Undici anni, tre contesti',
    entries: [
      {
        period: '2021 — oggi',
        current: true,
        role: 'Fullstack Engineer',
        org: 'E-commerce B2B/B2C',
        body: 'Responsabile del design system e delle API di catalogo. Ho portato sette brand su una sola libreria di componenti e riscritto la pipeline di ingestione prodotti.',
        tags: ['React', '.NET', 'PostgreSQL', 'Azure'],
      },
      {
        period: '2018 — 2021',
        current: false,
        role: 'Frontend Developer',
        org: 'Software house',
        body: 'Applicazioni su misura per manifattura e retail: configuratori di prodotto, portali fornitori, dashboard operative. Primo contatto serio con il backend, per necessità.',
        tags: ['Angular', 'React', 'Node'],
      },
      {
        period: '2015 — 2018',
        current: false,
        role: 'Web Developer',
        org: 'Agenzia',
        body: 'Siti e landing per clienti di ogni dimensione. Dove ho imparato a consegnare, a misurare le performance e a discutere con chi il codice non lo legge.',
        tags: ['JavaScript', 'PHP', 'SCSS'],
      },
    ],
  },
  contact: {
    mark: 'contatti',
    title: 'Se hai un sistema complicato, {parliamone}.',
    note: 'Rispondo entro un paio di giorni. Se scrivi con un contesto concreto — cosa state costruendo, cosa vi blocca — rispondo prima.',
    links: [
      { label: 'Email', value: 'ciao@esempio.dev', href: 'mailto:ciao@esempio.dev', arrow: '→' },
      { label: 'GitHub', value: 'github.com/utente', href: 'https://github.com/utente', arrow: '→' },
      { label: 'LinkedIn', value: 'in/utente', href: 'https://linkedin.com/in/utente', arrow: '→' },
      { label: 'CV', value: 'curriculum.pdf · 180 KB', href: '/curriculum.pdf', arrow: '↓' },
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
