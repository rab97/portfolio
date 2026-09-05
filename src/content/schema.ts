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
  /** Descrizione accessibile del disegno (finisce in `aria-label` sull'`<svg>`
   *  dello schema): dice cosa raffigura lo schema, non cosa fa il progetto —
   *  è per questo che è un campo distinto da `summary`. Presa dall'attributo
   *  `aria-label` di ogni SVG nel mockup approvato. */
  schemaDescription: string
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
  meta: {
    title: string
    description: string
    portraitAlt: string
    /** Nome della lingua nella lingua stessa, per i link della pagina radice. */
    languageName: string
    /** Valore `og:locale`, es. `it_IT`. */
    ogLocale: string
  }
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
