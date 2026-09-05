import type { SchemaProps } from './types'

/** Schema "migrazione headless": latenza p95 prima (monolite) e dopo
 *  (switch headless) la migrazione, come una linea spezzata che scende.
 *
 *  Ordine di `labels` (contratto con `project.schemaLabels`, vedi il
 *  commento in `src/content/it.ts`), dall'alto verso il basso, sinistra
 *  verso destra — in questo schema coincide con l'ordine del markup
 *  sorgente del mockup, entrambe le etichette sulla stessa riga in alto:
 *    0: etichetta del tratto monolite         ("monolite")
 *    1: etichetta dello switch headless       ("switch headless")
 *
 *  Gli assi ("900ms"/"450ms"/"0"), la didascalia dell'asse
 *  ("P95 TIME TO FIRST BYTE") e la variazione finale ("−78%") sono
 *  invarianti fra le due lingue nel mockup approvato (nessun
 *  `data-i`/`data-e`): restano letterali, come le iniziali di `Portrait`. */
export function HeadlessSchema({ label, labels }: SchemaProps) {
  return (
    <svg viewBox="0 0 300 130" role="img" aria-label={label}>
      <g stroke="var(--line)">
        <line x1={30} y1={24} x2={292} y2={24} />
        <line x1={30} y1={56} x2={292} y2={56} />
        <line x1={30} y1={88} x2={292} y2={88} />
      </g>
      <g fontSize={6.5} fill="var(--faint)" textAnchor="end">
        <text x={24} y={27}>900ms</text>
        <text x={24} y={59}>450ms</text>
        <text x={24} y={91}>0</text>
      </g>
      <path d="M30 30 L70 34 L110 28 L150 40" fill="none" stroke="var(--coral)" strokeWidth={1.6} />
      <path
        d="M150 40 L152 74 L190 76 L230 73 L270 78 L292 76"
        fill="none"
        stroke="var(--teal)"
        strokeWidth={1.6}
      />
      <line x1={150} y1={16} x2={150} y2={88} stroke="var(--amber)" strokeDasharray="3 3" />
      <circle cx={292} cy={76} r={3} fill="var(--teal)" />
      <g fontSize={7}>
        <text x={34} y={16} fill="var(--coral)">
          {labels[0]}
        </text>
        <text x={156} y={16} fill="var(--amber)">
          {labels[1]}
        </text>
        <text x={34} y={108} fill="var(--dim)">P95 TIME TO FIRST BYTE</text>
        <text x={292} y={108} textAnchor="end" fill="var(--teal)">
          −78%
        </text>
      </g>
    </svg>
  )
}
