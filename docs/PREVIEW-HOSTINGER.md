# Demo privada para el stakeholder, en Hostinger y sin indexar

Objetivo: una URL que puedas pasarle al stakeholder para que vea la web nueva **antes** del
swipe, sin que Google la encuentre ni la indexe, y sin tocar nada de la web actual.

El paquete ya está hecho:

```
~/Desktop/conroma-preview-hostinger/      ← carpeta lista para subir
~/Desktop/conroma-preview-hostinger.zip   ← la misma, comprimida (78 MB)
```

## Qué lleva dentro (y por qué no se puede indexar)

Son **tres barreras independientes**. Con una bastaría; las tres juntas hacen que sea
prácticamente imposible que aparezca en Google:

1. **`<meta name="robots" content="noindex, nofollow">` en las 184 páginas.** Verificado una a
   una: 184 de 184. Se genera con `PUBLIC_PREVIEW=true` al compilar.
2. **`robots.txt` con `Disallow: /`** para todo el subdominio.
3. **Cabecera `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`** en el `.htaccess`. Esta
   cubre también lo que no puede llevar etiqueta: PDF, imágenes, vídeos.

> El `.htaccess` además manda la raíz `/` a `/es/` y activa la compresión. Hostinger usa
> LiteSpeed, que entiende `.htaccess` igual que Apache.

## Pasos en el panel de Hostinger

### 1. Crear el subdominio

hPanel → tu dominio → **Dominios → Subdominios**.

- Subdominio: `demo` (queda `demo.conromaasesores.com`)
- Deja marcada la carpeta que te propone (`public_html/demo`) y crea.

> Esto **no afecta** a `conromaasesores.com` ni al correo: un subdominio es una entrada nueva,
> no modifica las existentes.

### 2. Subir los archivos

hPanel → **Archivos → Administrador de archivos** → entra en `public_html/demo`.

- Sube **`conroma-preview-hostinger.zip`**.
- Botón derecho sobre el zip → **Extraer**.
- Los archivos quedan dentro de una carpeta `conroma-preview-hostinger/`: **entra, selecciona
  todo y muévelo un nivel arriba**, a `demo/`. Luego borra la carpeta vacía y el zip.
- Comprueba que en `demo/` ves directamente `index.html`, `.htaccess`, `es/`, `img/`…

> Si no ves el `.htaccess`, activa **«Mostrar archivos ocultos»** en el menú del administrador.
> Sin ese archivo la demo funciona, pero pierde la cabecera `X-Robots-Tag`.

### 3. Activar el SSL

hPanel → **Seguridad → SSL** → instalar el certificado gratuito para `demo.conromaasesores.com`.
Tarda unos minutos. Sin él, el navegador avisará de sitio no seguro y da mala impresión en una
demo.

### 4. Ponerle contraseña (recomendado)

hPanel → **Archivos → Protección de carpetas con contraseña** → carpeta `demo` → usuario y
contraseña.

Es la única barrera que impide que alguien con el enlace entre. Las otras tres evitan que Google
lo indexe, pero no que una persona lo abra. Pásale al stakeholder la URL y la contraseña por
canales distintos.

## Comprobar que ha quedado bien

```bash
# 1. Carga y da 200
curl -sI https://demo.conromaasesores.com/es/ | head -1

# 2. La cabecera de no indexar está
curl -sI https://demo.conromaasesores.com/es/ | grep -i x-robots-tag

# 3. El robots.txt bloquea
curl -s https://demo.conromaasesores.com/robots.txt

# 4. La etiqueta en el HTML
curl -s https://demo.conromaasesores.com/es/ | grep -o '<meta name="robots"[^>]*>'
```

Y en el navegador: abre `https://demo.conromaasesores.com/` — debe llevarte solo a `/es/`.
**Míralo en el móvil**, que es el 97 % del tráfico.

## Qué NO funciona en la demo (y está bien que no funcione)

- **El formulario no guarda el lead en Supabase.** La ruta `/api/leads` necesita un servidor que
  ejecute JavaScript, y el hosting compartido de Hostinger ejecuta PHP. Los formularios **no dan
  error**: siguen abriendo WhatsApp con el mensaje escrito, que es lo que el stakeholder va a
  probar. Ver `docs/HOSTINGER.md` para cómo se resuelve de cara a producción.
- **El panel `/es/admin/`** no entra: necesita las claves de Supabase compiladas.

## Cuando el stakeholder dé el OK

**Borra el subdominio `demo`.** Si se queda, acabas con dos copias de la misma web y, aunque no
esté indexada, es una fuente de confusión. El swipe de verdad está en `docs/SWIPE.md`.

## Regenerar el paquete (si cambia algo de la web)

```bash
cd ~/conroma-web
PUBLIC_PREVIEW=true npm run build
bash scripts/preparar-preview.sh
```
