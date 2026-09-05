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

export const enContent = {
  meta: {
    title: 'Francesco Rabezzano — Fullstack Engineer',
    description:
      'Developer based in Turin: React and TypeScript on the frontend, C# and .NET on the backend. I work on a PIM and a CPQ.',
    portraitAlt: 'Portrait placeholder: the initials FR on a grid',
    ogImageAlt:
      'Preview card on a dark background: the name Francesco Rabezzano, the role Fullstack Engineer and a row of connected nodes.',
    languageName: 'English',
    ogLocale: 'en_GB',
  },
  nav: { about: 'about', skills: 'skills', work: 'work', path: 'path', contact: 'contact' },
  location: 'Turin, Italy',
  themeLabels: { group: 'Theme', auto: 'AUTO', light: 'Light theme', dark: 'Dark theme' },
  langLabel: 'Language',
  hero: {
    prompt: 'whoami --verbose',
    headline: 'Product data, and the {interfaces} to work on it.',
    sub: '**Frontend** developer doing real **backend** work: React and TypeScript on one side, C# and .NET on the other. Two years in-house on a PIM and a CPQ; before that, freelance projects.',
    ctaPrimary: 'See the work',
    diagramTitle: 'The flow I work on',
    diagramBadge: 'simplified',
    nodes: ['Product data', 'PIM', 'Catalogue', 'Channels'],
    // Three, not four: the year he joined the company, the number of
    // products he builds on and his commits on Basil are the only true,
    // checkable numbers there are. The mockup's fourth tile stays empty.
    metrics: [
      { value: '2024', label: 'in-house since' },
      { value: '2', label: 'products: PIM and CPQ' },
      { value: '131', label: 'commits on Basil' },
    ],
  },
  about: {
    mark: 'about',
    title: 'Frontend by default, backend by necessity',
    paragraphs: [
      'I started in the frontend and stayed there: **React and TypeScript** are where I work best. The backend came later, working on the same products from the other side — **C# and .NET** — because that is where the data the interface shows gets decided.',
      'For two years I have been building on two of my company’s products: a **PIM**, which collects and organises product information and distributes it to the sales channels, and a **CPQ**, which uses it to configure, price and quote. For the last four months I have been working on an **MCP server** for the PIM.',
      'I studied Computer Engineering at the Politecnico di Torino, then started a master’s in Cybersecurity that I did not finish. The rest I learned on the job.',
    ],
    facts: [
      { label: 'Based', value: 'Turin, Italy' },
      { label: 'Role', value: 'Junior developer' },
      { label: 'Strongest', value: 'Frontend' },
      { label: 'Languages', value: 'Italian, English B2, Spanish A1' },
      { label: 'Now', value: 'An MCP server for the PIM', accent: true },
    ],
  },
  skills: {
    mark: 'skills',
    title: 'By layer, not by percentage',
    lede: '"React 90%" bars say nothing. Here technologies are ordered by layer of the system, and the dots say how much I have actually worked with them: two years in-house and a few freelance projects. No five out of five.',
    layers: [
      {
        id: 'interface',
        title: 'Interface',
        caption: 'layer 1',
        skills: [
          { name: 'React · TypeScript', level: 4 },
          { name: 'Radix UI · MUI', level: 3 },
          { name: 'CSS · Stitches', level: 3 },
          { name: 'Figma', level: 2 },
        ],
        foot: 'Many components across two company products',
      },
      {
        id: 'services',
        title: 'Services & data',
        caption: 'layer 2',
        skills: [
          { name: 'C# · .NET', level: 3 },
          { name: 'Node · NestJS', level: 2 },
          { name: 'MCP servers', level: 2 },
          { name: 'Stripe', level: 2 },
          { name: 'Directus', level: 2 },
        ],
        foot: 'The backend of the two company products, in C# and .NET',
      },
      {
        id: 'delivery',
        title: 'Delivery',
        caption: 'layer 3',
        skills: [
          { name: 'Git · conventional commits', level: 3 },
          { name: 'npm workspaces monorepos', level: 2 },
          { name: 'Quality gates · SonarCloud', level: 2 },
        ],
        foot: 'All three on Basil, and checkable in the repository',
      },
    ],
  },
  work: {
    mark: 'work',
    title: 'Two company products, a new tool, one public project',
    lede: 'No screenshots: every project is drawn as the diagram that describes it. The company products have private code and stay deliberately generic; Basil, on the other hand, is public in full.',
    projects: [
      {
        slug: 'coolpim',
        schema: 'pipeline',
        // Order in the SVG top to bottom, left to right: the four nodes of
        // the row, then the caption below the dividing rule. The four verbs
        // are the ones in the definition of a PIM, not a description of the
        // implementation, which is private.
        schemaLabels: [
          'COLLECT',
          'ORGANISE',
          'MANAGE',
          'CHANNELS',
          'product information in one place, then out to the channels',
        ],
        schemaDescription: 'A PIM flow: from collecting product information to the sales channels',
        featured: true,
        kicker: 'Featured',
        period: '2024 — today',
        title: 'Coolpim',
        summary:
          'My company’s PIM: it collects and organises product information and distributes it to e-commerce sites, catalogues and sales channels. I have worked on it since 2024, mostly on the frontend.',
        tags: ['React', 'TypeScript', 'C#', '.NET'],
        metrics: [],
        links: [
          { kind: 'caseStudy', label: 'Read the case study →' },
          { kind: 'private', label: 'Private code' },
        ],
        caseStudy: {
          intro:
            'Coolpim is a PIM — Product Information Management — and a proprietary product of the company I work for. I have been developing on it since 2024: many components on the frontend in React and TypeScript, plus work on the backend in C# and .NET.',
          sections: [
            {
              heading: 'What a PIM is',
              body: [
                'A PIM is the internal system that collects, organises and manages product information, and then distributes it to the channels that use it: e-commerce sites, catalogues, sales channels.',
              ],
            },
            {
              heading: 'What I do on it',
              body: [
                'I work mostly on the frontend, in React and TypeScript, where I have implemented many of the product’s components. On the backend, in C# and .NET, I contribute to the part those components consume.',
                'The code is private and the clients cannot be named: what can be told ends here.',
              ],
            },
          ],
        },
      },
      {
        slug: 'coolsales',
        schema: 'configurator',
        // Order in the SVG top to bottom, left to right — **not** the order
        // of the source markup: the top node (y=12) is written after the
        // left one (y=20), and the constraint label (y=80) sits above the
        // closing caption (y=122) while being written after it:
        //   0: top node, the options
        //   1: left node, the product (highlighted)
        //   2: right node, the quote
        //   3: label on the dashed constraint
        //   4: closing caption, the CPQ acronym spelled out
        schemaLabels: ['OPTIONS', 'PRODUCT', 'QUOTE', 'constraint', 'CONFIGURE · PRICE · QUOTE'],
        schemaDescription: 'A CPQ: an option graph with constraints, from product to quote',
        featured: false,
        kicker: 'CPQ',
        period: '2024 — today',
        title: 'Coolsales',
        summary:
          'My company’s CPQ — configure, price, quote — integrated mainly with the PIM and with Salesforce. Used for industrial clients.',
        tags: ['React', 'TypeScript', 'C#', '.NET', 'Salesforce'],
        metrics: [],
        links: [
          { kind: 'caseStudy', label: 'Case study →' },
          { kind: 'private', label: 'Private code' },
        ],
        caseStudy: {
          intro:
            'Coolsales is a CPQ: a tool to configure a product, price it and produce a quote. It integrates mainly with the company PIM and with Salesforce, and is used for industrial clients.',
          sections: [
            {
              heading: 'What I do on it',
              body: [
                'The same as on the PIM: frontend in React and TypeScript, many components, and backend work in C# and .NET. It is the other of the two products I have been developing on since 2024.',
              ],
            },
            {
              heading: 'Why this stays generic',
              body: [
                'The code is private and the clients cannot be named. Internal architecture stays out of it: what can be said about a CPQ is what it does, not how it is built inside.',
              ],
            },
          ],
        },
      },
      {
        slug: 'mcp-server',
        schema: 'mcp',
        // Order in the SVG by column, not row by row: the three headers
        // (which all sit on the same top row), then the three rows of the
        // left column, then the three of the right column, then the closing
        // note. See the comment at the top of src/schemas/McpSchema.tsx,
        // which consumes these indices.
        schemaLabels: [
          'WHO USES IT',
          'MCP SERVER',
          'OBJECTS',
          'developers',
          'administrators',
          'customers',
          'products',
          'object schemas',
          'catalogue',
          'the same server for developers, administrators and customers',
        ],
        schemaDescription:
          'Three columns: who uses the MCP server, the server, the catalogue objects',
        featured: false,
        kicker: 'MCP',
        period: '2026',
        title: 'MCP server for the PIM',
        summary:
          'For four months I have been building an MCP server for the PIM: it exposes tools to create and edit products, object schemas and what it takes to build a catalogue.',
        tags: ['MCP', 'PIM'],
        metrics: [],
        links: [
          { kind: 'caseStudy', label: 'Case study →' },
          { kind: 'private', label: 'Private code' },
        ],
        caseStudy: {
          intro:
            'For the last four months I have been working on an MCP server for the company PIM. It exposes, as tools, the creation and editing of products, of object schemas and of what it takes to build a catalogue.',
          sections: [
            {
              heading: 'Who it is for',
              body: [
                'The same tools serve three kinds of user: whoever develops on the PIM, whoever administers it, and the customers who build their catalogue with it.',
              ],
            },
            {
              heading: 'Where it stands',
              body: [
                'It is work in progress, started four months ago. The code is private: there is nothing to show beyond the shape of the path above.',
              ],
            },
          ],
        },
      },
      {
        slug: 'basil',
        schema: 'monorepo',
        // Order in the SVG top to bottom, left to right:
        //   0: header of the monorepo box
        //   1: left package, highlighted (my side)
        //   2: right package
        //   3: caption of the contribution bar
        //   4: the value, left, under the bar
        //   5: the rank among contributors, right, under the bar
        // Both numbers are the ones on github.com/cirulla/basil.
        schemaLabels: [
          'MONOREPO · NPM WORKSPACES',
          'frontend',
          'backend',
          'MY CONTRIBUTION',
          '131 commits out of 779',
          'second of seven contributors',
        ],
        schemaDescription:
          'A monorepo with separate frontend and backend, and my share of the total commits',
        featured: false,
        kicker: 'Open source',
        period: '2021',
        title: 'Basil',
        summary:
          'A web app for solidarity purchasing groups, built for the Software Engineering II course at the Politecnico di Torino. A team of seven, a public repository: I am the second contributor, with 131 commits out of 779.',
        tags: ['React', 'TypeScript', 'MUI', 'NestJS', 'npm workspaces'],
        metrics: [
          { value: '131', label: 'my commits' },
          { value: '779', label: 'commits in all' },
          { value: '7', label: 'people on the team' },
        ],
        links: [
          { kind: 'caseStudy', label: 'Case study →' },
          { kind: 'repo', label: 'GitHub →', href: 'https://github.com/cirulla/basil' },
        ],
        caseStudy: {
          intro:
            'Basil is a web app for solidarity purchasing groups, built in 2021 for the Software Engineering II course at the Politecnico di Torino by a team of seven. The repository is public: it is the one project where everything below can be checked in a minute.',
          sections: [
            {
              heading: 'My contribution',
              body: [
                'I am the second contributor to the repository, with 131 commits out of 779, and I worked mainly on the frontend: React, TypeScript and MUI.',
              ],
            },
            {
              heading: 'How it was held together',
              body: [
                'An npm workspaces monorepo with frontend and backend separated — React on one side, NestJS on the other — a SonarCloud quality gate, conventional commits enforced by a git hook, and an MIT licence.',
              ],
            },
          ],
        },
      },
    ],
  },
  path: {
    mark: 'path',
    title: 'Studies, projects, a company',
    entries: [
      {
        period: '2024 — today',
        current: true,
        role: 'Junior developer',
        org: 'Coolshop',
        body: 'Building on two of the company’s products, a PIM and a CPQ: frontend in React and TypeScript, backend in C# and .NET. For the last four months, an MCP server for the PIM.',
        tags: ['React', 'TypeScript', 'C#', '.NET'],
      },
      {
        period: '2022 — today',
        current: false,
        role: 'Developer, freelance',
        org: 'Trader Without Money',
        body: 'An application for trading activity. Mostly frontend development, with backend contributions. The project is still in development and currently paused.',
        tags: ['React', 'TypeScript', 'Stitches', 'Radix UI', 'NestJS', 'Stripe'],
      },
      {
        period: '2021',
        current: false,
        role: 'Frontend developer, freelance',
        org: 'LVerify',
        body: 'A web application for document management in home and building renovations. I built the frontend.',
        tags: ['React', 'TypeScript', 'MUI', 'Figma', 'Directus'],
      },
      {
        period: '2016 — 2020',
        current: false,
        role: 'BSc in Computer Engineering',
        org: 'Politecnico di Torino',
        body: 'From 2020, the master’s in Cybersecurity at the same university: interrupted, not completed.',
        tags: ['Computer engineering', 'Cybersecurity'],
      },
    ],
  },
  contact: {
    mark: 'contact',
    title: 'If you feel like it, {write to me}.',
    note: 'I am not looking for a job. If you want to talk about PIM systems, frontend work or anything you have read here, the inbox is open.',
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
    left: '© 2026 · built with React, Vite and too much attention to detail',
    right: 'hosted on GitHub Pages',
  },
  notFound: {
    title: '404 — page not found',
    body: "The route you're looking for doesn't exist, or has moved. Happens to the best systems too.",
    cta: 'Back to home',
  },
  caseStudy: {
    back: '← Back to work',
    overview: 'Project overview',
  },
} satisfies Portfolio

export default enContent
