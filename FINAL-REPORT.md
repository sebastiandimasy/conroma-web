# FINAL-REPORT — Conroma web

> Resumen de las correcciones de la auditoría integral: qué se arregló, validaciones ejecutadas y
> lo que queda. Complementa `AUDIT-REPORT.md` / `IMPROVEMENT-PLAN.md`. Fecha: 2026-11-15.

## 1. Problemas solucionados (por ID)
| ID | Qué se hizo | Commit |
|---|---|---|
| **C-01** | Captación opción A: `ContactForm`/`ValuationWizard` insertan el lead **directo en Supabase** (anon + policy `0003`), se borra el Worker `api/leads.ts`. Funciona en Hostinger estático | `4134545` |
| **A-01/A-02** | H1 por página = **tema + ubicación** (home, comprar, vender, alquilar, reformas, patrimonio, puedo-comprar); se crea el H1 que faltaba en `/valoracion` | `c66c20a` |
| **A-03** | Ficha: se **difiere el mapa** (maplibre 281 KB) con `client:visible`. Ficha móvil **49 → 85** | `3520484` |
| **M-02** | Schema `Service` en vender, alquilar, patrimonio, reformas, valoración (casa con lo visible) | `acb15a1` |
| **B-01** | CSP en **Report-Only** en `.htaccess` (no bloquea, informa para revisar antes de forzar) | este |
| M-01/M-03/M-05 | Verificados: canibalización ya diferenciada por estructura; jerarquía de encabezados correcta (`<h2>/<h3>` reales); CTA primario vía componentes. **Sin cambio necesario** | — |

**Ya resuelto en la sesión** (previo a la auditoría formal): CWV home (escritorio 100 / móvil 90,
CLS 0), fuentes auto-alojadas + preload, imágenes de la home (7,5→1,1 MB), vídeos (44→13 MB),
código muerto, `llms.txt`, bots IA en `robots`, schema `WebSite` site-wide, FAQ citables,
cabeceras de seguridad, contenido de municipios, separación web/CRM/Supabase, migración `0003`.

## 2. Validaciones ejecutadas (datos reales, no inventados)
- `npm run build` (incluye `astro check`): **0 errores**, 171 páginas.
- **Lighthouse local con compresión** (gzip, simula Hostinger), móvil:
  - Home **90/100** (CLS 0) · Escritorio **100/100**.
  - Ficha de inmueble **85/100** (antes 49; CLS 0).
  - Listado de municipio **78/100** (CLS 0,006).
- Verificado en el HTML generado: H1 corregidos, schema `WebSite`+`Service`, `llms.txt`/`robots`
  con bots IA, y que ya **no hay ruta `/api/leads`** (las islas insertan directo).

## 3. Pendiente
### Código (siguientes pasadas)
- **Imágenes remotas de Habitatsoft** (JPG a tamaño completo, sin webp): son el LCP que frena ficha
  (4,0 s) y listado (5,1 s). En Hostinger no hay redimensión de imágenes; el arreglo correcto es la
  **migración de fotos a Supabase Storage** (optimización webp/avif por Astro), ya prevista en
  `docs/INTEGRACIONES.md`. Alternativa puente: un proxy de imágenes (decisión de arquitectura).
- **B-03** verificación responsive en tablet (visual) · **B-04** limpiar los 31 hints de `astro check`
  (deprecaciones en tests, no bloqueantes).

### Validación con herramientas externas (no ejecutadas aquí)
- JSON-LD en **Rich Results Test** · **CSP Report-Only**: revisar violaciones en consola antes de
  forzarla · WCAG 2.2 AA: contraste por par y navegación por teclado.

### Del dueño (⛔ bloqueantes de publicación)
- **AICAT + NIF/CIF** (C-02) · fotos de 8 pisos · `sampleData=false` · decisión de publicar.
- **Aplicar `0003` en Supabase** (SQL Editor) para que la captación de leads funcione.
- Conectar **Google Ads** en NotFair para rellenar los volúmenes de `docs/KEYWORDS.md`.

## 4. Conclusión
La web está **técnicamente sólida** y lista para competir una vez publicada: SEO técnico, GEO
on-page, rendimiento (salvo imágenes remotas de ficha/listado), seguridad y estructura en orden. Los
dos bloqueantes reales eran la **captación** (resuelta en código, pendiente de aplicar `0003`) y los
**datos legales** (del dueño). El mayor margen de mejora de rendimiento restante depende de **mover
las fotos a Storage**.
