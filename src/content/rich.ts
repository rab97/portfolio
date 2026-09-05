export type RichKind = 'plain' | 'strong' | 'highlight'
export interface RichToken {
  kind: RichKind
  text: string
}

const PATTERN = /\*\*([^*]+)\*\*|\{([^}]+)\}/g

export function parseRich(text: string): RichToken[] {
  const tokens: RichToken[] = []
  let last = 0

  for (const match of text.matchAll(PATTERN)) {
    const index = match.index ?? 0
    if (index > last) tokens.push({ kind: 'plain', text: text.slice(last, index) })
    tokens.push(
      match[1] !== undefined
        ? { kind: 'strong', text: match[1] }
        : { kind: 'highlight', text: match[2] },
    )
    last = index + match[0].length
  }

  if (last < text.length) tokens.push({ kind: 'plain', text: text.slice(last) })
  return tokens
}
