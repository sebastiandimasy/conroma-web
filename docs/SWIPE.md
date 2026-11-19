# Swipe: poner la web nueva en producción (Hostinger)

Cómo sustituir la web antigua de `conromaasesores.com` (servidor IIS de Habitatsoft) por la nueva,
alojada en **Hostinger**. Revisado el 18 de noviembre de 2026.

La web nueva es **100 % estática**: HTML, CSS, JS e imágenes. No hay servidor propio. Los
formularios escriben directo en Supabase con la `anon key` y una política RLS que solo permite
insertar (`supabase/migrations/0003_web_lead_insert.sql`).

---

## El riesgo principal: `www` y apex

Google tiene indexada la web antigua en **`www.conromaasesores.com`**. La nueva declara como
canónica la versión **sin www** (`site` en `astro.config.mjs`).

`public/.htaccess` ya hace el 301 de `www` al apex y todas las redirecciones de URLs antiguas
(las 43 del sitemap viejo, comprobadas). **Solo funciona si `www` y el apex llegan al mismo
alojamiento de Hostinger.** Si `www` siguiera apuntando a Habitatsoft, ninguna URL antigua pasaría
por esas reglas y se perdería el SEO heredado.

---

## Paso 0 — Antes de tocar nada

- [x] Apuntar los registros DNS **actuales** de `@` y `www`. Son la vuelta atrás. Consultados el
      19-nov-2026 (volver a mirarlos el día del swipe por si han cambiado):

      | Registro | Tipo | Valor |
      |---|---|---|
      | `@` | `A` | `185.79.147.30` (servidor IIS de Habitatsoft, la web antigua) |
      | `www` | `CNAME` | `conromaasesores.com.` |
      | `MX` | `MX` | `0 mail.conromaasesores.com.` (no tocar) |
      | NS | — | `nova.dns-parking.com`, `cosmos.dns-parking.com` (Hostinger) |
- [ ] Bajar el TTL de esos dos registros a 300 s **24-48 h antes** del cambio.
- [ ] Avisar a Habitatsoft de que no apaguen su servidor hasta pasadas 2 semanas.
- [ ] El backup de la web antigua sigue en `~/Library/Mobile Documents/com~apple~CloudDocs/Downloads/backup-conromaasesores-antigua.tar.gz` (iCloud Drive → Descargas).
- [ ] **No tocar los registros `MX` ni los `TXT` (SPF, DKIM, DMARC).** Son el correo.

## Paso 1 — Build de producción

Primero, con la web antigua aún encendida, refrescar lo que se lee de ella (certificado
energético, ids para las 301, qué sigue publicado):

```bash
node scripts/scrape-web-antigua.mjs
```

En un `.env` local (no se commitea):

```
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=la-anon-key
HABITATSOFT_FEED_URL=el-enlace-del-feed-Enlace-Web-2.0
```

Con `HABITATSOFT_FEED_URL`, el build trae el inventario del feed en vez del Excel y en la
salida dice cuántos pisos trae, cuántos son nuevos y qué campos del feed parecen certificado
energético o fecha (para mapearlos en `src/lib/habitatsoft.ts`). Si el feed falla o trae menos
de la mitad de los pisos, usa el inventario anterior y lo avisa.

`PUBLIC_PREVIEW` tiene que quedar **sin poner**: si vale `true`, toda la web sale con `noindex`.

```bash
npm run build && bash scripts/guardar-version.sh
```

`guardar-version.sh` deja una copia del build en `~/conroma-versiones/<fecha>-<commit>.zip` (guarda
las 10 últimas). Es lo que se vuelve a subir si una versión nueva sale mal.

El resultado está en **`dist/client/`**. Comprueba que dentro hay un `.htaccess` (es un archivo
oculto) y un `sitemap-index.xml`.

## Paso 2 — Subir a Hostinger

1. hPanel → *Sitios web* → añadir `conromaasesores.com` al plan de hosting (si no está).
2. *Administrador de archivos* → `public_html/` del dominio → subir **el contenido** de
   `dist/client/` (no la carpeta en sí), `.htaccess` incluido.
3. Si `public_html/` trae un `index.html` o `default.php` de Hostinger, borrarlo.

## Paso 3 — Apuntar el dominio

En hPanel → *Dominios* → *DNS*:

- [ ] `@` (registro `A`) → la IP del hosting de Hostinger (la muestra hPanel en *Detalles del plan*).
- [ ] `www` → `CNAME` a `conromaasesores.com` (o `A` a la misma IP).
- [ ] `MX` y `TXT` del correo: **sin tocar**.

Luego, en *Seguridad* → *SSL*: instalar el certificado gratuito para el dominio **y para `www`**,
y activar **Forzar HTTPS**. Sin el certificado de `www`, el 301 de `www` falla con error de
certificado antes de llegar a ejecutarse.

## Paso 4 — Comprobar que las 301 funcionan

```bash
for u in \
  "http://conromaasesores.com/" \
  "https://www.conromaasesores.com/" \
  "https://www.conromaasesores.com/detalle/en_venta/piso/barcelona/malgrat_de_mar/1281/" \
  "https://www.conromaasesores.com/texto_legal" \
  "https://www.conromaasesores.com/captacion" \
  "https://conromaasesores.com/es/venta/malgrat-de-mar/" ; do
  echo "--- $u"
  curl -sI -L --max-redirs 5 "$u" | grep -iE "^HTTP|^location"
done
```

Cada una tiene que acabar en **200** tras uno o dos **301**. Nunca 302, 404 ni bucle.

Y la prueba de humo (home, catálogo, una ficha con su foto de Habitatsoft, legales, indexación):

```bash
node scripts/smoke.mjs https://conromaasesores.com
```

Si sale algún `✗`, ir a «Cómo volver atrás».

Y a mano, en el móvil:
- [ ] La portada carga y se ve bien.
- [ ] Enviar el formulario de contacto: el lead aparece en la tabla `lead` de Supabase.
- [ ] La valoración guarda.
- [ ] El botón de WhatsApp de una ficha abre el chat con la referencia del piso.

## Paso 5 — Search Console

- [ ] Verificar la propiedad de **dominio** (registro `TXT` en el DNS de Hostinger).
- [ ] **No borrar** la propiedad antigua de `www`: ahí se ve cómo Google consume las 301.
- [ ] Enviar `https://conromaasesores.com/sitemap-index.xml`.
- [ ] Revisar *Indexación de páginas* las 2 primeras semanas.

## Paso 6 — Después

- [ ] GTM `GTM-KWJHKHR2`: comprobar que la etiqueta de **GA4 `G-C9WV5S78LX`** existe y se
      dispara en todas las páginas. El código no carga `gtag.js` directo (para no duplicar
      visitas): sin esa etiqueta, GA4 no recibe nada.
- [ ] Probar cómo se ve un enlace compartido por WhatsApp (imagen `/img/og-conroma.jpg`).
- [ ] Añadir el número AICAT al aviso legal (`company` en `src/data/site.ts`).
- [ ] A las 2 semanas, si todo va bien, avisar a Habitatsoft de que pueden apagar la web antigua.
      **El CRM de Habitatsoft sigue en uso**: solo se da de baja la web.

---

## Cómo volver atrás (el seguro de vida)

Tres niveles, del más leve al más grave. En todos, primero se confirma el fallo con
`node scripts/smoke.mjs https://conromaasesores.com`.

**1. Una actualización de la web sale mal** (la web nueva ya estaba funcionando). Unos 5 minutos:
1. Coger el zip anterior de `~/conroma-versiones/` (el segundo más reciente; el nombre lleva el
   commit).
2. hPanel → *Administrador de archivos* → `public_html/` → subirlo → botón derecho → *Extraer* →
   *Aquí, reemplazando los archivos existentes*.
3. Pasar otra vez la prueba de humo.
4. En el repo, `git revert` del commit que lo rompió, para que el siguiente build no lo repita.

**2. La web nueva no funciona en absoluto** (el día del swipe o después). Unos minutos con el TTL
a 300 s:
- hPanel → *Dominios* → *DNS* → `@` (`A`) otra vez a **`185.79.147.30`**. `www` es un `CNAME` a
  `@`, así que vuelve solo. La web antigua de Habitatsoft sigue encendida (paso 0: no la apagan
  hasta pasadas 2 semanas).
- `MX` y `TXT` no se tocan: el correo no se entera de nada.

**3. El feed de Habitatsoft falla o viene incompleto.** No hace falta hacer nada:
`scripts/fetch-inventory.mjs` lo detecta (menos de la mitad de pisos o error) y el build usa el
inventario anterior. Lo avisa en la salida del build.

Por eso el paso 0 no es opcional: sin el TTL bajo y sin los valores apuntados, el nivel 2 tarda
horas.

## Actualizar la web después del swipe

La web es estática: **un piso dado de alta en Habitatsoft aparece en la web en el siguiente
build**. Para que pase solo, activar el workflow de `docs/DEPLOY-ACTIONS.md` (build cada noche
con el feed y subida por FTP). La etiqueta «Nuevo» dura 7 días y se quita en el build de ese
día: sin el build diario, se quedaría puesta.

Cómo sabe qué es nuevo: el build apunta en `/data/altas.json` (publicado en la web) el día en
que cada referencia aparece por primera vez, y el siguiente build lo lee de ahí.

A mano: `npm run build` y volver a subir el contenido de `dist/client/`.
