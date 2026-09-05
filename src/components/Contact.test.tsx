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
