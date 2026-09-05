import { useLocale } from '@/i18n/LocaleProvider'

/** Stile in Nav.css (`footer.site`): questo componente non ha un CSS proprio. */
export function Footer() {
  const { copy } = useLocale()

  return (
    <div className="shell">
      <footer className="site">
        <span>{copy.footer.left}</span>
        <span>{copy.footer.right}</span>
      </footer>
    </div>
  )
}
