# IMPROVEMENT-PLAN — Conroma web

> Plan de corrección ordenado por prioridad (orden del brief). Referencia los IDs del
> `AUDIT-REPORT.md`. Estado: ✅ hecho · 🔜 pendiente · ⛔ bloqueado (depende del dueño).

## Orden de ejecución

### 1. Funcional / estructural
- 🔜 **C-01** Captación opción A: `ContactForm`/`ValuationWizard` → insert directo en `lead`
  (anon + `returning:'minimal'`), aplicar `migrations/0003`, borrar `api/leads.ts`. *(el fix más
  importante: sin esto se pierden los leads en Hostinger)*
- 🔜 Barrido de CTA/enlaces: confirmar que cada botón/enlace lleva a su destino y no hay rotos.

### 2. SEO técnico crítico
- ✅ robots (+bots IA), sitemap, canonical, meta robots, schema base.
- 🔜 **M-02** Validar JSON-LD (Rich Results) y añadir `Service` donde case con lo visible.

### 3. Arquitectura y jerarquía de contenidos
- 🔜 **A-01/A-02** H1 por página = tema + ubicación; emoción al `lead` de `PageHero`; crear H1 en
  `/valoracion`.
- 🔜 **M-01** Reflejar en el copy la diferencia inmobiliaria/{pueblo} (vender) vs venta/{pueblo}
  (comprar).
- 🔜 **M-04** Limpieza de datos de `towns.ts` (zonas que no son municipios).

### 4. UX / navegación
- 🔜 Revisar header/footer/dock/migas, estados y fricciones por recorrido (comprar/vender/alquilar/
  propietario/asesoramiento).

### 5. Sistema de diseño y consistencia visual
- ✅ Existe (`ESTANDAR.md` + tokens). 🔜 Verificar estilos sueltos/duplicados y corregirlos.

### 6. Copy y jerarquía de CTA
- 🔜 **M-05** Un CTA primario claro por página comercial, acorde al recorrido; limpiar copy genérico.

### 7. GEO y datos estructurados
- ✅ llms.txt, WebSite, FAQ citables, entidad consistente. 🔜 Reforzar E-E-A-T (autor/Person) cuando
  haya datos legales.

### 8. Rendimiento y accesibilidad
- ✅ CWV home, fuentes, imágenes, vídeos. 🔜 **A-03** medir ficha/listado; **M-03** verificar WCAG
  2.2 AA (contraste/teclado/focus/targets/encabezados).
- 🔜 **B-01** CSP en Report-Only.

### 9. Extras
- 🔜 **B-03** tablet; **B-04** limpiar hints; **B-02** catalán si se decide recuperarlo.

## Bloqueado (⛔ del dueño)
**C-02** datos legales AICAT/NIF · fotos de 8 pisos · `sampleData=false` · publicar ·
volúmenes de keywords (conectar Google Ads en NotFair).

## Recomendación de arranque
Empezar por **1 (C-01, captación opción A)** — es funcional y crítico — y **3 (H1)** — alto impacto
SEO on-page y ya está diagnosticado. El resto en el orden de arriba.
