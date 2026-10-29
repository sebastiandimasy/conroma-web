# Wireframe low-fi de Vender — `/es/vender/`

> **Propósito:** captar al propietario que piensa en vender y llevarlo a la valoración
> (`/es/valoracion/`). **Trabajo de conversión global:** arrancar la valoración gratis; en
> segundo plano, el contacto por WhatsApp/tel. Orden de arriba abajo. Fondo plano. Un único CTA
> primario amarillo por bloque.
>
> Fuente: `src/pages/es/vender.astro` (+ componentes `sections/`). Sección a sección, sin inventar.

```
┌───────────────────────────────────────────────────────────────────────────┐
│  CABECERA (sticky, glass)   logo · nav · ♥ · ☾ · [Valorar mi piso]★primario │
└───────────────────────────────────────────────────────────────────────────┘

╔══════════════════════════ 1. PAGE-HEAD (PageHero) ════════════════════════╗
║  ‹breadcrumb› Inicio › Vender                                             ║
║  ‹eyebrow› ¿Cómo vendo?                           ← eyebrow EN PREGUNTA    ║
║  ¿PIENSAS EN VENDER? Empieza por saber cuánto vale.  ← H1 EN PREGUNTA      ║
║  Te decimos un precio realista y nos encargamos de todo lo demás.          ║
║                                                                            ║
║  [ Saber cuánto vale mi piso ]★primario   [ Hablar con Conroma ]ghost       ║
╚════════════════════════════════════════════════════════════════════════════╝
   TRABAJO: captar y enrutar a valoración. CTA primario → /es/valoracion/.
   CTA secundario (ghost) → /es/contacto/. MIDE: navegación interna (aún sin Click URL).

╔════════════════════════════ 2. STEPS (sellSteps) ════════════════════════╗
║  ‹eyebrow› El proceso                                                      ║
║  Vender con Conroma, en tres pasos                                         ║
║  [01 Vemos tu piso] [02 Lo enseñamos bien] [03 Contigo hasta notaría]      ║
║   ← tarjetas numeradas, SIN botón por tarjeta                              ║
╚════════════════════════════════════════════════════════════════════════════╝
   TRABAJO: informar del proceso y quitar fricción. Sin CTA. No se mide.

╔═══════════════════════ 3. VALUATION-BLOCK (glass) ════════════════════════╗
║  ‹eyebrow› Para propietarios                                              ║
║  ¿Cuánto vale mi casa?                                                     ║
║  Pon la dirección y te lo decimos. Gratis y sin compromiso.               ║
║  [ Ej. Carrer de Mar 24, Malgrat ____________ ] [ Va, dime cuánto ]★primario║
║  Solo te pedimos el contacto al final.                                     ║
║  ┌─ Recomendada: Pasamos a verlo ─┐  ┌─ Rápida: Desde el móvil ─┐          ║
╚════════════════════════════════════════════════════════════════════════════╝
   TRABAJO: convertir — arrancar la valoración con la dirección ya metida.
   CTA primario (submit) → GET a /es/valoracion/?direccion=… (prefill del wizard).
   MIDE: envío del form (navegación con query). SEGUNDO primario de la página (coherente con embudo).

╔═══════════════════════════ 4. TRUST (garantías) ══════════════════════════╗
║  ‹eyebrow› ¿Por qué con nosotros?                ← eyebrow EN PREGUNTA     ║
║  Comprar o vender una casa ya es bastante. Lo demás lo llevamos nosotros.  ║
║  [ garantía ] [ garantía ] [ garantía ]  ← tarjetas, sin CTA               ║
╚════════════════════════════════════════════════════════════════════════════╝
   TRABAJO: dar confianza antes del cierre. Sin CTA. No se mide.

╔══════════════════════════ 5. TESTIMONIALS (reseñas) ══════════════════════╗
║  ‹eyebrow› ¿Qué dicen de nosotros?               ← eyebrow EN PREGUNTA     ║
║  Personas reales, casas con nombre.                                        ║
║  [ reseña destacada ] + [ reseñas pequeñas ]                               ║
║  [ 4,7 sobre 5 en 107 reseñas de Google ]ghost → Google (real, site.googleRating) ║
╚════════════════════════════════════════════════════════════════════════════╝
   TRABAJO: prueba social antes del CTA final. MIDE: clic externo a Google (ghost).

╔═══════════════════════ 6. FAQ-SECTION (SEO, no comercial) ════════════════╗
║  Vender: lo que nos preguntan   ← patrón clónico "X: lo que nos preguntan" ║
║  (4 preguntas: por dónde empiezo, compromiso, piso con reforma, herencia)  ║
╚════════════════════════════════════════════════════════════════════════════╝
   TRABAJO: resolver dudas + FAQPage schema para IA. Sin CTA comercial.

╔═══════════════════════════ 7. CONTACT-SECTION ════════════════════════════╗
║  ‹eyebrow› Hablemos · Cuéntanos qué necesitas.                            ║
║  [ Formulario ]  +  WhatsApp · Llamar · Fijo · Email · dirección           ║
╚════════════════════════════════════════════════════════════════════════════╝
   TRABAJO: capturar el lead que no arrancó la valoración. MIDE: envío de formulario (abre wa.me)
   + Click URL wa.me (data-origin="contacto") y tel: (contacto / contacto-fijo).

┌───────────────────────────── FOOTER (negro carbón) ───────────────────────┐
│  Conroma + NAP · WhatsApp/tel · redes · © · Privacidad                     │
└───────────────────────────────────────────────────────────────────────────┘
```

## La ruta de conversión (resumen)
1. **Capta** (héroe → valoración) al propietario.
2. **Convence** con el proceso en 3 pasos.
3. **Convierte** con el bloque de valoración (dirección → wizard) a mitad de página.
4. **Da confianza** (garantías + reseñas) y **cierra** en contacto (formulario + wa.me/tel).
El embudo es coherente vender→vender: todo apunta a la valoración; el contacto es la red de seguridad.

## Jerarquía de botones aplicada
- **Primario** (amarillo, texto negro): "Saber cuánto vale mi piso" (héroe) · "Va, dime cuánto" (valuation-block).
- **Secundario** (ghost/contorno): "Hablar con Conroma", reseñas de Google, canales de contacto.
- **Terciario** (text-link): no hay uno explícito en esta página.

## DESAJUSTES página-vs-wireframe (alimenta FASE 3)
1. **H1 en pregunta retórica autocontestada.** "¿Piensas en vender? Empieza por saber cuánto vale." es, literalmente, el ejemplo que ESTANDAR §2 manda corregir ("Afirmarlo"). Reescribir como afirmación, p. ej. "Te decimos cuánto vale tu piso en Malgrat".
2. **Dos CTA primarios hacia valoración.** Héroe ("Saber cuánto vale mi piso") y valuation-block ("Va, dime cuánto") son ambos `button--primary`. El embudo es coherente, pero hay dos primarios compitiendo por el pliegue: dejar el del héroe como único primario y tratar el submit del bloque como acción contextual, o viceversa.
3. **Eyebrows en pregunta repetidos:** "¿Cómo vendo?" (héroe), "¿Por qué con nosotros?" (Trust), "¿Qué dicen de nosotros?" (Testimonials). ESTANDAR §1/§2. Romper al menos uno.
4. (Menor) **FAQ clónica** "Vender: lo que nos preguntan" (misma forma que comprar/alquilar) y **H1 sin intención local** (Malgrat/Maresme solo aparecen en el `<title>` SEO, no en el titular visible).
