import type { SchemaProps } from './types'

/** Le sei tessere colorate rappresentano i temi di sei brand diversi: sono
 *  campioni di colore "a marchio", non colori d'interfaccia, e per questo
 *  non hanno un equivalente token in `src/theme/tokens.css` — è l'unica
 *  eccezione ammessa al vincolo "nessun esadecimale fuori da tokens.css".
 *  Ogni tessera è marcata `data-swatch="true"` perché il test sugli
 *  esadecimali possa escluderle esplicitamente dal markup prima di
 *  cercare, invece di trattarle come un file escluso a mano. */
const THEME_SWATCHES = ['#E8A33D', '#E2553C', '#2FA396', '#5A86E0', '#8A94A0', '#8C6FD4']

/** Schema "design system multi-brand": token primitivi che confluiscono in
 *  token semantici che alimentano i componenti, con la fila di temi
 *  generati a build time in fondo.
 *
 *  Ordine di `labels` (contratto con `project.schemaLabels`, vedi il
 *  commento in `src/content/it.ts`), dall'alto verso il basso, sinistra
 *  verso destra — in questo schema coincide con l'ordine del markup
 *  sorgente del mockup:
 *    0: intestazione colonna primitivi  ("PRIMITIVI")
 *    1: intestazione colonna semantici  ("SEMANTICI")
 *    2: intestazione colonna componenti ("COMPONENTI")
 *    3: didascalia della fila di temi   ("7 TEMI GENERATI A BUILD TIME")
 *    4: nota finale sul pacchetto unico ("un solo pacchetto...")
 *
 *  I nomi di token (`amber.500`, `action.primary`, ...) e il badge "+1"
 *  sono invarianti fra le due lingue nel mockup approvato (nessun
 *  `data-i`/`data-e`): restano letterali qui, come l'indice a due cifre
 *  di `SectionMark` o le iniziali di `Portrait`. */
export function DesignSystemSchema({ label, labels }: SchemaProps) {
  return (
    <svg viewBox="0 0 320 200" role="img" aria-label={label}>
      <g fontSize={8} fill="var(--faint)" letterSpacing={1}>
        <text x={8} y={14}>
          {labels[0]}
        </text>
        <text x={120} y={14}>
          {labels[1]}
        </text>
        <text x={236} y={14}>
          {labels[2]}
        </text>
      </g>

      <g fill="var(--panel2)" stroke="var(--line-2)">
        <rect x={8} y={26} width={62} height={15} rx={2} />
        <rect x={8} y={47} width={62} height={15} rx={2} />
        <rect x={8} y={68} width={62} height={15} rx={2} />
        <rect x={8} y={89} width={62} height={15} rx={2} />
      </g>
      <rect x={12} y={30} width={7} height={7} rx={1} fill="var(--amber-fill)" />
      <rect x={12} y={51} width={7} height={7} rx={1} fill="var(--coral)" />
      <rect x={12} y={72} width={7} height={7} rx={1} fill="var(--teal)" />
      <rect x={12} y={93} width={7} height={7} rx={1} fill="var(--dim)" />
      <g fontSize={7} fill="var(--dim)">
        <text x={24} y={36}>amber.500</text>
        <text x={24} y={57}>coral.500</text>
        <text x={24} y={78}>teal.400</text>
        <text x={24} y={99}>slate.400</text>
      </g>

      <g stroke="var(--line-2)" fill="none">
        <path d="M70 33 C 96 33, 96 44, 118 44" />
        <path d="M70 54 C 96 54, 96 65, 118 65" />
        <path d="M70 75 C 96 75, 96 86, 118 86" />
        <path d="M70 96 C 96 96, 96 65, 118 65" />
      </g>

      <rect x={118} y={36} width={76} height={16} rx={2} fill="var(--panel2)" stroke="var(--amber)" />
      <rect x={118} y={57} width={76} height={16} rx={2} fill="var(--panel2)" stroke="var(--line-2)" />
      <rect x={118} y={78} width={76} height={16} rx={2} fill="var(--panel2)" stroke="var(--line-2)" />
      <g fontSize={7} fill="var(--text)">
        <text x={124} y={47}>action.primary</text>
        <text x={124} y={68}>surface.raised</text>
        <text x={124} y={89}>text.muted</text>
      </g>

      <g stroke="var(--line-2)" fill="none">
        <path d="M194 44 C 216 44, 216 56, 236 56" />
        <path d="M194 65 C 216 65, 216 56, 236 56" />
        <path d="M194 86 C 216 86, 216 56, 236 56" />
      </g>

      <rect x={236} y={30} width={76} height={52} rx={3} fill="var(--panel)" stroke="var(--line-2)" />
      <rect x={244} y={40} width={40} height={12} rx={2} fill="var(--amber-fill)" />
      <rect x={244} y={58} width={60} height={4} rx={2} fill="var(--line-2)" />
      <rect x={244} y={67} width={44} height={4} rx={2} fill="var(--line-2)" />

      <text x={8} y={128} fontSize={7.5} fill="var(--faint)" letterSpacing={1}>
        {labels[3]}
      </text>

      <g fill="var(--panel)" stroke="var(--line-2)">
        <rect x={8} y={136} width={40} height={28} rx={3} />
        <rect x={54} y={136} width={40} height={28} rx={3} />
        <rect x={100} y={136} width={40} height={28} rx={3} />
        <rect x={146} y={136} width={40} height={28} rx={3} />
        <rect x={192} y={136} width={40} height={28} rx={3} />
        <rect x={238} y={136} width={40} height={28} rx={3} />
        <rect x={284} y={136} width={28} height={28} rx={3} strokeDasharray="3 3" />
      </g>
      {THEME_SWATCHES.map((color, i) => (
        <rect
          key={color}
          data-swatch="true"
          x={14 + i * 46}
          y={143}
          width={20}
          height={7}
          rx={1.5}
          fill={color}
        />
      ))}
      <g fill="var(--line-2)">
        <rect x={14} y={154} width={28} height={3} rx={1.5} />
        <rect x={60} y={154} width={28} height={3} rx={1.5} />
        <rect x={106} y={154} width={28} height={3} rx={1.5} />
        <rect x={152} y={154} width={28} height={3} rx={1.5} />
        <rect x={198} y={154} width={28} height={3} rx={1.5} />
        <rect x={244} y={154} width={28} height={3} rx={1.5} />
      </g>
      <text x={292} y={154} fontSize={9} fill="var(--faint)">
        +1
      </text>

      <text x={8} y={184} fontSize={7} fill="var(--faint)">
        {labels[4]}
      </text>
    </svg>
  )
}
