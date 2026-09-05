/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
// Solo per l'augmentation di `UserConfig` che aggiunge `ssgOptions`.
import type {} from 'vite-react-ssg'

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/',
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  ssgOptions: {
    // `/it/progetti/<slug>/index.html` invece di `/it/progetti/<slug>.html`:
    // gli URL restano con la barra finale su qualsiasi hosting statico.
    dirStyle: 'nested',
    // Le pagine dinamiche arrivano dai getStaticPaths delle rotte.
    includeAllRoutes: false,
    // vite-react-ssg inserisce title e meta in cima a <head>, spingendo il
    // charset dell'index oltre i primi 1024 byte: lì il browser smette di
    // cercarlo e i trattini lunghi e le accentate diventano illeggibili.
    // Lo si rimette per primo a pagina resa.
    onPageRendered: (_route, html) =>
      html
        .replace(/\s*<meta\s+charset="[^"]*"\s*\/?>/i, '')
        .replace('<head>', '<head><meta charset="UTF-8">'),
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    css: true,
  },
})
