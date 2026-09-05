import type { SchemaProps } from './types'

/** Schema "server MCP": il percorso da chi usa lo strumento, al server, agli
 *  oggetti del catalogo — tre colonne, con le richieste che convergono sul
 *  server e ne escono verso gli oggetti.
 *
 *  Era lo schema del design system multi-brand: stessa mappatura a tre
 *  colonne, altre etichette. Sono sparite le sei tessere colorate dei temi
 *  in fondo, che erano l'unica eccezione ammessa al divieto di esadecimali
 *  fuori da `src/theme/tokens.css` — con loro se n'è andata anche
 *  l'eccezione, e qui dentro non resta nessun colore letterale.
 *
 *  Ordine di `labels` (contratto con `project.schemaLabels`, vedi il
 *  commento in `src/content/it.ts`): **per colonna, non riga per riga**.
 *  Le tre intestazioni stanno tutte sulla stessa riga in alto, e alternare
 *  le righe delle due colonne laterali renderebbe l'array illeggibile:
 *    0: intestazione colonna sinistra ("CHI LO USA")
 *    1: intestazione colonna centrale ("SERVER MCP")
 *    2: intestazione colonna destra   ("OGGETTI")
 *    3: prima riga a sinistra         ("sviluppatori")
 *    4: seconda riga a sinistra       ("amministratori")
 *    5: terza riga a sinistra         ("clienti")
 *    6: prima riga a destra           ("prodotti")
 *    7: seconda riga a destra         ("schemi di oggetto")
 *    8: terza riga a destra           ("catalogo")
 *    9: nota in fondo                 ("lo stesso server per...")
 *
 *  Le tre pillole dentro il riquadro centrale non hanno etichetta: sono il
 *  disegno degli strumenti esposti, e nominarli vorrebbe dire pubblicare i
 *  nomi dei tool di un prodotto privato. */

/** Le tre righe di ciascuna colonna laterale: coordinata y del riquadro e
 *  token del pallino di sinistra. Il pallino è un token di tema, non un
 *  colore di marchio. */
const ROWS = [
  { y: 28, dot: 'var(--amber-fill)' },
  { y: 52, dot: 'var(--teal)' },
  { y: 76, dot: 'var(--dim)' },
]

export function McpSchema({ label, labels }: SchemaProps) {
  return (
    <svg viewBox="0 0 320 140" role="img" aria-label={label}>
      <g fontSize={8} fill="var(--faint)" letterSpacing={1}>
        <text x={8} y={14}>
          {labels[0]}
        </text>
        <text x={118} y={14}>
          {labels[1]}
        </text>
        <text x={228} y={14}>
          {labels[2]}
        </text>
      </g>

      {/* colonna sinistra: chi usa lo strumento */}
      <g fill="var(--panel2)" stroke="var(--line-2)">
        {ROWS.map((row) => (
          <rect key={row.y} x={8} y={row.y} width={96} height={18} rx={2} />
        ))}
      </g>
      {ROWS.map((row) => (
        <rect key={row.y} x={14} y={row.y + 5.5} width={7} height={7} rx={1} fill={row.dot} />
      ))}
      <g fontSize={7} fill="var(--dim)">
        {ROWS.map((row, i) => (
          <text key={row.y} x={27} y={row.y + 12}>
            {labels[3 + i]}
          </text>
        ))}
      </g>

      {/* le tre richieste convergono sul server */}
      <g stroke="var(--line-2)" fill="none">
        <path d="M104 37 C 111 37, 111 61, 118 61" />
        <path d="M104 61 L118 61" />
        <path d="M104 85 C 111 85, 111 61, 118 61" />
      </g>

      {/* colonna centrale: il server, con gli strumenti che espone */}
      <rect x={118} y={28} width={84} height={66} rx={3} fill="var(--panel2)" stroke="var(--amber)" />
      <g fill="var(--panel)" stroke="var(--line-2)">
        <rect x={126} y={38} width={68} height={12} rx={2} />
        <rect x={126} y={55} width={68} height={12} rx={2} />
        <rect x={126} y={72} width={68} height={12} rx={2} />
      </g>
      <g fill="var(--amber-fill)">
        <circle cx={133} cy={44} r={2.5} />
        <circle cx={133} cy={61} r={2.5} />
        <circle cx={133} cy={78} r={2.5} />
      </g>
      <g fill="var(--line-2)">
        <rect x={140} y={43} width={46} height={3} rx={1.5} />
        <rect x={140} y={60} width={38} height={3} rx={1.5} />
        <rect x={140} y={77} width={44} height={3} rx={1.5} />
      </g>

      {/* dal server agli oggetti del catalogo */}
      <g stroke="var(--line-2)" fill="none">
        <path d="M202 61 C 215 61, 215 37, 228 37" />
        <path d="M202 61 L228 61" />
        <path d="M202 61 C 215 61, 215 85, 228 85" />
      </g>

      {/* colonna destra: gli oggetti del catalogo */}
      <g fill="var(--panel)" stroke="var(--line-2)">
        {ROWS.map((row) => (
          <rect key={row.y} x={228} y={row.y} width={84} height={18} rx={2} />
        ))}
      </g>
      <g fontSize={7} fill="var(--text)">
        {ROWS.map((row, i) => (
          <text key={row.y} x={234} y={row.y + 12}>
            {labels[6 + i]}
          </text>
        ))}
      </g>

      <text x={8} y={124} fontSize={7} fill="var(--faint)">
        {labels[9]}
      </text>
    </svg>
  )
}
