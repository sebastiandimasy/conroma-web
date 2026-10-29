# Wireframe low-fi de Valoración — `/es/valoracion/`

> **Propósito:** una sola pantalla con un solo trabajo — recoger los datos del piso y abrir
> WhatsApp con la solicitud de valoración ya escrita. **Trabajo de conversión global:** completar
> el wizard y disparar el Click URL `wa.me`. Layout `bare` (sin cabecera ni footer completos): el
> wizard es toda la página, cero distracción.
>
> Fuente: `src/pages/es/valoracion.astro` (layout `bare`, solo el island `ValuationWizard.tsx`).
> Pasos descritos tal cual están en el código, sin inventar.

```
┌───────────────────────────────────────────────────────────────────────────┐
│  LAYOUT bare — sin nav completa. Dentro, el island ocupa toda la pantalla. │
└───────────────────────────────────────────────────────────────────────────┘

╔══════════════════════ CABECERA DEL WIZARD (wizard__header) ═══════════════╗
║  [✕ salir → /es/]        ▓▓▓▓░░░░░░░░ (progreso scaleX)       Paso N de 4   ║
╚════════════════════════════════════════════════════════════════════════════╝
   Única "salida" de la pantalla: la ✕ vuelve a /es/. Barra de progreso 1→4.

╔══════════════════════════ PASO 1 de 4 — MOMENTO ═════════════════════════╗
║  Vale, cuéntanos. ¿Cómo lo tienes?                                        ║
║  [ Quiero vender ya            → Te decimos precio y plan        > ]       ║
║  [ Aún no, solo curiosidad     → Te orientamos y listo          > ]       ║
║  [ Es una herencia o un lío    → Lo vemos con calma             > ]       ║
╚════════════════════════════════════════════════════════════════════════════╝
   PREGUNTA: el momento de venta (3 opciones). Al pulsar, avanza solo. Sin Click URL aún.

╔══════════════════════════ PASO 2 de 4 — DIRECCIÓN ════════════════════════╗
║  ¿Dónde está el piso?                                                      ║
║  [ Ej. Carrer de Mar 24, Malgrat ________________________ ]                ║
║  Con la calle sabemos a qué precio se vende de verdad en tu zona.          ║
║  [ Seguir ]★primario                                                       ║
╚════════════════════════════════════════════════════════════════════════════╝
   PREGUNTA: la dirección (input). Prefill desde ?direccion= (viene de ValuationBlock de /vender).
   Valida mínimo 5 caracteres. CTA primario "Seguir" avanza. Dato clave para valorar.

╔═══════════════════════════ PASO 3 de 4 — ESTADO ═════════════════════════╗
║  ¡Estás a un paso! ¿Cómo está por dentro?                                  ║
║  [ Para entrar a vivir      > ]   [ Necesita un repaso        > ]          ║
║  [ Hay que reformarlo entero > ]  [ No lo sé                  > ]          ║
╚════════════════════════════════════════════════════════════════════════════╝
   PREGUNTA: el estado (4 opciones). Al pulsar, avanza solo. Sin Click URL aún.

╔════════════════════════ PASO 4 de 4 — CONTACTO + ENVÍO ═══════════════════╗
║  Último paso. ¿Cómo te contestamos?                                        ║
║  Tu nombre: [ Ej. Ana ______________ ]                                     ║
║  ( Por WhatsApp | Llamadme )  ← segmented; si "Llamadme" → pide teléfono    ║
║  ☐ He leído la política de privacidad   (OBLIGATORIO)                      ║
║  ☐ Avisadme de novedades de mi zona (opcional)                             ║
║  [ Va, enviádmelo ]★primario                                               ║
║  Se abre WhatsApp con tu solicitud ya escrita. Solo dale a enviar.         ║
╚════════════════════════════════════════════════════════════════════════════╝
   TRABAJO: cerrar. CTA primario valida (nombre, teléfono si procede, privacidad) y hace
   window.open a wa.me con el mensaje montado (nombre + dirección + situación + estado + canal).
   MIDE: ESTE es el evento de conversión → apertura de Click URL wa.me (site.whatsapp).

╔═══════════════════════════ PANTALLA FINAL (sent) ════════════════════════╗
║  [tag: Listo]                                                              ║
║  Se ha abierto WhatsApp con tu solicitud ya escrita.                       ║
║  Si no se ha abierto, llámanos al {teléfono}  ← tel: (data-origin=         ║
║                                                   "valoracion-fin")        ║
║  [ Ver pisos en venta mientras tanto ]ghost → /es/venta/malgrat-de-mar/    ║
╚════════════════════════════════════════════════════════════════════════════╝
   TRABAJO: confirmar y dar una salida de respaldo. MIDE: Click URL tel: (valoracion-fin).
   El ghost a listado es post-conversión (no distrae del objetivo principal).

╔═══════════════════════════ PIE DEL WIZARD (trust) ═══════════════════════╗
║  4,7 sobre 5 en 107 reseñas de Google · Gratis y sin compromiso            ║
║  (real, de site.googleRating; visible en todos los pasos)                  ║
╚════════════════════════════════════════════════════════════════════════════╝
```

## Pasos reales del wizard (resumen)
Son **4 pasos**, uno por pantalla, con barra de progreso 1→4 y botón "Atrás" desde el paso 2:
1. **Momento** — 3 opciones (vender ya / curiosidad / herencia). Avanza al pulsar.
2. **Dirección** — input de calle (prefill posible vía `?direccion=`), botón "Seguir". Dato clave.
3. **Estado** — 4 opciones (vivir / repaso / reforma / no lo sé). Avanza al pulsar.
4. **Contacto + envío** — nombre, canal (WhatsApp/Llamada → teléfono), privacidad obligatoria,
   novedades opcional. CTA final "Va, enviádmelo" → abre WhatsApp con la solicitud escrita.

## ¿Cumple "un solo trabajo, cero distracción"?
**Sí, en lo esencial.** El layout `bare` quita nav y footer; cada paso tiene un único foco y un
único CTA primario; no hay embudo cruzado ni segundos CTA que compitan. Las dos "fugas" posibles
son controladas: la ✕ de salir (necesaria como escape) y, solo tras convertir, el ghost "Ver
pisos en venta". El trabajo de conversión (abrir `wa.me`) es nítido y bien medible.

## Jerarquía de botones aplicada
- **Primario** (amarillo, texto negro): "Seguir" (paso 2) y "Va, enviádmelo" (paso 4). Nunca dos a la vez: uno por pantalla.
- **Opciones de elección** (pasos 1 y 3): botones `.option` propios, no son CTA primarios (avanzan solos).
- **Secundario** (ghost): "Atrás" y, en la pantalla final, "Ver pisos en venta".
- **Terciario** (text-link): "política de privacidad" (paso 4) y el `tel:` de la pantalla final.

## DESAJUSTES página-vs-wireframe (alimenta FASE 3)
1. **El paso 4 no es "una pregunta": acumula varios campos** (nombre + segmented de canal + teléfono condicional + 2 checkboxes) justo en el último paso, donde más abandono hay. El `<title>`/descripción venden "cuatro preguntas", pero el paso 4 es un mini-formulario. Revisar si se puede aligerar (p. ej. privacidad implícita por el envío, teléfono solo si elige llamada — esto ya está).
2. **El dato clave (dirección) va en el paso 2, detrás de la pregunta de "momento".** El paso 1 (momento) añade fricción antes de pedir lo único imprescindible para valorar. Valorar adelantar la dirección al paso 1 reduciría el abandono temprano.
3. **Botones HeroUI `<Button variant="primary">` en pasos 2 y 4** (no la primitiva `.button--primary` del resto del sitio). ESTANDAR §0 avisa: si la paleta HeroUI no está mapeada, "salen azules". Hoy `tokens.css` los mapea, pero conviene unificar en la primitiva `Button` de FASE 0 para no depender del mapeo.
4. (Menor) **Sin intención local visible más allá del placeholder** "Carrer de Mar 24, Malgrat". Los H1 de cada paso no nombran Malgrat/Maresme; aceptable por ser flujo cerrado, pero es la única señal local.
