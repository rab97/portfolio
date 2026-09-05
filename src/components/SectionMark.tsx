interface SectionMarkProps {
  /** Indice a due cifre della sezione, es. "01". Non viene dai contenuti:
   *  è un numero d'ordine fisso, uguale nelle due lingue, quindi lo passa
   *  il chiamante come letterale (vedi il mockup: 01 chi sono, 02
   *  competenze, 03 progetti, 04 percorso, 05 contatti). */
  index: string
  /** Etichetta tradotta della sezione, da `copy.<sezione>.mark`. */
  label: string
}

/** Marcatore ripetuto in testa a ogni sezione della home (chi sono,
 *  competenze, progetti, percorso, contatti): un indice, l'etichetta e una
 *  riga tratteggiata che riempie lo spazio restante. Generico apposta — non
 *  sa nulla della sezione che lo usa — perché lo riusano tutte.
 *
 *  Gli stili (`.sec-mark` e figli) sono già globali in
 *  src/theme/base.css, copiati dal mockup approvato: qui non serve un
 *  foglio di stile proprio. */
export function SectionMark({ index, label }: SectionMarkProps) {
  return (
    <div className="sec-mark">
      <b>{index}</b>
      <span>{label}</span>
      <hr />
    </div>
  )
}
