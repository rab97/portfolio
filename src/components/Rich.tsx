import { Fragment } from 'react'
import { parseRich } from '@/content/rich'

export function Rich({ text }: { text: string }) {
  return (
    <>
      {parseRich(text).map((token, i) => {
        if (token.kind === 'strong') return <strong key={i}>{token.text}</strong>
        if (token.kind === 'highlight') return <mark key={i}>{token.text}</mark>
        return <Fragment key={i}>{token.text}</Fragment>
      })}
    </>
  )
}
