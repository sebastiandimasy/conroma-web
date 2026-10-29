# 05 — Marca Conroma: destilar la esencia

> Análisis de marca. No toca código. La norma vinculante sigue siendo `ESTANDAR.md`
> (color §0, forma §1, voz §2). Este documento destila y potencia la marca; no la cambia.
> Fecha: 2026-10-20.

---

## 1. Diagnóstico de la identidad actual

### Lo que ya es fuerte y diferencial (no se toca, se amplifica)

- **La voz hablada.** `site.ts` dice "Somos una pequeña familia", "agentes de calle, gente
  que conoce el sector y, sobre todo, el pueblo". Eso no lo escribe una cadena. Es un activo
  raro: casi ninguna inmobiliaria admite ser pequeña ni habla en primera persona de pueblo.
- **La prueba social es real y verificable.** Google 4,7/107. Los testimonios de
  `testimonials.ts` nombran el servicio concreto ("vendido en menos de una semana",
  "al ser joven y primeriza") y traen un caso francés ("Colaboración con empresa francesa").
  Nadie se inventa a Romain Traversino. Esa concreción es lo contrario del "+500 clientes".
- **Los cuatro idiomas con un propósito claro.** Català, castellano, English, Français no es
  un adorno de footer: es el territorio. Malgrat vive del residente catalán/castellano, del
  comprador francés de segunda residencia y del turista-inversor inglés. La marca ya atiende
  a los cuatro; falta que la web lo *demuestre* en vez de listarlo.
- **La honestidad como norma escrita.** `ESTANDAR.md §2` eleva a regla que "si un piso no te
  conviene, te lo decimos" es la marca y no se pule. Pocas marcas ponen la franqueza por
  escrito. Ese es el diferencial más defendible que tiene Conroma.
- **El sistema de color, medido.** `tokens.css` tiene nueve pares fondo/texto con contraste
  real (11,88:1 el amarillo), pares fijos para foto y mapeo de HeroUI. El amarillo
  `#f4ce4b` sobre negro `#161615` es una firma cromática reconocible y accesible a la vez.
- **El rombo del logo.** `Logo.astro` es un rombo geométrico con una "A" calada dentro.
  Es un activo de marca propio, escalable y memorable al margen del logotipo Pacifico.

### Lo que suena genérico, a plantilla o se contradice

- **El "about" se traiciona a sí mismo.** "encontrarle sentido a la vivienda que siempre has
  deseado" (`site.ts`) es exactamente el cierre aspiracional que `ESTANDAR.md §2` manda cortar.
  La frase buena ("pequeña familia", "el pueblo") convive con la cola de plantilla.
- **Simetría de plantilla (el defecto que más delata).** `ESTANDAR.md §2` lo cuantifica:
  9 H1 con la misma forma, 11 eyebrows en pregunta, 4 FAQ clónicos. Leídos de corrido, suenan
  a generador, por buena que sea cada frase suelta.
- **La bio del fundador está en placeholder.** `site.ts` tiene `bioPending: true` y tres
  "[Pendiente…]". La cara de la marca (Boris Conde Jr.) está sin contar. Es el hueco con más
  retorno: una marca "de personas con nombre" sin la historia de su persona principal.
- **Datos de confianza sin rellenar.** `yearsActive: null`, `feePercent: null`, `geo: null`.
  La marca de la honestidad concreta está dejando vacías justo las cifras concretas.
- **Cuarta tipografía fantasma.** `tokens.css` define `--font-display` como *Helvetica Neue*,
  no como las tres fuentes oficiales (Hanken, Playfair, Pacifico). O se asume y se documenta
  como neutral de sistema, o se retira. Hoy es una cuarta fuente sin criterio declarado.

---

## 2. Esencia de marca única

### Posicionamiento

**Para quien compra, vende o alquila en el Alt Maresme y la Costa Brava —resida aquí o venga
de fuera—, Conroma es la inmobiliaria del pueblo donde te atiende siempre una persona con
nombre, en tu idioma, que te dice la verdad aunque le cueste la venta.** Frente a los portales
(idealista, fotocasa), que son un buscador sin nadie detrás que responda. Frente a las grandes
cadenas (Engel & Völkers y similares), que tratan la casa como producto de lujo y a ti como
expediente.

### Propuesta de valor

Una sola persona te lleva de principio a fin —y sigue ahí después de firmar—, te habla en
catalán, castellano, inglés o francés, conoce la calle y el precio real, y te dice cuándo un
piso no te conviene. No un call center, no un algoritmo, no un comercial que rota.

### Arquetipo

**El Vecino honesto** (Everyman con columna de Sage). No el experto que te deslumbra ni el
lujo que te intimida: el de confianza que casualmente sabe de pisos y no te endulza la verdad.
Rasgos operativos: cercanía sin colegueo, franqueza sin brusquedad, saber de calle sin jerga.
Esto gobierna qué prometer, qué tono y qué NO decir (nada aspiracional, nada corporativo).

### El porqué, en una frase (memorable y honesta)

> **"Aquí no hablas con un portal: te lleva una persona del pueblo, en tu idioma,
> y te dice la verdad aunque pierda la venta."**

Variante corta para firma/RRSS: **"Una persona del pueblo, en tu idioma, de principio a fin."**

No es un eslogan de relleno: cada parte es una promesa verificable (persona con nombre /
cuatro idiomas / mismo responsable todo el proceso / franqueza). Si algún día deja de ser
verdad, deja de usarse.

---

## 3. Sistema verbal

### Principios de voz (cinco)

1. **Habla como la familia que sois**, no como "un equipo experto en asesoría". Primera y
   segunda persona, frase corta.
2. **El dato concreto antes que el adjetivo.** "107 reseñas", "vendido en menos de una semana",
   el año real. Nunca "+500 clientes satisfechos" ni "la primera década de este siglo".
3. **La franqueza es contenido, no disclaimer.** Decir cuándo algo no conviene es la marca.
4. **Afirma, no preguntes.** La duda retórica que se autocontesta es el tic de plantilla.
5. **Corta la cola aspiracional.** Termina en el hecho, no en "la casa de tus sueños".

### Do / Don't

| Haz | No hagas |
|---|---|
| "Te vendimos el piso en menos de una semana." | "Hacemos realidad tus sueños inmobiliarios." |
| "Si un piso no te conviene, te lo decimos." | "Tu satisfacción es nuestra prioridad." |
| "La misma persona, de principio a fin." | "Un equipo de profesionales a tu servicio." |
| "Te atendemos en català, castellano, English o Français." | "Atención multilingüe personalizada." |
| "4,7 de media en Google, con 107 reseñas." | "Miles de clientes nos avalan." |
| Punto y seguido. Frase corta. | Revelación tras dos puntos; contraste binario. |

### Titulares que rompen la simetría de plantilla (`ESTANDAR.md §2`)

El defecto es que 9 H1 comparten forma (cláusula + coma + remate resaltado + punto) y 11
eyebrows son preguntas. La cura es **variar la forma**, no solo el contenido. Rompe una de
cada tres. Formas a alternar:

- **Afirmación llana (declarativa):** "Vendemos pisos en Malgrat desde hace años. Y lo decimos
  con nombre." → *Corta el "¿Quieres vender?" de arriba.*
- **Dato al frente:** "4,7 en Google. 107 vecinos lo han dejado por escrito."
- **Imperativo directo, sin pregunta previa:** "Pásate por la oficina de la Av. Mediterránea.
  Te atendemos en tu idioma."
- **Voz hablada (muletilla de marca):** "Va, dinos qué buscas y por cuánto."
- **Admisión honesta como gancho:** "No todos los pisos valen lo que piden. Te decimos cuáles."
- **Frase sin remate resaltado** (para romper el patrón visual del `<em>` final):
  "La misma persona te lleva de la primera visita a la firma."

Eyebrows: sustituir la pregunta por **etiqueta categórica real** (versalitas solo aquí, nunca
en preguntas, según §1): `VENTA EN MALGRAT`, `GESTIÓN DE PATRIMONIO`, `REFORMAS`. Si un eyebrow
no es una categoría, se elimina y el H1 carga solo.

---

## 4. Sistema visual

Objetivo: que amarillo + negro + gris + blanco y las tres fuentes se lean como **una** identidad
reconocible, no como un tema de plantilla. Nada que cambiar en los tokens; sí reglas de uso.

### Color — consolidar, no añadir

- **El amarillo es el acento único y escaso.** `--color-accent #f4ce4b` sobre negro
  `--color-on-accent #161615` es la firma. Regla de escasez: **un solo bloque amarillo por
  pliegue** (el CTA primario o el dato estrella, no ambos). El amarillo repartido deja de ser
  acento y pasa a ser fondo.
- **Negro = autoridad y texto; gris = estructura; blanco = aire.** El `--color-surface-2`
  (gris `#f0f0ea`) separa secciones sin introducir una cuarta cromática.
- **Prohibiciones ya en §0/§1 que son identidad, no solo técnica:** cero degradados
  decorativos, cero glow, cero hex literal fuera de tokens. El amarillo plano es la marca;
  el amarillo con brillo es plantilla.
- **El rombo del logo como sello cromático:** rombo en amarillo sobre negro (o calado en
  blanco) como marca de agua / favicon / pin de mapa. Es el activo que viaja cuando el
  logotipo Pacifico no cabe.

### Tipografía — tres fuentes, tres trabajos (y uno que sobra)

| Fuente | Único trabajo | Error a evitar |
|---|---|---|
| **Hanken Grotesk** | Todo el cuerpo y titulares de sección. Mín. 14px. | Bajar de 13px. |
| **Playfair Display** | *Solo* el remate del H1 del hero. | Usarla en subtítulos o tarjetas (deja de ser acento). |
| **Pacifico** | *Solo* el logotipo. | Usarla en cualquier titular o eslogan. |

- **Pendiente visual a resolver:** `--font-display` apunta hoy a *Helvetica Neue*, una cuarta
  fuente no declarada en la marca. Decisión a tomar: (a) documentarla explícitamente como
  neutral de sistema para pantallas sin Hanken, o (b) apuntar `--font-display` a Hanken y
  retirarla. Sin decisión, es "mezcla sin criterio" (§1).
- **Regla de oro de escalabilidad:** Playfair y Pacifico son especias. Si aparecen en más de
  un sitio por página, la identidad se diluye. Hanken carga el 95% del texto.

### Reconocible y escalable

La identidad se reconoce por **tres constantes**, no por cada pantalla: (1) el par amarillo/negro
escaso, (2) Hanken como voz tipográfica única, (3) el rombo. Con esas tres, una tarjeta de
Instagram, un cartel en un escaparate de Barcelona y la web se leen como la misma marca sin
necesidad de repetir el logotipo Pacifico entero.

---

## 5. Arquitectura de marca para escalar (local → internacional)

**Modelo: masterbrand monolítica con descriptores geográficos.** Conroma es siempre la marca;
el territorio y el idioma son *atributos*, nunca submarcas nuevas. Esto encaja con el modelo de
datos del `plan.md` (FASE 1: territorios con `tier` local → comarca → provincia → ccaa → país):
la marca escala **añadiendo datos y una persona con nombre**, no creando identidades.

| Fase | Expresión de marca | Cómo se mantiene el alma familiar |
|---|---|---|
| **Local (Malgrat + Alt Maresme)** | "Conroma — Malgrat de Mar". Oficina física, Boris con nombre y cara. | El estado natural. Completar bio y cifras. |
| **Barcelona (ciudad)** | "Conroma — Barcelona". Misma marca, agente local con nombre. | Nunca "sucursal": una persona del barrio, no un call center. |
| **Cataluña / España** | Hub por territorio, `/ca/` real. | Cada territorio = una cara + reseñas propias de ese territorio. |
| **Internacional (`/en/`, `/fr/`)** | Mismo masterbrand, contenido traducido real. | El multilingüe deja de ser footer y pasa a promesa: "te atiende alguien en tu idioma". |

**Reglas de arquitectura:**

1. **Nunca una submarca nueva por territorio.** "Conroma Barcelona", no "BcnHomes by Conroma".
   Una sola marca que acumula reputación.
2. **Cada territorio hereda las tres constantes visuales** (§4) y la voz (§3). Lo único que
   cambia es el dato local (precio €/m² real, pueblos, cara del agente).
3. **La persona con nombre es la unidad que escala, no la oficina.** El alma familiar no se
   diluye si cada territorio tiene su "Boris": alguien con cara, reseñas y idioma.
4. **La franqueza y los cuatro idiomas son el techo de marca que no se negocia al crecer.**
   El día que Conroma sea un call center en cuatro idiomas sin nadie que te diga la verdad,
   dejó de ser Conroma.

---

## 6. Diferenciadores accionables

Cada promesa de la esencia (§2) debe ser **visible y medible**, no declarada.

### En la web

- **"La misma persona, de principio a fin"** → ficha de inmueble y páginas de servicio con
  **la cara y el nombre** del responsable (hoy `agent: null` en `site.ts`; rellenarlo es
  prioridad). Completar la bio de Boris (`bioPending`) con la historia real de la familia.
- **Cuatro idiomas como prueba, no como lista** → selector visible + mensaje "te atendemos en
  català, castellano, English, Français" junto al CTA, no escondido en el footer. Encaja con
  la semilla hreflang de `plan.md` FASE 1.3.
- **Franqueza como sección propia** → un bloque "Cuándo te decimos que no" o testimonios que
  incluyan la honestidad ("me dijeron que ese piso no me convenía"). Es el diferencial que ni
  el portal ni la cadena pueden copiar sin sonar falsos.
- **Confianza concreta** → rellenar `yearsActive`, `feePercent`, `geo`; mostrar 4,7/107 con
  enlace real a Google. La marca honesta no deja cifras en `null`.
- **Reformas como prueba visible** → antes/después de `@conromaenobras` en la página de
  reformas. Es evidencia de "seguimos ahí después de la venta".

### En RRSS

- **@conromaasesores = pueblo + datos; @conromaenobras = antes/después.** Mantener la división
  y aplicar la voz §3 (dato concreto, cero aspiracional).
- **Medir por Click URL** (convención HHB del contexto global): los CTA a `wa.me`/`tel:` miden
  la conversión, nunca el texto del botón.
- **La cara del agente en los reels**, no stock. Coherente con "persona con nombre".

### En el trato

- **Reseñas NFC** (piloto del contexto global): pedir la reseña en el momento de la firma, con
  el pin NFC, convierte el 4,7/107 en un motor de prueba social que escala por territorio.
  Cada territorio nuevo arranca con sus reseñas reales, no prestadas.
- **Protocolo "misma persona"**: documentar internamente que el cliente no rota de agente. Es
  la promesa operativa detrás de la frase de marca; si se incumple, la marca miente.
- **Guion de honestidad**: normalizar decir "este no te conviene" como parte del servicio, no
  como excepción. Es lo que genera la reseña que ninguna cadena tiene.

---

## Apéndice — criterio aplicado

Trabajado sobre `ESTANDAR.md §2` (que ya encapsula las reglas de `no-ai-slop`: cortar colas
aspiracionales, revelaciones tras dos puntos, contrastes binarios, preguntas retóricas,
cifras sin fuente y la simetría de plantilla) y sobre el posicionamiento frente a portales y
cadenas. Las fuentes de voz son reales (`site.ts`, `testimonials.ts`); los diferenciadores se
anclan a datos verificables (Google 4,7/107, cuatro idiomas, reformas) y a huecos concretos
del código (`agent: null`, `bioPending`, `yearsActive: null`).
