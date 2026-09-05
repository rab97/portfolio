import type { SchemaProps } from './types'

/** Schema "flusso di un PIM": quattro nodi in fila — raccoglie, organizza,
 *  gestisce, canali — e una didascalia sotto la riga di separazione.
 *
 *  Il disegno aveva tre elementi che dichiaravano misure inventate: una
 *  annotazione di scarti sopra il secondo nodo, una riga di conteggi sotto
 *  i nodi e una barra di avanzamento col tempo di sincronizzazione scritto
 *  a destra. Sono spariti tutti e tre: del PIM su cui il committente lavora
 *  non si possono pubblicare cifre di catalogo, e una barra riempita a metà
 *  è una misura anche quando nessun numero la accompagna. Restano i nodi,
 *  che dicono cosa fa un PIM, e una riga di testo che lo ripete a parole.
 *
 *  Ordine di `labels` (contratto con `project.schemaLabels`, vedi il
 *  commento in `src/content/it.ts`), dall'alto verso il basso, sinistra
 *  verso destra — qui coincide con l'ordine del markup sorgente:
 *    0: primo nodo della fila    ("RACCOGLIE")
 *    1: secondo nodo della fila  ("ORGANIZZA")
 *    2: terzo nodo della fila    ("GESTISCE")
 *    3: quarto nodo della fila   ("CANALI")
 *    4: didascalia sotto la riga ("le informazioni di prodotto...") */
export function PipelineSchema({ label, labels }: SchemaProps) {
  return (
    <svg viewBox="0 0 300 110" role="img" aria-label={label}>
      <g fill="var(--panel2)" stroke="var(--line-2)">
        <rect x={4} y={20} width={52} height={26} rx={3} />
        <rect x={172} y={20} width={52} height={26} rx={3} />
      </g>
      <rect x={88} y={20} width={52} height={26} rx={3} fill="var(--panel2)" stroke="var(--teal)" />
      <rect x={248} y={20} width={48} height={26} rx={3} fill="var(--panel2)" stroke="var(--amber)" />
      <g fontSize={7.5} textAnchor="middle">
        <text x={30} y={37} fill="var(--dim)">
          {labels[0]}
        </text>
        <text x={114} y={37} fill="var(--teal)">
          {labels[1]}
        </text>
        <text x={198} y={37} fill="var(--dim)">
          {labels[2]}
        </text>
        <text x={272} y={37} fill="var(--amber)">
          {labels[3]}
        </text>
      </g>
      <g stroke="var(--line-2)" strokeDasharray="3 3">
        <line x1={56} y1={33} x2={88} y2={33} />
        <line x1={140} y1={33} x2={172} y2={33} />
        <line x1={224} y1={33} x2={248} y2={33} />
      </g>
      <line x1={4} y1={68} x2={296} y2={68} stroke="var(--line)" />
      <text x={4} y={88} fontSize={7} fill="var(--faint)">
        {labels[4]}
      </text>
    </svg>
  )
}
