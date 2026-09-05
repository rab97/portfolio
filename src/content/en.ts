import type { Portfolio } from './schema'

export const enContent = {
  meta: {
    title: 'Francesco Rabezzano — Fullstack Engineer',
    description:
      'Frontend and backend developer. Design systems, catalogue APIs and e-commerce platforms.',
    portraitAlt: 'Photographic portrait',
    languageName: 'English',
    ogLocale: 'en_GB',
  },
  nav: { about: 'about', skills: 'skills', work: 'work', path: 'path', contact: 'contact' },
  availability: 'available from Q1',
  themeLabels: { group: 'Theme', auto: 'AUTO', light: 'Light theme', dark: 'Dark theme' },
  langLabel: 'Language',
  hero: {
    prompt: 'whoami --verbose',
    headline: 'I build systems that {hold up} and interfaces that make them obvious.',
    sub: '**Frontend and backend** developer. Eleven years between design systems consumed by dozens of teams and APIs moving catalogues of hundreds of thousands of products.',
    ctaPrimary: 'See the work',
    ctaSecondary: 'Download CV (PDF)',
    diagramTitle: 'A typical architecture I work on',
    diagramBadge: 'live',
    nodes: ['Suppliers', 'PIM', 'API Gateway', 'Storefront'],
    metrics: [
      { value: '11', label: 'years' },
      { value: '138', label: 'components shipped' },
      { value: '214k', label: 'SKUs managed' },
      { value: '42 ms', label: 'p95 catalog api' },
    ],
  },
  about: {
    mark: 'about',
    title: "I'm at home in the middle of the stack",
    paragraphs: [
      'I started in the frontend and stayed long enough to learn that **most interface problems start upstream**: in a wrong data model, in an API that returns too much, in a contract nobody wrote down. So I went down to the other side.',
      'The work I do best now sits on the boundary: defining the contract between whoever produces the data and whoever displays it, then building both sides. **Design systems** and **APIs** are the same craft from two angles — deciding what is public, what is stable, and what can change without breaking anyone.',
      'I work in B2B and B2C e-commerce: large catalogues, many variants, many languages, many brands. A context where shortcuts come due six months later.',
    ],
    facts: [
      { label: 'Based', value: 'Italy · remote' },
      { label: 'Role', value: 'Fullstack Engineer' },
      { label: 'Strongest', value: 'Architectural frontend' },
      { label: 'Languages', value: 'Italian, English' },
      { label: 'Status', value: 'Open to offers', accent: true },
    ],
  },
  skills: {
    mark: 'skills',
    title: 'By layer, not by percentage',
    lede: '"React 90%" bars say nothing. Here technologies are ordered by layer of the system, and the dots show how long I\'ve run them in production — not how much I like them.',
    layers: [
      {
        id: 'interface',
        title: 'Interface',
        caption: 'layer 1',
        skills: [
          { name: 'React · TypeScript', level: 5 },
          { name: 'Design systems', level: 5 },
          { name: 'Architectural CSS', level: 4 },
          { name: 'Accessibility', level: 4 },
          { name: 'Web animation', level: 3 },
        ],
        foot: '138 components published to a private npm',
      },
      {
        id: 'services',
        title: 'Services & data',
        caption: 'layer 2',
        skills: [
          { name: '.NET · C#', level: 4 },
          { name: 'Node · Fastify', level: 4 },
          { name: 'PostgreSQL · SQL Server', level: 4 },
          { name: 'REST · GraphQL', level: 5 },
          { name: 'Message queues', level: 3 },
        ],
        foot: '214k-SKU pipeline, full sync in 3 min',
      },
      {
        id: 'delivery',
        title: 'Delivery',
        caption: 'layer 3',
        skills: [
          { name: 'Docker', level: 4 },
          { name: 'CI/CD · GitLab, Actions', level: 4 },
          { name: 'Azure', level: 3 },
          { name: 'End-to-end testing', level: 4 },
          { name: 'Observability', level: 3 },
        ],
        foot: 'Zero visual regressions across 4 releases a month',
      },
    ],
  },
  work: {
    mark: 'selected work',
    title: 'Four things that shipped to production',
    lede: "No screenshots: every project is drawn as the diagram that describes it. It's the only way the invisible work — a pipeline, an API contract — gets a face too.",
    projects: [
      {
        slug: 'design-system',
        schema: 'design-system',
        // Order in the SVG top to bottom, left to right:
        // the three column headers (PRIMITIVES, SEMANTIC, COMPONENTS),
        // then the themes caption, then the closing note about the single package.
        schemaLabels: [
          'PRIMITIVES',
          'SEMANTIC',
          'COMPONENTS',
          '7 THEMES GENERATED AT BUILD TIME',
          'one package · no per-client fork',
        ],
        featured: true,
        kicker: 'Featured',
        period: '2023 — today',
        title: 'Multi-brand design system',
        summary:
          'One component library for seven brands with different identities. Three-tier semantic tokens, themes generated at build time, no per-client fork.',
        tags: ['React', 'TypeScript', 'Style Dictionary', 'Storybook', 'Chromatic'],
        metrics: [
          { value: '138', label: 'components' },
          { value: '7', label: 'brands' },
          { value: '0', label: 'forks' },
        ],
        links: [
          { kind: 'caseStudy', label: 'Read the case study →' },
          { kind: 'private', label: 'Private code' },
        ],
        caseStudy: {
          intro:
            'Seven brands, one component library: the challenge was making every identity recognisable without duplicating a single line of code. The result is 138 components published to a private npm registry and zero per-client forks.',
          sections: [
            {
              heading: 'The problem',
              body: [
                'Every brand had its own frontend, built by a different team at a different time. The same components — buttons, forms, cards — existed in seven slightly incompatible variants, and every design change meant seven separate pull requests.',
                'Product wanted to be able to launch an eighth brand in a few weeks, not months. With the existing architecture, every new brand meant a new fork to maintain forever.',
              ],
            },
            {
              heading: 'How I solved it',
              body: [
                'I defined three tiers of tokens — primitive, semantic, component — with Style Dictionary, so each brand could redefine only the semantic tier without touching the components. Themes are generated at build time, not at runtime.',
                'I built the component library in React and TypeScript with Storybook as an isolated development environment, and Chromatic for visual regression testing across all seven themes on every pull request.',
              ],
            },
            {
              heading: 'What came out of it',
              body: [
                'Today the library counts 138 components published to a private npm registry, consumed by seven brands with zero forks. Adding an eighth brand is a matter of tokens, not code.',
                'Time to launch a new brand dropped from months to about three weeks, and visual-inconsistency bugs across brands have essentially disappeared.',
              ],
            },
          ],
        },
      },
      {
        slug: 'pipeline',
        schema: 'pipeline',
        // Order in the SVG top to bottom, left to right:
        // the rejects annotation above the normalize node,
        // the row of four pipeline nodes, then the full-sync label.
        schemaLabels: [
          '−520 rejected',
          'CSV FEEDS',
          'NORMALIZE',
          'ENRICH',
          'INDEX',
          'FULL SYNC',
        ],
        featured: false,
        kicker: 'PIM',
        period: '2021 — 2023',
        title: 'Catalogue pipeline, 214k SKUs',
        summary:
          'Ingestion from 40 suppliers in as many formats: normalize, enrich, index. From six hours to three minutes.',
        tags: ['.NET', 'RabbitMQ', 'PostgreSQL', 'Elasticsearch'],
        metrics: [
          { value: '40', label: 'suppliers' },
          { value: '214k', label: 'SKUs processed' },
          { value: '3 m 08 s', label: 'full sync' },
        ],
        links: [{ kind: 'caseStudy', label: 'Case study →' }],
        caseStudy: {
          intro:
            'Forty suppliers, forty different formats, one catalogue to keep up to date. Full synchronization went from six hours to three minutes.',
          sections: [
            {
              heading: 'The problem',
              body: [
                'The catalogue was updated once a day by a monolithic script that read forty CSV feeds, each in a different format, one at a time, in sequence. A single supplier with a malformed file blocked the entire pipeline.',
                'There was no way to know which products had been rejected or why, until someone noticed after the catalogue was already published, with missing items or stale prices live.',
              ],
            },
            {
              heading: 'How I solved it',
              body: [
                'I rewrote the pipeline as a series of independent stages on RabbitMQ message queues: normalize, enrich, index. Each stage processes products in parallel and publishes rejects to a dedicated queue instead of halting.',
                'PostgreSQL holds the canonical product state, Elasticsearch the search index. A broken supplier now only rejects its own malformed rows — around 520 out of 214,000 — without stopping the other 39.',
              ],
            },
            {
              heading: 'What came out of it',
              body: [
                'Full synchronization of the 214k SKUs went from six hours to three minutes and eight seconds, with rejects tracked row by row instead of discovered after the fact.',
                'The catalogue can now update several times a day instead of once, and adding a new supplier is a matter of a normalization mapping, not a new pipeline.',
              ],
            },
          ],
        },
      },
      {
        slug: 'configurator',
        schema: 'configurator',
        // Order in the SVG top to bottom, left to right:
        // the motor node label (highest), then frame and control on the same
        // row, then the incompatible-constraint label, then the total of
        // valid configurations at the bottom.
        schemaLabels: [
          'MOTOR',
          'FRAME',
          'CONTROL',
          'incompatible',
          '4,812 VALID CONFIGURATIONS',
        ],
        featured: false,
        kicker: 'Industrial',
        period: '2020 — 2021',
        title: 'Constraint-based configurator',
        summary:
          'A rules engine that rejects impossible combinations across 6 option families in real time, with an instant quote.',
        tags: ['React', 'Node', 'Rules engine'],
        metrics: [
          { value: '6', label: 'option families' },
          { value: '4,812', label: 'valid configurations' },
          { value: '<50 ms', label: 'validation time' },
        ],
        links: [
          { kind: 'caseStudy', label: 'Case study →' },
          { kind: 'live', label: 'Live demo →', href: 'https://configurator.demo.example.dev' },
        ],
        caseStudy: {
          intro:
            'A rules engine rejects impossible combinations across six option families in real time, instead of letting them surface after the order is placed. The result is 4,812 valid configurations recognized by the constraint graph, with an instant quote instead of one at the end of configuration.',
          sections: [
            {
              heading: 'The problem',
              body: [
                "The existing configurator let people pick any combination of frame, motor and control, and only at order time would an operator discover the combination was incompatible or not manufacturable.",
                "The quote arrived by email the next day, often only to be redone because one of the chosen options wasn't available alongside the others.",
              ],
            },
            {
              heading: 'How I solved it',
              body: [
                'I modeled the six option families and their incompatibility constraints as a graph, with a rules engine in Node that evaluates every choice in real time and disables options that would become incompatible.',
                'The quote updates on every click, computed client-side against the same rules validated server-side, so a customer can never reach an order that isn\'t manufacturable.',
              ],
            },
            {
              heading: 'What came out of it',
              body: [
                'The constraint graph recognizes 4,812 valid configurations across the option families, and every rejected combination is rejected in real time, before the customer finishes choosing.',
                'Orders with a non-manufacturable configuration dropped to zero, and the time between configuration and quote went from a day to under a second.',
              ],
            },
          ],
        },
      },
      {
        slug: 'headless',
        schema: 'headless',
        // Order in the SVG top to bottom, left to right:
        // the monolith label, then the headless-switch label, both on the
        // same row at the top of the chart.
        schemaLabels: ['monolith', 'headless switch'],
        featured: false,
        kicker: 'Storefront',
        period: '2019 — 2020',
        title: 'Headless migration',
        summary:
          'Leaving a monolith without pausing sales: route-by-route rollout, mirrored traffic, one-minute rollback.',
        tags: ['Next.js', 'GraphQL', 'CDN edge'],
        metrics: [
          { value: '−78%', label: 'p95 TTFB' },
          { value: '1 min', label: 'rollback' },
          { value: '0', label: 'downtime during rollout' },
        ],
        links: [
          { kind: 'caseStudy', label: 'Case study →' },
          { kind: 'repo', label: 'GitHub →', href: 'https://github.com/utente/headless-storefront' },
        ],
        caseStudy: {
          intro:
            'A monolith serving both catalogue and checkout together is left behind one route at a time, with mirrored traffic and a rollback switch ready in under a minute. The result is a p95 time-to-first-byte down 78%, without a single minute of measurable downtime throughout the migration.',
          sections: [
            {
              heading: 'The problem',
              body: [
                'The storefront lived in a server-rendered monolith that served both the catalogue and checkout from the same application. Every deploy was all-or-nothing across all traffic, with a p95 time-to-first-byte near 900ms.',
                "Migrating to a headless architecture without risking hours of downtime during the peak sales period wasn't an option the business could accept.",
              ],
            },
            {
              heading: 'How I solved it',
              body: [
                'I migrated one route at a time to a Next.js frontend on the CDN edge, with GraphQL as the contract to the existing backend, keeping the monolith running in parallel as a fallback.',
                'Traffic was mirrored onto the new route before being genuinely routed there, to validate response times under real load, with a switch to fall back to the monolith in under a minute.',
              ],
            },
            {
              heading: 'What came out of it',
              body: [
                'The p95 time-to-first-byte dropped by 78%, and the entire migration happened without a single minute of measurable downtime on sales.',
                'Rollback, when needed during the rollout, took under a minute instead of an emergency deploy, which made the whole migration low-risk.',
              ],
            },
          ],
        },
      },
    ],
  },
  path: {
    mark: 'path',
    title: 'Eleven years, three contexts',
    entries: [
      {
        period: '2021 — today',
        current: true,
        role: 'Fullstack Engineer',
        org: 'B2B/B2C e-commerce',
        body: 'Owner of the design system and the catalogue APIs. Moved seven brands onto a single component library and rewrote the product ingestion pipeline.',
        tags: ['React', '.NET', 'PostgreSQL', 'Azure'],
      },
      {
        period: '2018 — 2021',
        current: false,
        role: 'Frontend Developer',
        org: 'Software house',
        body: 'Bespoke applications for manufacturing and retail: product configurators, supplier portals, operations dashboards. First serious contact with the backend, out of necessity.',
        tags: ['Angular', 'React', 'Node'],
      },
      {
        period: '2015 — 2018',
        current: false,
        role: 'Web Developer',
        org: 'Agency',
        body: "Sites and landing pages for clients of every size. Where I learned to ship, to measure performance, and to argue with people who don't read code.",
        tags: ['JavaScript', 'PHP', 'SCSS'],
      },
    ],
  },
  openSource: {
    mark: 'open source',
    title: "Code I publish when it's worth publishing",
    lede: "A handful of repositories, properly maintained: I'd rather have one supported package than ten half-abandoned projects.",
    stars: 'GitHub stars',
    unavailable: 'Repositories unavailable right now.',
  },
  contact: {
    mark: 'contact',
    title: "If you've got a complicated system, {let's talk}.",
    note: "I reply within a couple of days. Write with real context — what you're building, what's blocking you — and I'll reply sooner.",
    links: [
      { label: 'Email', value: 'ciao@esempio.dev', href: 'mailto:ciao@esempio.dev', arrow: '→' },
      { label: 'GitHub', value: 'github.com/utente', href: 'https://github.com/utente', arrow: '→' },
      { label: 'LinkedIn', value: 'in/utente', href: 'https://linkedin.com/in/utente', arrow: '→' },
      { label: 'CV', value: 'curriculum.pdf · 180 KB', href: '/curriculum.pdf', arrow: '↓' },
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
