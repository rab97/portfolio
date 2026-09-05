interface PortraitProps {
  /** Testo alternativo, da `copy.meta.portraitAlt`. */
  alt: string
}

/** Colonne e righe della griglia del segnaposto, in un viewBox 480×600. */
const GRID_X = [80, 160, 240, 320, 400]
const GRID_Y = [80, 160, 240, 320, 400, 480, 520]

/** Ritratto della sezione "chi sono".
 *
 *  Non esiste ancora una foto reale: il segnaposto è un SVG *in linea* nel
 *  DOM, non un file caricato via `<img src>`. Un'immagine referenziata da
 *  `<img>` vive in un documento isolato e non eredita le custom property
 *  di `src/theme/tokens.css` — un primo tentativo con un file SVG esterno
 *  restava scuro anche in tema chiaro, perché i suoi `var(--token)` non
 *  avevano nulla a cui agganciarsi. In linea, invece, il segnaposto fa
 *  parte del documento della pagina: eredita i token dal `:root` come
 *  qualunque altro elemento e cambia colore da solo col tema, senza
 *  JavaScript.
 *
 *  Il testo alternativo resta esposto a chi usa uno screen reader:
 *  `role="img"` + `aria-label` stanno sull'`<svg>` stesso (non su un
 *  elemento muto), e il disegno interno è `aria-hidden`.
 *
 *  Quando arriverà la foto vera, il corpo di questa funzione va sostituito
 *  con:
 *    <picture>
 *      <source type="image/avif" srcSet="/portrait.avif" />
 *      <source type="image/webp" srcSet="/portrait.webp" />
 *      <img
 *        src="/portrait.jpg"
 *        width={480}
 *        height={600}
 *        loading="lazy"
 *        decoding="async"
 *        alt={alt}
 *      />
 *    </picture>
 *  La firma del componente («{ alt }» in ingresso, un unico elemento reso)
 *  non cambia: è una sostituzione del corpo, non una riscrittura di chi
 *  chiama `<Portrait />`. Non aggiungere le sorgenti avif/webp prima che
 *  quei file esistano: un `<source>` che punta a un file assente fa
 *  fallire il caricamento in silenzio. */
export function Portrait({ alt }: PortraitProps) {
  return (
    <svg
      className="portrait-placeholder"
      role="img"
      aria-label={alt}
      viewBox="0 0 480 600"
      width={480}
      height={600}
    >
      <rect width={480} height={600} fill="var(--panel)" />
      <g stroke="var(--line-2)" strokeWidth={1} aria-hidden="true">
        {GRID_X.map((x) => (
          <line key={`x${x}`} x1={x} y1={0} x2={x} y2={600} />
        ))}
        {GRID_Y.map((y) => (
          <line key={`y${y}`} x1={0} y1={y} x2={480} y2={y} />
        ))}
      </g>
      <text
        x={240}
        y={300}
        fill="var(--faint)"
        fontFamily="var(--mono)"
        fontSize={64}
        fontWeight={600}
        letterSpacing={2}
        textAnchor="middle"
        dominantBaseline="middle"
        aria-hidden="true"
      >
        FR
      </text>
    </svg>
  )
}
