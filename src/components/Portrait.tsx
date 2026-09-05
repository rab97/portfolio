interface PortraitProps {
  /** Testo alternativo, da `copy.meta.portraitAlt`. */
  alt: string
}

/** Ritratto della sezione "chi sono".
 *
 *  Non esiste ancora una foto reale, quindi l'unica sorgente è
 *  `public/portrait.svg`: un placeholder 480×600 coerente con la direzione
 *  visiva (griglia sottile + sigla in IBM Plex Mono), non una foto vera.
 *
 *  Quando la foto arriverà: aggiungere prima dell'`<img>` le sorgenti
 *  `<source type="image/avif" srcSet="/portrait.avif" />` e
 *  `<source type="image/webp" srcSet="/portrait.webp" />`, sostituire il
 *  `src` dell'`<img>` con il formato di ripiego reale (es. `/portrait.jpg`)
 *  e togliere `public/portrait.svg`. Non prima: un `<source>` che punta a
 *  un file assente fa fallire il caricamento dell'immagine in silenzio. */
export function Portrait({ alt }: PortraitProps) {
  return (
    <picture>
      <img
        src="/portrait.svg"
        width={480}
        height={600}
        loading="lazy"
        decoding="async"
        alt={alt}
      />
    </picture>
  )
}
