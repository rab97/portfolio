import { useLocale } from '@/i18n/LocaleProvider'
import { Rich } from '@/components/Rich'
import { SectionMark } from '@/components/SectionMark'
import { SECTION_IDS } from '@/components/sections'
import './Contact.css'

/** Sezione "contatti", ultima della home. L'`id` è `SECTION_IDS[4]`
 *  ("contact"), non l'etichetta tradotta del marcatore — è a quell'id che
 *  punta il link "contatti"/"contact" del menu (vedi
 *  src/components/sections.ts).
 *
 *  Ogni riga di `contact.links` è un'ancora completa (etichetta, valore,
 *  freccia). La freccia (`→` per i profili, `↓` per lo scaricamento del
 *  CV) è puramente decorativa — la stessa informazione (dove porta il
 *  link) è già nel testo — quindi è marcata `aria-hidden`. I link verso
 *  domini esterni si aprono in una scheda nuova con `rel="noopener
 *  noreferrer"`: `noopener` evita che la pagina aperta possa manipolare
 *  `window.opener`, `noreferrer` in più sopprime l'header Referer. */
export function Contact() {
  const { copy } = useLocale()
  const { contact } = copy

  return (
    <section className="sec" id={SECTION_IDS[4]}>
      <div className="shell">
        <SectionMark index="05" label={contact.mark} />

        <div className="contact">
          <div>
            <h2>
              <Rich text={contact.title} />
            </h2>
            <p className="contact-note">{contact.note}</p>
          </div>

          <div className="links">
            {contact.links.map((link) => {
              const external = link.href.startsWith('http')
              return (
                <a
                  key={link.label}
                  href={link.href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <i>{link.label}</i>
                  <span>{link.value}</span>
                  <s aria-hidden="true">{link.arrow}</s>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
