# Conroma Asesores — web

Astro (salida estática) + islas React + Tailwind 4 + GSAP + Motion.

## Comandos

- `npm run dev` — desarrollo en local
- `npm run build` — comprueba tipos y genera `dist/`
- `npm run preview` — sirve `dist/`
- `npm test` — pruebas de `src/lib`

## Dónde está cada cosa

- `src/data/site.ts` — datos de Conroma. Un dato en `null` oculta su bloque en la web.
- `src/data/properties.sample.json` — pisos de ejemplo. Con `sampleData: true` la web lo avisa arriba.
- `src/lib/seo.ts` — títulos, canonical, hreflang y datos estructurados.
- `src/lib/links.ts` — enlaces `wa.me` y `tel:` con el mensaje ya escrito.
- `src/styles/tokens.css` — colores, tipografía, radios y vidrio.

Diseño y alcance: `../conroma-prototipo/docs/superpowers/specs/2026-10-12-conroma-web-concepto3-design.md`.
