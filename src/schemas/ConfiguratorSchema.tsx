import type { SchemaProps } from './types'

/** Schema "configuratore a vincoli": grafo di sei nodi (telaio, motore,
 *  controllo e tre nodi intermedi) con un vincolo di incompatibilità
 *  tratteggiato e il totale delle configurazioni valide in fondo.
 *
 *  Ordine di `labels` (contratto con `project.schemaLabels`, vedi il
 *  commento in `src/content/it.ts`), dall'alto verso il basso, sinistra
 *  verso destra — **in questo schema l'ordine NON coincide con l'ordine
 *  del markup sorgente del mockup**: l'etichetta del motore (y=12) è la
 *  più alta del disegno ma nel markup è scritta dopo quella del telaio
 *  (y=20), e l'etichetta del vincolo incompatibile (y=80) precede nel
 *  disegno il totale in fondo (y=122) pur essendo scritta dopo nel markup:
 *    0: nodo motore, il più in alto            ("MOTORE")
 *    1: nodo telaio, stessa riga del controllo ("TELAIO")
 *    2: nodo controllo, stessa riga del telaio ("CONTROLLO")
 *    3: etichetta del vincolo incompatibile    ("incompatibile")
 *    4: totale delle configurazioni valide     ("4.812 CONFIGURAZIONI VALIDE") */
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
      <text x={192} y={80} fontSize={6.5} fill="var(--coral)">
        {labels[3]}
      </text>
    </svg>
  )
}
