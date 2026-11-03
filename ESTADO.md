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
- **CRM**: 9 pantallas, dos roles (admin / comercial), paleta Conroma sobre estructura Spike Admin,
  onboarding de 6 pasos, paleta de comandos ⌘K, y Panel + Leads + ficha de lead **leyendo y
  escribiendo en Supabase** con fallback a datos de demostración.

## 4. Falta (código)

1. **Enchufar a Supabase las pantallas que quedan** del CRM: Pisos, Ficha de piso (alta y
   guardado), Agenda, Valoraciones, Contactos. El patrón ya está hecho en `Leads.jsx`: hook en
   `src/lib/useData.js`, estados de carga/error/vacío, y el indicador de origen de datos.
2. **Subir `conroma-crm-ui` a GitHub.** Hay un paquete listo en
   `~/Desktop/conroma-crm-ui-para-subir/` con las instrucciones en `SUBIR-A-GITHUB.md`.
3. **Endpoint de descripción con IA** para la ficha de piso. El botón «Generar con IA» existe pero
   está simulado. Diseño previsto en `docs/INTEGRACIONES.md` (`POST /api/describe-property`).

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
- **Verifica a 390 px.** El móvil es el 97% del tráfico. Si `resize_window` no cambia el viewport,
  mete la página en un iframe de 390 px.

## 7. Vocabulario del sector (usarlo bien en la interfaz)

- **Encargo**: el contrato que firma el propietario autorizando a Conroma a vender su inmueble
  (el *listing agreement*). **Convertir en encargo** = la solicitud de valoración se cierra con
  firma y **se crea la ficha del piso** en estado «Captación». No es una venta todavía.
- **Captación**: conseguir que un propietario te dé el encargo. Es la mitad del negocio y es
  donde la web antigua no hacía nada (no había ni formulario de valoración).
- **AICAT**: registro obligatorio de agentes inmobiliarios de Cataluña. Debe figurar en la web.
