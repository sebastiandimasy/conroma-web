# AUDIT-REPORT — Conroma Asesores (web)

> Auditoría integral (SEO técnico, GEO, arquitectura, UX/UI, sistema de diseño, copy/CTA,
> funcional, rendimiento, accesibilidad, seguridad). Fecha: 2026-11-15. Repo: `conroma-web`.
> Clasificación: **CRÍTICO** (funcionamiento/indexación/conversión) · **ALTO** · **MEDIO** · **BAJO**.
> No se inventan datos de empresa ni puntuaciones de herramientas no ejecutadas.

## 1. Estado general
Prototipo avanzado y con base técnica fuerte, **no publicado todavía**. SEO técnico, rendimiento,
GEO on-page, seguridad y contenido ya están en buen estado (ver §"Ya resuelto"). Quedan **dos
bloqueantes de verdad**: la captación de leads no funciona en el hosting elegido, y faltan los datos
legales obligatorios. Y una mejora on-page de alto impacto: los H1.

## 2. Arquitectura tecnológica
Astro 7.4 **estático** + islas React + Tailwind 4; se publica en **Hostinger** (el adaptador
Cloudflare solo se usa para el build). Supabase como backend (CRM en repo aparte `conroma-crm-ui`).
`astro check`: **0 errores, 0 warnings, 31 hints** (deprecaciones menores en tests).

## 3. Hallazgos

### CRÍTICO
| ID | Categoría | Página/Comp. | Problema | Evidencia | Impacto | Solución | Archivos |
|---|---|---|---|---|---|---|---|
| C-01 | Funcional/Arq. | ContactForm, ValuationWizard | Envían el lead con `fetch('/api/leads')`, una ruta de **Worker** que en Hostinger estático **no se ejecuta** | `ContactForm.tsx:36` | En producción **se pierden todos los leads del formulario** | Opción A: insert directo en `lead` con anon key + policy `0003`; borrar `api/leads.ts` | `ContactForm.tsx`, `ValuationWizard.tsx`, `lib/supabase.ts`, `pages/api/leads.ts` |
| C-02 | Legal/E-E-A-T | aviso-legal, privacidad, cookies | Faltan **AICAT** (obligatorio para agentes inmobiliarios en Cataluña) y **NIF/CIF**; textos con placeholders de "borrador" e indexables | placeholders `[NIF/CIF pendiente]`, `[AICAT pendiente]` | Publicar sería **ilegal**; daña confianza/E-E-A-T | Rellenar datos reales (los da el dueño) y quitar notas de borrador | `aviso-legal.astro`, `privacidad.astro`, `cookies.astro`, `data/site.ts` |

### ALTO
| ID | Categoría | Página | Problema | Impacto | Solución | Archivos |
|---|---|---|---|---|---|---|
| A-01 | SEO on-page | home, vender, alquilar, reformas, patrimonio, puedo-comprar | **H1 emocionales que no mencionan el tema buscado** ("Encuentra tu hogar"…). Los *titles* sí están bien | Desaprovecha la señal on-page de relevancia más fuerte tras el title | H1 = tema + ubicación; la frase emocional baja al `lead` de `PageHero` | `index.astro`, `vender.astro`, `alquilar.astro`, `reformas/index.astro`, `gestion-de-patrimonio.astro`, `comprar/puedo-comprar.astro` |
| A-02 | SEO on-page | valoracion | **Sin H1** (solo monta la isla React) | Página clave ("valoración gratis") sin encabezado semántico | Añadir H1 server-rendered sobre el wizard | `valoracion.astro` |
| A-03 | Rendimiento | ficha, listado | CWV medido **solo en home** (escritorio 100 / móvil 90, CLS 0). Ficha/listado usan imágenes remotas de Habitatsoft y mapa (maplibre) → pueden variar | LCP/INP peor en plantillas no medidas | Medir con Lighthouse y optimizar (lazy del mapa, srcset de fotos) | `inmueble/[slug].astro`, `venta/[town].astro`, `islands/*Map*` |

### MEDIO
| ID | Categoría | Página/Comp. | Problema | Solución | Archivos |
|---|---|---|---|---|---|
| M-01 | SEO/Arq. | inmobiliaria/{pueblo} vs venta/{pueblo} | Posible **canibalización** (intención parecida). Mapeada por intención en `docs/KEYWORDS.md`, pero el copy/H2 no la refleja del todo | Diferenciar copy: `/inmobiliaria/{pueblo}`=vender/agencia, `/venta/{pueblo}`=comprar/catálogo | plantillas `[town].astro` |
| M-02 | GEO/Schema | servicios | Falta `Service` schema para los servicios (casaría con el contenido visible); valorar `WebPage` | Añadir `Service` solo donde case con lo visible; no inflar | `lib/seo.ts`, páginas de servicio |
| M-03 | Accesibilidad | global | WCAG 2.2 AA **a verificar**: contraste (tokens ya pareados, validar en `/es/estilo/`), focus visible (existe), targets ≥24px, y que los H2 de páginas de contenido sean `<h2>` reales (viven en subcomponentes como `Steps`/grids, no en el `.astro`) | Verificar con herramientas + corregir lo que falle | componentes de sección |
| M-04 | Datos/Arq. | towns.ts | El feed trae "municipios" que son **zonas** (comajuliana, el-serrat, carretera-de-santa-coloma) | Limpieza de datos: mapear a su municipio real | `data/towns.ts` |
| M-05 | CTA/CRO | páginas comerciales | Jerarquía de CTA existe (`Button` primary/ghost/ink); revisar que cada página comercial tenga **un** CTA primario claro acorde al recorrido (vender→valorar, comprar→ver pisos) | Revisión de jerarquía por página | páginas `.astro` |

### BAJO
| ID | Categoría | Problema | Solución |
|---|---|---|---|
| B-01 | Seguridad | CSP pendiente en `.htaccess` | Probar en Report-Only con los hosts permitidos |
| B-02 | SEO i18n | Solo castellano (la antigua tenía CA/ES/EN/FR) | Si se recupera catalán, añadir hreflang (ya preparado en `seo.ts`) |
| B-03 | Responsive | Tablet sin verificar (solo 390px comprobado) | Revisar breakpoint intermedio |
| B-04 | Calidad | 31 hints de `astro check` (deprecaciones en tests) | Limpieza menor |

## 4. Ya resuelto en esta sesión (no re-hacer; detalle en git)
Rendimiento (CWV home 100/90, CLS 0; fuentes auto-alojadas + preload; imágenes 7,5→1,1 MB;
vídeos 44→13 MB; código muerto eliminado) · GEO (llms.txt, bots IA en robots, schema `WebSite`
site-wide, FAQ citables) · Seguridad (RLS, policy anon `0003`, cabeceras `.htaccess` + X-Frame)
· Contenido (intros de municipios con inventario, pueblos finos fuera del índice, mapa de keywords)
· Arquitectura (separación web/CRM/Supabase documentada en `docs/INTEGRACIONES.md`).

## 5. Lo que NO es problema (verificado)
Titles y meta descriptions (keyword + intención + ubicación, bien) · canonical + sitemap + robots ·
schema RealEstateAgent/Breadcrumb/FAQ/listing/article · un solo H1 por página (salvo valoración) ·
ALT de imágenes (cobertura correcta; el único `<img>` "sin alt" recibe `alt` por props) · formularios
etiquetados (labels/aria) · skip-link presente · sistema de diseño con tokens y pares fondo/texto.

## 6. Dependencias (del dueño, no del código)
Datos legales (AICAT/NIF) · fotos de 8 pisos · `sampleData=false` · decisión de publicar ·
volúmenes de keywords (conectar Google Ads en NotFair).
