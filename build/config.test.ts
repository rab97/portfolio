import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { requireSiteUrl, resolveBase, hoistCharset, emitNotFoundShell } from './config.ts'

/** Le tre funzioni di build più il risolutore della base. Sono le uniche del
 *  repository che nessun test poteva raggiungere finché vivevano dentro
 *  `vite.config.ts`, ed è anche il codice che sbaglia nel modo peggiore: una
 *  build che *riesce* e produce un sito rotto. */

/** `vite.config.ts` imposta `test.env.VITE_SITE_URL` per i test dell'head:
 *  qui le variabili si manipolano a mano, quindi vanno rimesse come stavano. */
function withEnv(vars: Record<string, string | undefined>, body: () => void): void {
  const previous: Record<string, string | undefined> = {}
  for (const [key, value] of Object.entries(vars)) {
    previous[key] = process.env[key]
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }
  try {
    body()
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  }
}

describe('requireSiteUrl', () => {
  test('solleva quando la variabile manca', () => {
    withEnv({ VITE_SITE_URL: undefined }, () => {
      expect(() => requireSiteUrl()).toThrow(/VITE_SITE_URL/)
    })
  })

  test('solleva anche quando è impostata a vuoto o a soli spazi', () => {
    // Una variabile di repository lasciata vuota per sbaglio non è diversa da
    // una dimenticata: entrambe producono metadati relativi.
    withEnv({ VITE_SITE_URL: '' }, () => {
      expect(() => requireSiteUrl()).toThrow(/VITE_SITE_URL/)
    })
    withEnv({ VITE_SITE_URL: '   ' }, () => {
      expect(() => requireSiteUrl()).toThrow(/VITE_SITE_URL/)
    })
  })

  test('restituisce il valore, ripulito, quando c’è', () => {
    withEnv({ VITE_SITE_URL: '  https://rab97.github.io  ' }, () => {
      expect(requireSiteUrl()).toBe('https://rab97.github.io')
    })
  })
})

describe('resolveBase', () => {
  test('solleva in build quando la variabile manca', () => {
    // È il caso che il README prometteva e che nessuno controllava: senza
    // VITE_BASE la build riusciva e pubblicava una pagina bianca.
    withEnv({ VITE_BASE: undefined }, () => {
      expect(() => resolveBase('build')).toThrow(/VITE_BASE/)
    })
  })

  test('non solleva in build quando c’è, e la usa così com’è', () => {
    withEnv({ VITE_BASE: '/portfolio/' }, () => {
      expect(resolveBase('build')).toBe('/portfolio/')
    })
  })

  test('impostata a vuoto vale la radice: è la forma documentata per un dominio proprio', () => {
    withEnv({ VITE_BASE: '' }, () => {
      expect(resolveBase('build')).toBe('/')
    })
    withEnv({ VITE_BASE: '  ' }, () => {
      expect(resolveBase('build')).toBe('/')
    })
  })

  test('in sviluppo la variabile resta facoltativa', () => {
    withEnv({ VITE_BASE: undefined }, () => {
      expect(resolveBase('serve')).toBe('/')
    })
  })
})

describe('hoistCharset', () => {
  const HEAVY = `<title>${'x'.repeat(1200)}</title>`

  test('rimette il charset per primo, prima dei mille byte di meta', () => {
    const html = `<!doctype html><html><head>${HEAVY}<meta charset="UTF-8"></head><body></body></html>`
    const out = hoistCharset(html)

    expect(out.indexOf('<meta charset="UTF-8">')).toBe(out.indexOf('<head>') + '<head>'.length)
    // Uno solo: l'originale è stato rimosso, non duplicato.
    expect(out.match(/<meta\s+charset=/gi)).toHaveLength(1)
  })

  test('inserisce prima di rimuovere: non lascia mai una pagina senza charset', () => {
    // L'ordine delle due sostituzioni è la garanzia: se la rimozione venisse
    // prima e l'inserimento fallisse, resterebbe una pagina senza charset.
    // Qui si verifica sull'esito, che è l'unica cosa osservabile: comunque sia
    // fatto l'HTML in ingresso, in uscita un charset c'è.
    const cases = [
      `<html><head>${HEAVY}<meta charset="UTF-8"></head></html>`,
      `<html><head lang="it" data-x="1">${HEAVY}<meta charset="utf-8" /></head></html>`,
      `<html><head>${HEAVY}</head></html>`,
      `<html><HEAD>${HEAVY}<META CHARSET="UTF-8"></HEAD></html>`,
    ]
    for (const html of cases) {
      expect(hoistCharset(html)).toMatch(/<meta\s+charset=/i)
    }
  })

  test('con un head che ha attributi li conserva e non duplica il charset', () => {
    const html = `<html><head data-build="1">${HEAVY}<meta charset="UTF-8"></head></html>`
    const out = hoistCharset(html)

    expect(out).toContain('<head data-build="1"><meta charset="UTF-8">')
    expect(out.match(/<meta\s+charset=/gi)).toHaveLength(1)
  })

  test('senza un head a cui agganciarsi restituisce l’HTML intatto', () => {
    const html = '<html><body><p>niente head</p></body></html>'
    expect(hoistCharset(html)).toBe(html)
  })
})

describe('emitNotFoundShell', () => {
  test('scrive un 404.html identico all’indice', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'portfolio-dist-'))
    try {
      const index = '<!doctype html><html><head><meta charset="UTF-8"></head><body>guscio</body></html>'
      await writeFile(join(dir, 'index.html'), index, 'utf8')

      await emitNotFoundShell(dir)

      expect(await readFile(join(dir, '404.html'), 'utf8')).toBe(index)
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })

  test('solleva se l’indice non c’è, invece di lasciare la dist senza 404', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'portfolio-dist-'))
    try {
      await expect(emitNotFoundShell(dir)).rejects.toThrow()
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })
})
