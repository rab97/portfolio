import { useLocale } from '@/i18n/LocaleProvider'
import { Rich } from '@/components/Rich'
import { MagneticButton } from '@/components/MagneticButton'
import { SystemDiagram } from '@/components/SystemDiagram'
import { Metric } from '@/components/Metric'
import './Hero.css'

/** Come nel mockup: ogni metrica parte 110ms dopo la precedente. */
const METRIC_STAGGER_MS = 110

/** L'hero della home: il momento più visibile del sito, e quello con tutte
 *  le animazioni della direzione visiva. Non ha un `id` di sezione: non è
 *  fra le sezioni a cui punta il menu (vedi src/components/sections.ts). */
export function Hero() {
  const { copy } = useLocale()
  const { hero } = copy

  return (
    <section className="hero">
      <div className="orb orb-a" aria-hidden="true" />
      <div className="orb orb-b" aria-hidden="true" />
      <div className="orb orb-c" aria-hidden="true" />

      <div className="shell">
        <p className="hero-prompt">
          $ <em>{hero.prompt}</em>
          <span className="caret" aria-hidden="true" />
        </p>

        <h1>
          <Rich text={hero.headline} />
        </h1>

        <p className="hero-sub">
          <Rich text={hero.sub} />
        </p>

        <div className="hero-actions">
          <MagneticButton variant="solid">{hero.ctaPrimary}</MagneticButton>
          <MagneticButton variant="ghost">{hero.ctaSecondary}</MagneticButton>
        </div>

        <div className="diagram">
          <SystemDiagram title={hero.diagramTitle} badge={hero.diagramBadge} nodes={hero.nodes} />

          <div className="metrics">
            {hero.metrics.map((metric, i) => (
              <Metric
                key={metric.label}
                value={metric.value}
                label={metric.label}
                delayMs={i * METRIC_STAGGER_MS}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
