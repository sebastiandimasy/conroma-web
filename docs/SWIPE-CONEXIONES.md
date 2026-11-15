# Checklist del swipe — conexiones y medición (no perder tráfico)

> Qué revisar al publicar la web nueva para **no perder tráfico ni medición**. Mismo dominio
> (`conromaasesores.com`): si las 301 y la indexación están bien, no se pierde autoridad.
> Complementa el plan de swipe de `docs/INTEGRACIONES.md` §5.

## 0. La regla de oro
La mayor pérdida de tráfico en una migración viene de **redirecciones 301 incompletas** y de
**bloqueos accidentales** (robots/noindex). Todo lo demás es secundario.

> **RESUELTO 2026-11-15:** las 301 estaban SOLO en `public/_redirects` (formato Cloudflare), que
> **Hostinger (Apache) ignora** -> todas las URLs antiguas habrían caído en 404. Se tradujeron a
> `RewriteRule` en `public/.htaccess` (incluye www->apex y raíz `/`->`/es/`, porque el build no
> emite index.html en la raíz). Verificado contra las 43 URLs del sitemap antiguo:
> `node check-redirects.mjs` -> 0 404. `public/_redirects` queda como respaldo si algún día se
> vuelve a Cloudflare, pero **el archivo operativo en producción es `.htaccess`**.

## 1. Antes del swipe
- [ ] **Rastrear el sitio ANTIGUO** (Screaming Frog o el backup `~/Desktop/backup-...`) y cruzar
      TODAS sus URLs vivas contra `public/_redirects` (hoy 72 reglas). Cualquier URL viva sin
      destino 301 = 404 = tráfico perdido. Añadir las que falten.
- [ ] **No cambiar** los títulos ni el contenido de las URLs que YA posicionan (las nuevas H1/title
      de esta auditoría son mejoras, pero revisar que las páginas con tráfico siguen cubriendo su
      intención).
- [ ] **Indexabilidad:** con `sampleData=false`, comprobar que las páginas clave son indexables
      (sin `noindex` accidental) y que las internas (`/admin`,`/estilo`,`/guardados`,`/privacidad`)
      siguen fuera. `robots.txt` permite rastreo (+ bots IA). `canonical` correcto en todas.
- [ ] **Sitemap** nuevo (`/sitemap-index.xml`) accesible y sin URLs internas/finas.

## 2. Google Search Console (GSC)
- [ ] Propiedad verificada (idealmente **propiedad de dominio**). Mismo dominio → **NO** hace falta
      "Cambio de dirección" (eso es solo para cambiar de dominio); el cambio de hosting/IP
      (Cloudflare→Hostinger) no lo requiere.
- [ ] **Reenviar el sitemap** nuevo tras el swipe.
- [ ] **Inspección de URL** + "Solicitar indexación" de las páginas clave (home, comprar, vender,
      alquilar, valoración, municipios top).
- [ ] Vigilar 1–2 semanas: **Páginas/Cobertura** (404, redirecciones, excluidas) y **Rendimiento**
      (clics/impresiones) para detectar caídas pronto.

## 3. GA4
- [ ] El flujo de datos sigue vivo (Measurement ID **G-C9WV5S78LX**) y recibe datos tras el swipe.
- [ ] **Clave:** GA4 se carga **vía GTM**. En el contenedor debe existir la etiqueta
      **"GA4 Configuration"** con ese ID disparada en All Pages. Sin ella, GA4 NO mide (se quitó el
      gtag.js directo para no duplicar). Verificar en Tiempo real.
- [ ] **VERIFICADO 2026-11-15 (co-pilotaje en GTM):** hay DOS contenedores GTM en la cuenta de
      Boris Conde (borisconde11@gmail.com): `www.conromaasesores.com` = **GTM-KWJHKHR2** (el que
      carga la web, ver `BaseLayout.astro`) y `conromaasesores.com` = **GTM-K44DTTWW** (duplicado).
      **Los DOS están vacíos** (cero etiquetas, "No hay datos recientes"). Es decir, hoy **GA4 no
      mide nada** y **no hay Meta Pixel**. Hay que montar la medición en **GTM-KWJHKHR2** (el
      canónico) antes del swipe y decidir qué hacer con el duplicado K44 (ignorar o borrar).
- [ ] **Consent Mode v2** activo (ya): medición solo tras aceptar cookies.
- [ ] Marcar como **conversión** el evento `contacto_click` (wa.me/tel) — la medición por Click URL.
- [ ] Es la misma propiedad GA4: no se pierde histórico, solo hay que asegurar que sigue midiendo.

## 4. Google Tag Manager (GTM-KWJHKHR2)
**MONTADO 2026-11-15 en el contenedor (espacio de trabajo, SIN publicar).** La web ya empuja todo
lo necesario (`BaseLayout.astro`: Consent Mode v2 denegado por defecto + `update` al aceptar, y el
evento de dataLayer `contacto_click` con `metodo`/`origen`/`contacto` en cada clic a `wa.me`/`tel:`).
Etiquetas creadas en el contenedor:
- [x] **GA4 - Configuración (Google tag)** · ID `G-C9WV5S78LX` · activador *Initialization - All Pages*.
- [x] **GA4 - Evento contacto_click** · evento `contacto_click` · parámetro `metodo = {{DLV - metodo}}`
      · activador *CE - contacto_click* (Evento personalizado de dataLayer). GA4 respeta el Consent
      Mode de forma nativa (`analytics_storage`).
- [x] **Meta Pixel - Base (PageView)** · ver §5.
- [x] **Meta Pixel - Lead** · evento **Lead** sobre *CE - contacto_click*, consentimiento requerido
      `ad_storage`, CAPI desactivada (ver §5).
- [x] Activador **CE - contacto_click** y variable **DLV - metodo** (clave de dataLayer `metodo`).
- [ ] Opcional: añadir parámetros `origen` y `contacto` al evento GA4 (crear DLVs igual que `metodo`).
- [ ] **Revisar en Vista previa (modo debug de GTM) y PUBLICAR** el contenedor antes del swipe.
      (Hoy sigue SIN publicar: nada mide todavía hasta pulsar *Enviar*.)

## 5. Meta Pixel — ID `1550066012961447`
El Pixel/Dataset **ya existía** en Meta Events Manager (cuenta de Boris, business `362040946769680`),
nombre "Conroma Asesores", pero **sin recibir eventos** (no estaba instalado). Montado **vía GTM**
(no hardcodeado) el 2026-11-15:
- [x] **Meta Pixel - Base (PageView)** · plantilla oficial de Meta · Pixel `1550066012961447` ·
      Event Name *PageView* · activador *All Pages* · **gateado por consentimiento: requiere
      `ad_storage`** (no dispara hasta "Aceptar cookies"). CAPI (Conversions API) **desactivada** a
      propósito (implica aceptar términos de Meta / integración server-side: decisión del dueño).
- [x] **Meta Pixel - Lead** · plantilla oficial de Meta · Pixel `1550066012961447` · Event Name
      *Lead* · activador *CE - contacto_click* · requiere `ad_storage` · CAPI desactivada.
- [ ] Verificar con **Meta Pixel Helper** tras publicar el contenedor.

## 6. Google Ads (si hay campañas activas)
- [ ] Reapuntar/verificar las **acciones de conversión** a los eventos nuevos (`contacto_click`).
- [ ] Revisar las **URLs finales** de los anuncios: apuntar a las URLs NUEVAS directas, no a URLs
      viejas que ahora redirigen (una 301 extra resta calidad y velocidad).

## 7. El día del swipe
- [ ] Bajar el **TTL del DNS** antes; luego apuntar el dominio al hosting nuevo (Hostinger).
- [ ] Comprobar en vivo: responde, **HTTPS**, `canonical`, `sitemap` accesible, `robots`, y probar
      varias **URLs viejas → 301** a las nuevas (que no den 404).
- [ ] GSC: reenviar sitemap + inspeccionar URLs clave. GA4/GTM/Pixel: ver Tiempo real / Pixel Helper.
- [ ] **Rollback listo:** mantener el backup de la web antigua; si algo va mal, revertir el DNS.

## 8. Semana post-swipe (seguimiento)
- [ ] GSC Cobertura (que no suban los 404 ni las "excluidas") y Rendimiento (que no caigan clics).
- [ ] GA4: tráfico orgánico estable; eventos de contacto llegando.
- [ ] Logs/404 del hosting: cazar URLs viejas sin redirección que se escaparon.
- [ ] Mantener el backup hasta que el swipe lleve semanas asentado.

## Pendientes del dueño antes de publicar (bloqueantes)
Datos legales (AICAT/NIF), fotos de 8 pisos, `sampleData=false`, y la decisión de publicar. Sin
estos, no se hace el swipe.
