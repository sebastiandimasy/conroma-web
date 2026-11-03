# Swipe: poner la web nueva en producción

Procedimiento para sustituir la web antigua de `conromaasesores.com` por la nueva.
Verificado el 3 de noviembre de 2026 contra el estado real del dominio y del repo.

---

## ⚠️ Lo primero: hoy la web vive en `www`, y la nueva canonicaliza el apex

Esto es **el riesgo principal del swipe**, y no se ve hasta que lo compruebas:

```
$ dig +short NS conromaasesores.com
cosmos.dns-parking.com.        ← DNS de parking (Hostinger), no Cloudflare
nova.dns-parking.com.

$ curl -I https://conromaasesores.com/
HTTP/2 301 → http://www.conromaasesores.com/     ← el apex redirige a www
server: Microsoft-IIS/10.0                        ← servidor de Habitatsoft

$ curl -I https://www.conromaasesores.com/
HTTP/2 200
```

Todo lo que Google tiene indexado está bajo **`www.`**. La web nueva declara como canónica la
versión **sin www** (`site: 'https://conromaasesores.com'` en `astro.config.mjs`).

**Si se despliega el Worker solo en el apex, las 192 rutas antiguas —que son todas `www`— no
llegan a tocar ninguna regla de `_redirects`, y se pierde el SEO heredado.** Las redirecciones
están perfectas (192 de 192 cubiertas, 0 destinos rotos), pero no se ejecutarían.

**Solución:** enganchar el Worker como *Custom Domain* en **los dos hosts** (apex y `www`) y
redirigir `www → apex` con una Redirect Rule de Cloudflare. `_redirects` **no sirve** para esto:
no admite reglas por host.

---

## Paso 0 — Antes de tocar nada

- [ ] El backup de la web antigua sigue en `~/Desktop/backup-conromaasesores-antigua.tar.gz`.
- [ ] Apuntar los **TTL actuales** del DNS. Bájalos a 300 s **24-48 h antes** del cambio: así el
      cambio se propaga en minutos y la vuelta atrás también.
- [ ] Avisar a Habitatsoft de que no apaguen su servidor hasta pasadas 2 semanas (por si hay que
      revertir).

## Paso 1 — Mover el dominio a Cloudflare

1. Cloudflare → *Add a site* → `conromaasesores.com` → plan Free.
2. Cloudflare importa los registros DNS actuales. **Revísalos uno a uno**, sobre todo:
   - `MX` y `TXT` de **correo** (SPF, DKIM, DMARC). Si se pierden, **dejáis de recibir correo**.
     Esto es lo que más se rompe en una migración de DNS.
   - Cualquier subdominio en uso (webmail, cpanel, etc.).
3. En **Hostinger**, cambiar los nameservers por los dos que te da Cloudflare.
4. Esperar a que Cloudflare marque la zona como *Active* (de minutos a 24 h).

Comprobación:
```bash
dig +short NS conromaasesores.com     # tienen que salir los de Cloudflare
dig +short MX conromaasesores.com     # el correo tiene que seguir igual que antes
```

## Paso 2 — Autenticar wrangler

```bash
npx wrangler login      # abre el navegador; entra con la cuenta Cloudflare del dominio
npx wrangler whoami     # tiene que decir el email y la cuenta, no "not authenticated"
```

## Paso 3 — Secretos del Worker

Sin esto, **el formulario de contacto y la valoración devuelven error 500**
(`src/pages/api/leads.ts`).

```bash
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```
Te los pide por teclado: no quedan en el historial ni en ningún archivo.

Y para el build (archivo `.env` local, que no se commitea):
```
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=la-anon-key
```
Sin estas dos, el panel `/es/admin/` lanza «Faltan PUBLIC_SUPABASE_URL…» al abrirse.
**`PUBLIC_PREVIEW` tiene que quedar SIN poner en producción**: si vale `true`, mete `noindex`
en toda la web.

## Paso 4 — Desplegar sin tocar el dominio todavía

```bash
npm run deploy
```
Esto publica en `conroma-web.<tu-cuenta>.workers.dev`. La web antigua sigue intacta.

La primera vez wrangler pedirá **aprovisionar el KV `SESSION`** (está sin `id` en
`wrangler.jsonc`): acepta.

Prueba ahí, en la URL de `workers.dev`:
- [ ] La portada carga y **a 390 px** se ve bien (el móvil es el 97% del tráfico).
- [ ] Enviar el formulario de contacto → el lead aparece en Supabase.
- [ ] La valoración guarda.
- [ ] Entrar en `/es/admin/` con el usuario admin (ver `docs/USUARIOS.md`).

## Paso 5 — Enganchar los dos hosts

En Cloudflare → *Workers & Pages* → `conroma-web` → *Settings* → *Domains & Routes*:
- [ ] Añadir Custom Domain **`conromaasesores.com`**
- [ ] Añadir Custom Domain **`www.conromaasesores.com`**

Y en *Rules* → *Redirect Rules*, una regla:

| Campo | Valor |
|---|---|
| Si | `http.host eq "www.conromaasesores.com"` |
| Entonces | Dynamic redirect a `concat("https://conromaasesores.com", http.request.uri.path)` |
| Código | **301** · Preservar query string: **sí** |

> Esto es lo que hace que las URLs antiguas en `www` entren, se redirijan al apex y **allí sí**
> las recojan las reglas de `_redirects`. Es una cadena de dos saltos (www → apex → destino):
> aceptable y habitual, Google la sigue sin problema.

## Paso 6 — Comprobar que las 301 funcionan de verdad

```bash
for u in \
  "https://www.conromaasesores.com/" \
  "https://www.conromaasesores.com/detalle/inmueble/1281" \
  "https://www.conromaasesores.com/texto_legal" \
  "https://conromaasesores.com/es/venta/malgrat-de-mar/" ; do
  echo "--- $u"
  curl -sI -L --max-redirs 5 "$u" | grep -E "^HTTP|^location|^Location"
done
```
Lo que tiene que pasar: cada una acaba en **200** tras uno o dos saltos **301** (nunca 302,
nunca 404, nunca un bucle).

## Paso 7 — Search Console

- [ ] Verificar la propiedad de **dominio** (TXT en DNS, ahora es fácil estando en Cloudflare).
- [ ] **No borrar** la propiedad antigua de `www`: es donde vas a ver cómo se consumen las 301.
- [ ] Enviar `https://conromaasesores.com/sitemap-index.xml`.
- [ ] Vigilar «Cobertura» las 2 primeras semanas: lo normal es ver subir las redirecciones y
      bajar las URLs antiguas poco a poco.

## Paso 8 — Después

- [ ] Comprobar en GTM (`GTM-KWJHKHR2`) que la etiqueta **GA4 Configuration `G-C9WV5S78LX`**
      existe y dispara en *All Pages*. En el código el `gtag.js` directo está quitado a
      propósito para no duplicar hits: si esa etiqueta no está dentro de GTM, **GA4 no recibe
      absolutamente nada**.
- [ ] Probar cómo se ve al compartir en WhatsApp (la imagen OG es `/img/og-conroma.jpg`,
      1200x630).
- [ ] A las 2 semanas, si todo va bien: dar de baja el hosting antiguo.

---

## Cómo volver atrás

Mientras el dominio esté en Cloudflare, revertir es quitar los dos Custom Domains del Worker y
devolver los registros `A`/`CNAME` a la IP de Habitatsoft. Con el TTL a 300 s, cuestión de
minutos. Por eso el paso 0 (bajar TTL y no apagar el servidor viejo) no es opcional.
