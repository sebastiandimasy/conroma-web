# 04 — Redes sociales y contenido social (Conroma Asesores)

> Análisis estratégico. No toca código. La voz de marca manda: `ESTANDAR.md §2`
> (familiar, directa, de pueblo; honesta — "si un piso no te conviene, te lo decimos").
> La palabra "vicio" **no** aplica a este proyecto.
>
> **Aviso de datos:** no tengo acceso a las analíticas de las cuentas (seguidores,
> alcance, guardados, tráfico social→web). Todo lo que sigue es estrategia y
> estructura, no rendimiento medido. Donde hace falta un número real, lo señalo como
> **[pendiente de analítica]**.

---

## 1. Diagnóstico del uso actual

### Cuentas (fuente: `src/data/site.ts`)
- **Instagram @conromaasesores** — "Pisos, consejos y datos curiosos del sector".
- **Instagram @conromaenobras** — "El antes y el después de nuestras reformas".
- **TikTok @conromaasesores**.
- Enlaces con iconos oficiales (Instagram/TikTok) en `InstagramVideos.astro` + `social-links`.

### Qué hace bien hoy
- **Dos cuentas de IG con roles claros**: venta (@conromaasesores) y reforma
  (@conromaenobras). La separación es correcta de origen: el antes/después de obra es
  un pilar visual potente que merece su propio feed.
- **La web ya consume el social como prueba**: `InstagramVideos.astro` embebe 5 reels
  bajo "Casos de éxito / Historias que nos motivan" (`StoryVideos.tsx`), con los MP4
  servidos en local (`/video/historia-*.mp4`) y enlace de retorno al post de IG. Es el
  puente social→web ya montado; falta explotarlo.
- **Prueba social de Google ya estructurada en datos**: `googleRating` = 4,7 / 107
  reseñas (`site.ts`), verificada el 2026-10-12, con enlace a Maps.

### Problemas / huecos
1. **Sentido único**: el social alimenta la web (reels embebidos), pero la web no
   devuelve tráfico ni conversión medible al social, y el social no lleva a
   valoración/contacto con un enlace rastreable (ver §3).
2. **Desalineación de cuentas**: @conromaasesores es a la vez IG y TikTok, pero el
   contenido de cada red debería diferenciarse (ver §2). Hoy probablemente se replica.
3. **"Casos de éxito" ≠ testimonios**: la sección dice "testimonios de clientes" pero
   embebe reels, que no son lo mismo que una reseña. Las 107 reseñas de Google y el
   piloto NFC no están conectados al relato social (ver §4).
4. **Riesgo de simetría de plantilla también en social**: el mismo defecto que
   `ESTANDAR.md §2` señala en la web (9 H1 clónicos, 11 eyebrows en pregunta) suele
   repetirse en los pies de reel ("¿Buscas piso en Malgrat? 🏠"). Cortar una de cada tres.
5. **Sin YouTube**: los reels verticales editados (antes/después, tours) tienen una
   segunda vida gratis como **YouTube Shorts**, que además indexa en Google y aguanta
   en el tiempo mucho mejor que un reel de IG. Hoy no se aprovecha.

---

## 2. Estrategia de contenido por plataforma

Misma materia prima (fotos de pisos, reels de reforma, equipo), **tres cortes distintos**.
El móvil es ~97% del tráfico: todo se concibe vertical 9:16.

### Pilares de contenido (los 5 de Conroma)
| Pilar | Qué es | Cuenta principal | Por qué convierte |
|---|---|---|---|
| **P1 · Antes/después de reforma** | Transformación de obra, 3-7 s por estado | @conromaenobras (IG) + TikTok + Shorts | El formato más compartible; demuestra capacidad y da envidia sana |
| **P2 · Tour de piso** | Recorrido de un inmueble en cartera, con precio y zona visibles | @conromaasesores (IG) + TikTok | Intención de compra directa; cada tour es un lead potencial |
| **P3 · Consejo local / mercado** | "Cuánto cuesta el m² en Malgrat", gastos de compra, trampas de contrato | TikTok + Shorts (alcance) | Capta por intención informativa; posiciona autoridad de pueblo |
| **P4 · Equipo y pueblo** | La familia, la oficina, agentes de calle, el día a día | IG (feed + stories) | Construye la confianza "de pueblo"; es la diferencia frente a portales |
| **P5 · Prueba social** | Reseña real leída, cliente con las llaves, hito ("vendido en X") | IG stories + reel; TikTok | Cierra: convierte interés en confianza (ver §4) |

### Reparto por plataforma
- **Instagram** — el hogar de la marca. Feed = P1, P2, P4, P5 editados y bonitos.
  Stories = P4 y P5 en crudo, diarias, con stickers de enlace. Reels = P1 y P2 (el
  antes/después rinde igual aquí). Mantener las **dos cuentas**: @conromaenobras como
  escaparate de reforma, @conromaasesores como inmobiliaria. Cruzar de una a otra en
  stories.
- **TikTok** — el canal de **alcance frío y voz**. P3 (consejo local hablado a cámara)
  y P2/P1 con audio de tendencia. Aquí manda el gancho en los primeros 2 s y el tono
  hablado de pueblo, que es exactamente la voz de marca de `ESTANDAR.md §2`. Menos
  pulido que IG, más persona.
- **YouTube Shorts** (recomendado, coste marginal casi nulo) — **repurposing** de los
  mismos verticales de P1/P2/P3, sin marca de agua de TikTok. Gana porque **Google
  indexa Shorts** y porque un tour sigue trayendo vistas meses después. Un Short por
  cada reel/TikTok que ya exista.

### Cadencia realista para una inmobiliaria familiar
No se trata de volumen de agencia grande, sino de **constancia sostenible**:
- **IG feed/reels**: 3 por semana (1 reforma, 1 tour, 1 equipo/consejo).
- **IG stories**: 4-5 días por semana (lo que pasa en la oficina, un piso que entra,
  una reseña nueva). Es el canal más barato y el que más confianza da.
- **TikTok**: 3-4 por semana (reaprovecha 2 del feed de IG + 1-2 nativos de consejo).
- **YouTube Shorts**: publicar **todo** lo vertical que ya se grabó (coste casi cero).

Regla de oro: **grabar en bloque** (una tarde de rodaje = 2-3 semanas de contenido).
Una inmobiliaria familiar no sostiene producción diaria; sostiene lotes mensuales.

---

## 3. Embudo social → web (medición por Click URL)

Convención del equipo (ver HHB): **se mide por la Click URL de destino** (`wa.me` /
`tel:`), nunca por el texto del botón. Trasladado al social:

### Rutas de salida del social
1. **Enlace en bio** (IG y TikTok): no a la home genérica, sino a la página de **mayor
   intención según el pilar activo**. Usar un enlace con parámetros UTM a la web, o
   directo a un `wa.me` con mensaje pre-rellenado. Ejemplos:
   - `https://wa.me/34626378687?text=Vengo%20de%20Instagram%20y%20quiero%20valorar%20mi%20piso`
   - El `tel:` y `wa.me` ya viven en `site.ts` (`phone`, `whatsapp`).
2. **Sticker de enlace en stories** (P2 tour → ficha del inmueble; P5 reseña →
   `/valoracion`): cada story apunta a una URL concreta y rastreable.
3. **CTA hablado/escrito en el reel**: "te dejo el WhatsApp en la bio" — y la bio lleva
   el `wa.me` con UTM. El clic a `wa.me` es el evento que cuenta, no el "me gusta".

### Qué secciones de la web alimenta el social
- **Casos de éxito** (`InstagramVideos.astro`): ya embebe reels. Mantenerla **fresca**
  rotando los 5 `instagramVideos` de `site.ts` con lo mejor de cada mes. Es el nodo
  social→web existente; basta con alimentar el array.
- **Fichas de inmueble** (`/inmueble/<slug>`): cada tour de piso (P2) es un reel cuyo
  destino natural es su ficha. Enlazar story→ficha→`wa.me`.
- **Valoración** (`/valoracion`): destino de los pilares P3 (consejo) y P5 (prueba).
- **Reformas** (`/reformas`): destino de @conromaenobras y P1.

### Mínimo técnico para medir (recomendación, no incluido aquí)
Etiquetar los enlaces de bio/stories con UTM (`utm_source=instagram`,
`utm_medium=bio`, `utm_campaign=tour-octubre`) y, en GA4 de la web propia, mirar
**clics a `wa.me`/`tel:` segmentados por `utm_source`**. GA4/GSC solo para propiedades
propias (regla global). El resto (alcance, guardados) es vanidad y queda en §5.

---

## 4. Prueba social y reseñas como activo de conversión

Dos activos de prueba social, hoy infrautilizados en el relato:

### Google: 4,7 / 107 reseñas (dato real, `site.ts`)
- Es la cifra honesta que `ESTANDAR.md §2` ya exige usar en web (en vez del inventado
  "+500 clientes"). **El social debe usar la misma**: "107 familias ya han confiado",
  nunca cifras redondas infladas.
- **Contenido P5**: una vez al mes, un reel/story que lee una reseña real de Google
  (con permiso), con la foto del piso o las llaves. Cierra el bucle: el tour (P2)
  despierta interés, la reseña (P5) lo valida.
- CTA de esas piezas → `/valoracion` o `wa.me`.

### Piloto NFC de reseñas (Fidelización NFC)
- El piloto NFC capta reseñas en el punto físico (tras una firma, un cliente contento
  pasa el móvil por la tarjeta y deja reseña). **Eso realimenta el 4,7/107** y, con el
  tiempo, sube el número que el social exhibe.
- **Bucle completo**: cliente feliz → reseña vía NFC → sube el contador de Google → el
  social presume del contador real → más leads → más clientes. El social es el
  altavoz del activo que el NFC produce.
- Pedir al cliente, en el momento NFC, **permiso para grabar 10 s con las llaves**:
  materia prima gratis para P5.

> La prueba social es el activo de conversión de mayor palanca para una inmobiliaria
> familiar: la gente no compra un piso por un reel bonito, compra por confiar en quien
> se lo vende. El social solo tiene que hacer visible esa confianza.

---

## 5. Calendario editorial tipo (4 semanas) y métricas

### Ejemplo de 4 semanas (ritmo sostenible, grabado en 1-2 lotes)

| Semana | Lun | Mié | Vie | Stories (diario) |
|---|---|---|---|---|
| **1** | P2 Tour piso Malgrat (IG+TikTok+Short) | P1 Antes/después baño (@enobras+TikTok+Short) | P4 Conoce al equipo (IG) | Piso que entra · oficina · reseña nueva |
| **2** | P3 "Cuánto cuesta el m² en Malgrat" (TikTok+Short) | P2 Tour ático Santa Susanna (IG+TikTok) | P5 Reseña real + llaves (IG reel) | Obra en curso · consejo rápido · encuesta |
| **3** | P1 Antes/después cocina (@enobras+TikTok+Short) | P2 Tour piso Palafolls (IG+TikTok) | P3 "3 gastos ocultos al comprar" (TikTok+Short) | Agente de calle · piso vendido · bastidores |
| **4** | P4 Un día en Conroma (IG) | P2 Tour (IG+TikTok) | P5 "Vendido en X semanas" + testimonio (IG+TikTok) | Reseña NFC nueva · próximo piso · gracias |

- Cada **P2 tour** enlaza a su ficha; cada **P3/P5** enlaza a `/valoracion` o `wa.me`.
- Todo lo vertical se replica como **Short** (coste cero).
- Un lote de rodaje al mes cubre casi todo; las stories se nutren del día a día.

### Métricas que importan (no vanidad)
**Cuentan (negocio):**
- **Clics a `wa.me` y `tel:` atribuibles a social** (por UTM, en GA4 propio) — la
  métrica reina, misma lógica que HHB.
- **Leads cualificados** que dicen venir de IG/TikTok (preguntar siempre el origen).
- **Valoraciones solicitadas** desde tráfico social.
- **Reseñas nuevas** (Google + NFC): mide si el bucle de §4 gira.
- Guardados y compartidos (único proxy de alcance que correlaciona con intención, no
  mero like).

**No cuentan (vanidad):** seguidores totales, likes, impresiones sueltas, views sin clic.

> No puedo reportar ninguno de estos valores hoy: **[pendiente de analítica]** de las
> cuentas y de GA4. El primer paso operativo es montar los UTM (§3) para que estos
> números existan.

---

## 6. Escalado del contenido social por fases de negocio

El contenido escala con la misma lógica que la web (`tasks/plan.md` Fase 4): **de
pueblo a ciudad a comunidad, localizando, no reescribiendo**.

- **Fase local (Alt Maresme, hoy)**: todo el contenido es de pueblo y para el pueblo —
  Malgrat, Palafolls, Santa Susanna, Pineda, Blanes, Calella, Lloret, Tordera. La voz
  "de pueblo" es la ventaja competitiva; **no diluirla**. Pilar P3 con datos reales de
  cada pueblo (precio €/m² — pendiente de fuente real, igual que la web).
- **Fase Barcelona**: nuevos pilares de tour (P2) en la ciudad, pero manteniendo el
  ángulo diferencial ("una inmobiliaria del Maresme que ahora también en Barcelona").
  El tono familiar es más raro y más valioso en una gran ciudad: es el gancho.
  Considerar geo-segmentar: contenido de ciudad etiquetado por barrio.
- **Fase Cataluña/España**: aquí entra el **catalán** en el social (coherente con el
  `/ca/` de la web, plan Fase 4.3). Localizar los pilares P3 por comarca/costa. Un
  mismo antes/después sirve en varias geografías; solo cambia el pie y el hashtag local.
- **Fase internacional**: Shorts/reels con subtítulos en EN/FR (la web ya contempla
  `/en/` `/fr/`). El antes/después y el tour son **universales sin idioma**: el vídeo
  no necesita traducción, solo el pie y el CTA. YouTube cobra aún más peso (audiencia
  internacional que busca "buy property Costa Brava").

**Principio de escalado**: el formato (antes/después, tour, consejo) es fijo y
reutilizable; lo que se localiza es el **pie, el idioma, el hashtag geográfico y el
enlace de destino**. Igual que la web crece "añadiendo datos, no reescribiendo
páginas", el social crece añadiendo geo-variantes del mismo molde.

---

## Primeros pasos recomendados (orden de impacto)
1. Montar **UTM + `wa.me` con mensaje pre-rellenado** en las bios → empieza a medir (§3).
2. Activar **YouTube Shorts** reaprovechando los verticales ya existentes (coste cero).
3. Arrancar el **bucle P5 + NFC**: una pieza de prueba social al mes con reseña real (§4).
4. Grabar el **primer lote mensual** siguiendo el calendario de 4 semanas (§5).
5. Pedir las **analíticas de IG/TikTok y acceso a GA4** para cerrar el hueco de datos.
