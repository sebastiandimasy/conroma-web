# Traspaso a la sesión de Claude Pro (Mac personal)

> **Estado a 5-nov-2026.** Lee esto antes que nada: hay una parte subida y otra que no.

| Repo | Estado |
|---|---|
| **`conroma-web`** (este) | Todo subido, rama `feat/crm-leads`. Nada pendiente |
| **`conroma-crm-ui`** | **5 commits SOLO en el Mac de trabajo.** El `git push` devuelve **403**: el token disponible no tiene acceso de escritura a ese repo |

### Cómo recuperar los 5 commits del CRM

**Opción A — la buena: un token con acceso.** Un PAT clásico con permiso `repo` sobre
`sebastiandimasy/conroma-crm-ui`, un `git push`, y se acabó el problema para siempre.
Todo lo demás son apaños.

**Opción B — paquete git, sin GitHub.** En el Mac de trabajo hay un archivo con el
historial completo:

```
~/Desktop/conroma-crm-ui.bundle          (262 KB, historial completo verificado)
```

Pásalo al otro Mac (AirDrop, iCloud, un USB) y:

```bash
# si NO tienes el repo clonado todavia
git clone ~/Downloads/conroma-crm-ui.bundle conroma-crm-ui
cd conroma-crm-ui && git checkout main

# si YA lo tienes clonado y quieres solo lo nuevo
cd ~/conroma-crm-ui
git pull ~/Downloads/conroma-crm-ui.bundle main
```

Un `.bundle` es un repositorio entero en un archivo: se clona y se extrae de él igual
que de un remoto. No pierdes historial ni mensajes de commit.

Los 5 commits que viajan en él:

```
f2bb0c3  Fase 1: el gestor de pisos puede escribir, y marcha atras por capas
a69880c  docs: guion de lanzamiento con el orden de conexion
5724c5c  Reglas de movil y el tablero de leads con un solo eje
60f88b6  Captacion de particulares y barrido movil a 390 px
1c24b53  Ficha de inmueble de verdad, publicacion en portales y esqueletos
```

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

---

# Anexo · Sesión del 5-nov-2026 (CRM)

Todo lo de este anexo vive en **`conroma-crm-ui`**, no en este repo. Si no has recuperado
los 5 commits, vuelve a la cabecera de este documento.

## Qué se hizo

**El recorrido del comercial no se podía terminar.** El botón «Nueva cita» no tenía
manejador, las citas no eran clicables y desde la ficha del lead no se podía agendar: ibas
a la visita y no había dónde decir cómo había ido. Ahora se crea, se confirma y se cierra
una cita, y el resultado **baja solo** a la ficha del lead y al historial del inmueble.

**No existía pantalla para ver una ficha de inmueble**, solo para crearla: `App.jsx` montaba
`<FichaPiso>` sin inmueble. Ahora es un expediente de 6 pestañas con la estructura de
HabitatSoft (Datos · Fotos y textos · Publicación · Interno · Documentos) más Historial,
que ellos no tienen.

**El gestor de pisos estaba entero en modo lectura.** No había ninguna escritura de
inmuebles en `useData.js`. Ahora se puede crear, editar y **publicar o retirar de la web**,
con las migraciones `0001_cartera.sql` y `0002_leads.sql` que faltaban en el repo.

**El Panel enseñaba tres métricas inventadas** con la etiqueta «ejemplo». Fuera. Ahora todo
sale de los datos que hay.

**Móvil**: «Más» llevaba directo a Valoraciones y había **siete pantallas inalcanzables**
desde un móvil. La tabla del kit tenía `min-w-[640px]` dentro de 390 px. Y el tablero de
leads metía scroll horizontal dentro del vertical. Las tres cosas, corregidas.

**Nuevo**: módulo de publicación en portales con los cupos reales y bloqueo legal sin
certificado energético, y pantalla de **captación de particulares** ordenada por para quién
ya tenemos comprador.

## Las dos reglas que no se tocan

1. **`docs/REGLAS-MOVIL.md`** — un solo eje de desplazamiento, las tablas cambian de forma
   con `<Table movil={…}>`, todo alcanzable desde «Más». Cada regla existe porque algo se
   rompió, no por gusto.
2. **Las migraciones son solo aditivas.** Una fase añade; nunca cambia lo que usa la
   anterior. Deshacer una fase es dejar de usarla.

## Marcha atrás, en cuatro capas

| Si falla | Se deshace con |
|---|---|
| La web no lee bien el catálogo | `src/data/site.ts` → `inventarioDesde: 'json'` (en **este** repo) |
| Un módulo del CRM | `src/config/modulos.js` → su bandera a `false` |
| Una migración | El `rollback` comentado al pie de cada archivo |
| Una fase entera | `git revert` del merge |

## Documentación nueva (toda en `conroma-crm-ui/docs/`)

| Archivo | Para qué |
|---|---|
| `PLAN-FASES.md` | Las 4 fases y cómo deshacer cada una |
| `LANZAMIENTO.md` | El orden de conexión y qué papeleo empezar el día 1 |
| `PUBLICACION-PORTALES.md` | Cómo se publica de verdad en Idealista y Fotocasa, con fuentes |
| `CAPTACION-PARTICULARES.md` | De dónde salen los datos y qué exige el RGPD |
| `QUE-CUBRE.md` | Qué cubre el CRM y qué **no**: ni facturación, ni firma digital, ni MLS |
| `REGLAS-MOVIL.md` | Las 8 reglas de diseño móvil |
| `AUDITORIA-TRES-CRM.md` | Habitatsoft vs Clientify vs el nuestro |

## Lo que hay que saber antes de enseñarlo

**Nada de lo que se escribe sobrevive a recargar la página.** Está avisado en pantalla con
el punto ámbar de «datos de demostración», pero no se puede presentar como que guarda.

## Para retomar, por orden

1. **Terminar la Fase 1**: fotos a Storage, que la web lea de `property`, usuarios reales.
2. **Aplicar las migraciones** en el proyecto de Supabase.
3. **Decidir el alojamiento** (sigue abierto y bloquea dónde viven las claves).
4. **Empezar el papeleo** de Idealista, Meta y Google: tarda semanas y no depende de nosotros.

## Texto para pegarle a la otra sesión

```
Retomo el CRM de Conroma (~/conroma-crm-ui). Lee primero CLAUDE.md,
docs/PLAN-FASES.md y docs/REGLAS-MOVIL.md.

Estamos en la Fase 1: el gestor de pisos. Ya se puede crear, editar y
publicar o retirar un inmueble de la web, y están escritas las migraciones
0001_cartera y 0002_leads. Falta: subir fotos a Storage, que la web lea de
la tabla property en vez del JSON, y dar de alta a los usuarios reales.

Tres reglas que no se tocan:
· Móvil es el 97%: verifica a 390 px en navegador real, y sigue
  docs/REGLAS-MOVIL.md.
· Las migraciones son solo aditivas, cada una con su rollback al pie.
· Marca: negro principal, amarillo solo de acento, nada de azul.

Y una advertencia: hoy nada de lo que se escribe sobrevive a recargar la
página. No lo enseñes como si guardara.
```
