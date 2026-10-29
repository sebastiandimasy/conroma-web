# 03 — Paid Media (Google Ads + Meta Ads) · Conroma Asesores

> Estratega de paid media. Negocio inmobiliario local (Malgrat de Mar, Alt Maresme).
> Medición **siempre por Click URL** (`wa.me` / `tel:`), nunca por el texto del botón.
> Escalado por fases: **local → Barcelona → Cataluña/España → internacional**.
>
> **Datos de volumen fiables (Keyword Planner, pull previo) — los únicos que uso como ciertos:**
> - `piso alquiler malgrat` ~1.600/mes
> - `pisos en venta malgrat` ~1.300/mes
> - `tasacion vivienda` ~8.100/mes · CPC €1–5,7
> - SEM local muy barato en algunos términos: €0,02–0,19
>
> Todo CPC/volumen que no esté arriba va marcado como **[SUPUESTO]** o **[MEDIR]**. No invento cifras.

---

## 0. Diagnóstico de lo que ya existe (base de la medición)

El sitio ya está preparado para medir por Click URL, pero **falta el consumidor de esos clics**:

- `src/lib/links.ts` genera `wa.me` y `tel:` con mensaje escrito según el motivo (`reason`:
  `valoracion`, `alquiler`, `visita`, `general`…). Cada motivo deja rastro en el **texto del
  mensaje** de WhatsApp → sirve para clasificar el lead en bandeja aunque no haya tracking.
- Todos los CTA llevan ya `data-contact` (`whatsapp` / `llamada`), `data-origin` (14 valores:
  `barra`, `pie`, `home-contacto`, `ficha-contacto`, `valoracion-fin`, `alquilar-busco`,
  `alquilar-propietario`, `simulador-reformas`, `simulador-hipoteca`, `pueblo-<slug>-comprar`…)
  y `data-ref` (referencia del inmueble).
- El wizard de valoración (`ValuationWizard.tsx`) abre `wa.me` con el mensaje completo ya montado
  (`buildMessage`) al terminar los 4 pasos.

**Hallazgo clave:** NO hay GA4, ni Meta Pixel/CAPI, ni ningún listener que lea esos `data-*`.
Es decir, la infraestructura de Click URL está cableada en el HTML pero **no reporta a ningún
sitio**. Sin esto, ninguna campaña puede optimizar a conversión. Es el prerequisito nº1 (ver §5).

---

## 1. Embudos por intención → qué landing recibe cada campaña

Tres intenciones, un CTA primario claro por cada una. La regla de embudo del plan manda:
vender→valoración, comprar→listado/ficha, alquilar→se separa inquilino vs propietario.

| Intención | Quién | Landing de aterrizaje | CTA primario | Click URL / medición |
|---|---|---|---|---|
| **Vender / valorar** (prioridad 1) | Propietario | `/es/valoracion/` (wizard 4 pasos) | Completar wizard → abre `wa.me` con solicitud escrita | `wa.me` con `reason=valoracion` + `data-origin=valoracion-fin` |
| **Comprar** | Comprador | `/es/venta/<pueblo>/` (listado) → `/es/inmueble/<slug>/` (ficha) | WhatsApp "¿lo puedo ver?" / llamar | `wa.me` (`reason=visita`, `data-ref`) + `tel:` |
| **Alquilar – inquilino** (secundario) | Busca piso | `/es/alquilar` bloque "busco" | WhatsApp | `data-origin=alquilar-busco` |
| **Alquilar – propietario** (secundario) | Quiere alquilar el suyo | `/es/alquilar` bloque "propietario" | WhatsApp | `data-origin=alquilar-propietario`, `reason=alquiler` |

Principios:
- **Cada campaña aterriza en la landing de su intención, nunca en la home.** La home es para
  marca/orgánico, no para paid.
- **Valoración es el embudo con mejor economía**: `tasacion vivienda` ~8.100/mes y el wizard ya
  convierte la intención en un lead cualificado (dirección + estado + canal) escrito en WhatsApp.
  Es donde concentro la primera inversión.
- Comprar alimenta orgánicamente a vender: quien ve fichas hoy puede ser vendedor mañana →
  retargeting cruzado en Meta.

---

## 2. Google Ads (NO conectado en NotFair — datos en vivo habría que pedirlos)

> Google Ads no está conectado. Los CPC/volumen fuera de los 4 datos fiables van como [SUPUESTO]/[MEDIR].
> Para pujas y Quality Score reales hay que conectar la cuenta o compartir un export.

### Estructura de cuenta

**Campaña A — Search "Valoración / Vender" (prioridad 1)**
- Ad groups por intención de venta, keyword en *frase* y *exacta* (nada de amplia sin tuning):
  - `cuánto vale mi piso`, `valoración piso <pueblo>`, `tasación vivienda <pueblo>`, `vender piso <pueblo>`
  - Grupo por pueblo del Alt Maresme (Malgrat, Palafolls, Santa Susanna, Pineda, Blanes, Tordera, Calella).
- Landing: `/es/valoracion/`.
- Negativas globales: `gratis online` (filtra a quien no quiere trato), `simulador`, `catastro`,
  `plusvalía`, `idealista`, `fotocasa`, `calculadora`, `trabajo`, `oposiciones`, nombres de bancos.
- Dato de apoyo: `tasacion vivienda` ~8.100/mes, CPC €1–5,7 → **[SUPUESTO]** a nivel pueblo el
  volumen es menor y el CPC más barato (coincide con el €0,02–0,19 observado en términos locales).

**Campaña B — Search "Comprar" (por pueblo)**
- Un ad group por pueblo: `pisos en venta <pueblo>`, `comprar piso <pueblo>`, `casas en venta <pueblo>`.
- Dato de apoyo: `pisos en venta malgrat` ~1.300/mes.
- Landing: `/es/venta/<pueblo>/`.
- Negativas: `alquiler`, `obra nueva` (si no hay stock), `embargo`, `subasta`, portales.

**Campaña C — Search "Alquilar" (bajo presupuesto, secundario)**
- Ad group inquilino (`piso alquiler <pueblo>` — `piso alquiler malgrat` ~1.600/mes) y ad group
  propietario (`alquilar mi piso <pueblo>`, `gestión alquiler <pueblo>`).
- El inquilino convierte poco y satura la bandeja → **presupuesto mínimo o pausado al inicio**;
  priorizo al propietario, que es cliente de gestión.
- Landing: `/es/alquilar` (bloque correspondiente).

**Campaña D — Performance Max (solo tras tener conversiones en A/B/C)**
- Con feed de marca + señales de audiencia (clientes, visitantes web). **No lanzar PMax en frío**:
  canibaliza marca y es caja negra; sin conversiones medidas no optimiza. Marcado para Fase 2.

**Campaña E — Search Marca ("conroma", "conroma asesores")**
- Defensiva, CPC bajo. Protege la marca de competidores y portales.

### Presupuestos orientativos por fase [SUPUESTO — ajustar con CPC real tras medir]

| Fase | Campañas activas | Rango orientativo | Nota |
|---|---|---|---|
| **Local (arranque)** | A (valoración) + E (marca) | €300–500/mes | Empezar solo por valoración; es el mejor ratio |
| **Local (consolidado)** | + B (comprar) + C (propietario alquiler) | €600–1.000/mes | Añadir cuando A dé CPL estable |
| **Barcelona** | Duplicar A/B con geo ciudad + PMax (D) | €1.500–3.000/mes | CPC sube fuerte fuera del pueblo [MEDIR] |
| **Cataluña/España** | Hub por comarca/provincia | escalar por ROAS | Solo con feed CRM real (Habitatsoft) |

Geolocalización: **radio por pueblo + "presencia", no "interés"** (evita curiosos de fuera).
Horario: reforzar 10–14h y 17–21h (cuando se contesta el WhatsApp).

---

## 3. Meta Ads (cuenta YA conectada en NotFair)

> Conectadas: **"CONROMA ASESORES INMOBILIARIOS"** y **"Boris Conde Jr."**. Se puede lanzar y leer
> rendimiento en vivo vía NotFair (skill `meta-ads`). Aprovechar esto para arrancar ya, mientras
> Google se conecta.

### Estructura

**Conjunto 1 — Captación de vendedores (lead, frío)**
- Objetivo: **Mensajes (Click to WhatsApp)** apuntando al `wa.me` de valoración, o Leads con
  formulario instantáneo si se prefiere no depender del wizard. CTWA encaja mejor con la medición
  por Click URL del sitio.
- Público: geo Malgrat + Alt Maresme (radio), 35–65+, propietarios de vivienda
  (comportamiento/segmentos de valor de propiedad donde Meta lo permita [MEDIR]).
- Creatividad: foto real de la familia Conroma + copy de pueblo ("¿Cuánto vale tu piso en Malgrat?
  Te lo decimos nosotros, en persona"). Prohibido el tono corporativo (ESTANDAR §2).

**Conjunto 2 — Retargeting de visitantes web (calentar)**
- Público: visitantes de `/es/valoracion/`, `/es/venta/*` y fichas (vía Pixel/CAPI — hay que
  instalarlo, §5), y lista de clientes para *lookalike*.
- Mensaje: recordatorio + prueba social (4,x sobre 5 en 107 reseñas reales — usar el dato real, no
  "+500 clientes"). CTA a valoración o a la ficha vista.

**Conjunto 3 — Compradores (tráfico/mensajes, bajo peso)**
- Carruseles de inmuebles destacados → ficha. Secundario frente a captación de vendedores.

### Creatividades (criterio)
- 3–4 ángulos: valoración gratis / honestidad ("si no te conviene vender, te lo decimos") /
  cercanía familiar / resultado (vendido en X). Variar formato: reel vertical, foto única, carrusel.
- Ya hay material: `instagramVideos`, fotos de equipo reales en `src/data/site.ts`. Reutilizar.
- Partir del copy de marca existente; NO romper paleta (amarillo/negro/gris/blanco).
- Medir por **Click URL del `wa.me`**, no por el botón; etiquetar cada anuncio con un `data-origin`
  propio (p. ej. `meta-valoracion-A`) añadiendo un parámetro al `wa.me` o UTM al link de destino.

---

## 4. CRO de la landing de valoración y de las fichas

### Landing de valoración (`/es/valoracion/` + `ValuationWizard.tsx`)
Ya está muy bien resuelta (4 pasos, microcopy de pueblo, prueba social, progreso, reduced-motion).
Mejoras priorizadas:

1. **[Alta] El paso 4 exige nombre + privacidad antes de abrir WhatsApp.** Cada campo es fricción.
   El dato de contacto real llega igualmente en WhatsApp. Evaluar si `news`/`nombre` pueden ser
   opcionales o pedirse en la conversación. **[MEDIR con A/B]** antes de quitar nada: la privacidad
   es obligatoria legalmente, no se toca.
2. **[Alta] Capturar la keyword/campaña en el mensaje.** El wizard ya lee `?direccion=`; añadir que
   lea `utm_source/campaign` y los incluya en `buildMessage` → cada lead de WhatsApp dirá de qué
   anuncio vino. Cierra la atribución sin depender de cookies.
3. **[Media] Prueba social más arriba:** el "4,x sobre 5 en 107 reseñas" está al pie; subirlo al
   paso 0 reduce abandono inicial.
4. **[Media] Botón "prefiero que me llaméis ahora" visible en paso 0** para quien no quiere 4 pasos
   → `tel:` directo (capta al impaciente sin perderlo).
5. **[Baja] Autocompletar dirección** (Places) para bajar errores en el paso 1.

### Fichas de inmueble (`/es/inmueble/<slug>/`)
1. **CTA pegajoso** WhatsApp + llamar siempre visible en móvil (existe `ActionBar`; confirmar que va
   fijo en ficha).
2. **Mensaje de WhatsApp con ref. del piso** (ya lo hace `links.ts` con `propertyRef/propertyTitle`
   → `reason=visita`). Mantener.
3. "Avísame si baja de precio" (`reason=bajada`) como micro-conversión de retargeting.
4. Galería + precio + zona arriba del pliegue; evitar la rejilla de métricas por defecto (ESTANDAR).

Todo cambio se verifica a **390px** (97% móvil) antes de darlo por bueno.

---

## 5. Medición y atribución (coherente con Click URL)

**Orden obligatorio — sin esto no se puede optimizar ninguna campaña:**

1. **Instalar GA4 + Meta Pixel + Meta CAPI** en `BaseLayout.astro` (hoy no hay nada). Con consentimiento
   (Consent Mode v2) por el RGPD.
2. **Listener de Click URL:** un script que escuche clics en `a[data-contact]` y dispare un evento con
   `{contact, origin, ref}` a GA4 y al Pixel. Los `data-contact`/`data-origin`/`data-ref` **ya están en
   todo el HTML**; solo falta quien los lea. Eventos sugeridos:
   - `click_whatsapp` / `click_llamada` (acción medida = el clic al `wa.me`/`tel:`, no el texto del botón).
   - `valoracion_completada` cuando el wizard abre WhatsApp.
3. **Atribución a campaña:** UTM en todos los anuncios + propagar `utm_*` al `wa.me` (y meterlos en el
   mensaje, ver §4.2). Así el lead que entra por WhatsApp se puede casar con su anuncio aunque no haya
   conversión de servidor.
4. **Conversión de valor para pujas:** marcar `valoracion_completada` como conversión primaria en
   Google Ads (import GA4) y Meta. `click_llamada` como secundaria.
5. **Verdad del negocio = CRM/bandeja.** El `wa.me`/`tel:` mide el clic, no el cierre. El `reason` del
   mensaje (valoracion/alquiler/visita) ya pre-clasifica el lead. Cerrar el bucle etiquetando en el CRM
   qué lead acabó en mandato → coste por mandato real. **[MEDIR]**

> Nota sincera: la atribución Click-to-WhatsApp es imperfecta (no hay cookie de ida y vuelta fiable).
> La compensamos con UTM-en-mensaje + etiquetado manual en bandeja. Es suficiente a este volumen.

---

## 6. Roadmap de inversión por fases (priorizado)

| Orden | Acción | Depende de | Inversión [SUPUESTO] |
|---|---|---|---|
| **0** | Instalar GA4 + Pixel + CAPI + listener Click URL + UTM-en-mensaje | nada (es prerequisito) | €0 (trabajo) |
| **1** | Meta: Conjunto 1 captación vendedores (CTWA) — cuenta ya conectada | paso 0 | €200–400/mes |
| **2** | Google Search A (valoración) + E (marca) — **conectar cuenta Google Ads** | paso 0 + conexión | €300–500/mes |
| **3** | Meta Conjunto 2 retargeting + lookalike de clientes | Pixel con datos (≥2–4 sem) | +€150–300/mes |
| **4** | Google Search B (comprar) + C (propietario alquiler) | CPL estable en paso 2 | +€300–500/mes |
| **5** | PMax (D) + escalado a **Barcelona** | conversiones medidas + feed CRM | €1.500–3.000/mes |
| **6** | **Cataluña/España**: hubs por comarca; `/ca/` real | modelo geo Fase 1 del plan + feed Habitatsoft | escalar por ROAS |
| **7** | **Internacional** `/en/ /fr/` (compradores extranjeros costa) | contenido traducido | según demanda [MEDIR] |

Prioridad absoluta: **paso 0 y luego valoración** (mejor economía y el embudo ya está construido).
Meta primero porque la cuenta ya está conectada; Google en paralelo en cuanto se conecte.

### Supuestos y lo que falta medir
- **[SUPUESTO]** Todos los presupuestos: son rangos de arranque de negocio local, a ajustar con CPC real.
- **[MEDIR]** CPC/CPL reales por pueblo (Google Ads no conectado); CPL de CTWA en Meta (sí consultable
  vía NotFair); coste por mandato (requiere cierre de bucle en CRM); volumen fuera de los 4 términos
  fiables; viabilidad de segmentar propietarios en Meta.
- **Riesgo RGPD:** sin Consent Mode v2 la medición queda coja y hay exposición legal. Va en el paso 0.
