/** Contratto comune a tutti i quattro schemi SVG dei progetti.
 *
 *  `label` è la descrizione per gli screen reader (finisce in `aria-label`
 *  sull'`<svg>`, distinta dalle etichette disegnate al suo interno).
 *  `labels` sono le etichette di testo disegnate dentro lo schema, prese da
 *  `project.schemaLabels`: l'ordine è deciso dal contenuto (vedi il commento
 *  in cima a ciascun componente) e il componente le consuma per indice. */
export interface SchemaProps {
  label: string
  labels: string[]
}
