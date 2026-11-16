# Rediseño de páginas · secciones, narrativa y SEO local

Fecha: 2026-11-16 · Estado: **borrador para aprobación** · Repo: `conroma-web`

## 1. Intención y porqué

El dueño quiere que cada página del menú (Pisos, Comprar, Vender, Alquilar, Empresa, Equipo,
Blog) sea una **página completa**: secciones distintas entre sí, con fotografía, movimiento y un
hilo narrativo (storytelling) que lleve de una sección a la siguiente, con un texto y un orden
lógicos. Todo para salir **primeros en Google y en las respuestas de IA** (ChatGPT, Perplexity,
AI Overviews) para el sector inmobiliario **local** (Alt Maresme / Costa Brava sur), y con
contenido interno de alto valor: blog nutrido y páginas que ataquen búsquedas largas con buena
intención.

Hoy el problema es concreto: **casi todas las páginas usan la misma secuencia de bloques**
(`PageHero → Steps → Trust → Testimonials → FaqSection → ContactSection`). Cada bloque está bien;
leídos en fila, se nota la plantilla. Vender, la página que trae el cliente de más valor, es la
más corta (61 líneas).

## 2. Objetivos, no-objetivos, anti-objetivos

**Objetivos**
- Cada página cuenta una historia con principio, nudo y salida, y cada sección prepara la siguiente.
- Ninguna página repite la secuencia de otra; ninguna sección aparece dos veces seguidas con la misma forma.
- Cada página tiene **una** búsqueda principal y un trabajo claro (ver §6), sin canibalizar a otra.
- Contenido que Google y las IA puedan citar: datos reales en el HTML, respuestas cortas y
  autocontenidas, autoría y fuentes.
- Claro y oscuro correctos en todos los componentes (ver §4.3).

**No-objetivos**
- No se toca el CRM ni Supabase. No se cambia de framework (Astro + islas React se queda).
- No se rehacen fichas de inmueble ni el buscador (`ListingExplorer`) salvo lo que pida el tema.
- No se traducen páginas (ca/en/fr siguen sin publicar).

**Anti-objetivos (aunque “funcione”, sería un fracaso)**
- Animación que tape o retrase contenido: nada crítico (H1, cifras, precios, CTA) puede depender
  de JS para verse. Hoy el HTML de la home dice **«0 reseñas en Google, 0 años, 0 inmuebles»**
  porque las cifras solo suben con JS: Google y las IA leen ceros. Eso no se repite.
- Texto con cara de IA o de agencia corporativa (ver `ESTANDAR.md §2` y memoria de voz).
- Cifras inventadas, volúmenes de búsqueda estimados, reseñas en el schema.
- Azul de marca, amarillo como fondo de sección, cristal en tarjetas sobre fondo plano.
- Peor LCP/INP en móvil que hoy.

## 3. Restricciones

- **Móvil = 97 %.** Todo se diseña a 390 px primero y se verifica ahí, en los dos temas.
- **Marca:** negro `#1A1912`, amarillo `#F3BC16` solo acento, fondos carbón/blanco, sin azul;
  Hanken Grotesk + Playfair solo en remate de H1 + Pacifico solo marca. Reglas en `ESTANDAR.md`.
- **Movimiento** (`ESTANDAR.md §1`): hover sin `transform`; `:active` `scale(0.97)`; entradas
  desde `scale(0.95)`+`opacity:0`; 100–250 ms en microinteracciones; solo `transform`/`opacity`;
  `prefers-reduced-motion` quita movimiento y conserva el estado final.
- **Datos reales:** sin Google Ads conectado en NotFair no hay volúmenes. `docs/KEYWORDS.md` es
  el mapa de intención; las prioridades se ajustan cuando entren datos.
- **Fotografía disponible hoy:** equipo (14 fotos), reformas (23), servicios (3), inmuebles del
  feed. **No hay fotos de pueblos, playas, calles ni de la oficina por fuera.** El storytelling con
  fotos de lugar depende de conseguirlas (ver §9).
- Build estático Astro, publicado en Hostinger. `npm run build` + `npx vitest run` antes de cada commit.

### 3.1 Base obligatoria: `no-slop-ui` (diseño) y `no-ai-slop` (redacción)

Pedido por el dueño. Se aplica por encima de mis propuestas; donde choca con lo que pidió
(movimiento, storytelling) o con la marca, se resuelve así:

**Diseño (`no-slop-ui`)**
- **Sin eyebrows** (etiqueta pequeña encima del titular) en las secciones nuevas; se quitan de las
  que se rehagan. El H2 se basta solo.
- **Sin rejilla de tarjetas-métrica.** ProofBand es una fila de cifras con su fuente en texto, sin
  tarjetas. **Sin contador que sube desde 0**: la cifra real está en el HTML y se ve tal cual.
- **Sin cristal ni degradados decorativos.** CTAs sólidos también sobre foto (se retira la
  excepción de vidrio de `ESTANDAR.md §4 Botón`). Se elimina el resplandor radial
  `--gradient-hero`. El único degradado permitido es el velo funcional bajo texto sobre foto.
- **Sombras ≤ `0 2px 8px`**, tarjetas con radio 12 px, botones 10 px, nada de cápsula salvo
  chips e iconos circulares.
- **Rejillas predecibles.** HeroSplit usa una rejilla de 2–3 fotos alineadas, no un collage
  asimétrico. Nada de espacio muerto “para parecer caro”: ritmo con `--space-section`.
- **Selector Comprar/Alquilar:** el indicador de cápsula deslizante se cambia por un subrayado o
  borde inferior (patrón vetado: tabs con píldora deslizante).
- **Tipografía:** una familia (Hanken Grotesk) en todo lo nuevo. Playfair no se extiende a
  ninguna página nueva; queda solo donde ya está el remate del H1 de la home, por marca, y se
  revisa al rehacer la home.
- **Movimiento, conciliado con el storytelling que pidió el dueño:** solo movimiento ligado al
  scroll que **cuenta algo** (el paso activo de StoryScroll, la foto que acompaña al paso, la
  revelación antes/después). Opacidad y desplazamiento corto (≤ 24 px), sin rebote ni escala.
  **Nada se anima al cargar la página**: el hero llega quieto (bueno también para el LCP).
  Parallax: solo en la foto del HeroStory, ≤ 10 % de desplazamiento, y se elimina si en la
  revisión se ve decorativo. Hover: solo color, fondo o borde.

**Redacción (`no-ai-slop`, aplicado en español)**
- Cortar: contrastes binarios («no es X, es Y»), revelaciones tras dos puntos, preguntas
  retóricas autocontestadas, remates aforísticos, cierres-resumen («en definitiva»),
  atribuciones vagas («los expertos»), puffery («un antes y un después»), metadiscurso
  («lo importante es…»), fragmentos dramáticos y rayas (—) como muletilla.
- Prueba de portabilidad: si una frase valdría igual para otra inmobiliaria de otro pueblo, se
  cambia por un dato, un nombre, un plazo o un mecanismo de Conroma.
- Conservar la voz de la familia (`conroma-voz-redaccion`): muletillas habladas y admisiones
  honestas se quedan.
- Cada texto nuevo (secciones y artículos) pasa por el modo *detectar* de `no-ai-slop` antes del
  commit, y lo marcado se corrige.

## 4. Enfoque

### 4.1 Alternativas consideradas

| | Enfoque | A favor | En contra |
|---|---|---|---|
| **A** ✅ | **Librería de ~10 secciones nuevas y distintas** + cada página compuesta como una historia con ellas | Variedad real sin rehacer todo cada vez; una sola implementación de tema, motion y accesibilidad por sección; páginas futuras (long-tail, blog) reutilizan las piezas | Requiere disciplina para no volver a componer siempre igual (regla §5.3) |
| B | Maqueta a medida por página | Máxima singularidad | 7 diseños que mantener; los fallos de tema y motion se multiplican; las long-tail no tienen piezas |
| C | Reestilar los componentes actuales | Barato | No ataca la causa (la secuencia repetida); el resultado seguiría pareciendo plantilla |

**Elegido: A** (llamada mía; el dueño delegó el cómo). Es el único que da variedad y a la vez
deja piezas para las páginas long-tail y el blog.

### 4.2 Motion: CSS nativo primero, GSAP solo donde aporte

- Entradas/salidas de sección y scrollytelling con **CSS scroll-driven animations**
  (`animation-timeline: view()`), siempre dentro de
  `@media (prefers-reduced-motion: no-preference)` y
  `@supports ((animation-timeline: view()) and (animation-range: entry))`. Baseline desde
  oct-2026 (Safari 26, Firefox 159): sin soporte, el contenido **se ve estático y completo**
  (mejora progresiva, sin polyfill).
- Transiciones entre páginas con **cross-document view transitions** (`@view-transition
  { navigation: auto }`, dentro de `prefers-reduced-motion: no-preference`); sin soporte, navegación normal.
- GSAP (`src/lib/motion.ts`) se queda solo para lo que CSS no hace bien (SplitText del H1 si se
  conserva). `data-reveal` deja de ocultar contenido con JS: el estado inicial oculto solo existe
  dentro del `@supports`, nunca en el HTML.
- Imagen LCP de cada página: `fetchpriority="high"`, nunca `loading="lazy"`; el resto lazy.

### 4.3 Tema claro/oscuro: causa raíz y arreglo

Auditoría con script (contraste WCAG de cada texto sobre fondo liso, 9 páginas × 2 temas, sin
transiciones): **el texto sobre fondo liso pasa en todas** (el único aviso, el selector
Comprar/Alquilar, es un falso positivo: el texto va sobre la píldora amarilla).

Causa raíz encontrada, verificada en el navegador:
- **HeroUI solo cambia a oscuro con `data-theme="dark"` explícito**; no escucha
  `prefers-color-scheme`. En la primera visita de un móvil en modo oscuro (sin haber tocado el
  botón), la web sale oscura pero los tokens de HeroUI siguen en claro: `--surface`,
  `--overlay`, `--field-background` = blanco; `--foreground` = casi negro.
- **Solo se mapearon a Conroma `--accent*`, `--default*`, `--background*` y `--danger*`.**
  `--foreground`, `--muted`, `--surface*`, `--overlay*`, `--field-*`, `--border*`,
  `--separator*` y `--focus` siguen con la paleta gris-violeta de HeroUI (tono 285°, contra la
  regla de “sin azul”).

Arreglo (en un solo sitio, `tokens.css`):
1. El script de cabeza que ya lee `localStorage` (`BaseLayout.astro:71`) fija **siempre**
   `data-theme` (guardado → o, si no hay, el del sistema) y escucha el `change` de
   `matchMedia`. Así HeroUI y Conroma cambian a la vez.
2. Mapear **todos** los tokens de HeroUI a pares de Conroma, una vez, válidos en ambos temas.
3. Reauditoría con el mismo script + revisión visual de lo que el script no mide: texto sobre
   foto/degradado, bordes e iconos (≥3:1), desplegables y paneles abiertos.

Pendiente de confirmar con el dueño **qué componentes concretos vio mal** para incluirlos en la
reauditoría (el script no los marcó).

## 5. Sistema de secciones

### 5.1 Librería (nuevas o reescritas)

Cada una tiene una forma reconocible distinta. Todas: tokens de Conroma, legibles en ambos
temas, 390 px primero, contenido completo sin JS.

| Sección | Forma | Motion | Uso típico |
|---|---|---|---|
| **HeroStory** | Foto a sangre (o vídeo corto) + H1 grande + 1 CTA; velo legible en ambos temas | Quieto al cargar; parallax ≤10 % opcional (§3.1) | Arranque de página de servicio |
| **HeroSplit** | Texto a un lado, rejilla de 2–3 fotos alineadas al otro (apiladas en móvil) | Quieto al cargar | Empresa, Equipo |
| **StoryScroll** (scrollytelling) | Columna de pasos que avanzan mientras una foto/visual fija cambia (sticky en escritorio; en móvil, foto encima de cada paso) | `view-timeline` por paso | “Cómo vendemos tu piso”, “Cómo es comprar con nosotros” |
| **ProofBand** | Fila de cifras grandes **en el HTML** (107 reseñas, 4,7, años, inmuebles) con su fuente en texto; sin tarjetas | Ninguno (sin contador desde 0) | Tras el hero o antes del cierre |
| **CaseStory** | Un caso real: antes/después o “vendido en X días”, foto + cita del cliente | Comparador antes/después o entrada lateral | Vender, Reformas |
| **Compare** | Tabla/lista lado a lado (con nosotros vs por tu cuenta; venta vs alquiler) | Ninguno o mínimo | Vender, Alquilar |
| **MapTowns** | Mapa (maplibre, ya instalado) o lista de pueblos con dato vivo (nº en venta) | Puntos aparecen al entrar | Pisos, Comprar, Empresa |
| **QuoteFeature** | Una reseña grande, con nombre y fecha, sobre foto o plano | Fundido | Romper ritmo entre secciones densas |
| **GuideTeaser** | 2–3 artículos del blog de la intención de la página | Entrada escalonada | Todas: enlazado interno contextual |
| **FaqSection** (existente, reescrita) | Preguntas reales con respuesta corta (≤60 palabras) + `FAQPage` | — | Final de página de servicio |
| **ClosingCTA** | Cierre con una sola acción según intención (valorar / buscar / llamar) | — | Fin de cada página |

Se conservan y se reutilizan: `ListingExplorer`, `PropertyGrid`, `ValuationBlock`,
`ContactSection` (adelgazada), `TeamMembers`, `TownLinks`.

### 5.2 Arco narrativo común (cada página lo rellena distinto)

**Gancho** (qué te pasa) → **Prueba** (por qué fiarte, con datos) → **Cómo** (el proceso, contado)
→ **Caso** (alguien como tú) → **Dudas** (FAQ) → **Siguiente paso** (una acción).
Cada sección termina con una frase o enlace que **anuncia la siguiente** (transición de texto,
no solo visual).

### 5.3 Reglas de composición
- Ninguna página usa la misma secuencia de secciones que otra.
- Nunca dos secciones de la misma forma seguidas; alternar denso / respiro / foto.
- Una sola sección con fondo distinto por página (p. ej. ProofBand); el resto, fondo plano.
- Un CTA primario por sección como máximo.
- Titulares: romper la simetría de plantilla (`ESTANDAR.md §2`), uno de cada tres con otra forma.

## 6. Arquitectura por página

Búsquedas tomadas de `docs/KEYWORDS.md` (intención, sin volúmenes todavía).

### Orden de trabajo
1. **Tema** (§4.3) y **ProofBand con cifras en HTML** — afectan a todo y son baratos.
2. **Vender** — el cliente de más valor y búsquedas donde competimos con agencias, no con portales.
3. **Hubs de pueblo** `/es/inmobiliaria/{pueblo}/` — misma intención vendedora, local.
4. **Comprar** y **Pisos**. 5. **Alquilar**. 6. **Empresa** y **Equipo**. 7. **Blog** (índice + plantilla).

### Vender `/es/vender/` — «vender piso Malgrat de Mar», «vender casa Maresme»
Trabajo: que un propietario pida la valoración.
1. HeroStory — foto de una venta real / del equipo enseñando un piso; H1 directo; CTA «¿Cuánto vale mi piso?».
2. ProofBand — 107 reseñas · 4,7 · años en el Alt Maresme · pisos vendidos (si hay dato real).
3. StoryScroll — cómo vendemos: valoración → fotos/reforma ligera → difusión → visitas → notaría.
4. CaseStory — un piso vendido: punto de partida, qué hicimos, en cuánto tiempo (dato real del dueño).
5. Compare — vender con Conroma vs por tu cuenta (tiempo, papeles, precio, seguridad).
6. ValuationBlock — formulario corto (ya existe).
7. GuideTeaser — papeles para vender en Cataluña, vender piso heredado, etc.
8. FaqSection — honorarios, plazos, exclusiva o no, cédula/certificado energético.
9. ClosingCTA — WhatsApp / llamar.

### Comprar `/es/comprar/` — «comprar piso Malgrat de Mar», «comprar casa Costa Brava»
Trabajo: guiar al comprador (no repetir el catálogo; para eso está Pisos).
1. HeroSplit — «Comprar en el Alt Maresme» + collage de pisos reales.
2. MapTowns — dónde comprar: pueblos con precio orientativo y nº en venta (datos del feed).
3. StoryScroll — de la primera visita a la notaría (hipoteca, arras, notaría, gastos).
4. Herramienta — «¿Puedo comprar?» (enlace a la calculadora existente) presentada como tarjeta.
5. QuoteFeature — reseña de comprador.
6. PropertyGrid — 3 novedades → «Ver todo» (Pisos).
7. GuideTeaser + FaqSection + ClosingCTA (alerta de nuevos pisos).

### Pisos `/es/venta/` — «pisos en venta Maresme» (catálogo)
Trabajo: encontrar piso rápido. Se mantiene el buscador arriba; se añade contexto debajo:
MapTowns (por pueblo) · alerta «¿No ves el tuyo?» · GuideTeaser de compra · FAQ.

### Alquilar `/es/alquilar/` — decisión pendiente (§9)
Hoy mezcla inquilino y propietario y no hay pisos en alquiler publicados. Propuesta: enfocar la
página al **propietario que quiere alquilar** («alquilar mi piso Malgrat», «gestión de
alquiler Maresme»), con Compare (alquilar vs vender) y StoryScroll del servicio; el inquilino
recibe un bloque corto «Busco piso de alquiler» con aviso por WhatsApp. Enlaza a Gestión de
patrimonio sin duplicarla.

### Empresa `/es/empresa/` — «inmobiliaria familiar Malgrat», E-E-A-T
Trabajo: confianza y entidad (lo que leen las IA para recomendar). HeroSplit con foto real de la
oficina/familia · historia en línea de tiempo (años reales) · ProofBand · colegiaciones
(AFC/API, AICAT cuando esté) · MapTowns «dónde trabajamos» · ClosingCTA.
Equipo deja de repetir esto.

### Equipo `/es/equipo/` — personas (E-E-A-T de autor)
Trabajo: poner cara. HeroSplit de equipo · una tarjeta grande por persona (foto trabajando,
qué hace, idiomas, pueblos que lleva) · QuoteFeature · ClosingCTA. Cada persona con
`Person` schema; los artículos del blog firman con esas personas.

### Blog `/es/blog/` — autoridad temática
Índice por categorías (Vender, Comprar, Alquilar, Zona) con artículo destacado; plantilla de
artículo con índice, respuesta corta arriba (para IA), autor con foto, fecha de actualización,
fuentes y GuideTeaser/CTA por intención.

## 7. Contenido SEO interno

### 7.0 Quién se queda con cada búsqueda (anti-canibalización) — *llamada mía*
| Búsqueda | URL dueña | Las demás páginas |
|---|---|---|
| «inmobiliaria en {pueblo}», «vender piso en {pueblo}» | Hub `/es/inmobiliaria/{pueblo}/` | Vender y Valoración enlazan al hub con ese texto |
| «vender piso/casa en el Maresme», «cómo vender mi piso» (regional y de proceso) | `/es/vender/` | Los hubs enlazan a Vender para el proceso completo |
| «cuánto vale mi piso», «valoración gratis» (genérica) | `/es/valoracion/` | — |
| «cuánto vale un piso en {pueblo}» | **Sección dentro del hub** (precios publicados del feed), no URL nueva | Enlaza a Valoración |
| «pisos en venta en {pueblo}» | `/es/venta/{pueblo}/` | — |

No se crean URLs nuevas «vender piso en {pueblo}»: esa intención es la del hub. Los hubs se
componen con la misma librería: HeroStory local · sección «Cuánto vale un piso en {pueblo}»
(recuentos y precio *desde* del feed) · StoryScroll corto · QuoteFeature · FAQ local · ClosingCTA.

- **Datos del feed:** se publican **recuentos y precio «desde»**, nunca medias ni €/m²: el
  inventario es un volcado estático que se refresca al reconstruir, y una media desfasada sería
  un dato falso. La cifra lleva «a fecha de {build}». *Llamada mía.*
- **Contenido local por pueblo, solo con cartera suficiente**; nada de páginas finas
  generadas en masa.
- **Clústeres de blog** (pilar + artículos): Vender (papeles en Cataluña, herencia, plusvalía,
  honorarios, cédula), Comprar (gastos, hipoteca, comprar viviendo fuera), Alquilar (zona
  tensionada, seguro de impago, contrato), Zona (vivir en Malgrat / Pineda / Lloret).
- **Para IA (GEO):** cada página de servicio abre con una respuesta autocontenida de 2–3 frases;
  FAQ con preguntas literales (`docs/KEYWORDS.md` §GEO); datos con fecha; autoría real.
- El orden fino del calendario de contenidos espera a los volúmenes reales (NotFair + Google Ads).
- **Alcance de redacción en esta fase** (*llamada mía*): plantilla de artículo + índice del blog
  + **el clúster Vender completo (pilar + 4 artículos)**, que es el que alimenta la página
  prioritaria. Los demás clústeres, cuando haya volúmenes. GuideTeaser solo muestra artículos
  que existan; si una intención no tiene, la sección no se pinta.

### 7.1 Alcance de páginas (*llamada mía*)
Entran: las 7 del menú + hubs de pueblo + **home** (al final, es la más visitada y hoy repite la
plantilla). El arreglo de cifras en HTML (ProofBand) se aplica a la home ya en el paso 1.
Valoración, Reformas, Servicios, Gestión de patrimonio y Contacto quedan para una segunda
ronda con la misma librería.

## 8. Lo que decidió el dueño

- Rediseñar las páginas del menú con secciones distintas, fotografía, movimiento y storytelling.
- Mantener el orden del menú: Pisos, Comprar, Vender, Alquilar, Empresa, Equipo, Blog (revisando qué hace cada una).
- Contenido SEO interno de alto valor, blog nutrido y páginas long-tail.
- Usar las skills de diseño, crítica y `modern-web-guidance`.
- **(2026-11-16, durante la ejecución de la fase 1)** Empresa debe destacar la parte digital
  de Conroma: el trabajo en redes con contenido educativo (@conromaasesores), con reels
  embebidos, y artículos del blog escritos a partir de esos reels educativos. Debe ser una
  página de alto valor educativo. *Llamada mía:* va en **Empresa** (Equipo se queda con las
  personas). Los artículos salen del contenido real de cada reel (texto del post y lo que se
  dice en el vídeo). No se inventa nada que el reel no diga, y cada artículo enlaza a su reel.
- Delegó el cómo. Llamadas mías marcadas como tales: enfoque A, motion CSS-first, orden de
  trabajo empezando por Vender, Alquilar orientado a propietario, Empresa/Equipo separadas por papel.

## 9. Pendiente del dueño (cambia lo que se construye)

1. ~~Fotografía de lugar~~ **Decidido por el dueño:** fotos de stock de los pueblos y la zona
   mientras tanto, sustituibles por fotos propias más adelante. Preferencia de licencia:
   Unsplash/Pexels (uso comercial sin atribución obligatoria); Wikimedia Commons solo si la
   licencia lo permite y con su atribución visible. Cada foto se registra en un único archivo de
   créditos (origen, autor, licencia, URL) para poder cambiarla sin tocar componentes.
   **Descargadas (2026-11-16, con permiso del dueño): 22 fotos en `src/assets/lugares/`, créditos
   en `src/data/creditos-fotos.ts`.** Revisadas a ojo: todas son del sitio que dicen. Flojas:
   `santa-susanna/playa-olas` (solo mar, no se reconoce) y `blanes/sa-palomera` (color muy
   saturado; usar con cuidado). **Falta una foto de la playa de Malgrat**, la más necesaria:
   prioridad para la primera foto propia.
   - *Wikimedia Commons* (atribución obligatoria; CC BY-SA o dominio público): Malgrat
     (panorámica, Parc del Castell, torre del castell, vista del pueblo, desembocadura de la
     Tordera), Palafolls (castell, Can Puig), Santa Susanna (vista), Tordera (vista desde
     Miralles), Blanes (castell de Sant Joan).
   - *Pexels* (licencia Pexels: uso comercial sin atribución): Blanes (Sa Palomera, puerto,
     vista desde el castillo, Marimurtra), Lloret (playa con el castillo, aérea), Pineda (paseo
     en bici por la playa, árbol junto al mar), Santa Susanna (playa ×2), Calella (playa, faro).
   - Descartadas: Unsplash (solo mar genérico, nada reconocible), fotos de otros pueblos mal
     etiquetadas (Canet, Arenys, Calella de Palafrugell, Santa Susanna de Roma, Laribal de
     Barcelona) y fotos con personas identificables en primer plano. **Sin imágenes generadas
     por IA de lugares reales**: serían un lugar falso presentado como real.
   - Destino: `src/assets/lugares/{pueblo}/` (Astro las optimiza a AVIF/WebP) + `src/data/creditos-fotos.ts`
     + créditos visibles en el pie de foto o en una página de créditos enlazada desde el pie.
2. **Casos reales** para CaseStory (piso vendido, plazo, cita del cliente con permiso).
3. **Alquilar**: ¿confirmas enfocarla al propietario?
4. **Componentes que viste mal en claro/oscuro**: captura o página, para la reauditoría.
5. **Google Ads en NotFair** para ordenar long-tails y blog por volumen real.
6. **Datos de personas y reseñas** que hoy no existen en el repo: idiomas y pueblos de cada
   persona del equipo (`team.ts`), fecha de cada reseña (`testimonials.ts`), años clave de la
   historia (fundación, oficina, hitos) para la línea de tiempo de Empresa, y permiso de cada
   persona para firmar artículos con su nombre. Sin ellos esas piezas se omiten, no se rellenan.

## 9.1 Referencias de diseño (Awwwards / Dribbble), filtradas por `no-slop-ui`
URLs comprobadas el 2026-11-16 (sitios 200, Dribbble 202). Se toma la **estructura**, nunca la
paleta ni la animación. Solo Concrete y Loam House se revisaron a 390 px; el resto, en escritorio.

| Sección | Referencia | Qué se toma | Qué NO se toma |
|---|---|---|---|
| HeroStory | [Loam House](https://residences.loamhouse.com.au) | Foto a sangre, H1 corto, capítulos numerados | Formulario dentro del hero, renders |
| HeroSplit / bloques foto+texto | [Vander Hotel](https://www.vanderhotel.com) | Foto grande alterna con texto; cada bloque acaba en una acción | Eyebrow, animación de revelado |
| StoryScroll | [Mejuma Tuscany](https://mejuma-tuscany.com) | 5 pasos numerados, cada uno con su foto | — |
| StoryScroll (proceso Vender) | [Woonpact](https://woonpact.gent) | Línea de 5 fases con contador «01/05» y marca de paso actual | Fondo crema/amarillo |
| ProofBand | [Concrete](https://www.concretemanagement.ch) | 4 cifras con frase corta bajo el hero; «pedir valoración» siempre en el header | Animación de entrada, tarjetas en parallax |
| ProofBand (alternativa) | Loam House, capítulo 01 | 3 cifras concretas, sin tarjeta | — |
| CaseStory / Empresa / Equipo | [Fox Valuations](https://foxvaluations.com.au) | Informe firmado como prueba; bloque «conoce al director» con 3 datos; línea de valoración gratis | — |
| MapTowns | Concrete (selector de pueblos con foto en móvil) · Loam House cap. 06 «Place» | Pueblo con foto y tiempos a pie/coche | — |
| Tono local / ClosingCTA | [Masia Mont Rural](https://mont-rural.emblematica.agency) | Tono catalán cercano, CTA WhatsApp/teléfono | Etiquetas entre paréntesis |
| GuideTeaser | Woonpact (3 noticias con fecha) | Tarjetas de artículo con fecha visible | — |
| Ficha de inmueble | [Havenly](https://dribbble.com/shots/26723335-Havenly-Minimalist-Property-Details-Website) | Mosaico de fotos con «+15», rejilla de características, blanco y negro | — |
| Tarjeta de inmueble | [Auric-Studio](https://dribbble.com/shots/27303161-Property-Listing-Modal-UI-Luxury-Real-Estate) | Precio grande + fila de 3 datos | Etiqueta píldora, serif cursiva |
| Compare | [Robin Holesinsky](https://dribbble.com/shots/26423354-Real-estate-platform-website-card-motion) | Cifras grandes, comparación por zona | Motion, paleta gris azulada |
| Catálogo con mapa / MapTowns | [Innocent Paul Uchechukwu](https://dribbble.com/shots/26773928-A-Real-Estate-Map) | Mapa móvil con marcadores de precio y hoja inferior | Mapa a color: se apaga a gris/carbón |

**Huecos:** sin buena referencia para Compare en Awwwards ni para QuoteFeature; se diseñan desde
`ESTANDAR.md`. **Descartadas:** sitios WebGL (Silver Pinewood, Belgrade Arbor, bright avenue,
Lenval), Realevate (loader + azul), Rialto (azul) y los shots de «cómo funciona» de Dribbble
(azul, eyebrows).

## 10. Lo que queda al constructor
- Nombres de componentes y archivos, siguiendo `src/components/sections/` y `Section.astro`.
- Rangos exactos de `animation-range` y distancias de parallax dentro de §3/§4.2.
- Redacción final de cada sección con la voz de `conroma-voz-redaccion`, verificada contra `ESTANDAR.md §2`.
- Criterio de “cartera suficiente” para long-tails por pueblo (propuesta inicial: ≥8 inmuebles publicados).

## Verificación (cada página)
`npm run build` · `npx vitest run` · script de contraste en ambos temas · 390 px sin scroll
horizontal · HTML sin JS muestra todo el contenido y las cifras reales · LCP con `fetchpriority`
· reduced-motion deja todo visible · `ESTANDAR.md §3` · revisión contra la lista vetada de
`no-slop-ui` (eyebrows, cristal, degradados, sombras, cápsulas, hover con transform) · textos
pasados por el modo detectar de `no-ai-slop`.
