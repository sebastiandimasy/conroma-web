# Checklist del swipe — conexiones y medición (no perder tráfico)

> Qué revisar al publicar la web nueva para **no perder tráfico ni medición**. Mismo dominio
> (`conromaasesores.com`): si las 301 y la indexación están bien, no se pierde autoridad.
> Complementa el plan de swipe de `docs/INTEGRACIONES.md` §5.

## 0. La regla de oro
La mayor pérdida de tráfico en una migración viene de **redirecciones 301 incompletas** y de
**bloqueos accidentales** (robots/noindex). Todo lo demás es secundario.

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
- [ ] **Consent Mode v2** activo (ya): medición solo tras aceptar cookies.
- [ ] Marcar como **conversión** el evento `contacto_click` (wa.me/tel) — la medición por Click URL.
- [ ] Es la misma propiedad GA4: no se pierde histórico, solo hay que asegurar que sigue midiendo.

## 4. Google Tag Manager (GTM-KWJHKHR2)
- [ ] Contenedor **publicado** con: GA4 Configuration + trigger sobre el evento de dataLayer
      `contacto_click` → conversión de GA4/Google Ads + (si aplica) Meta Pixel.
- [ ] Las etiquetas de medición respetan el Consent Mode (no disparan sin consentimiento).
- [ ] Publicar la versión del contenedor **antes** del swipe.

## 5. Meta Pixel — FALTA
- [ ] **No está instalado en la web.** Si usáis **Meta Ads** (conectado en NotFair), añadir el Pixel
      **vía GTM** (no hardcodeado), con Consent Mode, y disparar el evento **Lead** sobre
      `contacto_click`. Verificar con **Meta Pixel Helper** tras el swipe.

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
