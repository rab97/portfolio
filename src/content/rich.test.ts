import { parseRich } from './rich'

test('testo semplice produce un solo token', () => {
  expect(parseRich('ciao mondo')).toEqual([{ kind: 'plain', text: 'ciao mondo' }])
})

test('**testo** produce un token forte', () => {
  expect(parseRich('ecco **questo** qui')).toEqual([
    { kind: 'plain', text: 'ecco ' },
    { kind: 'strong', text: 'questo' },
    { kind: 'plain', text: ' qui' },
  ])
})

test('{testo} produce un token evidenziato', () => {
  expect(parseRich('sistemi che {reggono}.')).toEqual([
    { kind: 'plain', text: 'sistemi che ' },
    { kind: 'highlight', text: 'reggono' },
    { kind: 'plain', text: '.' },
  ])
})

test('i due marcatori convivono nella stessa stringa', () => {
  expect(parseRich('**A** e {B}')).toEqual([
    { kind: 'strong', text: 'A' },
    { kind: 'plain', text: ' e ' },
    { kind: 'highlight', text: 'B' },
  ])
})

test('un marcatore non chiuso resta testo semplice', () => {
  expect(parseRich('due ** stelle')).toEqual([{ kind: 'plain', text: 'due ** stelle' }])
})
