# Estado del proyecto — 3 de noviembre de 2026

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
| `conroma-web` (este) | La web nueva, que sustituye a la de `conromaasesores.com` | Construida, pendiente de publicar |
| `conroma-crm-ui` | Prototipo del CRM interno (pisos + leads + agenda) | 9 pantallas; 3 conectadas a Supabase |

La web antigua la generaba la plantilla del CRM **Habitatsoft** y tenía el SEO roto de fábrica:
0 de 253 páginas con canonical, ningún hreflang pese a tener 4 idiomas, la mitad de los títulos
duplicados, 1.945 imágenes sin ALT. De ahí el rediseño.

**Hay un backup completo de la web antigua** en `~/Desktop/backup-conromaasesores-antigua.tar.gz`
(285 páginas, 908 recursos, 18 MB). Se usó para comprobar que las redirecciones 301 cubren todas
las URLs viejas. No lo borres hasta que el swipe lleve meses asentado.

## 2. Cómo trabajamos entre dos cuentas

El dueño usa **Claude Pro en su Mac personal** (sesiones cortas) y una cuenta más amplia para el
trabajo de fondo. No hay nada que «sincronizar» entre cuentas: el contexto viaja por el repo.

```
GitHub  →  el código y el historial
Supabase →  los datos (leads, pisos, usuarios)
CLAUDE.md + ESTADO.md  →  el contexto para Claude
```

Para retomar en el otro ordenador:

```bash
git pull origin feat/crm-leads
npm install
```

Y abrir Claude Code en la carpeta. Lee `CLAUDE.md` solo; luego pídele que lea este `ESTADO.md`.
**Las skills y la memoria de Claude viven en `~/.claude/` del ordenador, no en la cuenta**: si
quieres las mismas en el Mac personal, hay un paquete preparado en `~/Desktop/Claude-migracion/`.

## 3. Hecho

- **Web nueva completa**: páginas de venta por municipio, fichas de inmueble, valoración,
  contacto, legales. 4 idiomas en la estructura antigua reducidos a castellano por ahora.
- **Captación de leads de verdad**: `src/pages/api/leads.ts` guarda en Supabase. Lo usan
  `ValuationWizard.tsx` y `ContactForm.tsx`. Con honeypot anti-spam (campo `company` oculto) y
  validación de consentimiento RGPD. Si falla el guardado, **el WhatsApp se abre igual**: el
  contacto no se pierde nunca.
- **Redirecciones 301** en `public/_redirects`, incluida la regla de `/blog/*` que faltaba y hacía
  404 en dos artículos que están vivos.
- **Catálogo indexable** (`catalogIndexable: true` en `src/data/site.ts`, aprobado por el dueño).
  Los 8 pisos sin fotos se quedan fuera solos hasta que Habitatsoft entregue el archivo.
- **Sitemap arreglado**: 27 → 179 URLs (126 fichas + 26 listados). Ver la trampa en el punto 6.
- **Alta de usuarios del panel**: `scripts/crear-usuario.mjs` + `docs/USUARIOS.md`.
- **Aviso de «web en construcción» retirado** (`sampleData: false`, aprobado el 3-nov).
- **Imagen al compartir** propia, 1200x630 y 100 KB (`public/img/og-conroma.jpg`). La anterior
  era un retrato vertical de 2,35 MB que WhatsApp recortaba mal.
- **Listado de venta rehecho para móvil** (ver punto 6): el buscador va primero, hay filtro por
  pueblo y la hoja de filtros cabe en una pantalla.
- **Demo privada lista para subir a Hostinger**: `docs/PREVIEW-HOSTINGER.md` +
  `scripts/preparar-preview.sh`. Paquete generado en `~/Desktop/conroma-preview-hostinger.zip`.
- **CRM**: 9 pantallas, dos roles (admin / comercial), paleta Conroma sobre estructura Spike Admin,
  onboarding de 6 pasos, paleta de comandos ⌘K, y Panel + Leads + ficha de lead **leyendo y
  escribiendo en Supabase** con fallback a datos de demostración.

## 4. Falta (código)

1. **El esquema de la base de datos no está versionado.** `src/lib/useData.js` consulta cuatro
   tablas —`lead`, `lead_event`, `property`, `agent`— pero en `supabase/migrations/` solo hay
   `0003_last_contact.sql`: faltan las migraciones que las crean. Nadie puede levantar la base
   desde el repo. **Esto bloquea todo lo demás de Supabase** y va primero.
2. **Enchufar a Supabase las pantallas que quedan** del CRM: Ficha de piso (alta y guardado),
   Valoraciones, Contactos, Difusión, Asesores, Movimientos y Operaciones. Ya están conectadas
   Panel, Leads, ficha de lead, Pisos, Agenda y Estadísticas. El patrón está en `Leads.jsx`.
3. **Nada de lo que se escribe en el CRM sobrevive a recargar la página.** Citas, notas,
   movimientos y cambios de etapa viven en memoria del proceso (`citasManuales` y `parches` en
   `src/data/agenda.js`, `movimientosManuales` en `src/data/movimientos.js`, `demoLeadPatches`
   y `demoEvents` en `src/lib/useData.js`). Es correcto para una demostración y está avisado en
   pantalla, pero **no se puede enseñar como si guardara**.
4. **Vídeos sin optimizar**: `public/video/` pesa **44 MB**, con `historia-3.mp4` a **19 MB**.
   En móvil con datos eso es inaceptable. Hay que recomprimirlos (y servir un póster + carga
   diferida) antes de publicar.
5. **Endpoint de descripción con IA** para la ficha de piso. El botón «Generar con IA» existe pero
   está simulado. Diseño previsto en `docs/INTEGRACIONES.md` (`POST /api/describe-property`).

## 4 bis. Dónde se aloja la web: decisión abierta

El dueño quiere **todo en Hostinger** si es posible (el dominio lo abrió él allí). La web es
estática salvo **una** ruta, `src/pages/api/leads.ts`, que está escrita para Cloudflare Workers
y que el hosting compartido de Hostinger no puede ejecutar (allí corre PHP, no JavaScript).

Tres caminos, explicados a fondo en **`docs/HOSTINGER.md`**. El recomendado es el **A**: hacer la
web 100 % estática y que el formulario escriba directo en Supabase desde el navegador con la
`anon key` y una política RLS que solo permita *insertar*. Así todo vive en Hostinger, el correo
no se toca y se sigue capturando el lead.

**Sin decidir todavía.** No empieces a migrar sin confirmarlo con el dueño.

## 5. Falta (decisiones del dueño, no se puede hacer por él)

- **Datos legales reales**: NIF/CIF y número de registro **AICAT** (obligatorio para agentes
  inmobiliarios en Cataluña). Sin esto las páginas legales no son válidas.
- **Fotos de 8 inmuebles**: bloqueado, Habitatsoft no ha entregado el archivo.
- **¿Versión en catalán?** La web antigua tenía 4 idiomas (CA/ES/EN/FR) sin hreflang. La nueva es
  solo castellano. En Malgrat el catalán es lengua habitual: decidir si se recupera.
- **Lloret tiene 36 inmuebles, más que Malgrat (23)**, pero todos los textos tratan Malgrat como
  el único mercado. Decidir si se reequilibra el foco.
- **Posible canibalización** entre `/es/inmobiliaria/{pueblo}` y `/es/venta/{pueblo}`: las dos
  familias de URLs apuntan a intenciones muy parecidas.

## 6. Trampas ya pisadas (no volver a caer)

- **Las banderas de indexación van por partida doble.** Al poner `catalogIndexable: true` las
  fichas perdieron el `noindex` pero siguieron fuera del sitemap, porque `astro.config.mjs`
  filtraba por la bandera **vieja** (`sampleData`). Si tocas una bandera de indexación,
  **comprueba el sitemap generado**, no solo el meta robots.
- **El rol va en `app_metadata`, nunca en `user_metadata`.** `user_metadata` lo puede editar el
  propio usuario desde el navegador: un comercial podría ascenderse a admin.
- **La `service_role` key salta todas las reglas RLS.** Solo en rutas API del Worker. Nunca en el
  cliente, nunca en el chat, nunca en un commit.
- **En el CRM, Vite necesita `base: './'`**. Con rutas absolutas el artefacto publicado sale en
  blanco.
- **Mide el móvil, no lo mires de reojo.** En `/es/venta/` el índice de 25 pueblos iba antes
  del buscador: había que bajar **3 pantallas (2.532 px)** para ver el primer piso. Se arregló
  poniendo el listado primero y plegando el índice (ahora 0,61 pantallas). Un `<details>`
  cerrado **sigue siendo rastreable** por Google: los enlaces están en el HTML.
- **Una lista larga de chips no es un filtro.** 25 pueblos en chips medían 1.488 px y dejaban el
  botón de aplicar a 745 px de scroll. Con `<select>` nativos la hoja mide 626 px y cabe entera
  — y en móvil abre la rueda del sistema.
- **El amarillo es solo del CTA principal.** Un chip de filtro en amarillo compite con «Valorar
  mi piso». Lo seleccionado va en negro (`--color-ink` / `--color-on-ink`, que además se
  invierten solos en modo oscuro).
- **Verifica a 390 px.** El móvil es el 97% del tráfico. Si `resize_window` no cambia el viewport,
  mete la página en un iframe de 390 px.

## 7. Vocabulario del sector (usarlo bien en la interfaz)

- **Encargo**: el contrato que firma el propietario autorizando a Conroma a vender su inmueble
  (el *listing agreement*). **Convertir en encargo** = la solicitud de valoración se cierra con
  firma y **se crea la ficha del piso** en estado «Captación». No es una venta todavía.
- **Captación**: conseguir que un propietario te dé el encargo. Es la mitad del negocio y es
  donde la web antigua no hacía nada (no había ni formulario de valoración).
- **AICAT**: registro obligatorio de agentes inmobiliarios de Cataluña. Debe figurar en la web.
