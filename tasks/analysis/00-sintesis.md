# Síntesis — Estrategia digital Conroma (web + SEO + ads + RRSS + marca)

> Integra los 5 análisis del equipo (`01`–`05`). Documento de estrategia; no toca código de la app.
> Norma vinculante: `ESTANDAR.md`. Plan de ejecución: `tasks/plan.md` + `tasks/todo.md`.

## 1. La esencia de marca (el eje de todo)

**"Aquí no hablas con un portal: te lleva una persona del pueblo, en tu idioma, y te dice la verdad
aunque pierda la venta."**

Arquetipo: el **Vecino honesto**. Se posiciona contra los portales (un buscador sin nadie que
responda) y contra las grandes cadenas (lujo que te trata como expediente). Cuatro promesas
**verificables**: persona con nombre · 4 idiomas (CA/ES/EN/FR) · mismo responsable de principio a fin ·
franqueza. Escala como **masterbrand monolítica con descriptor geográfico** (Conroma — Malgrat,
Conroma — Barcelona), nunca submarcas: lo que escala es la persona con nombre, no la oficina.

Todo lo demás —web, SEO, ads, RRSS— es esta frase hecha operativa.

## 2. El patrón que repiten los 5 informes: tres cimientos bloquean todo lo demás

Los cinco frentes, trabajando por separado, apuntaron a los **mismos tres cuellos de botella**.
Ninguna táctica (campañas, contenido, programmatic SEO) rinde hasta que estén resueltos.

### Cimiento A — Medición (lo piden paid media y RRSS)
El sitio ya tiene cableados `data-contact` / `data-origin` (14 valores) / `data-ref` en todos los
CTA, y `wa.me` lleva mensaje escrito por motivo. **Pero no hay ningún script de analítica**: ni GA4,
ni Meta Pixel/CAPI, ni un listener que lea esos `data-*`. Sin esto, **ninguna campaña ni post puede
optimizar a conversión** y no se cierra la atribución Click-to-WhatsApp.
→ Instalar GA4 + Meta Pixel + CAPI + listener de `data-*` + Consent Mode v2 + UTM dentro del mensaje
de WhatsApp. **Es el paso 0 de ads y de RRSS.**

### Cimiento B — Datos reales de inventario (lo piden arquitectura y SEO)
Dos caras del mismo problema:
- **Arquitectura**: las páginas e islas importan `properties`/`propertiesIn` directo; no existe la
  costura `getListings/getListing` (plan §1.4). Pasar del sample al feed de Habitatsoft obligaría a
  tocar cada página.
- **SEO**: con `sampleData: true` el sitio está (correctamente) casi todo en `noindex`. **El valor
  SEO está congelado hasta tener inventario real.** Es el cuello de botella principal de SEO.
→ Construir la costura `getListings` + plan de sustitución del sample por el feed Habitatsoft.
Desbloquea escala e indexación a la vez.

### Cimiento C — Datos reales de marca/personas (lo piden marca y SEO)
La esencia es "personas con nombre y datos concretos", pero en `site.ts` están en `null` justo esos
campos: `agent: null`, `ceo.bioPending: true` (3 "[Pendiente]"), `yearsActive: null`,
`feePercent: null`, `geo: null`. Y el blog son 3 borradores sin publicar. Esto hunde el E-E-A-T
(YMYL) y vacía la promesa de marca.
→ Completar bio real de Boris, autoría y fecha en los posts, años de trayectoria, comisión real,
geo, y publicar el blog. **Dato real siempre; sin fuente, no se publica** (regla del usuario).

## 3. El chasis escalable (una vez puestos los cimientos)

- **Design system**: hoy son clases BEM sueltas sobre ~4.080 líneas de CSS, sin primitivas. Extraer
  `Section` / `Button` / `MediaCard` y formalizar tokens de espaciado/movimiento (los de color ya son
  maduros). Guía viva en `/es/estilo/`. → Fase 0 del plan.
- **Modelo geo/locale**: `Town` es plano (sin `tier`/`parent`); `src/lib/locales` **no existe** (los
  locales viven inline en `seo.ts`); faltan rutas `alquiler/[town]` y nivel ciudad. → Fase 1 del plan.
- **Rendimiento**: las fotos de piso en `public/img/pisos/` **no pasan por `astro:assets`** → riesgo
  nº1 de LCP/CLS al escalar. Migrarlas al pipeline de imagen. (Deuda que introduje yo por rapidez.)

## 4. Deudas concretas ya detectadas (quick wins, baratas)

- `index.astro`: cifra prohibida **"+500 clientes satisfechos"** sigue viva; el dato real es **107
  reseñas** (regla `ESTANDAR §2`).
- **21 hex literales** fuera de `tokens.css` (18 en sections.css, 3 en property.css) + 4 en index.astro.
- `tokens.css` define una **4ª fuente** no declarada (`--font-display: Helvetica Neue`): documentarla
  como neutral de sistema o apuntarla a Hanken.
- `about` conserva la cola aspiracional ("la vivienda que siempre has deseado") que `ESTANDAR §2`
  manda cortar.
- Schema: añadir `sameAs` (IG×2 + TikTok), `openingHours`, `priceRange`, `geo` real; verificar que
  comprar/vender/alquilar emitan su `faqSchema`. Mantener la decisión (testada) de NO autodeclarar
  `aggregateRating`.
- Publicar los 3 posts del blog (hoy `draft`) + firma de autor/fecha.

## 5. Roadmap unificado (orden recomendado)

**FASE 0 · Cimientos transversales** (desbloquean todo; hacer primero)
0.1 Medición: GA4 + Pixel + CAPI + listener `data-*` + Consent Mode v2 + UTM en WhatsApp. *(ads+RRSS)*
0.2 Costura de datos `getListings/getListing` delante del sample. *(arquitectura+SEO)*
0.3 Datos reales de marca: bio de Boris, años, comisión, geo, autoría del blog. *(marca+SEO)*
0.4 Quick wins de deuda: quitar "+500", publicar blog, `sameAs`/`openingHours` en schema.

**FASE 1 · Chasis escalable**
1.1 Design system (primitivas + guía `/es/estilo/`) · 1.2 Modelo geo con `tier` + `src/lib/locales` +
taxonomía URL · 1.3 Migrar fotos a `astro:assets`.

**FASE 2 · Auditoría por wireframes** (sección a sección, criterio de conversión) → ya en el plan.

**FASE 3 · Aplicar DS + corregir embudos** sección por sección.

**FASE 4 · Escalado de negocio** local → Barcelona → Cataluña/España → internacional, cada fase con:
- **Web**: territorios nuevos como dato (reutilizan plantilla) + fotos por `astro:assets`.
- **SEO**: página de pueblo/ciudad **solo con dato propio real** (€/m², inventario del feed), nunca
  plantilla vacía; clusters + GEO/AEO (llms.txt, datos citables, autoría).
- **Ads**: Search por pueblo + marca; Meta Click-to-WhatsApp + retargeting; presupuestos recalibrados
  con CPC/CPL reales ya medidos.
- **RRSS**: 5 pilares (antes/después, tour, consejo local, equipo/pueblo, prueba social); localizar
  pie/idioma/hashtag/enlace, no el formato; bucle reseñas NFC → contador Google real → social.

## 6. Lo que hace falta del humano / accesos pendientes

- **Feed Habitatsoft** (o export) para quitar `sampleData` — desbloquea SEO y escala.
- **GA4 + Meta Pixel/CAPI**: crear propiedades y permisos; Meta Ads ya está conectado vía NotFair.
- **Autorizar pull real de keywords** (NotFair getKeywordIdeas / conectar Google Ads o DataForSEO)
  para los pueblos sin volumen conocido (Pineda, Santa Susanna, Palafolls, Calella; compra/alquiler/
  valoración en Blanes/Tordera/Lloret).
- **Datos reales de negocio**: bio de Boris, años de trayectoria, % de comisión, €/m² por pueblo.

## 7. Limitaciones de esta ronda de análisis

Fue análisis por lectura: ningún agente corrió `npm run build`, Lighthouse ni navegador a 390px. No
se inventaron volúmenes, €/m², comisión ni geo (sin fuente no se publican). Las cifras "9 H1 iguales /
11 eyebrows" vienen de `ESTANDAR.md`, conviene recontarlas en `src/pages` antes de reescribir titulares.
