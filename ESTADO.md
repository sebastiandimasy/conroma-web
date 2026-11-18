# Estado del proyecto — 18 de noviembre de 2026

Este archivo existe para que **cualquier sesión nueva de Claude Code** (en cualquier ordenador o
cuenta) pueda retomar el trabajo sin que haya que volver a explicarlo. Si lo lees por primera vez:
esto es lo que hay hecho, lo que falta y por qué se decidió cada cosa.

> **Mantenlo al día.** Cuando cierres un bloque de trabajo, actualiza el apartado que corresponda
> antes de terminar la sesión. Es el único sitio donde vive el «¿por dónde íbamos?».

---

## 1. Qué es esto

Conroma Asesores es una inmobiliaria familiar de **Malgrat de Mar** (Alt Maresme). Dos frentes:

| Repo | Qué es | Estado |
|---|---|---|
| `conroma-web` (este) | La web nueva, que sustituye a la de `conromaasesores.com` | Terminada, pendiente de publicar en Hostinger |
| `conroma-crm-ui` | Prototipo del CRM interno (pisos + leads + agenda) | 9 pantallas; parte conectadas a Supabase |

La web antigua la genera la plantilla de **Habitatsoft** (el portal de gestión que Conroma sigue
usando) y tenía el SEO roto de fábrica: 0 de 253 páginas con canonical, ningún hreflang pese a
tener 4 idiomas, la mitad de los títulos duplicados, 1.945 imágenes sin ALT. De ahí el rediseño.

**Hay un backup completo de la web antigua** en `~/Desktop/backup-conromaasesores-antigua.tar.gz`
(285 páginas, 908 recursos, 18 MB). No lo borres hasta que el swipe lleve meses asentado.

## 2. Cómo trabajamos entre dos cuentas

El dueño usa **Claude Pro en su Mac personal** (sesiones cortas) y una cuenta más amplia para el
trabajo de fondo. El contexto viaja por el repo:

```
GitHub  →  el código y el historial
Supabase →  los datos (leads, pisos, usuarios)
CLAUDE.md + ESTADO.md + ESTANDAR.md  →  el contexto para Claude
```

Para retomar en el otro ordenador:

```bash
git pull origin feat/crm-leads
npm install
```

**Ojo:** a 18-nov la rama local va **62 commits por delante** de GitHub. Hasta que se haga push,
el otro ordenador no ve el rediseño.

Las skills y la memoria de Claude viven en `~/.claude/` del ordenador, no en la cuenta: hay un
paquete preparado en `~/Desktop/Claude-migracion/`.

## 3. Hecho

- **Rediseño editorial de todas las páginas** (16-18 nov): home, vender, valoración, comprar,
  ¿puedo comprar?, alquilar, servicios, gestión de patrimonio, reformas, empresa, equipo,
  contacto, zonas, pueblos, listados, blog, legales, 404 y ficha de inmueble. Reglas en
  `ESTANDAR.md` (títulos a la izquierda, párrafos justificados, sin tarjetas ni chips sobre foto).
- **Ficha de inmueble**: visor con miniaturas que pide a Habitatsoft el tamaño de foto justo
  (`src/lib/photos.ts`), datos sin repetir y contacto con dos botones (WhatsApp con la referencia
  y Llamar), sin mensajes prefabricados.
- **Blog**: 6 artículos, 3 de ellos con el vídeo del reel de Instagram alojado en la web (MP4
  propio, sin la interfaz de Instagram), resumen al principio, enlaces internos y `VideoObject`.
- **Captación de leads sin servidor** (opción A de `docs/HOSTINGER.md`): `ContactForm.tsx` y
  `ValuationWizard.tsx` insertan directo en la tabla `lead` con la `anon key`; la política RLS
  solo permite insertar (`supabase/migrations/0003`). Honeypot anti-spam. Si el guardado falla,
  el WhatsApp se abre igual.
- **Esquema de Supabase versionado**: `0001_crm_init`, `0002_lead_taxonomy`, `0003_web_lead_insert`.
- **Redirecciones 301 en `public/.htaccess`** (Hostinger ignora `_redirects`): `www` → apex,
  raíz → `/es/`, y las 43 URLs del sitemap antiguo llegan a una página que existe.
- **Legales con datos reales** (18-nov): Conroma La Selva S.L., NIF B65585408, domicilio social
  en Blanes y registro mercantil, sacados del aviso legal de la web antigua. Ya son indexables.
- **SEO técnico** (auditoría del build, 18-nov): 174 páginas, 163 indexables y las 163 en el
  sitemap (117 fichas). Sin enlaces rotos, títulos duplicados ni JSON-LD inválido.
- **Analítica** en GTM `GTM-KWJHKHR2` con consent mode por defecto denegado.
- **Catálogo indexable** (`catalogIndexable: true`). Los 8 pisos sin fotos quedan fuera solos.
- **Imagen al compartir** propia, 1200x630 y 100 KB (`public/img/og-conroma.jpg`).
- **Vídeos optimizados**: `public/video/` 44 MB → 13 MB, con póster y `preload="none"`.

## 4. Falta (código)

En este repo:

1. **Feed de Habitatsoft.** El inventario sale de un Excel exportado
   (`src/data/properties.real.json`, 125 inmuebles). `scripts/fetch-inventory.mjs` y el parser
   `src/lib/habitatsoft.ts` están listos, pero falta la URL del feed («Enlace Web 2.0») en
   `HABITATSOFT_FEED_URL`. Hay que sacarla del panel de Habitatsoft con el dueño logueado.
2. **Certificado energético**: ningún inmueble lo trae en los datos y es obligatorio en el
   anuncio. Hay que mapearlo desde el feed cuando esté.
3. **URLs antiguas de fichas** (`/detalle/.../<id>/`) van a la página del pueblo o a
   `/es/comprar/`. Con el `IdInmueble` del feed se pueden redirigir 1:1 a la ficha nueva.
4. **Títulos largos** en ~30 fichas con nombres de zona largos (más de 65 caracteres). Menor.

En `conroma-crm-ui`:

5. Enchufar a Supabase las pantallas que quedan (ficha de piso, valoraciones, contactos,
   difusión, asesores, movimientos y operaciones). Lo que se escribe en las demás vive en
   memoria y no sobrevive a recargar.
6. Endpoint de descripción con IA para la ficha de piso (el botón existe, simulado).

## 5. Falta (decisiones o datos del dueño)

- **Número AICAT** (obligatorio para agentes inmobiliarios en Cataluña). Va en `company` de
  `src/data/site.ts`; se añadirá cuando la web esté publicada.
- **Publicar**: seguir `docs/SWIPE.md` (Hostinger, `www` y apex al mismo alojamiento, SSL de los dos).
- **Push a GitHub** de la rama `feat/crm-leads`.
- **Fotos de 8 inmuebles**: Habitatsoft no ha entregado el archivo.
- **¿Versión en catalán?** La web antigua tenía 4 idiomas sin hreflang; la nueva es solo
  castellano. En Malgrat el catalán es lengua habitual.
- **Lloret tiene 36 inmuebles, más que Malgrat (23)**, pero los textos tratan Malgrat como el
  mercado principal. Decidir si se reequilibra.
- **Posible canibalización** entre `/es/inmobiliaria/{pueblo}` y `/es/venta/{pueblo}`.

## 6. Trampas ya pisadas (no volver a caer)

- **Las banderas de indexación van por partida doble**: el `noindex` de la página y el filtro
  `hiddenPaths` de `astro.config.mjs`. Si tocas una, **comprueba el sitemap generado**, no solo
  el meta robots.
- **Hostinger ignora `public/_redirects` y `public/_headers`** (son de Cloudflare). Lo que manda
  es `public/.htaccess`. Si cambias una redirección, cámbiala en los dos.
- **El build sale en `dist/client/`**, no en `dist/`: aún usa el adaptador de Cloudflare.
- **`PUBLIC_PREVIEW=true` mete `noindex` en toda la web.** Nunca en el build de producción.
- **El rol va en `app_metadata`, nunca en `user_metadata`.** `user_metadata` lo puede editar el
  propio usuario: un comercial podría ascenderse a admin.
- **La `service_role` key salta todas las reglas RLS.** Solo en el script local de altas. Nunca en
  el navegador, en el chat ni en un commit.
- **En el CRM, Vite necesita `base: './'`**. Con rutas absolutas el artefacto publicado sale en blanco.
- **Mide el móvil, no lo mires de reojo.** En `/es/venta/` el índice de pueblos iba antes del
  buscador y había que bajar 3 pantallas para ver el primer piso. Un `<details>` cerrado sigue
  siendo rastreable por Google.
- **Una lista larga de chips no es un filtro.** Con `<select>` nativos la hoja de filtros cabe
  en una pantalla y en móvil abre la rueda del sistema.
- **El amarillo es solo acento.** Lo seleccionado va en negro (`--color-ink` / `--color-on-ink`,
  que se invierten solos en modo oscuro).
- **Verifica a 390 px.** Si `resize_window` no cambia el viewport, mete la página en un iframe de 390 px.
- **Las fotos de Habitatsoft cambian de tamaño por la ruta** (`fotoshs.imghs.net/3xl/...`,
  `xl`, `l`, `s`...). No pidas la de 1280 px para una miniatura.

## 7. Vocabulario del sector (usarlo bien en la interfaz)

- **Encargo**: el contrato que firma el propietario autorizando a Conroma a vender su inmueble.
  **Convertir en encargo** = la solicitud de valoración se cierra con firma y se crea la ficha del
  piso en estado «Captación». No es una venta todavía.
- **Captación**: conseguir que un propietario te dé el encargo. Es la mitad del negocio y es donde
  la web antigua no hacía nada (no había ni formulario de valoración).
- **AICAT**: registro obligatorio de agentes inmobiliarios de Cataluña. Debe figurar en la web.
