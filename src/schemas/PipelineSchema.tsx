import type { SchemaProps } from './types'

/** Schema "pipeline catalogo": quattro nodi in fila (feed → normalizza →
 *  arricchisci → indicizza) con l'annotazione degli scarti sopra il
 *  secondo nodo e la barra di sincronizzazione completa in fondo.
 *
 *  Ordine di `labels` (contratto con `project.schemaLabels`, vedi il
 *  commento in `src/content/it.ts`), dall'alto verso il basso, sinistra
 *  verso destra — **in questo schema l'ordine NON coincide con l'ordine
 *  del markup sorgente del mockup**: l'annotazione degli scarti sta più in
 *  alto (y=26) della riga dei quattro nodi (y=49) ma nel markup è scritta
 *  dopo:
 *    0: annotazione degli scarti sopra il nodo normalizza ("−520 scarti")
 *    1: primo nodo della fila             ("FEED CSV")
 *    2: secondo nodo della fila           ("NORMALIZZA")
 *    3: terzo nodo della fila             ("ARRICCHISCI")
 *    4: quarto nodo della fila            ("INDICIZZA")
 *    5: etichetta della barra in fondo    ("SYNC COMPLETO")
 *
 *  I conteggi (214.000, 213.480...) e il tempo di sync ("3 m 08 s") sono
 *  invarianti fra le due lingue nel mockup approvato (nessun
 *  `data-i`/`data-e`): restano letterali, come le iniziali di `Portrait`. */
export function PipelineSchema({ label, labels }: SchemaProps) {
  return (
    <svg viewBox="0 0 300 130" role="img" aria-label={label}>
      <g fill="var(--panel2)" stroke="var(--line-2)">
        <rect x={4} y={34} width={52} height={24} rx={3} />
        <rect x={172} y={34} width={52} height={24} rx={3} />
      </g>
      <rect x={88} y={34} width={52} height={24} rx={3} fill="var(--panel2)" stroke="var(--teal)" />
      <rect x={248} y={34} width={48} height={24} rx={3} fill="var(--panel2)" stroke="var(--amber)" />
      <g fontSize={7.5} textAnchor="middle">
        <text x={30} y={49} fill="var(--dim)">
          {labels[1]}
        </text>
        <text x={114} y={49} fill="var(--teal)">
          {labels[2]}
        </text>
        <text x={198} y={49} fill="var(--dim)">
          {labels[3]}
        </text>
        <text x={272} y={49} fill="var(--amber)">
          {labels[4]}
        </text>
      </g>
      <g stroke="var(--line-2)" strokeDasharray="3 3">
        <line x1={56} y1={46} x2={88} y2={46} />
        <line x1={140} y1={46} x2={172} y2={46} />
        <line x1={224} y1={46} x2={248} y2={46} />
      </g>
      <g fontSize={7} fill="var(--faint)" textAnchor="middle">
        <text x={30} y={72}>214.000</text>
        <text x={114} y={72}>213.480</text>
        <text x={198} y={72}>213.480</text>
        <text x={272} y={72}>213.480</text>
        <text x={72} y={26} fill="var(--coral)">
          {labels[0]}
        </text>
      </g>
      <rect x={4} y={88} width={292} height={6} rx={3} fill="var(--panel2)" />
      <rect x={4} y={88} width={248} height={6} rx={3} fill="var(--teal)" fillOpacity={0.5} />
      <g fontSize={7} fill="var(--faint)">
        <text x={4} y={110}>
          {labels[5]}
        </text>
        <text x={296} y={110} textAnchor="end" fill="var(--text)">
          3 m 08 s
        </text>
      </g>
    </svg>
  )
}
