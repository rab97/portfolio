import { render, screen } from '@testing-library/react'
import { Rich } from './Rich'

test('rende i token forti dentro strong', () => {
  render(<Rich text="ecco **questo**" />)
  expect(screen.getByText('questo').tagName).toBe('STRONG')
})

test('rende i token evidenziati dentro mark', () => {
  render(<Rich text="sistemi che {reggono}" />)
  expect(screen.getByText('reggono').tagName).toBe('MARK')
})
