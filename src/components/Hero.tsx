import { useLocale } from '@/i18n/LocaleProvider'
import { Rich } from '@/components/Rich'
import { MagneticButton } from '@/components/MagneticButton'
import { SystemDiagram } from '@/components/SystemDiagram'
import { Metric } from '@/components/Metric'
import { SECTION_IDS } from '@/components/sections'
import './Hero.css'

/** Come nel mockup: ogni metrica parte 110ms dopo la precedente. */
const METRIC_STAGGER_MS = 110

/** La sezione a cui porta la CTA: `SECTION_IDS[2]` ("work"), lo stesso
 *  identificatore che `Work.tsx` mette sul proprio `id` e che `Nav.tsx` usa
 *  per il link "progetti". Non una stringa scritta a mano: un id copiato a
 *  mano che smette di combaciare è un bottone morto silenzioso, ed è già
 *  successo una volta. */
const WORK_SECTION = SECTION_IDS[2]

/** Il click su "vedi i progetti" porta alla sezione progetti. Sta fuori dal
 *  render, dove `document` esiste per definizione: il pre-rendering non
 *  clicca niente. L'animazione e lo scarto sotto la barra fissa non sono
 *  qui ma in CSS (`scroll-behavior` e `scroll-margin-top` in
 *  `src/theme/base.css`), così lo stesso comportamento vale anche per i
 *  cinque link del menu, che sono ancore vere e non passano da qui. */
function scrollToWork() {
  document.getElementById(WORK_SECTION)?.scrollIntoView()
}

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

        {/* Una sola CTA. La seconda era "scarica il CV": è stata tolta
            perché non c'è un PDF pubblicabile (vedi README, "Riattivare il
            CV") — un bottone che promette un file inesistente è peggio di
            un bottone che non c'è. */}
        <div className="hero-actions">
          <MagneticButton variant="solid" onClick={scrollToWork}>
            {hero.ctaPrimary}
          </MagneticButton>
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
