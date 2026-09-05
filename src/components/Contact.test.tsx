import { render, screen } from '@testing-library/react'
import { LocaleProvider } from '@/i18n/LocaleProvider'
import { Contact } from './Contact'
import { itContent } from '@/content/it'

test('ogni contatto è un link con href corretto', () => {
  render(
    <LocaleProvider locale="it">
      <Contact />
    </LocaleProvider>,
  )
  for (const link of itContent.contact.links) {
    expect(screen.getByRole('link', { name: new RegExp(link.value) })).toHaveAttribute(
      'href',
      link.href,
    )
  }
})

test('i link esterni si aprono in sicurezza', () => {
  render(
    <LocaleProvider locale="it">
      <Contact />
    </LocaleProvider>,
  )
  for (const anchor of screen.getAllByRole('link')) {
    if (anchor.getAttribute('href')?.startsWith('http')) {
      expect(anchor).toHaveAttribute('rel', expect.stringContaining('noopener'))
    }
  }
})

test('il nome accessibile di ogni link separa etichetta e valore', () => {
  // getByRole con `name` come RegExp fa una corrispondenza *parziale*: da
  // sola passerebbe anche se etichetta e valore fossero concatenati senza
  // separatore ("Emailciao@esempio.dev"), perché quella stringa contiene
  // comunque `link.value`. `toHaveAccessibleName` invece confronta per
  // uguaglianza esatta il nome accessibile completo (calcolato con lo
  // stesso algoritmo di uno screen reader), quindi non lascerebbe passare
  // la versione incollata.
  render(
    <LocaleProvider locale="it">
      <Contact />
    </LocaleProvider>,
  )
  for (const link of itContent.contact.links) {
    const anchor = screen.getByRole('link', { name: new RegExp(link.value) })
    expect(anchor).toHaveAccessibleName(`${link.label} ${link.value}`)
  }
})

test('la freccia di ogni riga è decorativa', () => {
  render(
    <LocaleProvider locale="it">
      <Contact />
    </LocaleProvider>,
  )
  for (const link of itContent.contact.links) {
    const anchor = screen.getByRole('link', { name: new RegExp(link.value) })
    const arrow = anchor.querySelector('[aria-hidden="true"]')
    expect(arrow).not.toBeNull()
    expect(arrow).toHaveTextContent(link.arrow)
  }
})
