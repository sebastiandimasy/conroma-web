# Hostinger o Cloudflare: qué hace cada uno y qué conviene aquí

Escrito el 3 de noviembre de 2026 para responder a una pregunta concreta del dueño:
*«no sé qué diferencia hay de Cloudflare a Hostinger; si podemos hacer que todo esté en
Hostinger, genial».*

## No son lo mismo ni compiten del todo

Un dominio tiene tres cosas separadas, y suele confundirlas que las venda la misma empresa:

| Pieza | Qué es | Dónde está hoy |
|---|---|---|
| **Registrador** | Quién tiene el dominio a tu nombre. Lo pagas una vez al año. | **Hostinger** (lo abriste tú) |
| **DNS** | La agenda que dice «conromaasesores.com está en esta IP». | **Hostinger** (dns-parking.com) |
| **Alojamiento** | El servidor que sirve las páginas. | **Habitatsoft** (un IIS de Microsoft) |

**Cloudflare no es un registrador aquí.** Si se usara, el dominio **seguiría siendo tuyo en
Hostinger**: solo cambiarían los *nameservers*, es decir, quién lleva la agenda. No pierdes la
propiedad del dominio ni dejas Hostinger.

Dicho esto: **si todo puede quedarse en Hostinger, mejor.** Menos piezas, menos cosas que
explicar y, sobre todo, **el correo no se toca**.

## El correo: por qué quedarse en Hostinger lo hace más seguro

El correo no viaja por la web: va por unos registros DNS aparte (`MX`, y los `TXT` de SPF, DKIM
y DMARC). Si el DNS no se mueve de Hostinger, **esos registros no se tocan y el correo no puede
caerse**. Riesgo cero.

Mover el DNS a Cloudflare no rompe el correo *si se copian bien esos registros*, pero es
exactamente el paso donde más migraciones se estropean. Si no hay una razón de peso para
moverlo, no se mueve.

## El único obstáculo técnico: una ruta

La web nueva es **estática casi entera**: 184 páginas HTML que cualquier hosting sirve sin
problema, Hostinger incluido. Pero tiene **una** ruta que ejecuta código en el servidor:

```
src/pages/api/leads.ts      ← guarda en Supabase los contactos y las valoraciones
```

Está escrita para **Cloudflare Workers** (JavaScript en el borde). El hosting compartido de
Hostinger ejecuta **PHP**, no JavaScript de servidor: esa ruta ahí no funciona, devolvería 404.

Qué pasa si no funciona: los formularios **no se rompen** (están hechos para aguantarlo: si el
guardado falla, abren el WhatsApp igual y el contacto no se pierde), pero **el lead no queda
registrado en Supabase**. Y registrar el lead es justo lo que diferencia a la web nueva de la
antigua.

## Tres caminos reales

### A) Todo en Hostinger, quitando el servidor de la ecuación — *recomendado*
Hacer la web **100 % estática** y que el formulario escriba **directamente en Supabase desde el
navegador**, con la `anon key` y una política RLS que solo permita *insertar* en la tabla `lead`
(ni leer, ni modificar, ni borrar).

- **Ventajas:** todo vive en Hostinger. El correo ni se entera. No hay Worker, no hay segunda
  factura, no hay segundo panel que aprender. Y se sigue capturando el lead.
- **A cambio:** hay que escribir la política RLS con cuidado y protegerlo del spam (ya hay
  honeypot; conviene añadir Turnstile o similar).
- **Trabajo:** unas horas. Cambia `ContactForm.tsx`, `ValuationWizard.tsx`, una migración SQL
  y se borra `api/leads.ts`.

### B) Todo en Hostinger, traduciendo la ruta a PHP
Reescribir `api/leads.ts` como un `leads.php` que hable con Supabase.

- **Ventajas:** la `service_role` sigue en el servidor, que es lo más seguro.
- **A cambio:** aparece PHP en un proyecto que no tiene nada de PHP. Dos lenguajes que mantener
  para una sola función.

### C) Dejarlo en Cloudflare Workers (como está hoy el código)
- **Ventajas:** no hay que tocar nada del código. Cloudflare es gratis en este tamaño y más
  rápido sirviendo (CDN propia).
- **A cambio:** hay que mover el DNS a Cloudflare — con el riesgo del correo — y manejas dos
  paneles.

## Recomendación

**Opción A.** El motivo no es técnico sino práctico: el dominio, el hosting y el correo ya están
en Hostinger y funcionando. Meter Cloudflare en medio solo para una ruta de formulario añade un
punto de fallo (el correo) y un panel más, a cambio de poco.

La opción A deja la web como lo que realmente es —184 páginas estáticas— y la captación de leads
funcionando igual.

> **Pendiente de decidir con el stakeholder.** Mientras tanto, la demo se sirve en un subdominio
> de Hostinger sin indexar: ver `docs/PREVIEW-HOSTINGER.md`.

## Lo que hay que hacer igualmente, elijas lo que elijas

El hallazgo crítico del swipe no depende de esta decisión:

**Hoy Google tiene indexada la web en `www.conromaasesores.com`, y la web nueva declara como
oficial la versión sin `www`.** Si el servidor nuevo solo responde en una de las dos, las URLs
antiguas mueren en un 404 y se pierde el posicionamiento.

En Hostinger esto se resuelve en el panel: el subdominio `www` tiene que apuntar al mismo sitio,
y el `.htaccess` hace el 301 de uno a otro. Detalle en `docs/SWIPE.md`.
