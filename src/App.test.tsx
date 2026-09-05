import { render, screen } from '@testing-library/react'
import App from './App'

test('rende un landmark main', () => {
  render(<App />)
  expect(screen.getByRole('main')).toBeInTheDocument()
})
