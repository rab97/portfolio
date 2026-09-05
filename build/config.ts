import { fileURLToPath, URL } from 'node:url'
import { copyFile } from 'node:fs/promises'
import { isAbsolute, join } from 'node:path'

/** Funzioni di build estratte da `vite.config.ts`.
 *
 *  Stanno qui e non lì per una ragione sola: sono logica, non
 *  configurazione. Decidono se la build si ferma quando deve, se l'HTML
 *  emesso è ben formato e se la pagina 404 di produzione esiste — tre cose
 *  che si scoprono rotte in produzione e mai in sviluppo. Un modulo
 *  separato è un modulo importabile da un test (`build/config.test.ts`);
 *  dentro `vite.config.ts` sarebbero raggiungibili solo eseguendo una build
 *  intera e guardando cosa ne esce. */

/** `og:url`, `canonical` e `hreflang` devono essere assoluti e
 *  fully-qualified, altrimenti scraper social e Google li ignorano — cioè
 *  esattamente ciò per cui esiste il pre-rendering. È un dato che il codice
 *  non può indovinare, quindi la build si ferma finché non gliela si dà: un
 *  `og:url` sbagliato si scopre quando qualcuno condivide il link e vede
 *  l'anteprima rotta, cioè troppo tardi. */
export function requireSiteUrl(): string {
  const value = process.env.VITE_SITE_URL?.trim()
  if (!value) {
    throw new Error(
      'VITE_SITE_URL non è impostata: senza, og:url, canonical e hreflang delle pagine\n' +
        'pre-renderizzate sarebbero relativi e gli scraper social li ignorerebbero.\n' +
        '  In deploy:  VITE_SITE_URL=https://dominio.esempio npm run build\n' +
        '  In locale:  VITE_SITE_URL=http://localhost:4173 npm run build',
    )
  }
  return value
}

/** La base da cui il sito è servito. In build è obbligatoria quanto
 *  `VITE_SITE_URL`, e per lo stesso motivo: il valore di ripiego `/` produce
 *  una build che *riesce* e che in produzione è una pagina bianca, perché
 *  ogni `<script>` e ogni `<link>` puntano alla radice del dominio invece
 *  che a `/<nome-repo>/`. Un errore che riesce è peggio di un errore che
 *  fallisce: non lo vede nessuno finché non lo vede un visitatore.
 *
 *  Impostata ma vuota è invece una scelta legittima e documentata (README,
 *  "Collegare un dominio proprio": con un dominio proprio il sito è servito
 *  dalla radice). Vuota significa `/`, e la distinzione fra "non impostata"
 *  e "impostata a vuoto" è tutta la differenza fra una dimenticanza e una
 *  decisione — per questo il controllo guarda `undefined` e non la
 *  verità/falsità della stringa. */
export function resolveBase(command: 'build' | 'serve'): string {
  const raw = process.env.VITE_BASE
  if (raw === undefined) {
    if (command === 'build') {
      throw new Error(
        'VITE_BASE non è impostata: senza, gli asset della build puntano alla radice del\n' +
          'dominio invece che alla sottocartella da cui il sito è servito, e su GitHub Pages\n' +
          'la pagina resta bianca (nessuno script si carica).\n' +
          '  Su GitHub Pages:  VITE_BASE=/<nome-repo>/ npm run build\n' +
          '  Su dominio proprio (sito servito dalla radice):  VITE_BASE= npm run build',
      )
    }
    return '/'
  }
  const value = raw.trim()
  return value === '' ? '/' : value
}

/** vite-react-ssg inserisce title e meta in cima a `<head>`, spingendo il
 *  charset del template oltre i primi 1024 byte: lì il browser smette di
 *  cercarlo e i trattini lunghi e le accentate diventano illeggibili. Lo si
 *  rimette per primo a pagina resa.
 *
 *  L'inserimento viene prima della rimozione, e se non c'è un `<head>` a cui
 *  agganciarsi l'HTML torna intatto: una pagina col charset nel posto
 *  sbagliato è comunque meglio di una senza. */
export function hoistCharset(html: string): string {
  const withCharset = html.replace(/<head([^>]*)>/i, '<head$1><meta charset="UTF-8">')
  if (withCharset === html) return html
  return withCharset.replace(
    /(<head[^>]*><meta charset="UTF-8">)([\s\S]*?)\s*<meta\s+charset="[^"]*"\s*\/?>/i,
    '$1$2',
  )
}

/** Il pre-rendering copre le rotte che esistono. Quelle che non esistono —
 *  uno slug sbagliato, un vecchio link, un refuso — non hanno un file, e su
 *  un hosting statico un URL senza file è la fine del discorso: GitHub Pages
 *  risponde con la propria pagina d'errore, non con la nostra, e il router
 *  non entra mai in gioco perché nessun JavaScript del sito viene caricato.
 *
 *  `404.html` alla radice è la convenzione con cui GitHub Pages lascia
 *  rispondere l'applicazione: lo serve per qualunque percorso che non trova.
 *  Copiandoci il guscio della radice, un URL sconosciuto carica comunque
 *  l'app, e il router rende la pagina non trovata nella lingua del percorso
 *  chiesto (`/it/...` sta dentro le rotte italiane).
 *
 *  Il markup pre-renderizzato dentro quel file è quello della radice, quindi
 *  React trova un disallineamento in idratazione e ricostruisce lato client.
 *  Su una pagina d'errore è un prezzo accettabile: è l'unica pagina del sito
 *  di cui non si può conoscere l'URL in anticipo, quindi l'unica che non si
 *  può pre-renderizzare. Tutte le altre restano statiche.
 *
 *  Va fatto qui e non copiando un file a mano in un workflow: il guscio
 *  cambia a ogni build (gli hash degli asset ci sono dentro), e una copia
 *  fatta altrove si stantisce senza dirlo. */
export async function emitNotFoundShell(outDir: string): Promise<void> {
  // La radice si calcola solo se serve davvero, cioè se `outDir` è relativo:
  // `import.meta.url` è un `file:` URL sotto Node ma non sotto il runner dei
  // test, e risolverlo comunque renderebbe questa funzione impossibile da
  // esercitare con una directory temporanea.
  const dir = isAbsolute(outDir)
    ? outDir
    : join(fileURLToPath(new URL('../', import.meta.url)), outDir)
  await copyFile(join(dir, 'index.html'), join(dir, '404.html'))
}
