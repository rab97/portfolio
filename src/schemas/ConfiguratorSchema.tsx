import type { SchemaProps } from './types'

/** Schema "CPQ": grafo di sei nodi con un vincolo tratteggiato fra due di
 *  essi e una didascalia in fondo. Descrive un configuratore — un grafo di
 *  opzioni con vincoli, dal prodotto al preventivo — e il disegno non è
 *  cambiato: sono cambiate le etichette, che prima nominavano parti e un
 *  totale di configurazioni inventati.
 *
 *  Ordine di `labels` (contratto con `project.schemaLabels`, vedi il
 *  commento in `src/content/it.ts`), dall'alto verso il basso, sinistra
 *  verso destra — **in questo schema l'ordine NON coincide con l'ordine
 *  del markup sorgente del mockup**: l'etichetta del nodo in alto (y=12) è
 *  la più alta del disegno ma nel markup è scritta dopo quella del nodo di
 *  sinistra (y=20), e l'etichetta del vincolo (y=80) precede nel disegno la
 *  didascalia in fondo (y=122) pur essendo scritta dopo nel markup:
 *    0: nodo in alto, le opzioni               ("OPZIONI")
 *    1: nodo di sinistra, in evidenza          ("PRODOTTO")
 *    2: nodo di destra                         ("PREVENTIVO")
 *    3: etichetta del vincolo tratteggiato     ("vincolo")
 *    4: didascalia in fondo                    ("CONFIGURE · PRICE · QUOTE") */
export function ConfiguratorSchema({ label, labels }: SchemaProps) {
  return (
    <svg viewBox="0 0 300 130" role="img" aria-label={label}>
      <g stroke="var(--line-2)" fill="none">
        <path d="M60 34 L150 22 L240 34" />
        <path d="M60 34 L150 62 L240 34" />
        <path d="M60 34 L60 90 L150 104 L240 90 L240 34" />
        <path d="M150 62 L150 104" />
      </g>
      <g fill="var(--panel2)" stroke="var(--line-2)">
        <circle cx={150} cy={22} r={7} />
        <circle cx={240} cy={34} r={7} />
        <circle cx={150} cy={62} r={7} />
        <circle cx={60} cy={90} r={7} />
        <circle cx={240} cy={90} r={7} />
        <circle cx={150} cy={104} r={7} />
      </g>
      <circle cx={60} cy={34} r={9} fill="var(--panel2)" stroke="var(--amber)" />
      <circle cx={60} cy={34} r={3} fill="var(--amber-fill)" />
      <g fontSize={7} fill="var(--dim)">
        <text x={4} y={20} fill="var(--amber)">
          {labels[1]}
        </text>
        <text x={132} y={12}>
          {labels[0]}
        </text>
        <text x={222} y={20}>
          {labels[2]}
        </text>
        <text x={118} y={122}>
          {labels[4]}
        </text>
      </g>
      <path d="M150 62 L240 90" stroke="var(--coral)" strokeDasharray="2 3" fill="none" />
      {/* Sopra la linea tratteggiata, non sopra il tratto: a y=80 l'etichetta
          cadeva esattamente sul vincolo che nomina e si leggeva male. */}
      <text x={198} y={71} fontSize={6.5} fill="var(--coral)">
        {labels[3]}
      </text>
    </svg>
  )
}
