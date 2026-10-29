# Wireframe low-fi de Alquilar — `/es/alquilar/`

> **Propósito:** atender las **dos intenciones** del alquiler y abrir conversación por WhatsApp.
> **Trabajo de conversión global:** separar inquilino (busca piso) de propietario (quiere alquilar
> el suyo) y llevar a cada uno a su WhatsApp con el motivo correcto. Orden de arriba abajo. Fondo
> plano. Un único CTA primario amarillo por bloque.
>
> Fuente: `src/pages/es/alquilar.astro` (+ componentes `sections/`). Sección a sección, sin inventar.

```
┌───────────────────────────────────────────────────────────────────────────┐
│  CABECERA (sticky, glass)   logo · nav · ♥ · ☾ · [Valorar mi piso]★primario │
└───────────────────────────────────────────────────────────────────────────┘

╔══════════════════════════ 1. PAGE-HEAD (PageHero) ════════════════════════╗
║  ‹breadcrumb› Inicio › Alquilar                                           ║
║  ‹eyebrow› ¿Cómo alquilo?                         ← eyebrow EN PREGUNTA    ║
║  ALQUILAR, desde los dos lados.                   (H1 + highlight)         ║
║  Tanto si buscas piso como si tienes uno y quieres alquilarlo bien.        ║
║                                                                            ║
║  (SIN botones — el slot de acciones del héroe va vacío)   ← PLIEGUE SIN CTA║
╚════════════════════════════════════════════════════════════════════════════╝
   TRABAJO: nombrar las dos intenciones. NO hay CTA en el pliegue; obliga a hacer scroll.
   MIDE: nada aquí. Intención local ausente en H1 (no nombra Malgrat/Maresme).

╔══════════════════ 2. AUDIENCE (dos tarjetas = dos intenciones) ════════════╗
║  ┌──────────── INQUILINO ───────────┐  ┌────────── PROPIETARIO ──────────┐ ║
║  │ [foto piso] 🔍                    │  │ [foto piso] 🔑                   │ ║
║  │ Busco piso de alquiler            │  │ Tengo un piso para alquilar      │ ║
║  │ Dinos zona, presupuesto y cuándo. │  │ Buscamos inquilino, enseñamos el │ ║
║  │ Te decimos qué hay hoy…           │  │ piso y preparamos el contrato.   │ ║
║  │ [ Preguntar qué hay ahora ]★prim. │  │ [ Quiero alquilar mi piso ]ghost │ ║
║  └───────────────────────────────────┘  └──────────────────────────────────┘║
╚════════════════════════════════════════════════════════════════════════════╝
   TRABAJO: convertir, separando las dos intenciones en tarjetas distintas.
   CTA inquilino (primario) → wa.me reason="general" (data-origin="alquilar-busco").
   CTA propietario (ghost)  → wa.me reason="alquiler" (data-origin="alquilar-propietario").
   MIDE: dos Click URL wa.me bien diferenciadas por data-origin. UN solo primario (el del inquilino).

╔════════════════════════════ 3. STEPS (rentSteps) ════════════════════════╗
║  ‹eyebrow› El proceso                                                      ║
║  Alquilar con Conroma                                                      ║
║  [01 Nos cuentas tu caso (buscas o tienes) ] [02 Buscamos lo que te cuadra]║
║  [03 Contrato claro]  ← paso 01 vuelve a distinguir los dos caminos        ║
╚════════════════════════════════════════════════════════════════════════════╝
   TRABAJO: informar del proceso, manteniendo separadas las dos intenciones. Sin CTA. No se mide.

╔══════════════════════════ 4. TESTIMONIALS (reseñas) ══════════════════════╗
║  ‹eyebrow› ¿Qué dicen de nosotros?               ← eyebrow EN PREGUNTA     ║
║  Personas reales, casas con nombre.                                        ║
║  [ reseña destacada ] + [ reseñas pequeñas ]                               ║
║  [ 4,7 sobre 5 en 107 reseñas de Google ]ghost → Google (real, site.googleRating) ║
╚════════════════════════════════════════════════════════════════════════════╝
   TRABAJO: prueba social. MIDE: clic externo a Google (ghost).

╔═══════════════════════ 5. FAQ-SECTION (SEO, no comercial) ════════════════╗
║  Alquilar: lo que nos preguntan  ← patrón clónico "X: lo que nos preguntan"║
║  (2 preguntas: ¿hay pisos ahora? [inquilino] · piso vacío [propietario])   ║
╚════════════════════════════════════════════════════════════════════════════╝
   TRABAJO: resolver dudas de ambos perfiles + FAQPage schema. Sin CTA comercial.

╔═══════════════════════════ 6. CONTACT-SECTION ════════════════════════════╗
║  ‹eyebrow› Hablemos · Cuéntanos qué necesitas.                            ║
║  [ Formulario ]  +  WhatsApp · Llamar · Fijo · Email · dirección           ║
╚════════════════════════════════════════════════════════════════════════════╝
   TRABAJO: capturar el lead genérico. MIDE: envío de formulario (abre wa.me)
   + Click URL wa.me (data-origin="contacto") y tel: (contacto / contacto-fijo).

┌───────────────────────────── FOOTER (negro carbón) ───────────────────────┐
│  Conroma + NAP · WhatsApp/tel · redes · © · Privacidad                     │
└───────────────────────────────────────────────────────────────────────────┘
```

## Las dos intenciones (inquilino vs propietario)
La página **las separa bien y no las mezcla**, y es su acierto principal:
- En el **héroe** las nombra ("desde los dos lados" / "si buscas piso como si tienes uno").
- En **audience** (sección 2) hay **una tarjeta por intención**, con CTA, foto y mensaje de WhatsApp
  propios y `data-origin` distintos (`alquilar-busco` vs `alquilar-propietario`) → medición limpia.
- En **steps** el paso 01 recuerda que "son dos caminos distintos".
- En la **FAQ** hay una pregunta de cada perfil.
Lo único discutible es la **jerarquía entre ambas** (ver desajuste 2).

## La ruta de conversión (resumen)
1. **Nombra** las dos intenciones (héroe) — pero sin acción en el pliegue.
2. **Convierte** en audience: cada perfil a su WhatsApp con el motivo correcto.
3. **Informa** (proceso) y **da confianza** (reseñas, FAQ).
4. **Cierra** en contacto (formulario + wa.me/tel) para el que no usó las tarjetas.

## Jerarquía de botones aplicada
- **Primario** (amarillo, texto negro): "Preguntar qué hay ahora" (tarjeta inquilino).
- **Secundario** (ghost/contorno): "Quiero alquilar mi piso" (tarjeta propietario), reseñas de Google, canales de contacto.
- **Terciario** (text-link): no hay uno explícito en esta página.

## DESAJUSTES página-vs-wireframe (alimenta FASE 3)
1. **Héroe sin CTA: el embudo primario no domina el pliegue.** El slot de acciones de `PageHero` va vacío; el usuario tiene que hacer scroll hasta audience para actuar. Rompe "el embudo primario domina el pliegue". Añadir dos enlaces-ancla (o CTA) al héroe que salten a cada tarjeta, o adelantar la sección audience.
2. **La jerarquía prioriza al inquilino sobre el propietario.** La tarjeta "Busco piso" es `button--primary` y "Tengo un piso para alquilar" es `ghost`. Para una inmobiliaria, captar producto (propietario) suele valer más que atender demanda (inquilino). Decisión de negocio a confirmar: si el propietario es el lead valioso, debería ser él el primario (y aun así: un solo primario por bloque — no los dos).
3. **Eyebrow en pregunta** ("¿Cómo alquilo?", "¿Qué dicen de nosotros?") y **FAQ clónica** "Alquilar: lo que nos preguntan" (ESTANDAR §1/§2).
4. (Menor) **H1 sin intención local** (no nombra Malgrat/Maresme; solo el `<title>` SEO lo hace).
