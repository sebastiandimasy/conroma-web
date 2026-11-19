import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { posts } from './src/data/blog.ts';
import { site } from './src/data/site.ts';
import { getListings, propertySlug } from './src/data/properties.ts';
import { injectLegacyRules, legacyRedirectRules } from './src/lib/legacy-redirects.ts';
import { languages, localizePath } from './src/i18n/index.ts';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import cloudflare from '@astrojs/cloudflare';

const draftPaths = posts.filter((post) => post.draft).map((post) => `/es/blog/${post.slug}/`);
// El catálogo entra al sitemap cuando se marca indexable (bandera independiente
// del aviso de 'web en construcción' que controla `sampleData`).
const samplePaths = site.catalogIndexable ? [] : ['/es/inmueble/', '/es/venta/'];
// Una ficha sin fotos lleva `noindex` (ver src/pages/es/inmueble/[slug].astro), asi que
// tampoco puede estar en el sitemap: pedirle a Google que rastree una URL que luego le
// dice "no me indexes" es una senal contradictoria. Hoy son 8 de 126.
const photolessPaths = site.catalogIndexable
  ? getListings()
      .filter((property) => !property.images || property.images.length === 0)
      .map((property) => `/es/inmueble/${propertySlug(property)}/`)
  : [];
// 301 de cada ficha antigua (/detalle/.../<id>) a su ficha nueva, escritas en el .htaccess del build.
const legacyRedirects = {
  name: 'conroma-legacy-redirects',
  hooks: {
    'astro:build:done': ({ dir }) => {
      const file = fileURLToPath(new URL('.htaccess', dir));
      const rules = legacyRedirectRules(getListings(), propertySlug);
      writeFileSync(file, injectLegacyRules(readFileSync(file, 'utf8'), rules));
    },
  },
};
// Las rutas se escriben en español y se ocultan en los tres idiomas.
const hiddenPaths = ['/estilo/', '/guardados/', ...[...draftPaths, ...samplePaths, ...photolessPaths].flatMap((path) => languages.map((lang) => localizePath(path, lang)))];

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
  integrations: [react(), legacyRedirects, sitemap({
      filter: (page) => !hiddenPaths.some((path) => page.includes(path)),
      // Cada URL del sitemap lista sus versiones en los tres idiomas (xhtml:link hreflang).
      i18n: { defaultLocale: 'es', locales: { es: 'es', en: 'en', ca: 'ca' } },
    })],
  // worker.format 'es' para que Vite emita bien el web worker de maplibre-gl.
  // ssr.noExternal: evita el error intermitente del optimizador SSR de Vite en `astro dev`.
  vite: {
    plugins: [tailwindcss()],
    worker: { format: 'es' },
    ssr: { noExternal: ['@nanostores/react'] },
  },
  adapter: cloudflare(),
});