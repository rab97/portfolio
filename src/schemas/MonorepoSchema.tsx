import type { SchemaProps } from './types'

/** Schema "Basil": la forma del monorepo — frontend e backend come due
 *  pacchetti separati dentro un solo repository — e sotto la quota dei
 *  commit del committente sul totale.
 *
 *  Era il grafico della latenza p95 di una migrazione headless, cioè una
 *  misura di un progetto che non esiste. Qui il disegno dice due cose sole,
 *  entrambe leggibili su github.com/cirulla/basil: com'è organizzato il
 *  repository e quanto ne ha scritto lui.
 *
 *  La barra è l'unica misura rimasta in tutti gli schemi del sito, ed è
 *  disegnata sul rapporto vero: `MINE_COMMITS / TOTAL_COMMITS` della
 *  larghezza utile. Se un giorno i numeri cambiassero, vanno cambiati qui e
 *  nelle due etichette dei contenuti insieme.
 *
 *  Ordine di `labels` (contratto con `project.schemaLabels`, vedi il
 *  commento in `src/content/it.ts`), dall'alto verso il basso, sinistra
 *  verso destra — qui coincide con l'ordine del markup sorgente:
 *    0: intestazione del riquadro     ("MONOREPO · NPM WORKSPACES")
 *    1: pacchetto di sinistra         ("frontend")
 *    2: pacchetto di destra           ("backend")
 *    3: didascalia della barra        ("IL MIO CONTRIBUTO")
 *    4: valore sotto la barra, a sin. ("131 commit su 779")
 *    5: posizione, a destra           ("secondo contributore su sette") */

/** I commit del committente e il totale del repository, al 2026: la barra
 *  qui sotto è larga in proporzione, non a occhio. */
const MINE_COMMITS = 131
const TOTAL_COMMITS = 779

/** Estremi della barra nel viewBox. */
const BAR_X = 4
const BAR_WIDTH = 292

export function MonorepoSchema({ label, labels }: SchemaProps) {
  const mineWidth = (BAR_WIDTH * MINE_COMMITS) / TOTAL_COMMITS

  return (
    <svg viewBox="0 0 300 130" role="img" aria-label={label}>
      <rect x={4} y={10} width={292} height={58} rx={4} fill="var(--panel)" stroke="var(--line-2)" />
      <text x={12} y={24} fontSize={7.5} fill="var(--faint)" letterSpacing={1}>
        {labels[0]}
      </text>

      <rect x={14} y={32} width={130} height={28} rx={3} fill="var(--panel2)" stroke="var(--teal)" />
      <rect
        x={156}
        y={32}
        width={130}
        height={28}
        rx={3}
        fill="var(--panel2)"
        stroke="var(--line-2)"
      />
      <line x1={144} y1={46} x2={156} y2={46} stroke="var(--line-2)" strokeDasharray="3 3" />
      <g fontSize={7.5} textAnchor="middle">
        <text x={79} y={49} fill="var(--teal)">
          {labels[1]}
        </text>
        <text x={221} y={49} fill="var(--dim)">
          {labels[2]}
        </text>
      </g>

      <text x={BAR_X} y={88} fontSize={7} fill="var(--faint)" letterSpacing={1}>
        {labels[3]}
      </text>
      <rect x={BAR_X} y={94} width={BAR_WIDTH} height={6} rx={3} fill="var(--panel2)" />
      <rect x={BAR_X} y={94} width={mineWidth} height={6} rx={3} fill="var(--amber-fill)" />
      <g fontSize={7}>
        <text x={BAR_X} y={116} fill="var(--text)">
          {labels[4]}
        </text>
        <text x={296} y={116} textAnchor="end" fill="var(--faint)">
          {labels[5]}
        </text>
      </g>
    </svg>
  )
}
