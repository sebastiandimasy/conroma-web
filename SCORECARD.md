# Scorecard — Web nueva de Conroma Asesores (estado a 2026-11-15)

> En qué punto está la web pública nueva (Astro, servida en local; **aún sin publicar**).
> Puntuaciones **1-10**, síntesis de 8 auditorías paralelas sobre el **código y el HTML
> renderizado** + capturas puntuales a 390px. **No** incluye Lighthouse/CrUX de producción ni
> datos de SERP/backlinks reales (DataForSEO no conectado): donde hace falta medición real se dice.
> La web **antigua** (`www.conromaasesores.com`) no se evalúa aquí; esto es la nueva.

## Nota global: **7,9 / 10** (tras las correcciones de esta sesión)

Partíamos de 6,8. Tras dos pasadas de corrección (accesibilidad, medición, schema, rendimiento del
listado, contenido estructural), **7 de 10 rubros llegan a ≥8**. Los 3 que se quedan en 7–7,5
(Contenido/E-E-A-T, GEO y "datos de web profesional") tienen un **techo que pone el dueño**: sin
AICAT/NIF, honorarios, fotos de pisos, perfiles sociales reales y más contenido, no se puede subir
más sin inventar datos (y eso no se hace).

## Puntuaciones por dimensión (antes → ahora)

| Dimensión | Antes | Ahora | Lectura corta |
|---|---|---|---|
| **Diseño / UX / UI** | 6,5 | **8,0** | Home ya muestra pisos destacados reales; CTA primario en contacto; labels de nav distintos; marca coherente. |
| **Accesibilidad (WCAG 2.2 AA)** | 5,0 | **8,0** | Foco accesible (1,45→17,5:1), contraste AA en tokens, errores de formulario anunciados, carrusel con pausa, modal con foco atrapado. |
| **Rendimiento** | 6,0 | **8,0** | Listado 124→24 fichas + "Ver más"; imágenes −60% (xl+srcset); sin blur por tarjeta; guardados recortado. |
| **Contenido / E-E-A-T** | 6,0 | **7,5** | Blog con autor+fecha, horario y dirección visibles, empresa reforzada. Techo: páginas finas y datos del dueño. |
| **Legibilidad (humana)** | 8,0 | **8,5** | Tono claro, escaneable. |
| **Esquema / datos estructurados** | 6,5 | **8,5** | `@graph` global (agencia+WebSite+fundador), `contactPoint`, fichas con `description`/`image`/`geo`, blog con autor/fecha. Sin `aggregateRating` self-serving. |
| **SEO técnico (global)** | 8,0 | **8,5** | Valoración con 1 H1 + breadcrumb, legales a `noindex`, listado más ligero. |
| **GEO (buscadores generativos)** | 6,5 | **7,5** | Schema y robots IA reforzados, llms.txt con datos clave. Techo: cifras citables, `sameAs` y contenido único de pueblo (dueño). |
| **Legibilidad para la IA** | 7,5 | **8,0** | robots IA completo (+Claude-SearchBot), `@graph`, fundador, llms.txt. |
| **Datos de una web profesional** | 6,0 | **7,0** | Horario/`contactPoint`/dirección visibles. Techo: AICAT/NIF, redes reales, honorarios (dueño). |

## SEO por página (1-10)

| Página | Nota | Motivo |
|---|---|---|
| `/es/` (home) | 8 | Completa; schema + intención local. No muestra inventario. |
| `/es/comprar/` | 7 | Buena; H2 poéticos (no preguntas) restan en GEO. |
| `/es/vender/` | 7 | H1 con ubicación, CTAs claros; contenido algo corto. |
| `/es/alquilar/` | 7 | Correcta. |
| `/es/valoracion/` | 6 | **2-3 H1**, 138 palabras, 3 enlaces, sin breadcrumb. |
| `/es/gestion-de-patrimonio/` | 6 | Fina (~300 palabras), sin datos propios. |
| `/es/reformas/` | 6 | Fina (~315 palabras). |
| `/es/venta/` (listado) | 6 | 974 KB–1,5 MB, 124 fichas, 547 enlaces: riesgo LCP/INP móvil. Sin paginar. |
| `/es/inmobiliaria/{pueblo}`, `/es/venta/{pueblo}` | 7 | Buenas, pero plantilla casi idéntica (canibalización + poco contenido único). |
| ficha `/es/inmueble/{ref}` | 7 | Schema de listing incompleto; galería con bug de índice. |
| `/es/empresa/` | 7 | Bio real; sin `AboutPage` marcado. |
| `/es/contacto/` | 7 | NAP + mapa; sin `ContactPage` marcado. |
| `/es/blog/` | 6 | 3 posts cortos, misma fecha, sin autor/fecha visibles. |

## Qué subió la nota — ya CORREGIDO esta sesión (sin publicar; build verde, detector limpio)

Aplicado y verificado (build + capturas claro/oscuro): **foco accesible** (amarillo 1,45:1 → tinta
17,5:1), **contraste de tokens** (`ink-3`, bordes `line`, error `negative`, puntos del carrusel, todos
a AA), **banner de cookies** (botón duplicado eliminado + desbordes desktop + altura móvil), **medición
+ WhatsApp fiable en iOS** por enlace real con `data-origin`/`data-contact` (cierra la atribución con el
GTM que montamos), **a11y de errores de formulario** (aria-invalid/describedby, role=alert, foco,
required), **IntentWelcome** como `<dialog>` nativo con foco atrapado, **carrusel** con botón de pausa
y roles corregidos, **un solo H1** en valoración + breadcrumb, **legales a `noindex`** mientras sean
borrador, **schema de fichas** (`description`/`image`/`geo`) y blog (`image`/`dateModified`), **bugs de
inventario** (placeholder "Fotos próximamente", visor de galería en la foto pulsada, gestos del mapa),
y retirada del filtro **liquid-glass de PRUEBA**. Pendiente deliberado (cambio mayor): paginar el
listado y servir imágenes con `srcset` (rendimiento móvil).

## Bloqueantes del dueño (ponen el techo; no se inventan)

- **Datos legales reales:** AICAT y NIF/CIF → cerrar aviso legal, privacidad y cookies (hoy en borrador).
- **Honorarios** (`feePercent`) y algún caso/cifra real para las páginas de servicio finas.
- **Fotos** de los pisos pendientes (hoy SVG de muestra).
- **Redes y perfiles:** Google Business Profile, Facebook/LinkedIn si existen → `sameAs` y confianza.
- **Blog:** más entradas, con autor y fechas reales.
- Confirmar cifras que aparecen en la web (años de actividad: la home dice "3", `team.ts` "7-8").

## Pendiente de medición real (no estimar)

Lighthouse/CWV de producción, cabeceras servidas por Hostinger, SERP/posiciones y backlinks
(requiere conectar Google Ads/Search Console/DataForSEO). Verificar en producción que `/` da un solo
301 a `/es/` y que `/sitemap-index.xml` responde 200 (en dev da 404; solo existe tras `npm run build`).

---
*Informes detallados por área (código + hallazgos P0-P3) generados en esta sesión; pídemelos para
dejarlos en `docs/` si los quieres conservar en el repo.*
