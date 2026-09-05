import type { Portfolio } from '@/content/schema'

/**
 * Identificatori stabili delle cinque sezioni della home, uguali nelle due
 * lingue. Coincidono con le chiavi di `copy.nav` — che invece cambiano
 * etichetta a seconda della lingua ("chi" vs "about", "skill" vs "skills",
 * "progetti" vs "work", "percorso" vs "path", "contatti" vs "contact") — e
 * fanno da id di ancoraggio per i link della navigazione.
 *
 * Ogni componente che rende una di queste sezioni sulla home (Hero/About,
 * Skills, Work, Path, Contact) DEVE impostare il proprio `id` HTML a uno di
 * questi valori, mai all'etichetta tradotta: l'etichetta cambia con la
 * lingua, questi id no. `Nav.tsx` costruisce i propri `href` da qui: un id
 * di sezione che non corrisponde a un valore di `SECTION_IDS` è un link
 * morto silenzioso.
 */
export const SECTION_IDS = [
  'about',
  'skills',
  'work',
  'path',
  'contact',
] as const satisfies readonly (keyof Portfolio['nav'])[]

export type SectionId = (typeof SECTION_IDS)[number]
