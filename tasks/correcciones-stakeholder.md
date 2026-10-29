# Correcciones del stakeholder — seguimiento

> Estado: ✅ hecho y verificado · 🔨 código hecho, falta validar en navegador · ⬜ pendiente
> Base técnica: `npm run build` 0 errores, 39 páginas · `npm test` 31/31.

## Bloque grande (plan F1–F7)
- [x] **F1 · Ficha: eliminar dirección exacta** (enlace Maps + chip "La dirección exacta"). ✅
- [~] **F2 · Ficha: mapa de ubicación aproximada** — círculo de marca, radio **250 m** (barrio), claro/oscuro. 🔨 falta verlo en **preview** (maplibre no pinta en `astro dev`).
- [x] **F3 · Calculadora "¿puedo comprar?"** (DTI 40%). ✅ validada.
- [x] **F4 · Onboarding: modal de intención**. ✅
- [~] **F5 · Wizard "es un lío"** (5 motivos). 🔨 código OK.
- [x] **F6 · Bio real del CEO** (en producción). ✅
- [x] **F7 · Página de contacto**. ✅

## Correcciones dadas
- [x] Chip "La dirección exacta" eliminado. ✅
- [~] **Foto de Boris** arriba con el texto (sticky). 🔨 en producción; confirmar en preview.
- [x] **Galería ficha**: cuadro **4/3** + ¿Qué necesitas? a la derecha (retícula) + botones WhatsApp/Llamar a ancho + flechas + ampliar (lightbox). ✅ validada escritorio.
- [x] **Mapa**: radio 30→500→**250 m**. ✅
- [x] **Calculadora v3** (validada en navegador): ✅
  - [x] Resultado **solo al pulsar** "Hacer mi cálculo"; el form se **reemplaza** por la pantalla de resultado.
  - [x] **Apto** → check verde **animado** + "Crédito preaprobado" + CTA asesor + letra pequeña.
  - [x] **No apto** → alerta **animada** + "Aún no es hora" + mensaje motivacional (deja claro que no es viable) + asesor.
  - [x] **Floating labels** (etiqueta dentro que sube al escribir).
  - [x] **Segmentados Sí/No y 12/14** con selección visible (pastilla amarilla).
  - [x] **Bug de ceros a la izquierda** corregido ("01000" → "1000").
  - [x] Layout **2 columnas** (texto | form), compacto, ancho acotado (no full-width).
- [x] **Reemplazar simulador de hipotecas** → redirige a `/es/comprar/puedo-comprar/`; actualizados nav, ToolsPreview y comprar; página e island viejos eliminados. ✅
- [x] **Banner amarillo "¿No ves el tuyo?"** → rediseño **liquid-glass (CTA-3)** adaptado a Conroma (centrado, brillo radial, esquinas "+", línea central). Clase reutilizable `.alert-card`. ✅ validado.
- [x] **Páginas legales** (sector inmobiliario ES): **Aviso Legal** (`/es/aviso-legal/`), **Política de Privacidad** (`/es/privacidad/`), **Política de Cookies** (`/es/cookies/`). ✅ creadas — borradores con datos reales de `site.ts` y marcadores `[…]` para CIF/datos registrales; **requieren revisión jurídica**.

## Migración para subir la web (plan TDD de municipios) — COMPLETA
- [x] **Tarea 1** · Reactivar Pineda, Calella, Santa Susanna y Palafolls con copy de captación. ✅
- [x] **Tarea 2** · Redirecciones de los slugs antiguos (`_`) a su página, antes del comodín. ✅ (test)
- [x] **Tarea 3** · Schema `CollectionPage` en los listados de pueblo. ✅ (test + verificado en HTML)
- [x] Páginas legales enlazadas desde el footer (Aviso legal · Privacidad · Cookies). ✅

## Medición — GTM instalado (código hecho)
- [x] **Google Tag Manager `GTM-KWJHKHR2`** en `<head>` + `<noscript>` (todas las páginas, vía BaseLayout).
- [x] **Consent Mode v2** (RGPD): por defecto denegado; se actualiza a "granted" al aceptar en el aviso de cookies (`store.ts` → `setConsent`).
- [x] **Listener Click-URL**: cada CTA con `data-contact` empuja `cta_click` al dataLayer (con `cta_origin`/`cta_contact`/`cta_ref`).
- [x] **GA4 `G-C9WV5S78LX`** instalado directo (gtag.js), respeta el Consent Mode. El evento `cta_click` se envía a GA4 vía `gtag('event', …)` con `cta_origin`/`cta_contact`/`cta_ref`.
- [ ] **En la UI de GA4 (usuario):** marcar `cta_click` como evento clave/conversión y registrar `cta_origin`/`cta_contact`/`cta_ref` como dimensiones personalizadas (opcional pero recomendado).
- [ ] **En la UI de GTM (usuario):** montar **solo el Meta Pixel** (base + trigger de evento personalizado `cta_click`). **NO** añadir GA4 en GTM (ya va directo → evitar doble conteo). Falta el **Pixel ID**.

## Pendiente (necesita humano / preview)
- Confirmar en **preview** (no dev): mapa (círculo 250 m) y foto de Boris.
- Completar datos legales reales ([CIF], registro/AICAT) antes de publicar.
- **Inventario real (Excel)** — HECHO: `properties.real.json` (126 pisos reales del Excel) enchufado a `getListings`; 25 páginas de municipio; 17 municipios nuevos añadidos a `towns.ts`; build 181 páginas. Galería "Fotos próximamente" y amenidades "Consultar" (el Excel no trae fotos/descripciones/ascensor/etc.). Banner cambiado a "los pisos son reales; estamos añadiendo sus fotos". `sampleData` sigue `true` (noindex) hasta tener fotos.
  - [ ] **Pendiente (fotos + descripciones):** vienen en el feed **Habitatsoft Enlace Web 2.0** (XML, trae `<Foto>` + textos + geo) → con esa URL completo las fichas y pongo `sampleData:false`.

- **Feed Habitatsoft** — PREPARADO (parser listo; el Excel ya cubre el listado, el feed cubrirá fotos):
  - [x] Costura `getListings()`/`getListing()` (única puerta a los pisos; páginas enrutadas). Tests.
  - [x] Parser `src/lib/habitatsoft.ts` (Enlace Web 2.0 v1.7) → `Property`, validado con test contra el formato del spec.
  - [x] `Property.geo` (coords reales del feed) + la ficha usa `property.geo ?? town.geo` en el mapa.
  - [x] Ficha oculta el bloque editorial "lo que más nos gusta/a tener en cuenta" si viene vacío.
  - [ ] **Activar (necesita usuario):** URL del feed + credenciales (o export real) para hacer `fetch` en build y enchufarlo en `getListings`; confirmar que todos sus municipios existen en `towns.ts`; decidir `likes`/`watchOut` (vacío u otro campo libre de HS); poner `sampleData:false`.
- Accesos de medición (GA4 / Meta Pixel) para cerrar la atribución Click-to-WhatsApp.

## Estructura de todas las páginas — CERRADA
- [x] Auditadas las 23 páginas: todas estructuralmente completas (hero + secciones + contacto).
- [x] `alquilar`: añadidos los 2 CTA de doble intención en el héroe (→ #busco / #tengo-piso) — era el único desajuste de conversión.
- [x] Simetría de FAQ rota (vender → "Dudas al vender tu piso"; alquilar → "Lo que más preguntan del alquiler").
- [x] Verificación ESTANDAR §3: build 0 err · 35/35 tests · 0 hex fuera de tokens · 0 eyebrows-pregunta duplicados.
- Único contenido que falta = dato-dependiente (legales, feePercent, autoría blog, inventario real).

## A4 · Simetría de titulares (ESTANDAR §2) — HECHO
- [x] H1 de Vender (pregunta retórica autocontestada) → afirmación "Vender bien empieza por saber lo que vale".
- [x] Deshechos 2 duplicados exactos: "¿Qué hacemos?" (ServicesFeature→"Lo que hacemos") y "¿Quiénes somos?" (FamilyShowcase→"De aquí, como tú").
- [x] "¿Qué dicen de nosotros?"→"Lo que dicen de nosotros"; "¿Cómo vendo?"→"Tu venta, paso a paso".
- Roto ~1 de cada 3 eyebrows-pregunta; el resto (distintivos) se dejan como pregunta a propósito.

## Notas / memoria
- CTAs Comprar/Vender con 21st.dev / react-three-fiber → anotado, sin construir.
- `feePercent` (comisión) y autoría del blog, pendientes (cimiento C.3).
- Config: `vite.ssr.noExternal` añadido para la inestabilidad del optimizador SSR de Vite en `astro dev`.
