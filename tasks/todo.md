# Conroma — Lista de tareas

> Derivada de `tasks/plan.md`. Cada tarea es una rebanada vertical (camino completo).
> Marca `[x]` solo cuando pasa su verificación. No empieces una fase nueva sin su checkpoint.

## FASE 0 — Cimientos transversales (del equipo; desbloquean todo; ver tasks/analysis/00-sintesis.md)
- [ ] C.1 Medición: GA4 + Meta Pixel + CAPI + listener de `data-*` + Consent Mode v2 + UTM en WhatsApp (ads+RRSS)
- [ ] C.2 Costura `getListings/getListing` delante del sample (arquitectura+SEO)
- [~] C.3 Datos reales de marca: HECHO bio real de Boris (+ frase de cierre), años (`yearsActive: 7`), geo y openingHours ya puestos. PENDIENTE: comisión (`feePercent` null) y autoría/fecha del blog.
- [x] C.4a Quitar "+500 clientes" → "107 reseñas de clientes" (dato real)
- [x] C.4b Publicar los 3 posts del blog (draft:false) — ya indexables
- [x] C.4c `sameAs` (IG×2 + TikTok) en agentSchema
- [x] C.4d Mapear a token los 2 fondos de vídeo `#161615` → `--color-fixed-ink`
- [ ] C.4e `openingHours`/`priceRange`/`geo` en schema — PENDIENTE: requiere datos reales (horario, geo)
- [ ] C.4f Migrar fotos de pisos a `astro:assets` — REFACTOR (las cards son islas React con `<img src>`, no quick win)
- [~] C.4g Hex literales → tokens. HECHO en CSS (sections.css + property.css = 0 hex): aurora del héroe → `--gradient-hero`; panel del simulador → `--color-on-fixed-ink{,-muted,-faint}` + `--color-fixed-line`; brand-lock → `--color-ink`; favorite-toggle → `--color-fixed-ink`/`--color-on-accent`; visor galería → `--color-fixed-backdrop`. PENDIENTE (fuera del alcance solo-CSS): `Logo.astro:18` (hex inline) y `HeroGradient.tsx` (colores del shader WebGL en JS).
- [ ] **CHECKPOINT 0** — revisión humana de cimientos + accesos (feed Habitatsoft, GA4/Pixel, pull keywords)

## FASE DS — Design System
- [ ] 0.1 Tokens de espaciado y movimiento formalizados en `tokens.css` (cero hex nuevo fuera de tokens)
- [~] 0.2 Primitiva `Section.astro` creada + prop `wrapClass` añadido (desbloquea secciones con grid propio) + probada con 0 diff en `Trust`, `ServicesGrid` y `TownLinks` (build verde, markup idéntico salvo `data-reveal="true"`≡`data-reveal`). Pendiente: migrar las ~13 secciones restantes. Omitido a propósito: variante de fondo `canvas/surface` (ninguna sección pinta fondo por el envoltorio hoy → YAGNI).
- [ ] 0.3 Primitiva `Button` con variantes/estados (hover sin transform, active scale 0.97, 44px)
- [ ] 0.4 Primitiva `MediaCard` aplicada a PropertyCard y a las cards de alquiler
- [ ] 0.5 Guía de estilo viva `/es/estilo/` (noindex) con paleta, tipografía, primitivas y estados
- [ ] **CHECKPOINT A** — revisión humana del design system

## FASE 1 — Arquitectura geo/locale
- [ ] 1.1 Modelo de territorio con `tier` y `parent` (Malgrat/Maresme = local)
- [ ] 1.2 Taxonomía de URL fijada y documentada; hueco `alquiler/[town]` y ciudad nombrados
- [ ] 1.3 Semilla hreflang-ready verificada con un locale de prueba (y revertida)
- [ ] 1.4 Costura `getListings`/`getListing` delante del sample (componentes no leen el JSON directo)
- [ ] **CHECKPOINT B** — revisión humana del modelo de datos

## FASE 2 — Wireframes + auditoría de conversión (solo documentación)
- [ ] 2.1 Wireframe + criterio de éxito: Home → `tasks/wireframes/home.md`
- [ ] 2.2 Wireframe + criterio: Valoración
- [ ] 2.3 Wireframe + criterio: Comprar
- [ ] 2.4 Wireframe + criterio: Vender
- [ ] 2.5 Wireframe + criterio: Alquilar (inquilino vs propietario)
- [ ] 2.6 Wireframe + criterio: Ficha de inmueble
- [ ] 2.7 Wireframe + criterio: Listado
- [ ] 2.8 Wireframe + criterio: Pueblo de captación
- [ ] 2.9 Lista de desajustes página-vs-wireframe (alimenta la Fase 3)
- [ ] **CHECKPOINT C** — revisión humana de wireframes y desajustes

## FASE 3 — Aplicar el DS a cada sección
- [ ] 3.1 Home refactorizada a primitivas + copy sin simetría de plantilla
- [ ] 3.2 Valoración
- [ ] **CHECKPOINT D** — revisión humana tras Home + Valoración
- [ ] 3.3 Comprar
- [ ] 3.4 Vender
- [ ] 3.5 Alquilar
- [ ] 3.6 Ficha
- [ ] 3.7 Listado
- [ ] 3.8 Pueblo

## FASE 4 — Escalado por fases de negocio
- [ ] 4.1 Local: páginas de pueblo con datos reales (€/m², ventas recientes) — 8 pueblos
- [ ] 4.2 Barcelona: landing de ciudad enlazando el Maresme
- [ ] 4.3 Cataluña/España: hub por comunidad + `/ca/` real
- [ ] 4.4 Internacional: `/en/` y `/fr/` con hreflang de 4 idiomas
- [ ] **CHECKPOINT E** — revisión humana al cierre de cada subfase

## Preguntas abiertas (bloquean el arranque)
- [ ] ¿Orden: design system primero o wireframes primero?
- [ ] ¿Acceso al feed Habitatsoft para 1.4, o sample por ahora?
- [ ] Fuente real de €/m² por pueblo para 4.1
