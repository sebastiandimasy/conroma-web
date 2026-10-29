# Wireframe low-fi de Comprar — `/es/comprar/`

> **Propósito:** resolver la intención "comprar piso/casa en Malgrat de Mar" y llevar al
> comprador al catálogo real y al contacto. **Trabajo de conversión global:** enrutar al listado
> de venta (`/es/venta/malgrat-de-mar/`) y recoger el lead por WhatsApp/tel desde las fichas y el
> contacto final. Orden de arriba abajo. Fondo plano. Un único CTA primario amarillo por bloque.
>
> Fuente: `src/pages/es/comprar/index.astro` (+ componentes `sections/`). Sección a sección, sin inventar.

```
┌───────────────────────────────────────────────────────────────────────────┐
│  CABECERA (sticky, glass)   logo · nav · ♥ · ☾ · [Valorar mi piso]★primario │
└───────────────────────────────────────────────────────────────────────────┘

╔══════════════════════════ 1. PAGE-HEAD (PageHero) ════════════════════════╗
║  ‹breadcrumb› Inicio › Comprar                                             ║
║  ‹eyebrow› ¿Cómo compro?                         ← eyebrow EN PREGUNTA     ║
║  COMPRAR CASA, sin perderte por el camino.       (H1 + highlight)          ║
║  Te enseñamos lo que hay de verdad, con el precio a la vista…              ║
║                                                                            ║
║  [ Ver los N pisos en venta ]★primario   [ Simulador de hipoteca ]ghost    ║
╚════════════════════════════════════════════════════════════════════════════╝
   TRABAJO: captar y enrutar al catálogo. CTA primario → /es/venta/malgrat-de-mar/.
   CTA secundario (ghost) → /es/comprar/simulador-hipoteca/.
   MIDE: navegación interna (no hay Click URL todavía). El conteo de pisos es el real del catálogo.

╔═════════════════════ 2. BUY-INTRO (custom, foto + copy) ═══════════════════╗
║  ┌──────────────────┐   ‹eyebrow› Comprar en Malgrat de Mar               ║
║  │  FOTO real        │   Comprar casa con gente de aquí                    ║
║  │  (site.heroImage) │   Conocemos cada calle de Malgrat y del Alt Maresme…║
║  └──────────────────┘   ✓ Visitas sin compromiso, en cuatro idiomas        ║
║                         ✓ Te avisamos de lo que no está en portales        ║
║                         ✓ Te acompañamos hasta la firma en notaría         ║
║                         [ Ver pisos en venta ]★primario  [ Simular hipoteca ]ghost ║
╚════════════════════════════════════════════════════════════════════════════╝
   TRABAJO: dar confianza (cercanía local) + repetir el enrutado al catálogo.
   CTA primario → /es/venta/malgrat-de-mar/ (MISMO destino que el héroe = SEGUNDO primario).
   MIDE: navegación interna. Intención local fuerte en H2 y eyebrow (Malgrat + Alt Maresme).

╔═════════════════════════════ 3. STEPS (buySteps) ═════════════════════════╗
║  ‹eyebrow› El proceso                                                      ║
║  Comprar con Conroma, en tres pasos                                        ║
║  [01 Nos dices qué buscas] [02 Lo visitas con nosotros] [03 Te acompañamos ║
║   a firmar]  ← tarjetas numeradas, SIN botón por tarjeta                    ║
╚════════════════════════════════════════════════════════════════════════════╝
   TRABAJO: informar del proceso y quitar fricción. Sin CTA. No se mide.

╔══════════════════ 4. FEATURED (PropertyGrid, 3 pisos reales) ══════════════╗
║  ‹eyebrow› ¿Qué tenemos ahora?                   ← eyebrow EN PREGUNTA     ║
║  Pisos en venta en Malgrat de Mar                                          ║
║  [ ficha ] [ ficha ] [ ficha ]  ← cada una con WhatsApp / Llamar           ║
║  [ Ver todas las viviendas ]ghost → /es/venta/malgrat-de-mar/              ║
╚════════════════════════════════════════════════════════════════════════════╝
   TRABAJO: convertir — enseñar producto real y abrir el canal de contacto por ficha.
   MIDE: Click URL en cada ficha → wa.me (data-contact="whatsapp", data-origin="comprar")
   y tel: (data-contact="llamada", data-origin="comprar"). Ghost = navegación interna.

╔═══════════════════════════ 5. TRUST (garantías) ══════════════════════════╗
║  ‹eyebrow› ¿Por qué con nosotros?                ← eyebrow EN PREGUNTA     ║
║  Comprar o vender una casa ya es bastante. Lo demás lo llevamos nosotros.  ║
║  [ garantía ] [ garantía ] [ garantía ]  ← tarjetas, sin CTA               ║
╚════════════════════════════════════════════════════════════════════════════╝
   TRABAJO: dar confianza antes del cierre. Sin CTA. No se mide.

╔══════════════════════════ 6. TESTIMONIALS (reseñas) ══════════════════════╗
║  ‹eyebrow› ¿Qué dicen de nosotros?               ← eyebrow EN PREGUNTA     ║
║  Personas reales, casas con nombre.                                        ║
║  [ reseña destacada ] + [ reseñas pequeñas ]                               ║
║  [ 4,7 sobre 5 en 107 reseñas de Google ]ghost → Google (real, site.googleRating) ║
╚════════════════════════════════════════════════════════════════════════════╝
   TRABAJO: prueba social antes del CTA final. MIDE: clic externo a Google (ghost).

╔═══════════════════════ 7. FAQ-SECTION (SEO, no comercial) ════════════════╗
║  Comprar: lo que nos preguntan   ← patrón clónico "X: lo que nos preguntan"║
║  (3 preguntas: ¿cobráis por enseñar?, hipoteca, comprar desde fuera)       ║
╚════════════════════════════════════════════════════════════════════════════╝
   TRABAJO: resolver dudas + FAQPage schema para IA. Sin CTA comercial.

╔═══════════════════════════ 8. CONTACT-SECTION ════════════════════════════╗
║  ‹eyebrow› Hablemos                                                        ║
║  Cuéntanos qué necesitas.                                                  ║
║  [ Formulario ]  +  WhatsApp · Llamar · Fijo · Email · dirección           ║
╚════════════════════════════════════════════════════════════════════════════╝
   TRABAJO: capturar el lead que no usó una ficha. MIDE: envío de formulario (abre wa.me)
   + Click URL wa.me (data-origin="contacto") y tel: (contacto / contacto-fijo).

┌───────────────────────────── FOOTER (negro carbón) ───────────────────────┐
│  Conroma + NAP · WhatsApp/tel · redes · © · Privacidad                     │
└───────────────────────────────────────────────────────────────────────────┘
```

## La ruta de conversión (resumen)
1. **Capta** (héroe: "¿cómo compro?" → ver pisos) y enruta al catálogo.
2. **Convence** con cercanía local (buy-intro) y el proceso en 3 pasos.
3. **Convierte** enseñando 3 pisos reales con WhatsApp/tel en cada ficha.
4. **Da confianza** (garantías + reseñas) y **cierra** en contacto (formulario + wa.me/tel).
El embudo es coherente comprar→comprar (todo apunta al catálogo de venta y al contacto).

## Jerarquía de botones aplicada
- **Primario** (amarillo, texto negro): "Ver los N pisos en venta" (héroe) · "Ver pisos en venta" (buy-intro).
- **Secundario** (ghost/contorno): "Simulador de hipoteca", "Simular hipoteca", "Ver todas las viviendas", reseñas de Google, canales de contacto.
- **Terciario** (text-link): no hay uno explícito en esta página.

## DESAJUSTES página-vs-wireframe (alimenta FASE 3)
1. **Dos CTA primarios con el mismo destino.** Héroe ("Ver los N pisos en venta") y sección 2 buy-intro ("Ver pisos en venta") son ambos `button--primary` y van a `/es/venta/malgrat-de-mar/`. Rompe "un único CTA primario por pantalla" y diluye la jerarquía. Fundir en uno (dejar el de buy-intro en ghost) o diferenciar destino.
2. **Eyebrows en pregunta repetidos** (ESTANDAR §1 prohíbe versalitas en pregunta; §2 marca "11 eyebrows en pregunta"): sección 1 "¿Cómo compro?", sección 4 "¿Qué tenemos ahora?", sección 5 "¿Por qué con nosotros?", sección 6 "¿Qué dicen de nosotros?". Cuatro en una misma página. Romper al menos 2 de 4.
3. **FAQ con patrón clónico** "Comprar: lo que nos preguntan" (sección 7) — misma forma que vender/alquilar; ESTANDAR §2 señala las 4 FAQ idénticas. Reescribir el título.
4. (Menor) El **H1 visible no nombra Malgrat/Maresme** (solo el `<title>` SEO y la sección 2 lo hacen). La intención local llega en el pliegue vía buy-intro, pero el H1 podría anclarla antes.
