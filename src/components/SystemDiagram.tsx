import { Fragment } from 'react'

interface SystemDiagramProps {
  title: string
  badge: string
  nodes: string[]
}

/** Riga di nodi collegati da `.wire`, con l'animazione di flusso CSS
 *  sfasata (in Hero.css). Il secondo nodo prende la classe `cool`, il terzo
 *  `hot`, come nel mockup. */
export function SystemDiagram({ title, badge, nodes }: SystemDiagramProps) {
  return (
    <>
      <div className="diagram-head">
        <span>{title}</span>
        <span>{badge}</span>
      </div>
      <div className="flowline">
        {nodes.map((node, i) => (
          <Fragment key={node}>
            {i > 0 && <span className="wire" />}
            <span className={i === 1 ? 'node cool' : i === 2 ? 'node hot' : 'node'}>{node}</span>
          </Fragment>
        ))}
      </div>
    </>
  )
}
