# SEO Local — Conroma Asesores (conromaasesores.com)

> Análisis con datos del repo (`src/data/site.ts`, schema, páginas). **Sin acceso en vivo** a
> Google Business Profile, citaciones, velocidad de reseñas ni posición en el map pack
> (DataForSEO/Maps API no conectados). Ver limitaciones al final.

## Puntuación local (estimada sobre lo evaluable): ~55/100

| Dimensión | Peso | Estado | Nota |
|---|---|---|---|
| GBP (ficha de Google) | 25% | ⚠️ No verificable en vivo | Solo hay URL de búsqueda, sin embed ni place ID |
| Reseñas y reputación | 20% | 🟡 Parcial | 4,7/107 (fuerte) pero sin `aggregateRating` ni velocidad conocida |
| On-page local | 20% | 🟢 Bueno | NAP visible, `tel:`, ciudad en títulos/H1, páginas de servicio |
| NAP y citaciones | 15% | 🟡 Parcial | **Teléfono inconsistente** schema vs ficha; citaciones sin verificar |
| Schema local | 10% | 🟡 Parcial | `RealEstateAgent` correcto, pero `geo` null, sin horario |
| Enlaces/autoridad local | 10% | ⚠️ No verificable | Sin datos de backlinks/menciones |

## Tipo de negocio e industria
- **Híbrido** (predomina local con oficina física): dirección real (Av. Mediterránea 16) + área de
  servicio (`areaServed` con 8 municipios).
- **Vertical: inmobiliaria** → schema correcto `RealEstateAgent` (no el genérico `LocalBusiness`).

## Auditoría NAP (página vs schema vs ficha)

| Campo | `site.ts` / Footer / Contacto | Schema (`agentSchema`) | ¿Coherente? |
|---|---|---|---|
| Nombre | Conroma Asesores Inmobiliarios | `name: legalName` | ✅ |
| Dirección | Av. Mediterránea 16, 08380 Malgrat de Mar, Barcelona | igual | ✅ |
| **Teléfono** | Footer/Contacto muestran el **fijo** 937 61 03 53 | `telephone: site.phone` = **móvil** +34 626 378 687 | ❌ **Inconsistente** |

**Hallazgo nº1 (High):** el schema declara el **móvil** como teléfono del negocio, pero la ficha y el
pie muestran el **fijo**. WhatsApp usa el móvil. Google y las citaciones necesitan **un único número
primario**. Para una inmobiliaria con oficina, el primario suele ser el **fijo**. Decidir cuál es el
primario y que coincidan schema + GBP + citaciones. (Formato antiguo del título: "Av. Mediterranea,
16" sin tilde → unificar con tilde en todas partes.)

## GBP (ficha de Google) — datos del propietario
- **Categoría principal**: Agencia inmobiliaria *(a confirmar; no llegó el texto exacto)*.
- **Secundarias**: reformas/obras inmobiliarias + gestión de patrimonio ✅ (coinciden con los servicios).
- **Posts**: no se publican → **oportunidad**. 1–2/mes (piso, antes/después, consejo), reaprovechando RRSS.
- **Reseñas**: se responden **todas** ✅ (88% prefiere negocios que responden).
- **CID de la ficha**: `0xfa227f184b35bd19`; nombre en Maps: "CONROMA ASESORES INMOBILIARIOS | MALGRAT DE MAR".
- ✅ HECHO — **Mapa embebido** en `/es/contacto/` con diseño de Conroma (tarjeta dividida mapa+datos),
  carga diferida y **detrás de consentimiento** (placeholder sin cargar Google hasta aceptar cookies o
  pulsar "Cargar mapa"). Enlaces **Cómo llegar** y **Ver en Google Maps** por **CID**.
- ✅ HECHO — enlace de reseñas y `hasMap` del schema apuntan a la ficha por **CID** (`?cid=18024108401007901977`).

### Decisión de nombre de ficha (recomendación)
Usar el **nombre limpio** "Conroma Asesores Inmobiliarios", **sin** "| MALGRAT DE MAR":
- Añadir ubicación al nombre es name-stuffing → infracción de Google, riesgo de **suspensión** y de
  que un tercero lo edite.
- La diferenciación con "Conrroma la Selva" ya la dan la **ubicación** (Malgrat/Barcelona vs La Selva/
  Girona) y la **grafía** (una r vs dos). El map pack separa por proximidad.
- La intención "inmobiliaria malgrat" se capta por dirección + categoría + descripción/servicios/posts
  + H1 de la web, sin riesgo.
- Mantiene la **NAP coherente** con el schema (que ya usa el nombre limpio).
- Excepción: si el **rótulo físico** incluye "Malgrat de Mar", es defendible mantenerlo (sin el "|") y
  entonces schema + footer deben decir exactamente lo mismo.

## Reseñas
- **4,7 ★ / 107 reseñas** (dato real `site.ts`): supera el umbral de 10 y el 4,5+ que filtra el 31%
  de usuarios. Fuerte.
- **No está en `aggregateRating` del schema** — decisión deliberada y correcta: autodeclarar rating
  sin marcado de reseñas reales on-site va contra las guías de Google. Las reseñas se exhiben desde
  GBP, no desde schema inventado. **Mantener.**
- Velocidad de reseñas (regla de los 18 días) **no verificable** sin GBP Insights.

## Schema local
- ✅ `RealEstateAgent` con `address`, `areaServed` (8 municipios), `knowsLanguage`, `sameAs` (IG×2 +
  TikTok, recién añadido).
- ❌ **`geo` = null** → sin coordenadas. Es propiedad recomendada para local (≥5 decimales). (High)
- ❌ Sin `openingHoursSpecification` ni `priceRange`. (Medium — requieren dato real)

## On-page local
- ✅ NAP visible en footer y contacto; `tel:` (click-to-call) en footer/ContactBand/ContactSection.
- ✅ Ciudad en títulos y H1 ("…en Malgrat de Mar"); páginas de servicio dedicadas (comprar/vender/
  alquilar/valoración/reformas) — factor #1 de local orgánico.
- ⚠️ El `tel:` usa el **fijo**; WhatsApp el **móvil** → ligado al hallazgo nº1.
- ⚠️ Sin **mapa embebido** de la oficina en la página de contacto (refuerzo geográfico; cargar lazy).

## Top 10 acciones priorizadas

**Critical**
1. (Cuando salga de `noindex` con inventario real) asegurar que la home y las páginas de servicio son
   indexables y envían a GBP — hoy el valor local está congelado por `sampleData: true`.

**High**
2. ✅ HECHO — **Teléfono primario = móvil** (+34 626 378 687) en schema, footer, contacto y banda;
   el fijo (937 61 03 53) incluido como secundario con tracking propio (`*-fijo`).
3. ✅ HECHO — **`geo`** (41.650106, 2.741575) en `site.ts`, emitido en el schema.
4. **Reclamar/optimizar Bing Places** (alimenta ChatGPT, Copilot, Alexa) y **Apple Business Connect**
   (uso duplicado al 27%) — clave para el 45% que ya usa IA para recomendaciones locales.
5. Embeber el **mapa real de la oficina** + enlazar la ficha de GBP (place ID) en `/es/contacto/`.

**Medium**
6. ✅ HECHO — `openingHoursSpecification` con el horario real (L–V 09:00–14:00 y 16:30–19:30).
7. Verificar/consolidar **citaciones Tier 1** con NAP idéntica (Google, Bing, Apple, Facebook, portales
   inmobiliarios) — 3 de los 5 factores de visibilidad en IA son de citación.
8. Mantener **cadencia de reseñas** (regla de los 18 días) — encaja con el piloto NFC: reseña → sube el
   contador real → el social lo exhibe.
9. Publicar los **posts de GBP** y **fotos** reales de la oficina/equipo (45% más solicitudes de ruta
   con fotos).

**Low**
10. Señales de autoridad local: Cámara de Comercio, prensa local, "mejores inmobiliarias en Malgrat" —
    factor #1 de citación en IA.

## Limitaciones (lo que este análisis NO pudo medir)
- Posición en el **map pack** y geo-grid (requiere DataForSEO/Maps API).
- Estado real de la **ficha GBP**: categoría, posts, fotos, horario, Insights.
- **Velocidad de reseñas** y respuestas del propietario.
- **Citaciones** reales en directorios y **backlinks/menciones** locales (Domain Authority).
- Para cubrirlos: conectar DataForSEO o compartir acceso a GBP/Search Console.
