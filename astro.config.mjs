import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { posts } from './src/data/blog.ts';
import { site } from './src/data/site.ts';

import cloudflare from '@astrojs/cloudflare';

const draftPaths = posts.filter((post) => post.draft).map((post) => `/es/blog/${post.slug}/`);
const samplePaths = site.sampleData ? ['/es/inmueble/', '/es/venta/'] : [];
const hiddenPaths = ['/privacidad/', '/estilo/', '/guardados/', '/admin/', ...draftPaths, ...samplePaths];

export default defineConfig({
  site: 'https://conromaasesores.com',
  trailingSlash: 'always',
  redirects: {
    '/': '/es/',
    // El simulador de hipoteca se sustituyó por la calculadora de "¿puedo comprar?".
    '/es/comprar/simulador-hipoteca/': '/es/comprar/puedo-comprar/',
  },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  build: { inlineStylesheets: 'auto' },
  integrations: [react(), sitemap({ filter: (page) => !hiddenPaths.some((path) => page.includes(path)) })],
  // worker.format 'es' para que Vite emita bien el web worker de maplibre-gl.
  // ssr.noExternal: evita el error intermitente del optimizador SSR de Vite en `astro dev`.
  vite: {
    plugins: [tailwindcss()],
    worker: { format: 'es' },
    ssr: { noExternal: ['@nanostores/react'] },
  },
  adapter: cloudflare(),
});