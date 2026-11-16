# Estándar Conroma — redacción y diseño

Documento único para `conroma-web`. Fusiona cinco fuentes y resuelve sus contradicciones:

| Fuente | Qué aporta |
|---|---|
| `no-ai-slop` | Patrones de redacción que delatan texto generado |
| `no-slop-ui` | Patrones visuales que delatan interfaz generada |
| `emil-design-eng` | Criterio de movimiento, estados y rendimiento |
| `ui-styling` | La convención de pares fondo/texto (shadcn) |
| `impeccable` | Modo de superficie y listón de acabado |

**Cuando dos fuentes chocan, manda lo que dice este documento.** Y por encima de todo manda la
marca Conroma: amarillo, negro, gris y blanco; Hanken Grotesk, Playfair Display y Pacifico.

---

## 0. La regla que gobierna el color

**Ningún fondo se pinta sin su pareja de texto.** Cada color de fondo tiene un token
`--color-on-*` emparejado. Si escribes `background`, escribes `color` en la misma regla.

```css
/* Bien */
.boton-destacado {
  background: var(--color-accent);
  color: var(--color-on-accent);
}

/* Mal: el texto queda a merced de lo que herede */
.boton-destacado {
  background: var(--color-accent);
}
```

### Pares disponibles

| Fondo | Texto | Claro | Oscuro |
|---|---|---|---|
| `--color-accent` (amarillo) | `--color-on-accent` | 11,88:1 | 11,88:1 |
| `--color-ink` | `--color-on-ink` | 18,11:1 | 17,12:1 |
| `--color-canvas` | `--color-on-canvas` | 18,11:1 | 17,12:1 |
| `--color-surface` | `--color-on-surface` | 18,11:1 | 15,94:1 |
| `--color-surface-2` | `--color-on-surface-2` | 15,83:1 | 16,57:1 |
| `--color-accent-wash` | `--color-on-accent-wash` | 5,42:1 | 10,53:1 |
| `--color-positive` | `--color-on-positive` | 6,49:1 | 9,86:1 |
| `--color-negative` | `--color-on-negative` | 7,36:1 | 8,21:1 |
| `--color-whatsapp` | `--color-on-whatsapp` | 7,46:1 | 7,46:1 |

Los nueve pares superan 4,5:1 en ambos temas. Medido, no estimado.

### Pares fijos

Lo que se pinta **encima de una foto** o sobre un color que no cambia con el tema usa la
familia `--color-fixed-*`, que no se invierte nunca:

`--color-fixed-ink`, `--color-fixed-paper`, `--color-fixed-accent-deep`,
`--color-fixed-wash` + `--color-on-fixed-wash`.

Una etiqueta blanca sobre la foto de un piso debe seguir siendo blanca en modo oscuro, porque
la foto no cambia.

### Qué significa en la práctica

- Botón **amarillo o blanco** → letra **negra**.
- Botón **negro** → letra **blanca** (o amarilla si es un acento deliberado).
- Verde WhatsApp → letra **verde muy oscura**, nunca blanca. Blanco sobre `#25d366` da 1,98:1
  y es ilegible, aunque sea lo que hace WhatsApp.

### Botones: amarillo yellow-300 (regla del dueño, 2026-11-16)

Los botones usan **`--color-button` = `oklch(90.5% 0.182 98.111)`** (Tailwind yellow-300) con
letra negra `--color-on-button`, en los dos temas. El acento de marca `--color-accent` (amber-300)
queda para checks, cursores y detalles; **no** para botones.

- **Primario (CTA principal):** relleno `--color-button`, texto negro. Hover: `--color-button-2` (yellow-200).
- **Estándar (`button--ghost`, todo botón que no es el CTA principal):** contorno y texto en
  `--color-button-line`: **amarillo en oscuro y sobre foto**, **tinta en claro** (el amarillo sobre
  crema da 1,3:1 y no se lee). Al pasar el cursor se **rellena de amarillo con texto negro**.

El fondo y el color del texto cambian **juntos**, en la misma regla. Cambiar solo el fondo
es lo que deja texto ilegible.

### Librerías de terceros: HeroUI

HeroUI trae su propia paleta y, sin tocarla, **sus botones salen azules**. No es un fallo de
CSS propio: es que `<Button variant="primary">` usa `--accent` de HeroUI, no tu
`--color-accent`.

Los tokens de HeroUI están mapeados a los de Conroma en `tokens.css`:
`--accent`, `--accent-foreground`, `--accent-hover`, `--default`, `--background`, `--danger`…

**Si añades otra librería de componentes, lo primero es mapear su paleta.** Si no, mete sus
colores por la puerta de atrás y ningún repaso del CSS propio lo detecta.

### Prohibido

- Hex literales en reglas de componente. Los literales solo viven en la definición de tokens.
- Colores fuera de la paleta de marca.
- Cambiar el fondo en `:hover` sin comprobar que el texto heredado sigue contrastando.

---

## 1. Diseño

### Forma

| Elemento | Regla |
|---|---|
| Botones | radio **10px**. Excepciones del sistema editorial (§5): flecha cuadrada 40px radio 2px y la píldora del cierre |
| Enlaces de navegación | radio **8px** |
| Tarjetas | radio 12–18px |
| Cápsula (999px) | solo chips, avatares y botones **circulares** de icono |
| Sombras | máximo `--shadow-2` en hover; desenfoque nunca ≥24px |
| Bordes | 1px sólido. Ni degradados ni bordes decorativos gruesos |

### Prohibiciones heredadas de `no-slop-ui`

Gradientes como decoración, glow de color, cristal esmerilado en elementos de interfaz,
texto con degradado, rejilla de tarjetas-métrica por defecto, y la combinación
*etiqueta en versalitas + titular* repetida en cada sección.

**Prohibido en secciones (regla del dueño, 2026-11-16) — son tics de diseño hecho por IA:**
- **Etiquetas sobre el título** (eyebrow, kicker, `(EL PROCESO)`, «Comparativa», «Guías»): la
  sección empieza por su título.
- **Chapas y badges** («Recomendada», «Rápida», «Nuevo», «Popular») dentro de bloques de contenido.
- **Toggles de adorno** (interruptores, controles segmentados, pestañas) que no filtran datos reales.
  Un control solo existe si cambia lo que el usuario ve y lo necesita.
Si la sección necesita contexto, lo da el título o una frase de entrada (`.section__lead`), no una etiqueta.

### Tipografía

- Cuerpo: **Hanken Grotesk**, mínimo **14px**. Ningún texto por debajo de 13px.
- **Titulares (sistema editorial, §5):** Hanken Grotesk **300**, tracking `-0.06em` en display y
  `-0.05em` en `.section__title`. Playfair Display ya no se usa en páginas rediseñadas.
- **Pacifico**: solo marca.
- Versalitas con tracking: reservadas a etiquetas realmente categóricas. Nunca en preguntas.

### Movimiento

Aquí es donde `no-slop-ui` y `emil-design-eng` se contradicen. Resolución:

| Situación | Regla | Por qué |
|---|---|---|
| `:hover` | Solo color, fondo o sombra. **Cero transform** salvo el orbe del cierre (§5) | Mover al pasar el ratón es el tic de interfaz generada |
| `:active` (pulsación) | `transform: scale(0.97)` **sí** | Es respuesta a una acción, no decoración. Sin ella el botón parece muerto |
| Entradas | Desde `scale(0.95)` + `opacity: 0`. Nunca desde `scale(0)` | Nada aparece de la nada |
| Duración | 100–250ms. Excepción: el revelado del cierre (0,7s), el único momento firmado de la página | Por encima de 300ms la interfaz se siente lenta |
| Curva | `var(--ease-out)`. **Nunca `ease-in`** | `ease-in` retrasa el arranque, justo cuando se está mirando |
| `transition` | Propiedades concretas. Nunca `transition: all` | |
| Hover en táctil | Dentro de `@media (hover: hover) and (pointer: fine)` | En móvil el hover se dispara al tocar |
| Rendimiento | Animar solo `transform` y `opacity` | Lo demás provoca layout y repintado |

`prefers-reduced-motion` no significa cero animación: significa conservar opacidad y color,
y quitar el movimiento.

### Móvil manda

El móvil es el **97%** del tráfico. Se verifica a 390px antes de dar nada por bueno.

- Objetivo táctil mínimo **44×44px**. Excepciones legítimas: enlaces dentro de una frase y
  enlaces ocultos hasta recibir foco.
- Cero scroll horizontal.
- Comprobación: `document.documentElement.scrollWidth === clientWidth` a 390px.

#### Reglas de UI móvil (estilo app) — una regla general, no caso por caso

- **Botones de acción a ancho completo.** En teléfonos (`<40rem`), todo `.button` dentro de
  `<main>` ocupa el ancho del contenido (uno por línea, etiqueta centrada). Header, dock móvil
  y pie quedan fuera. Implementado en `components.css` (`main .button { width: 100% }`), no con
  clases por botón. Los grupos de 2 CTAs (p. ej. WhatsApp + Llamar) se apilan a ancho completo.
- **Un solo tamaño de botón.** Ninguno más grande que otro: `.button--large` se normaliza al
  tamaño base en `<60rem`.
- **Jerarquía de CTAs.** Primario = amarillo (`button--primary`), texto/iconos en tinta oscura
  (contraste correcto, incluido el icono de WhatsApp). Secundario = contorno (`button--ghost`).
- **Alineación coherente.** En páginas rediseñadas manda §5 (héroe abajo a la izquierda; Compare,
  FAQ y cierre centrados). En el resto: el **héroe** se centra (elemento distintivo); **todas las demás
  cabeceras de sección** (título + lead) van a la **izquierda** de forma uniforme en
  móvil (las `section__head--center` se alinean a la izquierda en `<40rem`). Las cifras del
  contador también van a la izquierda en móvil (coherencia con la cabecera).

---

## 2. Redacción

La voz de Conroma es **familiar, directa y de pueblo**. Frases cortas, segunda persona del
singular, datos concretos. Las muletillas habladas ("Va, dime cuánto") y las admisiones
honestas ("si un piso no te conviene, te lo decimos") **son la marca**: no se pulen.

### Patrones a cortar

| Patrón | Ejemplo real del sitio | Arreglo |
|---|---|---|
| Registro corporativo | "Somos un equipo experto en asesoría inmobiliaria" | Hablar como la familia que sois |
| Cierre aspiracional | "la vivienda que siempre has deseado" | Cortar la cola |
| Revelación tras dos puntos | "...pero no la idea: tratarte como a alguien del pueblo" | Punto en vez de dos puntos |
| Contraste binario | "para que te den tranquilidad y no trabajo" | Decir el mecanismo |
| Aforismo de cierre | "Personas reales, casas con nombre" | Titular llano |
| Cifra sin fuente | "+500 clientes satisfechos" | El dato real: 107 reseñas |
| Pregunta retórica autocontestada | "¿Piensas en vender? Empieza por saber cuánto vale" | Afirmarlo |
| Perífrasis por un dato | "la primera década de este siglo" | El año |

### Simetría de plantilla

Es el defecto más invisible y el que más delata. Ahora mismo hay **9 H1 con la misma forma**
(cláusula corta + coma + remate resaltado terminado en punto), **11 eyebrows en pregunta** y
**4 FAQ con el mismo "X: lo que nos preguntan"**.

Cada frase está bien. Leídas en seguidilla, se nota la plantilla. Rompe una de cada tres.

### Lo que no se toca

Español, no inglés: la lista de palabras vetadas de `no-ai-slop` ("delve", "leverage") no
aplica. Lo que traslada son los patrones, no el vocabulario.

---

## 3. Antes de dar algo por terminado

1. `npm run build` pasa.
2. Ningún par fondo/texto por debajo de 4,5:1, en los dos temas.
3. Cero `transform` en reglas `:hover`.
4. Ningún texto por debajo de 13px.
5. Revisado a 390px, sin scroll horizontal.
6. Ningún hex literal fuera de la definición de tokens.
7. Los titulares nuevos no repiten la forma del titular de al lado.

Verificar en una tanda, arreglar en una tanda, confirmar una vez y parar. Pulir en bucle
cuesta dinero y no mejora el resultado.

---

## 4. Reglas por componente (actuales y futuros)

Regla madre: **todo componente nuevo reutiliza una primitiva existente antes de crear CSS**
(`Section.astro`, `.button`, `.card`, `.field`). Si no encaja, se añade la regla aquí antes de
construirlo. Cada componente declara su anatomía (qué elementos lo forman) y sus estados.

### Escala y espacio (dirección Calvet)
- **Elementos protagonistas grandes.** Display del hero y cifras del contador son imponentes:
  `--text-display` llega a 7rem; una cifra de contador usa `clamp(3.75rem … 6.5rem)`.
- **Fondos planos** (`--color-canvas`: blanco en claro, negro carbón en oscuro). El color lo ponen
  el contenido y el acento amarillo, no fondos decorativos. Secciones que respiran, mucho aire.
- Ritmo de sección con `--space-section`; dentro, escala de Tailwind (4px). Nada de valores sueltos.

### `Section` (envoltura)
- Anatomía: `section.section > .wrap > [.section__head (h2.section__title + lead?)] + slot`.
- Usar la primitiva `src/components/Section.astro`. El `h2` va en el slot `title` (admite `highlight`).
- `.section__title`: peso 300, leading 1.02, tracking −0.05em (sistema editorial, §5).
- Para un `wrap` con clase extra (grid propio), usar el prop `wrapClass` (p.ej. `wrapClass="town-links__grid"`).

### Hero
- Ver §5 (`HeroStory`): foto real nítida a sangre, velo general suave y un velo fuerte anclado
  solo detrás del bloque de texto. El texto y el CTA mandan.
- Un H1, un CTA/buscador primario. Prueba social (4,7★ · 107) de apoyo, discreta.

### Botón
- Formas: radio 10px (`--radius-sm` conceptual). Cápsula (999px) solo en chips, botones circulares de
  icono y la píldora de WhatsApp del cierre.
- Variantes: `--primary` (yellow-300, texto negro), `--ghost` = **estándar** (contorno amarillo en
  oscuro/foto, tinta en claro), `--ink` (negro, texto blanco). El terciario no es botón: es `.text-link`.
- **Hover por variante, cambiando fondo y color juntos y CERO `transform`** (§1): el primario sube a
  yellow-200 (`--color-button-2`); el estándar se **rellena de amarillo con texto negro**; el `--ink`
  oscurece ligeramente. Ver §0 «Botones».
- **`:active`: `transform: scale(0.97)`** — único sitio donde se permite transform (es respuesta a la acción).
- Táctil ≥44×44px. `button--large` para CTAs protagonistas.
- *Sin vidrio en CTAs* (revisión 2026-11-16, base `no-slop-ui`): los CTA son sólidos siempre, también
  sobre foto. Sobre foto, la legibilidad la da el velo funcional bajo el texto, no el botón.

### Card
- Base `.card`: radio 12–18px, borde 1px `--color-line`, sombra máx `--shadow-3`, fondo `--color-surface`.
- **Contorno y radio idénticos** entre cards del mismo nivel (coherencia). Nunca vidrio en cards sobre
  fondo plano (no se ve). Foto a sangre arriba + cuerpo con padding cuando lleva imagen.
- Hover de card: solo sombra/elevación por color, sin `transform` (salvo `:active` en cards accionables).

### Field / Input
- `.field` = `label.field__label` (visible, encima) + `.field__control`. Nunca placeholder como etiqueta.
- Foco: anillo visible (`:focus-visible`). Error debajo del campo, `aria-invalid`.
- Teclado móvil correcto por `type` (email, tel, number).

### Contador / Stat
- En páginas rediseñadas: `ProofBand` (§5), cifras **estáticas** (no cuentan desde 0) que pasan de
  gris a tinta con el scroll. Resto: `.stats > .stat`, cifra en `--font-display`, `tabular-nums`.
- Cifras sin fuente = **provisionales**, marcadas en el dato y editables en un solo sitio.

### Movimiento (todos)
- Entradas desde `scale(0.95)` + `opacity:0`, 100–250ms, `--ease-out`. Nunca `transition: all`.
- Solo `transform`/`opacity` se animan. `prefers-reduced-motion` conserva opacidad/color, quita movimiento.

### Qué revisar en cada componente (checklist)
Pares fondo/texto ≥4,5:1 en ambos temas · cero `transform` en `:hover` (salvo orbe) · táctil 44px · 390px sin scroll
horizontal · ningún hex fuera de tokens · un CTA primario por bloque · estados hover/activo/foco/disabled
distintos y on-brand.

---

## 5. Sistema editorial (referencia concretemanagement.ch) — fijado al terminar Vender

Decidido por el dueño el 2026-11-16 y construido en `/es/vender/`. **Toda página que se rediseñe
sigue estas reglas.** Si una sección nueva no encaja, se añade aquí antes de construirla.

### Ritmo de página
- **Bandas planas alternas** `--color-canvas` / `--color-surface-2`, sin bordes ni tarjetas entre ellas.
  Nada de patrón de puntos de fondo.
- Cada sección abre **directamente con su `.section__title`** Hanken 300. Sin etiquetas, chapas ni
  toggles encima o dentro (§1, «Prohibido en secciones»). Una frase de **puente** (`.section__bridge`)
  anuncia la sección siguiente cuando el paso no es obvio.
- **Un solo acento:** amarillo. Checks y cursor en `--color-accent`; botones en `--color-button` (§0).

### Secciones (anatomía y reglas)
| Sección | Componente | Regla |
|---|---|---|
| Héroe | `HeroStory` | Foto real nítida, bloque de copia **abajo a la izquierda**: migas → H1 → lead → flecha. Ritmo **12 / 20 / 32 px**. H1 máx 12ch, lead máx 36ch y una sola frase. Velo fuerte anclado al bloque, no a toda la foto. Reserva el dock móvil (76px + safe-area). Crédito de foto visible si la licencia lo pide. |
| Respuesta | `Statement` | Una frase grande (Hanken 300, máx 30ch) sobre gris. Responde la intención de búsqueda; sin botones. |
| Cifras | `ProofBand` | Cifras gigantes centradas, estáticas, con fuente enlazada (≥44px). Pasan de gris a tinta con el scroll. |
| Proceso | `StoryScroll` | Numeral grande + título + texto; en escritorio la foto queda fija y los pasos pasan (scroll-driven, con fallback). |
| Comparativa | `Compare` | **Dos mitades sin bordes** (la segunda sobre gris). Las dos opciones son válidas y en positivo («te encaja si…»); **el check amarillo solo en la opción Conroma**, la otra lleva punto gris. Conroma lista más ventajas. Prohibido el tono de alarma. |
| Valoración | `ValuationBlock` | Sin tarjeta: formulario + CTA primario sobre la banda; las dos maneras separadas por una línea suave, sin chapas ni etiquetas. |
| Guías | `GuideTeaser` | Lista editorial con fecha, título y entradilla; separadores finos. |
| FAQ | `FaqSection` | Cabecera **centrada** (título y lead) y columna de 44rem. Filas sueltas con contorno muy suave (`--color-line` al 40%), radio 8px, separadas 8px. Cerrada: pregunta en ink-2; abierta: en tinta, velo de fondo al 4% y chevron girado 180°. Cierra con «¿Te queda alguna duda?» y **botón estándar** a WhatsApp (`origin` obligatorio para GTM). |
| Cierre | `ClosingCTA` | Foto a sangre con velo, estado real de la oficina (hora de Madrid), titular en dos tonos, orbe que revela la píldora amarilla de WhatsApp + enlace de llamada. Es el único momento animado «firmado» (0,7s); con reduced-motion todo se ve a la vez. |

### Bordes
- Si un borde se nota más que el contenido, sobra. Separadores: 1px `--color-line` al 40% o nada.
- Nada de tarjetas con borde en bandas editoriales, ni chapas («Recomendada»).

### Movimiento
- Scroll-driven en CSS (`animation-timeline: view()`) dentro de `prefers-reduced-motion: no-preference`
  y `@supports`. Sin JS para el movimiento salvo el revelado del cierre.
