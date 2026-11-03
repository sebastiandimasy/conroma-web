# Traspaso a la sesión de Claude Pro (Mac personal)

Todo lo de esta sesión está **subido a GitHub** en la rama `feat/crm-leads` del repo
`github.com/sebastiandimasy/conroma-web`. No hay nada pendiente de subir.

---

## 0. Dos proyectos, dos repos. No se mezclan.

| Proyecto | Carpeta | Repo | Stack |
|---|---|---|---|
| **Web pública** | `~/conroma-web` | `github.com/sebastiandimasy/conroma-web` (rama `feat/crm-leads`) | Astro + Cloudflare |
| **CRM interno** | `~/conroma-crm-ui` | `github.com/sebastiandimasy/conroma-crm-ui` (rama `main`) | Vite + React + Tailwind |

Cada uno tiene su propio `CLAUDE.md`. **Abre Claude Code dentro de la carpeta del proyecto en
el que vas a trabajar**, nunca en la carpeta padre: si lo abres un nivel por encima, mezcla los
dos contextos y acaba aplicando las reglas de uno al otro.

## 1. Qué hacer en el Mac personal (3 comandos)

```bash
cd ~/conroma-web                      # o donde lo tengas clonado
git fetch origin
git checkout feat/crm-leads           # ojo: el trabajo NO esta en main
git pull origin feat/crm-leads
npm install
```

> **El repositorio no tiene rama `main`.** Solo hay `feat/crm-leads` (donde esta todo) y
> `feat/design-system-fase0-4` (antigua). Si clonas de cero, comprueba en que rama caes.

Abre Claude Code en esa carpeta. Lee `CLAUDE.md` **solo**, sin que le digas nada.

## 2. Qué escribirle para que retome el hilo

Pégale esto tal cual:

> Lee `ESTADO.md` y `TRASPASO.md` del repo. Vengo de otra sesión donde dejamos la web lista
> para el swipe pero sin ejecutarlo. Sigue por el punto que te diga.

## 3. Qué hay en GitHub (9 commits de hoy, 3-nov-2026)

| Commit | Qué hizo |
|---|---|
| `4387480` | Captación de leads, RGPD, 301 de `/blog` y catálogo indexable |
| `5ac3ef1` | `CLAUDE.md` + `ESTADO.md` + guía y script de alta de usuarios |
| `72a5780` | Fichas sin fotos fuera del sitemap, imagen OG 1200x630, guía de swipe |
| `63ebc65` | Fuera el aviso de «web en construcción» |
| `37a4158` | Listado de venta primero en móvil + filtro por pueblo |
| `ec554f0` | Chips de filtro activos en negro (el amarillo es solo del CTA) |

## 4. Mapa de la documentación

Está toda en el repo. No hace falta buscar nada fuera:

| Archivo | Para qué |
|---|---|
| **`CLAUDE.md`** | Contexto permanente. Claude lo lee solo al abrir la carpeta. |
| **`ESTADO.md`** | **Empieza por aquí.** Qué está hecho, qué falta, decisiones pendientes y las trampas ya pisadas. |
| `docs/SWIPE.md` | Los 8 pasos para poner la web nueva en producción, con comandos y vuelta atrás. |
| `docs/HOSTINGER.md` | Hostinger o Cloudflare: qué hace cada uno y cuál conviene. Decisión abierta. |
| `docs/PREVIEW-HOSTINGER.md` | Subir la demo privada al subdominio, sin que Google la indexe. |
| `docs/USUARIOS.md` | Dar de alta a Rosa y a Marc en el panel. |
| `docs/REUNION-STAKEHOLDER.md` | Guion para la reunión: qué enseñar, qué pedir, estado del CRM. |
| `docs/INTEGRACIONES.md` | Cómo se conecta la web con el CRM. |
| `ESTANDAR.md` | Reglas de marca y de diseño. |

## 5. Archivos que NO están en GitHub (están en el Escritorio)

Son pesados o contienen datos, por eso no se commitean:

| En `~/Desktop/` | Qué es |
|---|---|
| `conroma-preview-hostinger/` y `.zip` | La demo lista para subir a Hostinger (78 MB). Se regenera con `bash scripts/preparar-preview.sh`. |
| `backup-conromaasesores-antigua.tar.gz` | La web antigua entera: 285 páginas, 908 recursos, 18 MB. **No la borres** hasta que el swipe lleve meses. |
| `conroma-crm-ui-para-subir/` | Copia antigua del CRM. **Ya no hace falta**: usa el repo `~/conroma-crm-ui`, que tiene el historial completo y el remote configurado. |
| `conroma-contexto/` | `CLAUDE.md`, `CONTEXT.md`, `COMO-SINCRONIZAR.md` y `VOLCADO-desde-Pro.md`: el puente de contexto entre las dos cuentas. |

> Las **skills y la memoria de Claude** no están en ninguna de esas carpetas ni en GitHub: viven
> en `~/.claude/` de **cada ordenador** (47 fichas de memoria y las skills instaladas). Si las
> quieres en el Mac personal hay que copiar esa carpeta a mano (AirDrop o USB). El repo funciona
> sin ellas: `CLAUDE.md` y `ESTADO.md` bastan para retomar este proyecto.

## 6. Lo primero que hay que retomar

1. **Subir la demo a Hostinger** y pasarle la URL al stakeholder → `docs/PREVIEW-HOSTINGER.md`.
2. **Decidir dónde se aloja** la web (Hostinger o Cloudflare) → `docs/HOSTINGER.md`.
3. **Conseguir el NIF/CIF y el número AICAT.** Es el único bloqueante legal sin rodeo: las
   páginas de aviso legal y privacidad siguen con `[NIF/CIF pendiente]`.
4. **Seguir enchufando el CRM a Supabase**: faltan Pisos, Ficha de piso, Agenda, Valoraciones
   y Contactos. El patrón está hecho en `Leads.jsx`.

## 7. Decisiones abiertas (no las cierres tú solo)

- **www o sin www** cuando se haga el swipe. Hoy Google tiene todo indexado en `www`; la web
  nueva canonicaliza el apex. Sea cual sea la elección, **el servidor tiene que responder en los
  dos hosts** o las 301 no se ejecutan.
- ~~El CTA «Valorar mi piso» del header~~ **Resuelto el 3-nov**: ahora es WhatsApp
  («Escríbenos»), en icono a partir de móvil y con texto desde 48rem.
- **¿Versión en catalán?** La antigua tenía 4 idiomas sin hreflang; la nueva es solo castellano.
- **Lloret tiene 36 inmuebles y Malgrat 23**, pero los textos tratan Malgrat como único mercado.
