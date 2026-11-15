# DESIGN-SYSTEM — Conroma web

> Documentación del sistema de diseño **ya existente** (no inventado). Fuente de verdad del código:
> `src/styles/tokens.css` (tokens) y `ESTANDAR.md` (norma de redacción + diseño, vinculante). Guía
> viva navegable en `/es/estilo/`. Fecha: 2026-11-15.

## 1. Fundamentos

### Tipografías (tokens `--font-*`)
| Rol | Token | Familia | Uso |
|---|---|---|---|
| Display/titulares | `--font-display` | Helvetica Neue → Hanken Grotesk Variable → Arial | H1/H2 (sistema, sin descarga para la mayoría) |
| Cuerpo | `--font-body` | **Hanken Grotesk Variable** (auto-alojada) | texto corrido, UI |
| Acento | `--font-accent` | **Playfair Display** italic | `.highlight`, remates editoriales |
| Firma | `--font-script` | **Pacifico** | firma del CEO (`CeoSection`) |
| Mono | `--font-mono` | ui-monospace… | datos/código |

Fuentes **auto-alojadas** en `public/fonts/` con `@font-face` en `src/styles/fonts.css` + preload de
Hanken y Playfair (rendimiento: sin FOUT, CLS 0).

### Escala tipográfica (responsive con `clamp`)
`--text-display` · `--text-h1` · `--text-h2` · `--text-h3` · `--text-title` · `--text-body` (1.0625rem)
· `--text-small` (0.9375rem) · `--text-caption` (0.875rem).

### Color — la regla que gobierna
**Ningún fondo sin su pareja de texto.** Cada `--color-*` de fondo tiene un `--color-on-*`
emparejado; si escribes `background`, escribes `color` en la misma regla. Paleta: **ámbar** (acento)
+ **stone** (neutros) en **oklch**, con semánticos `positive`/`negative`/`whatsapp` (texto oscuro
`--color-on-*` encima). Modo claro/oscuro por tokens; los `--color-fixed-*` **no** se invierten.
Marca: amarillo, negro, gris, blanco. **Prohibido el azul como color de marca** (solo gráficas).

### Radios · Espaciado · Sombras · Movimiento
- Radios: `--radius-xs 8` · `sm 12` · `md 18` · `lg 26` · `xl 36` · `pill 999`.
- Espaciado: `--space-1..12` (4→48 px) + `--space-gutter` (20/24) + `--space-section` (clamp 72–128).
- Sombras: `--shadow-1/2/3` (**máximo `--shadow-3`** por ESTANDAR; sin sombras dramáticas).
- Duración: `--duration-fast 180` · `base 240` · `slow 450`; curvas `--ease-out`, `--ease-in-out`.
- Animación: solo `transform`/`opacity`; `:active` = `scale(0.97)`; **sin `transform` en `:hover`**.

### Breakpoints
Móvil `<40rem` · intermedio `<60rem` · escritorio `≥60rem`. **El móvil es ~97% del tráfico**: se
verifica a 390px antes de dar nada por bueno.

## 2. Componentes (inventario `src/components/`)
- **Base:** `Button` (variantes `primary` / `ghost` / `ink`; renderiza `<a>` o `<button>`), `Icon`,
  `Logo`, `Section`, `MediaCard`, `Breadcrumbs`.
- **Layout:** `SiteHeader`, `SiteFooter`, `PageHero` (H1 + eyebrow + lead + slot de acciones).
- **Secciones:** `Steps`, `Faq`/`FaqSection`, `ServicesFeature`/`ServicesGrid`, `ContactSection`/
  `ContactBand`, `Contador`, `Trust`/`TrustBand`, `Testimonials`, `TeamMembers`/`TeamGallery`,
  `ReformGallery`, `StorySection`, `FamilyShowcase`, `InstagramSection`/`InstagramVideos`,
  `OfficeMap`, `TownLinks`, `ValuationBlock`, `ToolsPreview`, `CeoSection`, `BlogPreview`.
- **Islas React (`src/islands/`):** formularios (`ContactForm`, `ValuationWizard`), catálogo
  (`ListingExplorer`, `PropertyCard/Grid/Gallery`, `FilterSheet`), mapas (`OfficeMapLibre`,
  `ApproxLocationMap`), utilidades (`FavoriteToggle`, `SavedProperties`, `HeroSearch`, `CookieNotice`).

## 3. Reglas de uso (de `ESTANDAR.md`)
- Pares fondo/texto obligatorios (arriba). Botones de acción: fondo negro, texto blanco; amarillo
  solo acento, nunca texto largo ni brillos.
- Un H1 por página; jerarquía H1→H2 (`section__title`)→H3 (`feature__title`).
- Sin emojis en UI ni entregables. Copy humano (criterio `no-ai-slop`/`no-slop-ui`).
- Accesibilidad: focus visible, `skip-link`, labels en formularios, targets suficientes.

## 4. Estado de consistencia (auditoría)
Sistema **sólido y aplicado**: tokens centralizados, pares de color, componentes reutilizados, un H1
por página, headings reales `<h2>/<h3>`. No se detectaron estilos duplicados graves. Pendiente de
verificación con herramienta: contraste AA real por par y navegación completa por teclado (M-03).
